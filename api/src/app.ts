import cookie from "@fastify/cookie";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import Fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from "fastify";
import { Pool } from "pg";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const sessionCookie = "scuderia_session";
const sessionDurationSeconds = 60 * 60 * 8;
const temporaryPasswordDurationHours = 24;
const passwordPattern = /^[\x21-\x7e]{12,128}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const dummyPasswordHash = `scrypt$${Buffer.alloc(16).toString("base64url")}$${Buffer.alloc(64).toString("base64url")}`;

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  role: "admin" | "user";
  auth_version: number;
  must_change_password: boolean;
  temporary_password_expires_at: Date | null;
  created_at: Date;
}

interface SessionUser {
  sub: string;
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
  email: string;
}

interface UserIdParams {
  id: string;
}

export interface AppOptions {
  databaseUrl: string;
  jwtSecret: string;
  cookieSecure: boolean;
  bootstrapAdminEmail: string;
  bootstrapAdminPassword: string;
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

async function requireSameOrigin(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void | FastifyReply> {
  const origin = request.headers.origin;
  if (!origin) return;

  try {
    if (new URL(origin).origin === `${request.protocol}://${request.headers.host}`) return;
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
  bootstrapAdminPassword,
}: AppOptions): Promise<FastifyInstance> {
  const app = Fastify({ logger: true, trustProxy: true, bodyLimit: 16_384 });
  const database = new Pool({ connectionString: databaseUrl });
  const cookieOptions = {
    path: "/",
    httpOnly: true,
    secure: cookieSecure,
    sameSite: "strict" as const,
  };

  await app.register(cookie);
  await app.register(jwt, {
    secret: jwtSecret,
    sign: { expiresIn: sessionDurationSeconds },
    cookie: { cookieName: sessionCookie, signed: false },
  });
  await app.register(rateLimit, { max: 100, timeWindow: 60_000 });

  try {
    await database.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
        auth_version INTEGER NOT NULL DEFAULT 0,
        must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
        temporary_password_expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await database.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, 'admin')
       ON CONFLICT (email) DO NOTHING`,
      [normalizeEmail(bootstrapAdminEmail), await hashPassword(bootstrapAdminPassword)],
    );
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
      `SELECT id, email, password_hash, role, auth_version, must_change_password,
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
        `SELECT id, email, password_hash, role, auth_version, must_change_password,
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
          user: { id: user.id, email: user.email, role: user.role },
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
        email: request.user.email,
        role: request.user.role,
      },
      mustChangePassword: request.user.mustChangePassword,
    }),
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
            newPassword: { type: "string", minLength: 12, maxLength: 128 },
          },
        },
      },
    },
    async (request, reply) => {
      if (!passwordPattern.test(request.body.newPassword)) {
        return reply.code(400).send({
          error: "Password must contain 12-128 printable ASCII characters",
        });
      }

      const result = await database.query<UserRow>(
        `SELECT id, email, password_hash, role, auth_version, must_change_password,
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
         RETURNING id, email, password_hash, role, auth_version, must_change_password,
                   temporary_password_expires_at, created_at`,
        [await hashPassword(request.body.newPassword), user.id],
      );
      const updatedUser = update.rows[0];
      const sessionUser: SessionUser = {
        sub: updatedUser.id,
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
        `SELECT id, email, password_hash, role, auth_version, must_change_password,
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
          required: ["email"],
          additionalProperties: false,
          properties: { email: { type: "string", minLength: 3, maxLength: 254 } },
        },
      },
    },
    async (request, reply) => {
      const email = normalizeEmail(request.body.email);
      if (!emailPattern.test(email)) {
        return reply.code(400).send({ error: "A valid email address is required" });
      }

      const temporaryPassword = generateTemporaryPassword();
      try {
        const result = await database.query<UserRow>(
          `INSERT INTO users
             (email, password_hash, role, must_change_password, temporary_password_expires_at)
           VALUES ($1, $2, 'user', TRUE, NOW() + INTERVAL '${temporaryPasswordDurationHours} hours')
           RETURNING id, email, password_hash, role, auth_version, must_change_password,
                     temporary_password_expires_at, created_at`,
          [email, await hashPassword(temporaryPassword)],
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
         RETURNING id, email, password_hash, role, auth_version, must_change_password,
                   temporary_password_expires_at, created_at`,
        [await hashPassword(temporaryPassword), request.params.id],
      );
      const user = result.rows[0];
      if (!user) return reply.code(404).send({ error: "User not found" });

      return reply.send({ user: publicUser(user), temporaryPassword });
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
  }
}
