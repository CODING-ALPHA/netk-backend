# Net-K Backend

NestJS REST API with Prisma (PostgreSQL), JWT auth, Cloudinary file uploads, Resend email, and Anthropic AI.

## Prerequisites

- Node.js 18+
- PostgreSQL database (local or hosted, e.g. Supabase / Neon)
- [Resend](https://resend.com) account for transactional email
- [Cloudinary](https://cloudinary.com) account for file uploads
- [Anthropic](https://console.anthropic.com) API key for AI features

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `ACCESS_TOKEN_SECRET` | Long random string for JWT access tokens |
| `REFRESH_TOKEN_SECRET` | Long random string for JWT refresh tokens (must differ from access) |
| `RESEND_API_KEY` | API key from resend.com |
| `CLIENT_URL` | URL of the frontend app (e.g. `http://localhost:3000`) |
| `PORT` | Port the API listens on (default `3001`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `ANTHROPIC_API_KEY` | Anthropic API key |

Generate secure token secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Run database migrations

```bash
npm run db:migrate
```

To seed initial data:

```bash
npm run db:seed
```

### 4. Start the development server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3001`.

## Available Scripts

| Script | Description |
|---|---|
| `npm run start:dev` | Start with hot reload |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run compiled build |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:push` | Push schema changes without migration |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run prisma:generate` | Regenerate Prisma client |

## Project Structure

```
src/
├── auth/          # JWT auth, login, signup, password reset
├── users/         # User profile management
├── assessment/    # Ikigai career assessment
├── paths/         # Career path selection and stage progress
├── tasks/         # Tasks per career path stage
├── submissions/   # Task submission and review
├── uploads/       # File upload via Cloudinary
├── portfolio/     # Public portfolio pages
├── companies/     # Company profiles
├── hiring/        # Role openings, shortlists, contact requests
└── prisma/        # Prisma service
```
