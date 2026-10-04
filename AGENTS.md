# ROLE
You are an expert full-stack web developer and brand designer. Build a complete, production-ready event registration website as a **single self-contained HTML file** (inline CSS/JS, no build step, no framework) in this project. Do not leave placeholder Lorem Ipsum anywhere — write real, polished copy throughout. Every flavor label sits next to the plain-language version of the same info.

# EVENT (confirmed facts — do not change these)
- Event: **Reverse Hackathon 2026** — a "reverse hackathon": teams receive an already-built, intentionally vulnerable/broken system and must find, patch, and secure it within a fixed time window. Scoring = vulnerabilities fixed, quality of the fix, and a short final review/showcase. Theme wordmark: **Reverse Hackathon 2026** ("The Code of Silence") as a middle-of-the-page flavor line, because it fits the college's "[word]2026" convention.
- Tagline: **Reverse. Exploit. Defend.**
- Organizer: **The Whitehatians**, Department of Cyber Security (DEP-CYS), SRM Valliammai Engineering College, Kattankulathur, Chennai, Tamil Nadu.
- Date: **Oct 13, 2026, 09:00 AM IST** (gates 08:00, registration ledger closes 07:00). Countdown targets this exact date/time.
- Venue: **DEP-CYS Campus, SRM Valliammai Engineering College** — Address for footer: S.R.M. Nagar, Kattankulathur – 603203, Chengalpattu District, Tamil Nadu, India.
- Eligibility: **DEP-CYS students only** — Year I, II, or III (college ID at check-in).
- Format: **Solo or Duo; no teams larger than two**. A Duo has one team lead and exactly one partner. Team lead = "Capo" (flavor label next to plain "Team Lead"). Duration: **3-hour sprint** (09:30–12:30). Ends with a **5-minute live showcase** per pod (from ~13:00).
- **15 domains** chosen at registration — each with a 1–2 sentence description and 2–3 real, free practice platforms:
  1. Ethical Hacking (TryHackMe, Hack The Box, HackerOne)
  2. Penetration Testing (PortSwigger Academy, PentesterLab, VulnHub)
  3. CTF & Capture The Flag (picoCTF, CTFtime, Crackmes.one)
  4. Digital Forensics (CyberDefenders, Autopsy, DFIR Training)
  5. Reverse Engineering (Ghidra, Crackmes.one, TryHackMe RE)
  6. Cryptography (CryptoHack, CyberChef, dCode)
  7. Web Application Security (OWASP Juice Shop, PortSwigger, Burp Suite)
  8. Network Security (Wireshark, TryHackMe Networking, OverTheWire)
  9. Malware Analysis (ANY.RUN, Malware-Traffic-Analysis, LetsDefend)
  10. Binary Exploitation / Pwn (pwn.college, Exploit Education, ROP Emporium)
  11. OSINT & Social Engineering (OSINT Framework, SpiderFoot, Sherlock)
  12. Cloud Security (flAWS.cloud, CloudGoat, AWS Security Docs)
  13. Incident Response (LetsDefend, Blue Team Labs, TheHive)
  14. Zero-Day Hunting (Google Project Zero, FuzzBench, MITRE CVE)
  15. Quantum & Next-Gen Crypto (NIST PQC, Qiskit, Quantum Computing Stack Exchange)

