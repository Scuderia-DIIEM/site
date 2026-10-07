# Scuderia DIIEM

This repository contains the Scuderia DIIEM website and its API:

- [`webapp/`](./webapp/): Next.js website, exported as a static site.
- [`api/`](./api/): Fastify API written in TypeScript, with PostgreSQL connectivity.

## Webapp

From `webapp/`, install dependencies and run the development server:

```sh
npm install
npm run dev
```

Build the static site with `npm run build`; the generated site is written to `webapp/out`.
See [`webapp/README.md`](./webapp/README.md) for more website details.

## API and PostgreSQL

The API requires Node.js 22 or later and PostgreSQL. The production webapp is a
static Next.js export served by unprivileged Nginx; Nginx forwards `/api/` requests
to Fastify, so browser requests use the same origin. To build and run all three
services as containers, first create a `.env` from `.env.example` and set strong
secrets, then run Docker Compose from the repository root:

```sh
Copy-Item .env.example .env
# Generate a URL-safe secret, then use a different value for each secret in .env:
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
docker compose up --build
```

The website is available at <http://localhost>. `GET /health` reports API
liveness and `GET /health/ready` checks PostgreSQL readiness.

To develop the API directly, provide `DATABASE_URL` and run the commands from `api/`:

```sh
npm install
npm run dev
```

Build it with `npm run build`; run the compiled server with `npm start`.

## Login and user provisioning

There is no public registration. On first startup the API creates the admin account
from `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD`. Sign in at
<http://localhost/login>; the admin can then create accounts from
<http://localhost/admin/users>. The API generates a cryptographically random
temporary password, displays it once, and requires the new user to change it at
their first login. Temporary passwords expire after 24 hours. An admin can generate
a replacement password for an existing user from the same page.

Authentication uses short-lived, HTTP-only, same-site cookies. When hosting behind
HTTPS, set `COOKIE_SECURE=true` in `.env`.

## Project articles

Any authenticated user can create an article from the **Progetti** page. Articles
include a title, cover image, description, authors and a PDF, and can be public or
private. Public articles and their PDFs are visible to everyone; private articles,
cover images and PDFs are available only to signed-in users. Uploads are validated
as JPEG, PNG, WebP or PDF and limited to 5 MB per cover image and 20 MB per PDF.
Uploaded files are stored in the persistent `article_uploads` Docker volume.
