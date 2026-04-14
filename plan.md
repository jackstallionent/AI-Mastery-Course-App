# plan.md — JSE AI Mastery Companion (Production-worthy React App)

## 1) Objectives
- Deliver a premium, tiered interactive course companion (Tiers 0–4) with **Payhip paywalls**, **smooth UX**, and **Brand Bible-compliant UI**.
- Prove and ship the **core workflow** reliably: **Emergent Universal (Claude) API calls** powering (Tier 2) Council of Experts + (Tier 3) Bicameral Pipeline.
- Add **Google Sign-In** and **MongoDB persistence** for user progress, history, scores, and personal bests.
- Support **admin demo mode** via `?admin=true` (unlocks all tiers + bypass paywalls).

---

## 2) Implementation Steps

### Phase 1 — Core POC (Isolation: LLM + response contracts)
**Goal:** validate hardest integrations (LLM + prompt/response formats) before building the full app.

**User stories (POC)**
1. As a user, I can submit a question and get 4 Council perspectives + synthesis from Claude.
2. As a user, I can submit content and receive a STDIO verification score (1–10) + reasons.
3. As a builder, I can see errors (timeouts, rate limits) surfaced clearly and safely.
4. As a builder, I can confirm JSON/structured output is consistently parseable.
5. As a builder, I can quickly iterate prompts without touching the frontend.

**Steps**
1. Web research quick check: Anthropic/Claude best practices for **structured JSON outputs** + retries/timeouts.
2. Create a **minimal Python test script** (no app) that calls Emergent Universal LLM:
   - Endpoint 1: `council_of_experts(question) -> {optimist, skeptic, strategist, community, synthesis}`
   - Endpoint 2: `bicameral_verify(draft, rubric) -> {score_1_10, pass_bool, violations[], fixes[]}`
3. Add strict schema validation + fallback parsing (e.g., “JSON between tags”).
4. Add guardrails: max tokens, deterministic verification (low temperature), latency budget, retry w/ exponential backoff.
5. Do not proceed until: 20 consecutive runs succeed with valid structure.

**Exit criteria**
- Both endpoints return valid, parseable structured output reliably.

---

### Phase 2 — V1 App Development (MVP without auth; tiering + core interactivity)
**Goal:** ship a working product skeleton with tier gating + key interactions; persist progress anonymously (local) for now.

**User stories (V1)**
1. As a user, I can browse the dashboard and see which tiers/features are locked/unlocked.
2. As a user, locked content shows a blurred preview + Payhip CTA.
3. As a user, Tier 0 mini-games are playable end-to-end with scoring and feedback.
4. As a user, Tier 2 Council returns results quickly and in a clean layout.
5. As a user, animations make achievements/score changes feel rewarding but not distracting.

**Frontend (React + Tailwind + lucide-react + recharts)**
1. App shell:
   - Sidebar nav with tier indicators (lock/✅), mobile drawer.
   - Dashboard: unlocked tiers, recommended next exercise, local progress summary.
2. Tier/paywall framework:
   - `tierState` (0–4) + `admin=true` override.
   - `PaywallGate` component: blurred preview, gold lock icon, tier/price, Payhip placeholder link.
3. Implement Tier 0 fully:
   - Train Your Intuition drag-drop TRUE/FALSE claims.
   - Constraint Slider (0–4) with score 12→96 and explanation.
   - Glossary (15 terms) searchable + flip-card animation.
   - Spot the Hallucination (tap sentences) + score/explain.
4. Implement Tier 1 MVP interactions:
   - RACE Builder (assemble + progress + copy + before/after).
   - Negative Constraint Workshop (drag constraint chips, simulated score).
   - Template Library (10 templates).
   - Prompt Debugger mini-game (5 prompts, rubric scoring).
   - Chain Builder (4-step visual flow).
5. Implement Tier 2 MVP interactions:
   - Council of Experts (live Claude) + synthesis.
   - Temperature Dial mini-game.
   - Progress Tracker (5 modules).
   - Bias Lab + Fact-checker walkthrough (simplified cards).
