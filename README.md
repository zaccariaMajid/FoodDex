# FoodDex — PWA mobile-first

FoodDex è un Pokédex culinario: 10 paesi, 50 piatti misteriosi, tre indizi per piatto, scansione AI e medaglie. Versione iniziale in italiano e inglese.

## Hosting
Il frontend è una **esportazione statica di Next.js** pubblicabile su GitHub Pages all'indirizzo https://zaccariamajid.github.io/FoodDex/ .
Supabase ospita PostgreSQL, autenticazione e le future Edge Functions per il riconoscimento AI. Nessun server Node.js viene eseguito su GitHub Pages.

## Setup Supabase
Progetto: https://hxqbnezmynththobikrg.supabase.co

1. Nel pannello Supabase applica `supabase/migrations/202611090001_initial.sql` usando il SQL Editor.
2. Esegui `supabase/seed.sql` per inserire i 10 paesi.
3. Importa in seguito i 50 piatti, le descrizioni bilingui e gli indizi revisionati.
4. In **Authentication → URL Configuration** imposta come Site URL `https://zaccariamajid.github.io/FoodDex/` e aggiungilo fra i redirect consentiti.
5. In **Settings → API Keys** copia la **publishable key** (`sb_publishable_...`). NON condividere né pubblicare la secret/service_role key.

## GitHub Pages
1. In GitHub → **Settings → Secrets and variables → Actions**, crea il repository secret `SUPABASE_PUBLISHABLE_KEY` con la publishable key.
2. In **Settings → Pages**, scegli **GitHub Actions** come source.
3. Avvia il workflow `Deploy FoodDex to GitHub Pages` (oppure effettua un commit su main).
4. Controlla la scheda **Actions** per build ed eventuali errori.

La publishable key non è un segreto ad alta privilegiatura: sarà visibile nel bundle del browser. La protezione dei dati dipende da RLS e permessi minimi. La secret key non deve mai essere esposta.

## Sviluppo locale
Node.js 22; `npm install`; copia `.env.example` in `.env.local`, compila `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, poi `npm run dev`.
Per verificare l'export statico: `npm run build`. Output in `out/`.

## Stato attuale
Frontend statico predisposto con griglia paesi, login, profilo e visualizzazione slot nascosti. Le funzioni di riconoscimento AI, sblocco, medaglie, alcuni flussi UX e il contenuto dei 50 piatti sono ancora da sviluppare/testare. Non considerare questo repository pronto per il lancio pubblico.

## Sicurezza
Il database mantiene segreti i dettagli dei piatti non scoperti tramite RLS e funzioni RPC. Non inserire API key AI nel frontend. Il backend di scansione verrà implementato su Supabase Edge Functions.
