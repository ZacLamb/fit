# Zezze Athletics — Website (Demo Mode)

Full-stack site for Zezze Athletics (2 Tupper Rd, Sandwich, MA), in
partnership with Cape Cod Holistic Fitness.

**This runs with zero configuration.** No environment variables, no
database — deploy it and it just works. Includes:

- Marketing pages: Home, About, Services (list + detail), Contact
- **Calendar booking**: pick a program, date, and open time slot
- **Merch shop**: product catalog, cart, checkout page

## Deploy to Railway via GitHub

1. **Create a GitHub repo** and upload this whole folder through the
   GitHub web UI (drag the files in on the "Add file → Upload files"
   screen — no `node_modules` needed, GitHub will reject it anyway if you
   try; Railway runs `npm install` itself).
2. In Railway: **New Project → Deploy from GitHub repo** → select the repo.
3. That's it. Railway detects the Node app, runs `npm install` then
   `npm start` automatically, and gives you a live URL — no environment
   variables required for this demo version.

Every later push to the repo auto-redeploys, same as your other projects.

## What "demo mode" means

To skip all setup, this version stores everything in memory instead of a
real database:

- **Services and merch** are hardcoded in `data/store.js` — edit that file
  directly to change names, prices, or descriptions.
- **Bookings** are stored in memory. They work correctly while the server
  is running, but reset if the Railway service restarts (a redeploy, for
  example). Fine for a demo or client walkthrough; not fine for taking
  real appointments long-term.
- **Checkout** shows a real cart and flow, but Stripe isn't connected —
  the Checkout button tells the visitor payments aren't set up yet rather
  than failing silently.
- **The contact form** logs submissions to the server console instead of
  emailing or texting anyone.

## Making it real later

When you're ready to actually run the business on it:

1. **Add Postgres.** In Railway, add a Postgres plugin to the project —
   it sets `DATABASE_URL` automatically. The schema and seed data are
   already written and ready in `db/schema.sql` and `db/seed.sql`; run
   `node db/migrate.js` once (Railway → Settings → one-off command) to
   load them. Swap the routes back to querying the database instead of
   `data/store.js` — happy to do that wiring whenever you want.
2. **Add `STRIPE_SECRET_KEY`** as a Railway variable to turn on real
   checkout — the code already checks for it and only needs the key.

## Local development

```bash
npm install
npm start
```

Visit http://localhost:3000 — works immediately, no `.env` file needed.
