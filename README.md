# Gantavya — Authentication MVP

A full-stack starter for Gantavya, a Nepal-focused trip planning platform.

## Stack
- Frontend: Next.js App Router, TypeScript, Tailwind CSS
- Backend: NestJS, TypeScript
- Database: PostgreSQL 17 (Docker Compose)
- ORM: Prisma 6
- Authentication: bcrypt password hashing, JWT access + rotating refresh tokens in HttpOnly cookies

## Requirements
- Node.js 22 LTS
- npm
- Docker Desktop (or Docker Engine + Compose)

## 1. Start PostgreSQL

From the repository root:

```bash
docker compose up -d postgres
docker compose ps
```

PostgreSQL is exposed on `localhost:5432`. The database, username and password are configured in `docker-compose.yml`; change them before using this beyond local development.

## 2. Configure and start the backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

Backend: http://localhost:4000  
API prefix: `/api`

## 3. Configure and start the frontend

In a second terminal:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend: http://localhost:3000

Open `/signup`, create an account, then sign in at `/login`. Successful authentication takes you to `/dashboard`.

## Useful commands

Backend:
```bash
cd backend
npx prisma studio
npx prisma migrate dev
npm run build
```

Database:
```bash
docker compose logs -f postgres
docker compose down             # stop containers; keeps data volume
docker compose down -v          # WARNING: deletes the local database volume
```

## API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/refresh` | Rotate refresh token |
| POST | `/api/auth/logout` | Revoke refresh token and clear cookies |
| GET | `/api/auth/me` | Current authenticated user |

All browser requests use `credentials: "include"`.

## Important production checklist

This is an MVP starter, not a production deployment configuration. Before deployment:
1. Set strong, unique `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` values (at least 32 random bytes each).
2. Use managed PostgreSQL or secure your database; never expose its port publicly.
3. Set `NODE_ENV=production`, `COOKIE_SECURE=true`, and serve frontend/backend over HTTPS.
4. Set exact production origins in `CORS_ORIGIN`; do not use wildcard CORS with credentials.
5. Add email verification, password reset, rate limiting, login throttling, monitoring and backups.
6. Consider CSRF protection when deploying cookie-authenticated endpoints. Keep frontend and API on same-site domains where possible.
7. Do not commit `.env`, `.env.local`, or secrets.
8. Add authorization checks for admin-only routes; never trust a role supplied by the client.

The refresh token is stored hashed in PostgreSQL and rotated when refreshed. Access tokens are short-lived. Passwords are hashed with bcrypt.
