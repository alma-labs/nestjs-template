# AlmaLabs.io NestJs Template 🔼

We build a lot of APIs, so I set up this very basic repository with some of the key tooling we use. Enjoy!

## Features for Any Job

- 🐦‍🔥 Firebase Auth
- 📦 AWS S3 Uploads
- ✅ Prisma / Postgres / Neon
- 🐳 Docker & Testing with Local DB
- 📧 Free Email Sending (Gmail)
- 🐺 Husky on Commits
- 📀 Github Actions

## Installation Instructions

1. Copy `.env.example` as `.env`. Populate with variables.
2. Update `firebase.config.ts`.
3. Install packages & run!

```
yarn
yarn start:dev
```

## CI/CD Pipeline

#### Step 1: Before Commit (Husky)

- Prettier check
- Build check
- Test e2e on local database

### Step 2: On PRs to staging/prod (Github Actions)

- Install and build checks

### Step 3: Upon merge to staging/prod

- Install and build checks
- Migrate prisma database updates to relevant DB
- Deploy on Heroku

## Notes about Prisma Migrations

There are a few important functions to know when migrating with prisma:

- `npx prisma migrate dev` (local) creates a migration from changes in the Prisma schema and applies them to the DB found in the `.env` file. DO NOT USE IN PRODUCTION.
- `npx prisma migrate deploy` (cicd) is meant for production. It looks for the `DATABASE_URL` in the `.env` file, and applies migrations but does not issue warnings, detect drift, reset artifacts, or anything else.
- `npx prisma db push` Alternatively, if you are simply prototyping data changes, you can use `npx prisma db push`. This does not modify the migration files in any capacity, but instead updates the DB to have the corresponding schema for testing.

## Questions? Want us to Help?

Hit me up at garrett [at] almalabs dot io ❤️
