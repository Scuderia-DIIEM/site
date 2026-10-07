import cookie from "@fastify/cookie";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import Fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from "fastify";
import { fileTypeFromBuffer } from "file-type";
import { Pool } from "pg";
import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const sessionCookie = "scuderia_session";
const sessionDurationSeconds = 60 * 60 * 8;
const temporaryPasswordDurationHours = 24;
const maxCoverSize = 5 * 1024 * 1024;
const maxPdfSize = 20 * 1024 * 1024;
const maxArticleUploadSize = maxPdfSize + maxCoverSize;
const passwordPattern = /^[\x21-\x7e]{1,128}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const dummyPasswordHash = `scrypt$${Buffer.alloc(16).toString("base64url")}$${Buffer.alloc(64).toString("base64url")}`;

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: "admin" | "user";
  auth_version: number;
  must_change_password: boolean;
  temporary_password_expires_at: Date | null;
  created_at: Date;
}

interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  authors: string[];
  cover_file: string;
  cover_content_type: string;
  pdf_file: string;
  is_public: boolean;
  created_by: string;
  created_at: Date;
}

interface SessionUser {
  sub: string;
  name: string;
  email: string;
  role: "admin" | "user";
  authVersion: number;
  mustChangePassword: boolean;
}

interface UserCredentials {
  email: string;
  password: string;
}

interface CreateUserBody {
  name: string;
  email: string;
}

interface UpdateUserBody {
  name: string;
}

interface UserIdParams {
  id: string;
}

interface ProjectParams {
  slug: string;
}

