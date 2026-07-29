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
only" banner. Don't gate the tool itself behind Patreon.

**What Patreon/paid tiers are for:** genuine extras that cost ongoing hosting/
upkeep and aren't required to use the tool. Frame honestly, never as a
shame-lock ("🔒 ... Unlock →"). No tier-comparison shop windows, no
LinkedIn-style "join my community to see what I can do."

**The ask, when there is one:** one honest, low-key line after the task
completes — free to use, tell a mate if it helped, buy-me-a-coffee if you
want to say thanks (one-off, `buymeacoffee.com/chrispteemagician`), Patreon
if you want to be a regular. Not a gate. Not gamified.

Full doctrine: `[[concepts/the-tip-jar-doctrine]]`, mechanical pattern:
`[[tech/free-to-use-degate-skill]]`.

**Repo-specific facts (don't relitigate):**
- `analyze-image.js` and `chat-stanley.js` never had an `isPro`/tier check —
  confirmed ungated. `patreon-auth.js` only ever drives a badge/tier display.
- Patreon tiers here specifically fund: hosted hut/hamlet page, kudos,
  leaderboard, activity feed (persistent Supabase account).
- 2026-07-13 fixes: removed a false-scarcity "Founding Member — first 1,000
  only" banner; left the dead `#signInPrompt` block alone (never actually
  shown, `hidden` class never removed by JS); added a new sibling
  `#honestyBox` div rather than reusing the dead one.

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
