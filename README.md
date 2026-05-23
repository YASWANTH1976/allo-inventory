# Allo Health Inventory Reservation System

## Problem
In a multi-warehouse e-commerce setup, race conditions can lead to overselling when multiple users attempt to reserve the same unit simultaneously. 

## Solution
- **Atomicity:** Implemented a PostgreSQL function (`reserve_stock`) using `SELECT FOR UPDATE` to ensure sequential, atomic database operations.
- **Expiry Logic:** Integrated **Upstash QStash** to schedule a webhook callback. When a reservation is created, a 10-minute timer is queued; if payment is not finalized, the stock is automatically released back to inventory.
- **Stack:** Next.js (App Router), Supabase (PostgreSQL), Upstash (QStash).

## Links
- **Live Demo:** [https://strong-centaur-05084e.netlify.app](https://strong-centaur-05084e.netlify.app)
- **GitHub Repository:** [https://github.com/YASWANTH1976/allo-inventory](https://github.com/YASWANTH1976/allo-inventory)

## Setup
1. Clone the repository.
2. Run `npm install`.
3. Configure environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `QSTASH_TOKEN`, `QSTASH_CURRENT_SIGNING_KEY`, `NEXT_PUBLIC_BASE_URL`).
4. Run `npm run dev`.