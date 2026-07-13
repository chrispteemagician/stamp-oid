# Stamp-Oid — CLAUDE.md
*For Trinity. Read this first.*

---

## What Stamp-Oid Is

Free AI tool for stamp collectors (philatelists). Upload a photo — Stamp-Oid
identifies the stamp, gives context and value. Ask Stanley (65 years at the
album, 40 at the fair table) anything about watermarks, forgeries, condition,
storage.

Part of the FeelFamous -Oid ecosystem. Built by Chris P Taylor (Doc Strange).

**Live at:** stamp-oid.co.uk

---

## Stack

- **Static HTML** — single page (`index.html`), no framework, no build step
- **Netlify** — hosting + serverless `netlify/functions/`
- **Gemini** — image identification + Stanley chat (never Anthropic API in production)
- **Supabase** — `users` table (village accounts, kudos, leaderboard, activity feed)
- **Patreon** — OAuth membership check (`patreon-auth.js`), tiers only, no gate on the tool

---

## File Map

```
/
├── CLAUDE.md
├── index.html                       ← entire app: identify, Ask Stanley, gear, village/join
├── llms.txt
├── supabase-schema.sql
└── netlify/functions/
    ├── analyze-image.js             ← Gemini vision — stamp identification (ungated)
    ├── chat-stanley.js              ← Stanley chatbot (ungated)
    └── patreon-auth.js              ← Patreon OAuth token exchange + tier check
```

---

## Free-to-use philosophy (Chris, 2026-07-13 — read before adding any gate)

The core tool is free for everyone, no sign-in, no lock icon, no "Villager+
only" banner. Stamp identification (`analyze-image.js`) and Ask Stanley
(`chat-stanley.js`) have never had an `isPro`/tier check in the function
code — they run unlimited and ungated. `patreon-auth.js` only ever drives a
badge ("Pro unlocked") and tier display, never a feature block. Don't gate
the tool itself behind Patreon.

**What Patreon tiers are for:** genuine extras that cost Chris ongoing
hosting/upkeep and aren't required to use the free tools — a hosted hut/
hamlet page in the village, kudos + leaderboard + activity feed (all tied to
a persistent Supabase account), Elder/Founder badges. Frame honestly, never
as a shame-lock ("🔒 ... Unlock →"). No tier-comparison shop windows, no
LinkedIn-style "join my community to see what I can do."

**2026-07-13 audit and fix:**
- Removed a scarcity/urgency dark pattern from the top banner: "Founding
  Member price — first 1,000 only. After that, the door goes up." This is
  the same pattern found and removed in designer-oid — a fake artificial
  deadline. Replaced with an honest line: it's free, always will be, £4.95
  is there if you want to support the village.
- The `#signInPrompt` block after a scan result ("Sign in to save results,
  earn Kudos, and join the village") was dead code — it starts with the
  `hidden` class and nothing in the JS ever removes it, so it has never
  actually been shown to a user. Left it in place as-is (out of scope to fix
  an unrelated bug) but did NOT reuse it for the honesty box below — added a
  new sibling div instead so the two don't get tangled.
- Added a new `#honestyBox` div, shown by default under the result view
  after every scan (identification already ran free either way) — the
  one-time low-key ask: free to use, tell a mate, buy-me-a-coffee
  (buymeacoffee.com/chrispteemagician) if you want to say thanks one-off,
  Patreon (patreon.com/chrisptee) if you want to be a regular. Hidden via
  `showPatreonStatus()` when `patreonSession.isPro` is true
  (`document.getElementById('honestyBox')?.classList.toggle('hidden',
  !!patreonSession.isPro)`).
- Tier cards (Villager £4.95/mo, Elder — earned, Founder £14.95/mo) were
  already honestly framed — hut/hamlet pages, kudos, leaderboard, badges —
  no false claims of gating a free feature. Left unchanged.

**The ask, when there is one:** one honest, low-key line after the result
displays — free to use, tell a mate if it helped, buy-me-a-coffee if you
want to say thanks (one-off), Patreon if you want to be a regular. Not a
gate. Not gamified.

This same pattern is rolling out across the rest of the -oid ecosystem —
check other repos' CLAUDE.md for the ecosystem-wide version before assuming
this file is the only place it applies.

---

## Membership Tiers (Patreon)

| Tier | Price | What it is |
|------|-------|------------|
| 🏡 Villager | £4.95/mo | Hut in the village, kudos, leaderboard, activity feed |
| ⭐ Elder | Earned (not bought) | Everything in Villager + mini hamlet page + village roll |
| 👑 Founder | £14.95/mo | Full hamlet suite, direct line to Chris, early access, 300 kudos on joining |

Pricing unchanged by this session — do not touch without Chris's say-so.

---

## Gemini API Rules (Ecosystem-Wide)

Two known pitfalls:
1. **Do NOT set `thinkingBudget: 0`** — Gemini 2.5 Flash rejects it with a
   silent 400. Remove `thinkingConfig` entirely.
2. **Do NOT hardcode `mime_type: "image/jpeg"`** — always extract the real
   type from the data URL before stripping the prefix.

---

## Deploy

Push to `main` → Netlify auto-deploys. Never drag-to-Netlify.
Before every push: `git pull` first.

---

*"Every stamp tells a story."*