# ASK BEFORE INVENTING (never guess these — place TBA/placeholder if the user has no answer yet)
- [CONTACT EMAIL] (a clearly-marked placeholder contact will do, e.g. registration@whitehatians.in — flag it in the README/comment as the number-one thing to swap)
- [PRIZE AMOUNTS] (default copy: "cash prizes revealed live at the finale" + official Certificates of Participation & Merit for every participant — mirror the college's sister events)
- [SOCIAL HANDLES] (Discord / Instagram / LinkedIn — show TBA chips that turn into live links the moment URLs are provided)
- [COORDINATOR / TEAM NAMES] (faculty convenor, staff coordinators, student office-bearers — show role placeholders, never invented names)

# THEME — "The Godfather"
Cinematic 1970s mafia-drama aesthetic: dark, formal, dramatic — never violent or gory, no studio logos, movie stills, or real likenesses (original, inspired-by styling only).
- Palette: near-black background `#0A0A0A`, antique gold accent `#C9A227`, deep oxblood red `#6B0F1A`, parchment/cream text `#EFE6D8`, charcoal cards `#1A1A1A`. Verify gold/cream on black pass WCAG AA contrast; oxblood is for backgrounds/borders/large display only, never small body text.
- Type (Google Fonts): a bold display serif/blackletter for the wordmark and hero heading (**Cinzel Decorative**) · a refined serif for section headers (**Playfair Display** or Cormorant Garamond) · a classy serif/typewriter for body and "document" sections (**EB Garamond / Courier Prime**).
- Motifs as CSS/SVG, not stock photos: film-grain + vignette overlays, a **wax seal** with an original crest, thin smoke tendrils, marionette strings (a nod to the classic poster silhouette), a deck of cards, an old typewriter, a single red rose — all inline SVG/CSS.
- Voice: formal and theatrical, but never at the cost of clarity. Rules = "The Code." Registration confirmation = "**Welcome to the Family.**" Intro game state = the "ledger." Section headers can carry one (1) flavor line.

# DESIGN LANGUAGE (inspired by the college's actual sister sites — zugrunde Altruixx 2026 and CYBORGS '26)
- Single scrolling page with sticky header nav (no multi-page): Home → The Contract → The Timeline → The Family Code → The Cut → Meet the Family → The Ledger (form) → FAQ → Footer.
- Hero: full-bleed dark background, spotlight/vignette, animated wordmark reveal, one-line tagline, organizer credit, countdown to Oct 13 2026 09:00 IST, CTA "Join the Family — Register".
- The Family Code is the classy centerpiece: styled like an aged parchment/ledger page, ornate gold double-border, wax-seal graphic, noise texture. Lists eligibility, format, judging criteria, code of conduct.
- Meet the Family: portrait grid for faculty convenor + staff coordinators + student committee. Titles are primary; one small "family" nickname per card as flavor only. Use initials-based placeholder avatars; note in README the exact filenames to drop real photos into `/team/` (or `/public/team/`).
- The Cut: plaques for 1st, 2nd, 3rd (+ optional "Best Defence" special mention). Amounts TBA unless the user supplies them.

# REGISTRATION FORM — the core deliverable, build it carefully
- Support both Solo and Duo registration; a Duo contains exactly two people, with no larger teams.
- Fields, all labeled plainly with a flavor label beside it ("Capo · Team Lead"):
  - **Primary participant / Team Lead**: full name, college email, phone, year (I/II/III dropdown), roll number, domain (dropdown of the 15).
  - **Team name / Solo alias**: required and unique for every entry.
  - **Duo partner**: required only for Duo; partner's full name / year / roll number.
  - "How they heard" (Instagram / WhatsApp / Friend / Faculty / Other). Do not collect T-shirt size.
- Entry is free: do not collect UPI details, payment transaction IDs, receipts or screenshots; no payment proof is required in the form, API, admin dashboard, email or exports.
  - Checkbox agreeing to The Code (link to the Code section).
- Validation: required-field checks, email/phone format, and partner details only for Duo — client-side plus server-side. **Block duplicate submissions** (same participant email or team name / Solo alias twice).
- On valid submit: themed confirmation **"Welcome to the Family."** with a registration ID (e.g. `RH26-XXXX`), a **"Send Registration Email"** button (pre-filled `mailto:` to [CONTACT EMAIL] with all details in the body), and a **"Copy Details"** fallback button. This email is the real delivery mechanism — never drop it for a fake success state. Show real error states; never fail silently.

# ANIMATION
Use GSAP (via cdnjs) for a staged entrance sequence on load/scroll (stagger the hero and section elements in) plus a count-up animation for stat numbers. Respect `prefers-reduced-motion` throughout — skip/shorten every animation for users who request it.

# IMAGES
No real photos of people, celebrities, or film stills. Generate textures, borders, seals, crests and icons as inline CSS/SVG (feTurbulence grain, radial-gradient vignette, inline SVG crests). For Meet the Family use initials placeholder avatars. Background texture photos, if any, come only from Unsplash/Pexels (searches like "film noir dark", "vintage parchment", "smoke black background") — never hotlink an unverified URL.

# QUALITY BAR — NO MISTAKES
- Mobile-first; test at 375px, 768px, 1024px, 1440px.
- Alt text on every SVG/image, ARIA labels on every input, full keyboard navigation, visible focus states. Check contrast on oxblood-on-black combinations.
- Zero console errors/warnings, zero dead `href="#"` links.
- Proofread every piece of copy yourself for spelling and grammar.
- Working favicon (inline SVG data-URI) and Open Graph/Twitter meta tags (og:image can be a relative `og.png` with a comment to swap in an absolute URL once deployed).
- Ship/update a README with the local-open instructions, the swap list (contact email, socials, prize amounts, team photos), and deploy notes. Also keep a `.env.example` only if a real backend is added later.
- After building, verify the file yourself (balanced tags, no dead IDs, form submit → confirmation → correct mailto) before calling it done.
