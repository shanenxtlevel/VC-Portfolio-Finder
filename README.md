# VC Portfolio Finder (Beta)

An internal research tool for the Nxt Level recruiting team. Search the portfolio
companies of 24 venture capital firms, one firm at a time or all at once, and
filter by stage, industry, B2B/B2C, region and team size. Each company has a
plain-English description, where it tends to hire from, and links to LinkedIn
and its website.

**This is a beta.** Company write-ups, "hires from" lists and some stages are
estimates. Stage, funding and headcount come from a Crunchbase export taken on
the build date shown in the data. Check anything important before relying on it.

## What is in here

| Path | What it is |
| --- | --- |
| `public/index.html` | The whole app: one page, no build step |
| `data/companies.json.gz` | The company data (about 12,300 companies), compressed |
| `api/data.js` | Serves the data, only to signed-in visitors when a passcode is set |
| `api/session.js`, `api/login.js` | The optional team passcode |
| `scripts/dev-server.mjs` | Runs the site on your own computer |
| `tests/` | Checks for the passcode logic and the data |

## Settings (Vercel → Project → Settings → Environment Variables)

| Name | What it does |
| --- | --- |
| `FINDER_PASSCODE` | A shared team passcode. **Until this is set, anyone with the link can open the tool.** |
| `FEEDBACK_EMAIL` | Where the "Feedback & requests" button addresses its email |

Redeploy after changing either one.

## Run it locally

    npm run dev      # http://localhost:3000
    npm test

Needs Node 20 or newer. No packages to install.

## Keep it private

The data includes a Crunchbase export, which is licensed to the account that
exported it. Keep this repository private, keep the passcode set, and never
commit real secrets.