6. Implement Tier 3 MVP interactions:
   - Contract Builder.
   - Constraint Cascade visualization.
   - RSIP simulator (3 passes) (local simulation first).
   - AI Studio Configurator (platform picker → generated system prompt).
   - Bicameral Pipeline (live Claude verify step; ORSN draft can be user-written in V1).
   - Interactive cheat sheet + full glossary (25+).
7. Implement Tier 4 MVP interactions:
   - Shadow AI Auditor (10Q → risk score + action list).
   - Compliance calendar timeline cards w/ countdowns.
   - 90-day kanban (drag/drop columns).
   - Policy generator wizard (8 elements → export .md).
   - Vendor scorecard + ROI calculator w/ basic charts.
   - Compliance quiz (10 scenarios).

**Backend (FastAPI + MongoDB) — minimal in V1**
1. `POST /api/ai/council` → calls Emergent Universal Claude.
2. `POST /api/ai/bicameral/verify` → calls Emergent Universal Claude.
3. Add app-level rate limiting (simple in-memory) + request validation.

**Brand + UX**
- Enforce palette + typography hierarchy; no external images; Unicode/CSS ornaments.
- Smooth animations: card reveal, score change, unlock confetti (CSS only).

**Testing checkpoint (end of Phase 2)**
- Run 1 full E2E pass: Tier 0 games + Tier 2 Council + Tier 3 Bicameral verify + paywall gates.

---

### Phase 3 — Add Auth + Persistent Progress (Google OAuth + MongoDB)
**Goal:** real accounts, saved progress/history across devices.

**User stories (Auth + persistence)**
1. As a user, I can sign in with Google and return to my saved progress.
2. As a user, my scores/personal bests persist per mini-game.
3. As a user, I can see my history of Council/Bicameral runs.
4. As a user, my unlocked tier state is remembered (or set by admin/demo mode).
5. As an admin, I can demo everything with `?admin=true` without logging in.

**Steps**
1. Implement Google OAuth (frontend + backend token verification).
2. MongoDB models:
   - User profile
   - Progress (by module/exercise)
   - Game scores/personal bests
   - AI run history (Council + Bicameral) with timestamps
3. Replace local progress with server persistence; keep offline fallback.
4. Add “Resume where you left off” + recommended next exercise logic.

**Testing checkpoint (end of Phase 3)**
- E2E: login → play → refresh → progress restored; admin bypass works.

---

### Phase 4 — Hardening, polish, and content completeness
**Goal:** production readiness, stability, and full fidelity of interactions.

**User stories (hardening)**
1. As a user, the app feels fast on mobile with no broken layouts.
2. As a user, I never lose work due to transient API errors.
3. As a user, exports/downloads are consistent and correctly formatted.
4. As a user, locked tiers always show clear next steps to unlock.
5. As an operator, logs/monitoring make debugging easy.

**Steps**
1. Robust error states + retries + “try again” UX; loading skeletons.
2. Performance: code-splitting by tier routes; memoize heavy components.
3. Security: sanitize inputs, clamp token usage, redact sensitive text in logs.
4. Content pass: ensure all exercises match course PDFs + cheat sheet + glossary.
5. Comprehensive test matrix (devices, tiers, admin mode, logged-out vs logged-in).

---

## 3) Next Actions (Immediate)
1. Confirm the **Emergent Universal LLM** API calling pattern available in this environment (headers/endpoint).
2. Create and run the **Python POC scripts** for Council + Bicameral verify until stable.
3. Lock prompt schemas + parsing strategy (strict JSON contract).
4. Build Phase 2 V1 app in a small number of bulk writes (app shell + paywall + Tier 0 + LLM pages first).

---

## 4) Success Criteria
- Core: Council + Bicameral endpoints succeed reliably with structured outputs and safe error handling.
- UX: Tier gates work (blur/lock/Payhip CTA), admin mode unlocks instantly via `?admin=true`.
- Product: Tier 0 is fully playable; Tier 1–4 MVP experiences exist and feel cohesive.
- Persistence: Google sign-in works; progress + AI history persist in MongoDB.
- Brand: strict palette/typography compliance; mobile responsive; no external images; smooth animations.
- Quality: end-to-end tests pass for logged-out, logged-in, and admin demo flows.
