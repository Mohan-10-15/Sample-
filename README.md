# Reverse Hackathon 2026 — Mission Deck

Static public website for the Reverse Hackathon 2026, run by **The Whitehatians**, Department of Cyber Security, SRM Valliammai Engineering College.

**Live site:** <https://reverse-hack.vercel.app/>

## Current scope

This repository currently contains the public static mission deck only. Registration persistence, team login, admin dashboards, email delivery, and participant data storage are intentionally **disabled** until a secure backend is selected. The registration form validates the fields locally and clearly reports that online registration is unavailable; it never pretends to save a record.

No database credentials, API keys, serverless API handlers, or database dependencies are included in this repository.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Complete static website with inline CSS and JavaScript. |
| `assets/` | Local artwork and event assets. |
| `scripts/check-site.mjs` | Static content and secret-safety checks. |
| `vercel.json` | Static Vercel deployment configuration. |

## Local preview

Any static web server can preview the site:

```bash
python3 -m http.server 8080
```

## Validation

```bash
npm install
npm run check
```

## Future backend

When registration is needed, add a server-side backend deliberately. Keep all credentials in the hosting provider's private environment variables; never put them in `index.html`, client-side JavaScript, or GitHub. The future implementation must provide persistent storage, secure password hashing, duplicate prevention, authenticated sessions, and an organiser-only dashboard.
