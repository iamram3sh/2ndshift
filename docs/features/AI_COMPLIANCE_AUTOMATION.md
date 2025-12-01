## Advanced Compliance + AI Automation Stack

### Why this matters
- Talent marketplaces competing with Contra, Upwork, and Turing lean on proactive compliance, escrow, and AI discovery.  
- The latest upgrade introduces production-ready foundations for KYC orchestration, milestone-based escrow, conversational collaboration, and AI-powered recommendations—bridging the biggest competitive gaps we identified.

### What’s new
1. **Database primitives**
   - `kyc_verifications`: provider-agnostic audit trail with risk scores, documents, reviewer metadata.
   - `escrow_accounts` + `escrow_transactions`: milestone-ready wallet with full release/fund ledger.
   - `contract_milestones` and `contract_documents`: automation anchor for NDAs, SOWs, and Form 16A PDFs.
   - `conversations`, `conversation_members`, `messages`, `secure_files`: realtime-ready collaboration hub with AI summaries + virus-scan states.
   - `notifications`, `talent_recommendations`, `risk_events`: observability, matching, and trust scoring baked into the schema.
   - `vector` extension enabled so pgvector embeddings are first-class (Supabase compatible).

2. **Service layer modules (`/lib`)**
   - `lib/kyc.ts`: wraps Signzy (or mock) workflows with graceful fallbacks, webhooks, and re-verification logic.
   - `lib/escrow.ts`: ensures ledger consistency, records fund/release events, and bridges to Razorpay Route transfers.
   - `lib/ai-match.ts`: recomputes semantic recommendations with optional OpenAI embeddings and deterministic scoring when the model is unavailable.

3. **TypeScript coverage (`/types/database.types.ts`)**
   - Strongly typed interfaces for every new table/status union, unlocking safer server actions and component props.
4. **Operator tooling**
   - Admin analytics now shows KYC backlog, risk-event feed, and provides a one-click “Refresh AI recommendations” action that hits `/api/ai/recommendations/recompute`.
   - Verification queue displays turnaround KPIs plus reviewer controls so compliance staff can triage faster.

### Config & environment
| Concern | Variables | Notes |
| --- | --- | --- |
| KYC (Signzy or mock) | `SIGNZY_API_KEY`, `SIGNZY_BASE_URL`, `SIGNZY_WORKFLOW_ID` | Without keys the helper downgrades to mock mode and still records audit trails. |
| AI embeddings | `OPENAI_API_KEY`, `OPENAI_EMBEDDING_MODEL` | Optional—heuristic scoring still works if unset. |
| Escrow payouts | `RAZORPAY_KEY_ID`, `RAZORPAY_SECRET` (already required) plus destination account IDs per worker | `lib/escrow.ts` assumes Razorpay Route; replace with Cashfree/etc if needed. |

### How to roll out
1. **Database**
   - Apply `database/schema/DATABASE_SCHEMA.sql` via Supabase CLI or dashboard.
   - Re-run `database/schema/database_extensions.sql` (messages/disputes) so indexes stay in sync.
2. **Secrets**
   - Populate the new env vars in `.env.local`, Vercel, and Supabase secrets.
3. **Service wiring**
   - Server actions / cron jobs can call:
     - `startKycVerification` after registration or before payouts.
     - `fundEscrowAccount` when Razorpay order is captured.
     - `recomputeRecommendations(projectId)` after a client posts/updates a project.
4. **Product surfaces (next sprint)**
   - Worker/client dashboards: expose milestone progress, escrow balance, KYC checklist, and AI-suggested matches.
   - Admin: build views on `risk_events`, `kyc_verifications`, and `talent_recommendations` for manual overrides.
   - Messaging UI: switch to `conversations` + `secure_files` for structured chat, attachments, and future realtime support.

### Follow-up backlog
- Hook Supabase Realtime to `messages` and `notifications`.
- Trigger PDF generation into `contract_documents` (DocuSeal/Documint) and attach to `secure_files`.
- Schedule nightly job to refresh `talent_recommendations` plus anomaly detectors writing into `risk_events`.
- Build UI health indicators (KYC % complete, escrow status chips, AI match scores) to surface the new data.

This stack brings 2ndShift to parity with compliance-first marketplaces and unlocks AI-driven growth loops without waiting on a full rewrite. Ship the migrations first, wire the helper modules into server actions, then iterate on UX.
