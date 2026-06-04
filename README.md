# Zenvoice — Professional Invoice Builder
 
> A full-stack invoicing web app built for freelancers and small businesses. Create, send, and track professional invoices with PDF export, email delivery, and shareable public links.
 
**Live Demo:** [zenvoice-app.vercel.app](https://zenvoice-app.vercel.app/) · **API:** [zenvoice-api.onrender.com](https://zenvoice-api.onrender.com/health)
 
---
 
## Features
 
- **Invoice creation** — multi-line items, auto-calculated subtotals, tax, and totals
- **PDF generation** — client-side PDF export via jsPDF with three template themes
- **Email delivery** — send invoices directly to clients via Resend API
- **Shareable links** — public invoice URLs for client-facing PDF download
- **Authentication** — JWT-based login/register, 7-day token expiry
- **Dashboard** — search, filter by status, analytics (total revenue, paid vs pending)
- **Multi-currency** — INR, USD, EUR, GBP
## Tech Stack
 
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express.js, REST API |
| Database | PostgreSQL (Neon serverless) |
| Auth | JWT + bcryptjs |
| PDF | jsPDF (client-side) |
| Email | Resend API |
| Deployment | Vercel (frontend) + Render (backend) |
 
## Architecture
 
```
Browser → Vercel CDN → React SPA
              ↓
         REST API calls
              ↓
         Render (Express) → Neon PostgreSQL
              ↓
         Resend (email) / jsPDF (PDF generation)
```
 
## Local Setup
 
**Prerequisites:** Node.js 18+, PostgreSQL or a Neon account
 
```bash
# Clone
git clone https://github.com/Nishtha453/zenvoice.git
cd zenvoice
 
# Frontend
npm install
cp .env.example .env          
 
# Backend
cd server
npm install
cp .env.example .env          
 
# Init database
psql "$DATABASE_URL" -f schema.sql
 
# Run both
cd server && npm run dev      # backend → localhost:5000
cd ..    && npm run dev       # frontend → localhost:5173
```
 
## Environment Variables
 
**Frontend (`.env`)**
```
VITE_API_URL=https://zenvoice-api.onrender.com
```
 
**Backend (`server/.env`)**
```
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-here
CLIENT_URL=https://your-vercel-url.app
RESEND_API_KEY=re_...
EMAIL_FROM=Zenvoice <invoices@yourdomain.com>
```
 
## Database Schema
 
```sql
-- Users table
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  password    TEXT NOT NULL,            -- bcrypt hash
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
 
-- Invoices table
CREATE TABLE invoices (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
  invoice_number  TEXT NOT NULL,
  data            JSONB NOT NULL,        -- full invoice object
  status          TEXT DEFAULT 'draft',  -- draft | sent | paid
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```
 
## API Endpoints
 
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Create account | — |
| POST | `/auth/login` | Login, returns JWT | — |
| GET | `/invoices` | List user's invoices | ✓ |
| POST | `/invoices` | Create invoice | ✓ |
| PUT | `/invoices/:id` | Update invoice | ✓ |
| DELETE | `/invoices/:id` | Delete invoice | ✓ |
| GET | `/invoices/public/:token` | Public invoice view | — |
| POST | `/email/send-invoice` | Email invoice to client | ✓ |
| GET | `/health` | Health check | — |
 
## Project Structure
 
```
zenvoice/
├── src/
│   ├── components/
│   │   ├── InvoiceForm.tsx       
│   │   ├── InvoiceDashboard.tsx  
│   │   ├── PublicInvoiceView.tsx 
│   │   ├── EmailInvoice.tsx      
│   │   └── AuthPage.tsx          
│   ├── context/
│   │   └── AuthContext.tsx      
│   ├── utils/
│   │   ├── api.ts                
│   │   ├── calculations.ts      
│   │   └── pdfGenerator.ts       
│   └── types/
│       └── invoice.ts            
└── server/
    ├── index.js                 
    ├── auth.js                   
    ├── invoices.js               
    ├── email.js                 
    ├── middleware.js             
    ├── db.js                     
    └── schema.sql                
```
 
## Key Implementation Decisions
 
**Why JSONB for invoice data?** Invoice structure evolves — new fields like `shareToken`, `recurringFrequency`, template settings. JSONB lets us add fields without migrations, while indexed columns (`invoice_number`, `status`, `user_id`) keep queries fast.
 
**Why client-side PDF?** Avoids a separate PDF service, reduces backend load, and works offline. Trade-off: large logos bloat the payload; mitigated by enforcing a 500KB image limit.
 
**Why JWT over sessions?** Stateless — works across Render + Vercel without shared session storage. 7-day expiry balances convenience and security.
 
## What I'd improve with more time
 
- Move logo storage from base64-in-JSONB to Cloudinary
- Add rate limiting (`express-rate-limit`) on auth routes
- Implement Razorpay "Pay Now" on public invoice view
- Add React Router for proper deep linking
- Write unit tests for `calculations.ts` and integration tests for API routes

## Screenshots

**Dashboard**
![Dashboard](https://github.com/user-attachments/assets/7d199aa9-53bb-4f92-b6d8-7571d56c52d1)

**Invoice Form**
![Invoice Form](https://github.com/user-attachments/assets/703f2f82-6f3c-4107-8b7c-718dcbba8a38)

**Public Invoice**
![Public Invoice](https://github.com/user-attachments/assets/6d6c1bb6-3d8c-400c-a3c0-4c49f68aab86)

---
Built by [Nishtha Gupta](https://github.com/Nishtha453) · B.Tech Mathematics and Computing, RGIPT (2024–2028)
