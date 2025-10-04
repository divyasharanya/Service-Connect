# ServiceConnect Backend (Express + Prisma + PostgreSQL)

This is a minimal backend aligned with the frontend (Vite React) and the OpenAPI spec in `../docs/api/openapi.yaml`.

Features
- Express REST API under `/api`
- Prisma ORM with PostgreSQL models (users, services, technicians, bookings, reviews, wallet transactions)
- Auth login with bcrypt password check (returns a dummy token for now)
- Endpoints: services, technicians (with approve/reject), bookings (list/create/update)

Prerequisites
- Node.js 18+
- PostgreSQL 13+

Setup
1) Copy env example and fill in your DB URL
   ```bash
   cp .env.example .env
   # Edit .env and set DATABASE_URL and PORT (default 4000)
   ```
2) Install dependencies
   ```bash
   npm install
   ```
3) Generate Prisma client and run migrations
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4) Seed sample data (admin/technician/customer users, services, bookings)
   ```bash
   npm run seed
   ```
5) Start the server
   ```bash
   npm run dev    # with nodemon
   # or
   npm start      # plain node
   ```

Frontend integration
- In the frontend `.env` (at repo root), set:
  - `VITE_API_BASE_URL=http://localhost:4000/api`
  - `VITE_USE_MOCK=false`

Auth accounts (after seeding)
- admin@serviceconnect.com / admin123
- technician@serviceconnect.com / tech123
- customer@serviceconnect.com / customer123

Notes
- The login returns a placeholder token. Replace with JWT if desired.
- See `../docs/api/openapi.yaml` for the full contract.
- For production, use `npm run prisma:deploy` to apply migrations.