export interface AppOptions {
  databaseUrl: string;
  jwtSecret: string;
  cookieSecure: boolean;
  bootstrapAdminEmail: string;
  bootstrapAdminName?: string;
  bootstrapAdminPassword: string;
  uploadDirectory?: string;
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt$${salt.toString("base64url")}$${derivedKey.toString("base64url")}`;
}

async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
  const [algorithm, encodedSalt, encodedKey] = encodedHash.split("$");
  if (algorithm !== "scrypt" || !encodedSalt || !encodedKey) return false;

  const salt = Buffer.from(encodedSalt, "base64url");
  const expectedKey = Buffer.from(encodedKey, "base64url");
  const actualKey = (await scrypt(password, salt, expectedKey.length)) as Buffer;
  return actualKey.length === expectedKey.length && timingSafeEqual(actualKey, expectedKey);
}

function publicUser(user: UserRow) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    mustChangePassword: user.must_change_password,
    temporaryPasswordExpiresAt: user.temporary_password_expires_at,
    createdAt: user.created_at,
  };
}

function generateTemporaryPassword(): string {
  return randomBytes(24).toString("base64url");
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70)
    .replace(/-+$/g, "");
}

function articleResponse(article: ArticleRow) {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    authors: article.authors,
    coverImage: `/api/projects/${encodeURIComponent(article.slug)}/cover`,
    pdfUrl: `/api/projects/${encodeURIComponent(article.slug)}/pdf`,
    isPublic: article.is_public,
    date: article.created_at.toISOString().slice(0, 10),
  };
}

function isStoredFilename(value: string): boolean {
  return /^[0-9a-f-]+\.(?:pdf|jpe?g|png|webp)$/i.test(value) && path.basename(value) === value;
}

async function requireSameOrigin(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void | FastifyReply> {
  const origin = request.headers.origin;
  if (!origin) return;

  try {
    const originUrl = new URL(origin);
    const forwardedProtocolHeader = request.headers["x-forwarded-proto"];
    const forwardedProtocol = (Array.isArray(forwardedProtocolHeader)
      ? forwardedProtocolHeader[0]
      : forwardedProtocolHeader)
      ?.split(",")[0]
      .trim();
    const requestProtocol = (forwardedProtocol || request.protocol.split(",")[0].trim()).toLowerCase();
    const forwardedHostHeader = request.headers["x-forwarded-host"];
    const forwardedHost = (Array.isArray(forwardedHostHeader)
      ? forwardedHostHeader[0]
      : forwardedHostHeader)
      ?.split(",")[0]
      .trim();
    const requestHost = (forwardedHost || request.headers.host || "").toLowerCase();

    if (originUrl.protocol === `${requestProtocol}:` && originUrl.host.toLowerCase() === requestHost) {
      return;
    }
  } catch {
    // Reject malformed Origin headers below.
  }

  return reply.code(403).send({ error: "Cross-origin requests are not allowed" });
}

export async function buildApp({
  databaseUrl,
  jwtSecret,
  cookieSecure,
  bootstrapAdminEmail,
  bootstrapAdminName = normalizeEmail(bootstrapAdminEmail).split("@")[0] || "Amministratore",
  bootstrapAdminPassword,
  uploadDirectory = "./uploads",
}: AppOptions): Promise<FastifyInstance> {
  const app = Fastify({ logger: true, trustProxy: true, bodyLimit: maxArticleUploadSize + 64 * 1024 });
  const database = new Pool({ connectionString: databaseUrl });
  const resolvedUploadDirectory = path.resolve(uploadDirectory);
  const cookieOptions = {
    path: "/",
    httpOnly: true,
    secure: cookieSecure,
    sameSite: "strict" as const,
  };

  await app.register(cookie);
  await app.register(multipart, {
    limits: {
      files: 2,
      fields: 4,
      fileSize: maxPdfSize,
      fieldSize: 8 * 1024,
    },
  });
  await app.register(jwt, {
    secret: jwtSecret,
    sign: { expiresIn: sessionDurationSeconds },
    cookie: { cookieName: sessionCookie, signed: false },
  });
  await app.register(rateLimit, { max: 100, timeWindow: 60_000 });

  try {
    await mkdir(resolvedUploadDirectory, { recursive: true });
    await database.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL DEFAULT '',
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
        auth_version INTEGER NOT NULL DEFAULT 0,
        must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
        temporary_password_expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await database.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT ''");
    await database.query("UPDATE users SET name = split_part(email, '@', 1) WHERE name = ''");

    await database.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin')
       ON CONFLICT (email) DO NOTHING`,
      [
        bootstrapAdminName.trim().slice(0, 100) || "Amministratore",
        normalizeEmail(bootstrapAdminEmail),
        await hashPassword(bootstrapAdminPassword),
      ],
    );

    await database.query(`
      CREATE TABLE IF NOT EXISTS project_articles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        authors TEXT[] NOT NULL DEFAULT '{}',
        cover_file TEXT NOT NULL,
        cover_content_type TEXT NOT NULL,
        pdf_file TEXT NOT NULL,
        is_public BOOLEAN NOT NULL DEFAULT FALSE,
        created_by UUID NOT NULL REFERENCES users(id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
  } catch (error) {
    await database.end();
    throw error;
  }

  app.decorate("authenticate", async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    try {
      await request.jwtVerify();
    } catch {
      return reply.code(401).send({ error: "Authentication required" });
    }

    const result = await database.query<UserRow>(
      `SELECT id, name, email, password_hash, role, auth_version, must_change_password,
              temporary_password_expires_at, created_at
       FROM users WHERE id = $1`,
      [request.user.sub],
    );
    const user = result.rows[0];

    if (!user || user.auth_version !== request.user.authVersion) {
      return reply
        .clearCookie(sessionCookie, cookieOptions)
        .code(401)
        .send({ error: "Session expired; please sign in again" });
    }

    request.user = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      authVersion: user.auth_version,
      mustChangePassword: user.must_change_password,
    };

    if (
      user.must_change_password &&
      request.routeOptions.url !== "/api/auth/password" &&
      request.routeOptions.url !== "/api/auth/me"
    ) {
      return reply.code(403).send({
        error: "Change your temporary password before continuing",
        code: "PASSWORD_CHANGE_REQUIRED",
      });
    }
  });

  app.decorate("requireAdmin", async function requireAdmin(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    if (request.user.role !== "admin") {
      return reply.code(403).send({ error: "Administrator access required" });
    }
  });

  app.decorateRequest("articleViewer", null);
  app.decorate("optionalArticleViewer", async function optionalArticleViewer(
    request: FastifyRequest,
  ) {
    if (!request.cookies[sessionCookie]) return;

    try {
      await request.jwtVerify();
    } catch {
      request.articleViewer = null;
      return;
    }

    const result = await database.query<UserRow>(
      `SELECT id, name, email, password_hash, role, auth_version, must_change_password,
              temporary_password_expires_at, created_at
       FROM users WHERE id = $1`,
      [request.user.sub],
    );
    const user = result.rows[0];
    if (user && user.auth_version === request.user.authVersion && !user.must_change_password) {
      request.articleViewer = {
        sub: user.id,
        email: user.email,
        role: user.role,
        authVersion: user.auth_version,
        mustChangePassword: false,
      };
    }
  });

  app.get("/health", async () => ({ status: "ok" }));

  app.get("/health/ready", async (_request, reply) => {
    try {
      await database.query("SELECT 1");
      return { status: "ok", database: "ok" };
    } catch (error) {
      app.log.error({ err: error }, "Database readiness check failed");
      return reply.code(503).send({ status: "unavailable", database: "unavailable" });
    }
  });

  app.post<{ Body: UserCredentials }>(
    "/api/auth/login",
    {
      preHandler: requireSameOrigin,
      config: { rateLimit: { max: 5, timeWindow: 60_000 } },
      schema: {
        body: {
          type: "object",
          required: ["email", "password"],
          additionalProperties: false,
          properties: {
            email: { type: "string", maxLength: 254 },
            password: { type: "string", minLength: 1, maxLength: 128 },
          },
        },
      },
    },
    async (request, reply) => {
      const email = normalizeEmail(request.body.email);
      const result = await database.query<UserRow>(
        `SELECT id, name, email, password_hash, role, auth_version, must_change_password,
                temporary_password_expires_at, created_at
         FROM users WHERE email = $1`,
        [email],
      );
      const user = result.rows[0];
      const passwordMatches = await verifyPassword(
        request.body.password,
        user?.password_hash ?? dummyPasswordHash,
      );

      if (!user || !passwordMatches) {
        return reply.code(401).send({ error: "Invalid email or password" });
      }
      if (
        user.temporary_password_expires_at &&
        user.temporary_password_expires_at.getTime() <= Date.now()
      ) {
        return reply.code(401).send({
          error: "Temporary password expired; contact an administrator",
        });
      }

      const sessionUser: SessionUser = {
        sub: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        authVersion: user.auth_version,
        mustChangePassword: user.must_change_password,
      };

      return reply
        .setCookie(sessionCookie, app.jwt.sign(sessionUser), {
          ...cookieOptions,
          maxAge: sessionDurationSeconds,
        })
        .send({
          user: { id: user.id, name: user.name, email: user.email, role: user.role },
          mustChangePassword: user.must_change_password,
        });
    },
  );

  app.post(
    "/api/auth/logout",
    { preHandler: requireSameOrigin },
    async (_request, reply) => {
      return reply.clearCookie(sessionCookie, cookieOptions).code(204).send();
    },
  );

  app.get(
    "/api/auth/me",
    { preHandler: [requireSameOrigin, app.authenticate] },
    async (request) => ({
      user: {
        id: request.user.sub,
        name: request.user.name,
        email: request.user.email,
        role: request.user.role,
      },
      mustChangePassword: request.user.mustChangePassword,
    }),
  );

  app.patch<{ Body: { name: string } }>(
    "/api/auth/profile",
    {
      preHandler: [requireSameOrigin, app.authenticate],
      schema: {
        body: {
          type: "object",
          required: ["name"],
          additionalProperties: false,
          properties: { name: { type: "string", minLength: 1, maxLength: 100 } },
        },
      },
    },
    async (request, reply) => {
      const name = request.body.name.trim();
      if (!name || name.length > 100) {
        return reply.code(400).send({ error: "A name of 1-100 characters is required" });
      }

      const result = await database.query<{ id: string; name: string; email: string; role: "admin" | "user" }>(
        `UPDATE users SET name = $1
         WHERE id = $2
         RETURNING id, name, email, role`,
        [name, request.user.sub],
      );
      const user = result.rows[0];
      if (!user) return reply.code(401).send({ error: "Authentication required" });

      return reply.header("Cache-Control", "private, no-store").send({ user });
    },
  );

  app.post<{ Body: { currentPassword?: string; newPassword: string } }>(
    "/api/auth/password",
    {
      preHandler: [requireSameOrigin, app.authenticate],
      schema: {
        body: {
          type: "object",
          required: ["newPassword"],
          additionalProperties: false,
          properties: {
            currentPassword: { type: "string", maxLength: 128 },
            newPassword: { type: "string", minLength: 1, maxLength: 128 },
          },
        },
      },
    },
    async (request, reply) => {
      if (!passwordPattern.test(request.body.newPassword)) {
        return reply.code(400).send({
          error: "Password must contain 1-128 printable ASCII characters",
        });
      }

      const result = await database.query<UserRow>(
        `SELECT id, name, email, password_hash, role, auth_version, must_change_password,
                temporary_password_expires_at, created_at
         FROM users WHERE id = $1`,
        [request.user.sub],
      );
      const user = result.rows[0];
      if (!user) return reply.code(401).send({ error: "Authentication required" });

      if (
        !user.must_change_password &&
        (!request.body.currentPassword ||
          !(await verifyPassword(request.body.currentPassword, user.password_hash)))
      ) {
        return reply.code(401).send({ error: "Current password is incorrect" });
      }

      const update = await database.query<UserRow>(
        `UPDATE users
         SET password_hash = $1, must_change_password = FALSE,
             temporary_password_expires_at = NULL, auth_version = auth_version + 1
         WHERE id = $2
         RETURNING id, name, email, password_hash, role, auth_version, must_change_password,
                   temporary_password_expires_at, created_at`,
        [await hashPassword(request.body.newPassword), user.id],
      );
      const updatedUser = update.rows[0];
      const sessionUser: SessionUser = {
        sub: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        authVersion: updatedUser.auth_version,
        mustChangePassword: false,
      };

      return reply
        .setCookie(sessionCookie, app.jwt.sign(sessionUser), {
          ...cookieOptions,
          maxAge: sessionDurationSeconds,
        })
        .send({ status: "ok" });
    },
  );

  app.get(
    "/api/admin/users",
    { preHandler: [requireSameOrigin, app.authenticate, app.requireAdmin] },
    async () => {
      const result = await database.query<UserRow>(
        `SELECT id, name, email, password_hash, role, auth_version, must_change_password,
                temporary_password_expires_at, created_at
         FROM users ORDER BY created_at DESC`,
      );
      return { users: result.rows.map(publicUser) };
    },
  );

  app.post<{ Body: CreateUserBody }>(
    "/api/admin/users",
    {
      preHandler: [requireSameOrigin, app.authenticate, app.requireAdmin],
      schema: {
        body: {
          type: "object",
          required: ["name", "email"],
          additionalProperties: false,
          properties: {
            name: { type: "string", minLength: 1, maxLength: 100 },
            email: { type: "string", minLength: 3, maxLength: 254 },
          },
        },
      },
    },
    async (request, reply) => {
      const email = normalizeEmail(request.body.email);
      const name = request.body.name.trim();
      if (!name || name.length > 100) {
        return reply.code(400).send({ error: "A name of 1-100 characters is required" });
      }
      if (!emailPattern.test(email)) {
        return reply.code(400).send({ error: "A valid email address is required" });
      }

      const temporaryPassword = generateTemporaryPassword();
      try {
        const result = await database.query<UserRow>(
          `INSERT INTO users
             (name, email, password_hash, role, must_change_password, temporary_password_expires_at)
           VALUES ($1, $2, $3, 'user', TRUE, NOW() + INTERVAL '${temporaryPasswordDurationHours} hours')
           RETURNING id, name, email, password_hash, role, auth_version, must_change_password,
                     temporary_password_expires_at, created_at`,
          [name, email, await hashPassword(temporaryPassword)],
        );
        return reply.code(201).send({
          user: publicUser(result.rows[0]),
          temporaryPassword,
        });
      } catch (error) {
        if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
          return reply.code(409).send({ error: "An account with this email already exists" });
        }
        throw error;
      }
    },
  );

  app.patch<{ Params: UserIdParams; Body: UpdateUserBody }>(
    "/api/admin/users/:id",
    {
      preHandler: [requireSameOrigin, app.authenticate, app.requireAdmin],
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "string", format: "uuid" } },
        },
        body: {
          type: "object",
          required: ["name"],
          additionalProperties: false,
          properties: { name: { type: "string", minLength: 1, maxLength: 100 } },
        },
      },
    },
    async (request, reply) => {
      const name = request.body.name.trim();
      if (!name || name.length > 100) {
        return reply.code(400).send({ error: "A name of 1-100 characters is required" });
      }

      const result = await database.query<UserRow>(
        `UPDATE users SET name = $1
         WHERE id = $2
         RETURNING id, name, email, password_hash, role, auth_version, must_change_password,
                   temporary_password_expires_at, created_at`,
        [name, request.params.id],
      );
      const user = result.rows[0];
      if (!user) return reply.code(404).send({ error: "User not found" });

      return reply.send({ user: publicUser(user) });
    },
  );

  app.delete<{ Params: UserIdParams }>(
    "/api/admin/users/:id",
    {
      preHandler: [requireSameOrigin, app.authenticate, app.requireAdmin],
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "string", format: "uuid" } },
        },
      },
    },
    async (request, reply) => {
      const client = await database.connect();
      try {
        await client.query("BEGIN");
        const targetResult = await client.query<{ id: string; role: string }>(
          "SELECT id, role FROM users WHERE id = $1 FOR UPDATE",
          [request.params.id],
        );
        const target = targetResult.rows[0];
        if (!target) {
          await client.query("ROLLBACK");
          return reply.code(404).send({ error: "User account not found" });
        }
        if (target.role !== "user") {
          await client.query("ROLLBACK");
          return reply.code(403).send({ error: "Administrator accounts cannot be deleted" });
        }
        await client.query(
          "UPDATE project_articles SET created_by = $1 WHERE created_by = $2",
          [request.user.sub, request.params.id],
        );
        const result = await client.query<{ id: string }>(
          "DELETE FROM users WHERE id = $1 AND role = 'user' RETURNING id",
          [request.params.id],
        );
        if (!result.rowCount) {
          await client.query("ROLLBACK");
          return reply.code(404).send({ error: "User account not found" });
        }
        await client.query("COMMIT");
        return reply.code(204).send();
      } catch (error) {
        try {
          await client.query("ROLLBACK");
        } catch (rollbackError) {
          request.log.error({ err: rollbackError }, "Unable to roll back account deletion");
        }
        throw error;
      } finally {
        client.release();
      }
    },
  );

  app.post<{ Params: UserIdParams }>(
    "/api/admin/users/:id/temporary-password",
    {
      preHandler: [requireSameOrigin, app.authenticate, app.requireAdmin],
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "string", format: "uuid" } },
        },
      },
    },
    async (request, reply) => {
      const temporaryPassword = generateTemporaryPassword();
      const result = await database.query<UserRow>(
        `UPDATE users
         SET password_hash = $1, must_change_password = TRUE,
             temporary_password_expires_at = NOW() + INTERVAL '${temporaryPasswordDurationHours} hours',
             auth_version = auth_version + 1
         WHERE id = $2 AND role = 'user'
         RETURNING id, name, email, password_hash, role, auth_version, must_change_password,
                   temporary_password_expires_at, created_at`,
        [await hashPassword(temporaryPassword), request.params.id],
      );
      const user = result.rows[0];
      if (!user) return reply.code(404).send({ error: "User not found" });

      return reply.send({ user: publicUser(user), temporaryPassword });
    },
  );

  app.get(
    "/api/projects",
    { preHandler: app.optionalArticleViewer },
    async (request, reply) => {
      const result = await database.query<ArticleRow>(
        `SELECT id, slug, title, excerpt, authors, cover_file, cover_content_type,
                pdf_file, is_public, created_at
         FROM project_articles
         WHERE is_public = TRUE OR $1::boolean = TRUE
         ORDER BY created_at DESC`,
        [request.articleViewer !== null],
      );
      reply.header(
        "Cache-Control",
        request.articleViewer ? "private, no-store" : "public, max-age=60",
      );
      return { articles: result.rows.map(articleResponse) };
    },
  );

  app.post(
    "/api/projects",
    {
      preHandler: [requireSameOrigin, app.authenticate],
      config: { rateLimit: { max: 10, timeWindow: 60_000 } },
    },
    async (request, reply) => {
      let title = "";
      let excerpt = "";
      let rawAuthors = "";
      let visibility = "";
      let cover: { data: Buffer; type: string; extension: string } | undefined;
      let pdf: Buffer | undefined;

      try {
        for await (const part of request.parts()) {
          if (part.type === "file") {
            const data = await part.toBuffer();
            if (part.fieldname === "cover") {
              if (cover) return reply.code(400).send({ error: "Upload one cover image only" });
              if (data.length > maxCoverSize) {
                return reply.code(413).send({ error: "Cover image must be 5 MB or smaller" });
              }
              const detectedType = await fileTypeFromBuffer(data);
              const imageTypes: Record<string, { extension: string; type: string }> = {
                "image/jpeg": { extension: "jpg", type: "image/jpeg" },
                "image/png": { extension: "png", type: "image/png" },
                "image/webp": { extension: "webp", type: "image/webp" },
              };
              const imageType = detectedType && imageTypes[detectedType.mime];
              if (!imageType) {
                return reply.code(400).send({ error: "Cover must be a valid JPEG, PNG or WebP image" });
              }
              cover = { data, ...imageType };
            } else if (part.fieldname === "pdf") {
              if (pdf) return reply.code(400).send({ error: "Upload one PDF article only" });
              if (data.length > maxPdfSize) {
                return reply.code(413).send({ error: "PDF must be 20 MB or smaller" });
              }
              const detectedType = await fileTypeFromBuffer(data);
              if (detectedType?.mime !== "application/pdf") {
                return reply.code(400).send({ error: "Article must be a valid PDF file" });
              }
              pdf = data;
            } else {
              return reply.code(400).send({ error: "Unexpected upload file field" });
            }
          } else {
            if (typeof part.value !== "string") {
              return reply.code(400).send({ error: "Article fields must be text" });
            }
            if (part.fieldname === "title") title = part.value;
            else if (part.fieldname === "excerpt") excerpt = part.value;
            else if (part.fieldname === "authors") rawAuthors = part.value;
            else if (part.fieldname === "visibility") visibility = part.value;
            else return reply.code(400).send({ error: "Unexpected article field" });
          }
        }
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "FST_REQ_FILE_TOO_LARGE"
        ) {
          return reply.code(413).send({ error: "Article upload exceeds the 20 MB file limit" });
        }
        throw error;
      }

      title = title.trim();
      excerpt = excerpt.trim();
      if (title.length < 3 || title.length > 160) {
        return reply.code(400).send({ error: "Title must contain 3-160 characters" });
      }
      if (excerpt.length < 10 || excerpt.length > 2000) {
        return reply.code(400).send({ error: "Description must contain 10-2000 characters" });
      }
      if (visibility !== "public" && visibility !== "private") {
        return reply.code(400).send({ error: "Choose whether the article is public or private" });
      }
      if (!cover || !pdf) {
        return reply.code(400).send({ error: "Add both a cover image and the article PDF" });
      }

      let authors: unknown;
      try {
        authors = JSON.parse(rawAuthors) as unknown;
      } catch {
        return reply.code(400).send({ error: "Authors must be submitted as a JSON array" });
      }
      if (
        !Array.isArray(authors) ||
        authors.length === 0 ||
        authors.length > 30 ||
        authors.some((author) => typeof author !== "string" || author.trim().length < 1 || author.trim().length > 100)
      ) {
        return reply.code(400).send({ error: "Provide up to 30 authors, each with 1-100 characters" });
      }
      authors = authors.map((author: string) => author.trim());

      const id = randomUUID();
      const slugBase = slugify(title).slice(0, 60) || "articolo";
      const slug = `${slugBase}-${id}`;
      const coverFile = `${randomUUID()}.${cover.extension}`;
      const pdfFile = `${randomUUID()}.pdf`;
      const coverPath = path.join(resolvedUploadDirectory, coverFile);
      const pdfPath = path.join(resolvedUploadDirectory, pdfFile);

      try {
        await Promise.all([
          writeFile(coverPath, cover.data, { flag: "wx", mode: 0o640 }),
          writeFile(pdfPath, pdf, { flag: "wx", mode: 0o640 }),
        ]);
        const result = await database.query<ArticleRow>(
          `INSERT INTO project_articles
             (id, slug, title, excerpt, authors, cover_file, cover_content_type, pdf_file, is_public, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           RETURNING id, slug, title, excerpt, authors, cover_file, cover_content_type,
                     pdf_file, is_public, created_at`,
          [
            id,
            slug,
            title,
            excerpt,
            authors,
            coverFile,
            cover.type,
            pdfFile,
            visibility === "public",
            request.user.sub,
          ],
        );
        return reply.code(201).send({ article: articleResponse(result.rows[0]) });
      } catch (error) {
        await Promise.all([
          unlink(coverPath).catch((cleanupError: NodeJS.ErrnoException) => {
            if (cleanupError.code !== "ENOENT") throw cleanupError;
          }),
          unlink(pdfPath).catch((cleanupError: NodeJS.ErrnoException) => {
            if (cleanupError.code !== "ENOENT") throw cleanupError;
          }),
        ]);
        throw error;
      }
    },
  );

  app.get<{ Params: ProjectParams }>(
    "/api/projects/:slug",
    {
      preHandler: app.optionalArticleViewer,
      schema: {
        params: {
          type: "object",
          required: ["slug"],
          properties: { slug: { type: "string", minLength: 1, maxLength: 100 } },
        },
      },
    },
    async (request, reply) => {
      const result = await database.query<ArticleRow>(
        `SELECT id, slug, title, excerpt, authors, cover_file, cover_content_type,
                pdf_file, is_public, created_by, created_at
         FROM project_articles
         WHERE slug = $1 AND (is_public = TRUE OR $2::boolean = TRUE)`,
        [request.params.slug, request.articleViewer !== null],
      );
      const article = result.rows[0];
      if (!article) return reply.code(404).send({ error: "Article not found" });
      reply.header(
        "Cache-Control",
        article.is_public ? "public, max-age=60" : "private, no-store",
      );
      return {
        article: articleResponse(article),
        canEdit: request.articleViewer !== null &&
          (request.articleViewer.role === "admin" || request.articleViewer.sub === article.created_by),
      };
    },
  );

  app.put<{ Params: ProjectParams }>(
    "/api/projects/:slug",
    {
      preHandler: [requireSameOrigin, app.authenticate],
      schema: {
        params: {
          type: "object",
          required: ["slug"],
          properties: { slug: { type: "string", minLength: 1, maxLength: 100 } },
        },
      },
    },
    async (request, reply) => {
      const currentResult = await database.query<ArticleRow>(
        `SELECT id, slug, title, excerpt, authors, cover_file, cover_content_type,
                pdf_file, is_public, created_by, created_at
         FROM project_articles WHERE slug = $1`,
        [request.params.slug],
      );
      const currentArticle = currentResult.rows[0];
      if (!currentArticle) return reply.code(404).send({ error: "Article not found" });
      if (request.user.role !== "admin" && request.user.sub !== currentArticle.created_by) {
        return reply.code(403).send({ error: "Only the article author or an administrator can edit it" });
      }

      let title = "";
      let excerpt = "";
      let rawAuthors = "";
      let visibility = "";
      let cover: { data: Buffer; type: string; extension: string } | undefined;
      let pdf: Buffer | undefined;
      const receivedFields = new Set<string>();

      try {
        for await (const part of request.parts()) {
          if (part.type === "file") {
            const data = await part.toBuffer();
            if (part.fieldname === "cover") {
              if (cover) return reply.code(400).send({ error: "Upload one cover image only" });
              if (data.length > maxCoverSize) {
                return reply.code(413).send({ error: "Cover image must be 5 MB or smaller" });
              }
              const detectedType = await fileTypeFromBuffer(data);
              const imageTypes: Record<string, { extension: string; type: string }> = {
                "image/jpeg": { extension: "jpg", type: "image/jpeg" },
                "image/png": { extension: "png", type: "image/png" },
                "image/webp": { extension: "webp", type: "image/webp" },
              };
              const imageType = detectedType && imageTypes[detectedType.mime];
              if (!imageType) {
                return reply.code(400).send({ error: "Cover must be a valid JPEG, PNG or WebP image" });
              }
              cover = { data, ...imageType };
            } else if (part.fieldname === "pdf") {
              if (pdf) return reply.code(400).send({ error: "Upload one PDF article only" });
              if (data.length > maxPdfSize) {
                return reply.code(413).send({ error: "PDF must be 20 MB or smaller" });
              }
              const detectedType = await fileTypeFromBuffer(data);
              if (detectedType?.mime !== "application/pdf") {
                return reply.code(400).send({ error: "Article must be a valid PDF file" });
              }
              pdf = data;
            } else {
              return reply.code(400).send({ error: "Unexpected upload file field" });
            }
          } else {
            if (typeof part.value !== "string") {
              return reply.code(400).send({ error: "Article fields must be text" });
            }
            if (receivedFields.has(part.fieldname)) {
              return reply.code(400).send({ error: "Duplicate article field" });
            }
            receivedFields.add(part.fieldname);
            if (part.fieldname === "title") title = part.value;
            else if (part.fieldname === "excerpt") excerpt = part.value;
            else if (part.fieldname === "authors") rawAuthors = part.value;
            else if (part.fieldname === "visibility") visibility = part.value;
            else return reply.code(400).send({ error: "Unexpected article field" });
          }
        }
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "FST_REQ_FILE_TOO_LARGE"
        ) {
          return reply.code(413).send({ error: "Article upload exceeds the 20 MB file limit" });
        }
        throw error;
      }

      if (["title", "excerpt", "authors", "visibility"].some((field) => !receivedFields.has(field))) {
        return reply.code(400).send({ error: "All article fields are required" });
      }
      title = title.trim();
      excerpt = excerpt.trim();
      if (title.length < 3 || title.length > 160) {
        return reply.code(400).send({ error: "Title must contain 3-160 characters" });
      }
      if (excerpt.length < 10 || excerpt.length > 2000) {
        return reply.code(400).send({ error: "Description must contain 10-2000 characters" });
      }
      if (visibility !== "public" && visibility !== "private") {
        return reply.code(400).send({ error: "Choose whether the article is public or private" });
      }

      let authors: unknown;
      try {
        authors = JSON.parse(rawAuthors) as unknown;
      } catch {
        return reply.code(400).send({ error: "Authors must be submitted as a JSON array" });
      }
      if (
        !Array.isArray(authors) ||
        authors.length === 0 ||
        authors.length > 30 ||
        authors.some((author) => typeof author !== "string" || author.trim().length < 1 || author.trim().length > 100)
      ) {
        return reply.code(400).send({ error: "Provide up to 30 authors, each with 1-100 characters" });
      }
      authors = authors.map((author: string) => author.trim());

      const coverFile = cover ? `${randomUUID()}.${cover.extension}` : currentArticle.cover_file;
      const coverContentType = cover?.type ?? currentArticle.cover_content_type;
      const pdfFile = pdf ? `${randomUUID()}.pdf` : currentArticle.pdf_file;
      const newFilePaths = [
        ...(cover ? [path.join(resolvedUploadDirectory, coverFile)] : []),
        ...(pdf ? [path.join(resolvedUploadDirectory, pdfFile)] : []),
      ];

      try {
        if (cover) {
          await writeFile(path.join(resolvedUploadDirectory, coverFile), cover.data, {
            flag: "wx",
            mode: 0o640,
          });
        }
        if (pdf) {
          await writeFile(path.join(resolvedUploadDirectory, pdfFile), pdf, {
            flag: "wx",
            mode: 0o640,
          });
        }

        const result = await database.query<ArticleRow>(
          `UPDATE project_articles
           SET title = $1, excerpt = $2, authors = $3, is_public = $4,
               cover_file = $5, cover_content_type = $6, pdf_file = $7
           WHERE id = $8
           RETURNING id, slug, title, excerpt, authors, cover_file, cover_content_type,
                     pdf_file, is_public, created_by, created_at`,
          [
            title,
            excerpt,
            authors,
            visibility === "public",
            coverFile,
            coverContentType,
            pdfFile,
            currentArticle.id,
          ],
        );
        const updatedArticle = result.rows[0];

        const oldFileNames = [
          ...(cover ? [currentArticle.cover_file] : []),
          ...(pdf ? [currentArticle.pdf_file] : []),
        ];
        for (const oldFileName of oldFileNames) {
          if (!isStoredFilename(oldFileName)) {
            request.log.error(
              { articleId: currentArticle.id },
              "Invalid stored filename for replaced article file",
            );
            continue;
          }
          try {
            await unlink(path.join(resolvedUploadDirectory, oldFileName));
          } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
              request.log.error({ err: error, articleId: currentArticle.id }, "Unable to remove replaced article file");
            }
          }
        }

        reply.header("Cache-Control", "private, no-store");
        return reply.send({ article: articleResponse(updatedArticle), canEdit: true });
      } catch (error) {
        await Promise.all(
          newFilePaths.map((filePath) =>
            unlink(filePath).catch((cleanupError: NodeJS.ErrnoException) => {
              if (cleanupError.code !== "ENOENT") throw cleanupError;
            }),
          ),
        );
        throw error;
      }
    },
  );

  app.get<{ Params: ProjectParams }>(
    "/api/projects/:slug/cover",
    {
      preHandler: app.optionalArticleViewer,
      schema: {
        params: {
          type: "object",
          required: ["slug"],
          properties: { slug: { type: "string", minLength: 1, maxLength: 100 } },
        },
      },
    },
    async (request, reply) => {
      const result = await database.query<ArticleRow>(
        `SELECT id, slug, title, excerpt, authors, cover_file, cover_content_type,
                pdf_file, is_public, created_at
         FROM project_articles
         WHERE slug = $1 AND (is_public = TRUE OR $2::boolean = TRUE)`,
        [request.params.slug, request.articleViewer !== null],
      );
      const article = result.rows[0];
      if (!article) return reply.code(404).send({ error: "Article not found" });
      if (!isStoredFilename(article.cover_file)) {
        request.log.error({ articleId: article.id }, "Invalid stored cover image path");
        return reply.code(500).send({ error: "Article cover is unavailable" });
      }

      return reply
        .type(article.cover_content_type)
        .header("X-Content-Type-Options", "nosniff")
        .header("Cache-Control", article.is_public ? "public, max-age=3600" : "private, no-store")
        .send(createReadStream(path.join(resolvedUploadDirectory, article.cover_file)));
    },
  );

  app.get<{ Params: ProjectParams }>(
    "/api/projects/:slug/pdf",
    {
      preHandler: app.optionalArticleViewer,
      schema: {
        params: {
          type: "object",
          required: ["slug"],
          properties: { slug: { type: "string", minLength: 1, maxLength: 100 } },
        },
      },
    },
    async (request, reply) => {
      const result = await database.query<ArticleRow>(
        `SELECT id, slug, title, excerpt, authors, cover_file, cover_content_type,
                pdf_file, is_public, created_at
         FROM project_articles
         WHERE slug = $1 AND (is_public = TRUE OR $2::boolean = TRUE)`,
        [request.params.slug, request.articleViewer !== null],
      );
      const article = result.rows[0];
      if (!article) return reply.code(404).send({ error: "Article not found" });
      if (!isStoredFilename(article.pdf_file) || !article.pdf_file.endsWith(".pdf")) {
        request.log.error({ articleId: article.id }, "Invalid stored PDF path");
        return reply.code(500).send({ error: "Article PDF is unavailable" });
      }

      return reply
        .type("application/pdf")
        .header("Content-Disposition", `inline; filename="${article.slug}.pdf"`)
        .header("X-Content-Type-Options", "nosniff")
        .header("Cache-Control", article.is_public ? "public, max-age=3600" : "private, no-store")
        .send(createReadStream(path.join(resolvedUploadDirectory, article.pdf_file)));
    },
  );

  app.addHook("onClose", async () => {
    await database.end();
  });

  return app;
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<unknown>;
    requireAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<unknown>;
    optionalArticleViewer: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
