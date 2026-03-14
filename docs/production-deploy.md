# Production Deploy Guide

This project runs on Next.js 15, Vercel, Drizzle, and Turso.

## 1. Create a dedicated production Turso database

Do not reuse your local or preview database.

```zsh
turso auth login
turso db create risc-production
turso db show risc-production
turso db tokens create risc-production
```

Pick a Turso region close to this app's Vercel region (`fra1`).

## 2. Set production environment variables in Vercel

Add these in **Vercel → Project Settings → Environment Variables** for the **Production** environment:

```dotenv
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_ENV=production
API_BASE_URL=https://your-domain.com/api
TURSO_DATABASE_URL=libsql://your-production-db.turso.io
TURSO_AUTH_TOKEN=your-new-production-token
```

Notes:
- `NEXT_PUBLIC_*` values are build-time values in Next.js and must exist before the build starts.
- `TURSO_AUTH_TOKEN` is server-only and must never use the `NEXT_PUBLIC_` prefix.
- Keep production secrets in Vercel, not in git.

## 3. Apply the database schema to production

This repo already has Drizzle configured for Turso. Before the first production deploy, apply the schema:

```zsh
export TURSO_DATABASE_URL="libsql://your-production-db.turso.io"
export TURSO_AUTH_TOKEN="your-new-production-token"
cd /Users/avramvlad/dev/work/projects/risc
pnpm db:push
```

Useful follow-up commands:

```zsh
cd /Users/avramvlad/dev/work/projects/risc
pnpm db:check
pnpm db:studio
```

## 4. Validate locally before deploy

```zsh
cd /Users/avramvlad/dev/work/projects/risc
pnpm test:run
pnpm typecheck
pnpm build
```

## 5. Deploy

Deploy through Vercel after the production env vars are saved.

## 6. Post-deploy smoke test

Verify these flows in production:
- Homepage loads
- `/evaluari` loads
- Create a new evaluare
- Edit and save an evaluare
- Add or remove a risc
- Reload and confirm data persists
- Export a DOCX file

## 7. Secret rotation

If a Turso token was ever exposed locally, rotate it before launch.

Recommended rotation flow:

```zsh
turso db tokens create risc-production
```

Then:
1. Update `TURSO_AUTH_TOKEN` in Vercel Production
2. Redeploy
3. Verify the app works
4. Revoke the old token in Turso

## 8. Environment separation

Use separate databases and tokens for:
- local development
- preview/staging
- production

