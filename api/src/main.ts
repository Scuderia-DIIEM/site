import { buildApp } from "./app.js";

let app: Awaited<ReturnType<typeof buildApp>> | undefined;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || Buffer.byteLength(jwtSecret, "utf8") < 32) {
  throw new Error("JWT_SECRET must contain at least 32 bytes");
}

const bootstrapAdminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;
if (!bootstrapAdminEmail) {
  throw new Error("BOOTSTRAP_ADMIN_EMAIL environment variable is required");
}

const bootstrapAdminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;
if (!bootstrapAdminPassword || !/^[\x21-\x7e]{12,128}$/.test(bootstrapAdminPassword)) {
  throw new Error("BOOTSTRAP_ADMIN_PASSWORD must contain 12-128 printable ASCII characters");
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bootstrapAdminEmail.trim())) {
  throw new Error("BOOTSTRAP_ADMIN_EMAIL must be a valid email address");
}

const port = Number(process.env.PORT ?? "3001");
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

const host = process.env.HOST ?? "0.0.0.0";

try {
  app = await buildApp({
    databaseUrl,
    jwtSecret,
    cookieSecure: process.env.COOKIE_SECURE === "true",
    bootstrapAdminEmail,
    bootstrapAdminPassword,
    uploadDirectory: process.env.UPLOAD_DIR ?? "./uploads",
  });
  await app.listen({ host, port });
} catch (error) {
  console.error("API server failed to start", error);
  if (app) await app.close();
  process.exitCode = 1;
}
