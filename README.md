# Miner Meal System

A Next.js + Prisma app for mining accommodation meal ordering.

## Features

- Admin dashboard
- Add/reactivate/deactivate miners
- Prevent duplicate miners by mobile number
- Add/remove menu items with descriptions
- QR code order page
- One order per miner per day
- 8 PM Australia/Perth cutoff
- Daily kitchen docket summaries
- Print/save docket as PDF using browser print

## Setup

```bash
npm install
cp .env.example .env
# update DATABASE_URL in .env
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Open http://localhost:3000

## Production domain

Set this in Vercel environment variables:

```env
NEXT_PUBLIC_APP_URL=https://minermealsystem.vercel.app
```
