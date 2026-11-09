# FoodDex

Mobile-first culinary discovery PWA. Initial scaffold for the 10-country / 50-dish MVP.

## Stack
Next.js (App Router), React, TypeScript, Tailwind CSS, Supabase PostgreSQL/Auth, future server-side vision verification.

## Local setup
1. Install Node.js 20.9+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and add your Supabase project URL and publishable/anon key.
4. Apply `supabase/migrations/202611090001_initial.sql` using Supabase SQL Editor.
5. Load `supabase/seed.sql` for ten countries. The full 50-dish editorial catalog requires a separate verified import.
6. Run `npm run dev`.

**Security:** Never commit .env.local or service-role secrets. Locked dish names are not public browser data. Only trusted server code may award discoveries. Camera/AI integration is intentionally pending.

## Current state
Functional starter with a responsive country grid, Supabase authentication form, 10-country seed, secure RLS database scaffold and installable manifest. Vision scanning and dish unlocks are not implemented yet.

## Next milestones
- Import and review the 50 dish records and bilingual hints.
- Add protected country slots and clue reveal UI.
- Implement server-side recognition, abuse controls, discovery transaction, medals and audit logging.
- Test on physical iOS and Android devices.
