# Zenvoice

Zenvoice is a web app for freelancers and small businesses to create, save, preview, and manage invoices.

## Stack

- React, TypeScript, Vite, Tailwind CSS
- Node.js, Express
- PostgreSQL
- JWT authentication

## Local Setup

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd server
npm install
```

Create environment files:

```bash
cp .env.example .env
cp server/.env.example server/.env
```

Create the PostgreSQL tables:

```bash
psql "$DATABASE_URL" -f server/schema.sql
```

Run the backend:

```bash
cd server
npm run dev
```

Run the frontend:

```bash
npm run dev
```

## Environment Variables

Frontend:

```env
VITE_API_URL=http://localhost:5000
VITE_BASE_PATH=/
```

Backend:

```env
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
JWT_SECRET=replace-with-a-long-random-secret
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_...
EMAIL_FROM=Zenvoice <invoices@your-verified-domain.com>
```

`CLIENT_URL` can contain multiple comma-separated origins for preview deployments.

## Web Deployment

Recommended first production setup:

- Frontend: Vercel or Netlify
- Backend: Render or Railway
- Database: Neon, Supabase, Railway PostgreSQL, or Render PostgreSQL

Frontend settings:

- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL=https://your-api-domain.com`

Backend settings:

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `NODE_ENV`, `CLIENT_URL`, `JWT_SECRET`, `DATABASE_URL`
- For automatic invoice email: add `RESEND_API_KEY` and `EMAIL_FROM` from a verified Resend domain.

Run `server/schema.sql` once against the production database before real users sign up.

## Production Checklist

- Use a strong `JWT_SECRET`.
- Set `CLIENT_URL` to the real frontend domain.
- Set `VITE_API_URL` to the real backend domain.
- Run the database schema.
- Verify signup, login, create invoice, edit invoice, delete invoice, and PDF download.
- Verify public invoice links in a private browser window.
- Configure Resend and verify invoice email delivery.
- Add monitoring/logging before inviting many users.
- Add rate limiting and input validation before public launch.

## Mobile App Path

Launch the web app first. After the core flow is stable, Zenvoice can be packaged for Play Store using Capacitor or rebuilt as a React Native/Expo app.
