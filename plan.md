# plan.md — JSE AI Mastery Companion (Production-worthy React App)

## 1) Objectives
- Deliver a premium, tiered interactive course companion (Tiers 0–4) with **Payhip paywalls**, **smooth UX**, and **Brand Bible-compliant UI**.
- Ship the **core workflow** reliably: **Emergent Universal (Claude) API calls** powering:
  - (Tier 2) **Council of Experts**
  - (Tier 3) **Bicameral Pipeline (STDIO verification)**
- Provide **Google Sign-In** + **JWT sessions** + **MongoDB persistence** for:
  - User profile
  - Progress history
  - Scores/personal bests
- Support **admin demo mode** via `?admin=true` (unlocks all tiers + bypass paywalls).
- Ensure production readiness: mobile responsive, stable error handling, and completeness across all 29 exercises.

**Current status:** Phases 1–3 are complete; Phase 4 polish is in progress.

---

## 2) Implementation Steps

### Phase 1 — Core POC (Isolation: LLM + response contracts) ✅ COMPLETE
**Goal:** validate hardest integrations (LLM + prompt/response formats) before building the full app.

**Delivered**
1. Council of Experts structured JSON output (4 perspectives + synthesis) proven reliable.
2. Bicameral STDIO verification structured JSON output (score/pass/strengths/violations/fixes/summary) proven reliable.
3. JSON parsing + fallback extraction validated.

**Exit criteria (met)**
- Both endpoints return valid, parseable structured output reliably.

---

### Phase 2 — V1 App Development (Tiering + full interactivity) ✅ COMPLETE
**Goal:** ship a full product skeleton with tier gating + all key interactions.

**Delivered (Frontend)**
1. App shell:
   - Sidebar nav with tier indicators (lock/✅), mobile drawer
   - Dashboard: progress stats, tier cards, recommended next exercise
2. Tier/paywall framework:
   - Tier model (0–4) with `?admin=true` override
   - `PaywallGate` component: blurred preview, gold lock icon, tier/price, Payhip placeholder link
3. Implemented **all 29 exercises across 5 tiers**:
   - Tier 0: Train Your Intuition, Constraint Slider, Glossary (15), Spot the Hallucination
   - Tier 1: RACE Builder, Negative Constraints, Template Library (10), Prompt Debugger, Chain Builder
   - Tier 2: Council of Experts (live), Bias Lab, Fact-Checker Workflow, Module Progress Tracker, Temperature Dial
   - Tier 3: Contract Builder, RSIP Simulator, Constraint Cascade, AI Studio Configurator, Bicameral Pipeline (live), Context Engineer, Cheat Sheet, Full Glossary (25+)
   - Tier 4: Shadow AI Auditor, Compliance Calendar, 90-Day Planner (Kanban), AI Use Policy Generator, Vendor Scorecard, ROI Calculator (charts), Compliance Quiz
4. Brand + UX:
   - Strict Brand Bible palette/typography (dark-only UI)
   - Smooth animations (card reveals, score bumps, pulses)

**Delivered (Backend)**
- FastAPI + MongoDB base wiring
- LLM endpoints:
  - `POST /api/ai/council`
  - `POST /api/ai/bicameral/verify`
- Simple in-memory rate limiting + request validation
- Progress endpoints (initially anonymous; later extended in Phase 3)

**Testing checkpoint (met)**
- E2E smoke passes: dashboard, paywall gates, Tier 0 flows, live LLM flows.

---

### Phase 3 — Add Auth + Persistent Progress (Google OAuth + MongoDB) ✅ COMPLETE
**Goal:** real accounts, saved progress/history across devices.

**Delivered**
1. **Auth foundation**
   - JWT issuance + validation
   - `GET /api/auth/me` (returns authenticated user + progress)
   - `POST /api/auth/test-login` (bypass login for testing/dev)
2. **MongoDB persistence**
   - Users collection: profile + unlocked tiers
   - Progress collection: per-user progress entries keyed by `{user_email, exercise_id}`
3. **Frontend AuthContext**
   - Stores token in localStorage
   - Pulls user/profile via `/api/auth/me`
   - Adds sidebar Sign In / Sign Out controls
4. **Progress persistence**
   - `updateScore` and `markComplete` now POST to `/api/progress` with Bearer auth
   - Loads saved progress on app start

**Notes / caveats**
- Google OAuth start/callback endpoints are scaffolded; production OAuth requires finalizing the GoogleSSO configuration and ensuring correct callback routing in the deployed environment.

**Testing checkpoint (met)**
- Backend auth + progress: 100% pass
- Frontend: sign-in UI present, progress persists, admin bypass works

---

### Phase 4 — Hardening, polish, and content completeness 🚧 IN PROGRESS
**Goal:** production readiness, stability, and full fidelity of interactions.

**Completed so far**
- Mobile responsiveness verified (dashboard + shell)
- Enterprise tools verified visually (ROI Calculator charts, 90-Day Kanban)
- Invalid exercise route improved (“Exercise Not Found” page)

**Open work (next steps)**
1. **Google OAuth production finalize**
   - Confirm correct Emergent GoogleSSO import/config in this environment
   - Confirm callback URL routing (backend vs frontend) and FRONTEND_URL env
   - Add user-facing error messaging for OAuth failures (auth_error param)
2. **Stability + UX hardening**
   - Add consistent loading skeletons for live AI calls
   - Add retries/backoff on LLM failures + user-friendly error states
   - Add guardrail messaging if LLM budget/rate limits are reached
3. **Performance**
   - Code-splitting by tier routes (lazy-load exercises)
   - Memoize heavy views (charts/glossary lists)
4. **Security**
   - Ensure JWT_SECRET is fixed (not regenerated on restart) via `.env`
   - Clamp request sizes; redact sensitive text in logs
5. **Content completeness pass**
   - Cross-check exercises against PDFs for wording/choices
   - Expand any placeholder compliance dates/items if needed
6. **Test matrix**
   - Logged-out vs logged-in vs admin
   - Mobile drawer navigation
   - Paywall gates per tier
   - Live LLM exercises under normal + error conditions

---

## 3) Next Actions (Immediate)
1. Finalize **JWT_SECRET** and **FRONTEND_URL** env configuration for stable auth sessions.
2. Finalize and validate **Google OAuth production flow** (start → callback → token set → `/api/auth/me` works).
3. Add **LLM error/budget handling** UX for Council/Bicameral (clear messaging + retry).
4. Add **route-based code-splitting** to improve initial load performance.
5. Run final E2E test sweep (desktop + mobile) and document release checklist.

---

## 4) Success Criteria
- Core AI: Council + Bicameral endpoints succeed reliably with structured outputs; failures handled with clear UX.
- UX: Tier gates work (blur/lock/Payhip CTA), admin mode unlocks instantly via `?admin=true`.
- Product: All 29 exercises render and are usable; Tier 0 is fully playable; Tier 1–4 experiences feel premium.
- Persistence: JWT auth works; progress persists per user; sign in/out in sidebar works.
- Brand: strict palette/typography compliance; dark-only UI; no external images; smooth animations.
- Quality: end-to-end tests pass for logged-out, logged-in, and admin demo flows across desktop + mobile.
