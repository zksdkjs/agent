# Agent Pipeline Overview

This file is the single source of truth for how the folders, scripts, recipes, and agents fit together. Use it to understand what every directory is for, which Goose recipe touches it, and what the execution order looks like.

## Directory Map & Ownership

| Directory | Purpose | Read By | Written By | Notes |
|-----------|---------|---------|------------|-------|
| `.goose/` | Recipes, rules, and agent hints | All agents (recipes auto-load) | Maintainers | `data/context/current-session.md` is regenerated before each run. |
| `automation/scripts/` | Shell entrypoints and orchestrators | Operators, automation | Scripts themselves | Active wrappers: `prepare-context.sh`, `daily-run-strategy.sh`, `daily-run-dev.sh`, `run-*.sh`, `generate-daily-report.sh`, `start-new-session.sh`. |
| `automation/scripts/legacy/` | Archived one-off scripts | Humans (reference only) | — | Not part of the production pipeline. |
| `automation/recipes/` | YAML recipes for Goose | Goose CLI | Maintainers | `recipes/main/` (core workflow), `subrecipes/`, `specialists/`, `utilities/`. |
| `docs/` | Human-facing guides and architecture | Humans | Humans & docs agents | Includes `AGENT-PIPELINE.md`, `ARCHITECTURE.md`, `INTEGRATION_FLOWS.md`, `HOW-IT-WORKS.md`, etc. |
| `insights/daily/` | Immutable daily/weekly reports | Humans, docs agents | `generate-daily-report.sh`, docs agents | Dated taxonomy: `insights/daily/YYYY/MM-Month/DD/`. |
| `insights/research/` | Research vault (non-daily) | Humans, PM agents | Research agents (optional) | Use for long-form studies not tied to a specific day. |
| `strategy/active/` | Symlink to the current plan | All agents | Strategy Chief / PM | `current.md` points to the live strategy artifact. |
| `strategy/product/` | PM deliverables & strategy outputs | Strategy, dev, docs agents | `run-product-manager.sh` | Personas, requirements, GTM, architecture. |
| `strategy/roadmap/` | Long-term plans & integration tracks | Humans & agents | Humans/strategy agents | Canonical home for roadmap docs (duplication exists in `plans/`). |
| `strategy/decisions/` | ADRs and recorded decisions | Humans & agents | Humans/agents | Each ADR documents context + outcome. |
| `workspace/current/` | Sprint goals, blockers, decisions | All agents | Humans & agents | Must stay short-term; every automation step reads it. |
| `workspace/hubs/` | Hand-offs between agents | All agents & scripts | `run-*`, `daily-run-*` scripts | `research-latest.md`, `strategy-hand-off.md`, `dev-hand-off.md`, `docs-hand-off.md`, `pipeline-log.md`, `README.md`. |
| `workspace/sessions/` | Session notes & continuation guides | All agents | Scripts & humans | Organized by date (`workspace/sessions/YYYY-MM-DD/`). |
| `workspace/memory/` | Canonical agent memory/state | Role-specific recipes | Agents & humans | Persistent notes for agents; maintain here even though context builder does not auto-include it. |
| `memory/` | Legacy copy of agent memory | — | — | Duplicate of `workspace/memory/`; archive or remove after migration. |
| `knowledge/` | Future knowledge base | — | — | Currently empty; decide whether to populate or archive. |
| `reports/` | Legacy research drop zone | Humans | `run-pm-research.sh` | Still receiving PM reports—migrate to `insights/` before deleting. |
| `plans/` | Duplicate of `strategy/roadmap/` | — | — | Same files/size; remove once references move to roadmap. |
| `sdk/` | TypeScript workspace (core & providers) | Developer/tester agents | Developer/tester agents | Tests under `sdk/packages/**/__tests__`; builds with `npm run build`. |
| `examples/` | Example integrations | Docs/examples agents | `run-example-writer.sh`, humans | Mirrors SDK usage scenarios. |
| `privacy-cash-sdk/`, `goose/` | Vendor/upstream repositories | Humans | Humans | Consider submodules or moving outside repo to save space. |
| `defi_research/` | Legacy reference material | Humans (optional) | — | Keep as read-only archive until needed. |

### Directory Status Snapshot

- **Active**: `.goose/`, `automation/scripts/`, `automation/recipes/`, `docs/`, `insights/daily/`, `strategy/*`, `workspace/*`, `sdk/`, `examples/`.
- **Legacy (read-only but still referenced)**: `reports/` (until PM research output migrates), `defi_research/`.
- **Duplicate / needs decision**: `plans/` (same content as `strategy/roadmap/`), `memory/` (legacy copy of `workspace/memory/`).
- **Unassigned**: `knowledge/` (empty placeholder) — either populate with vetted guides or archive.
- **Vendor clones**: `privacy-cash-sdk/`, `goose/` — consider submodules or relocating outside the repo to reduce footprint.

## Recipe & Agent Cheat Sheet

| Script | Primary Recipe | Role | Reads | Writes |
|--------|----------------|------|-------|--------|
| `automation/scripts/prepare-context.sh` | — | Context builder | `workspace/current/*`, latest `workspace/sessions/*/continuation.md`, `workspace/hubs/*.md`, `strategy/active/current.md` | `.goose/data/context/current-session.md` |
| `automation/scripts/run-pm-research.sh` | `.goose/recipes/main/recipe-privacy-cash-researcher.yaml` | Research agent | Context bundle, `.goose/.goosehints` | `reports/pm-market-research-*.md`, `workspace/hubs/research-latest.md`, `workspace/hubs/pipeline-log.md` |
| `automation/scripts/run-product-manager.sh` | `.goose/recipes/main/recipe-product-manager.yaml` | Product strategy agent | Context bundle, research hand-off | `strategy/product/*.md`, `workspace/hubs/strategy-hand-off.md`, `workspace/hubs/pipeline-log.md` |
| `automation/scripts/run-developer.sh` | `.goose/recipes/main/recipe-developer.yaml` | Implementation agent | Context bundle, strategy hand-off, `sdk/` | `sdk/**`, `workspace/sessions/YYYY-MM-DD/`, `workspace/hubs/dev-hand-off.md`, `workspace/hubs/pipeline-log.md` |
| `automation/scripts/run-test-writer.sh` | `.goose/recipes/main/recipe-tester.yaml` | Testing agent | Context bundle, provider src/tests | `sdk/packages/**/__tests__`, `workspace/memory/tester/*` |
| `automation/scripts/run-example-writer.sh` | `.goose/recipes/main/recipe-frontend-integration-examples.yaml` | Docs/examples agent | Context bundle, `sdk/` | `sdk/examples/**`, (update `workspace/hubs/docs-hand-off.md` manually) |
| `automation/scripts/generate-daily-report.sh` | `.goose/recipes/utilities/recipe-session-reporter.yaml` | Summary agent | `workspace/sessions/` | `insights/daily/YYYY/MM/DD/*` |
| `automation/scripts/daily-run-strategy.sh` | (calls research & PM scripts) | Pipeline wrapper | — | Orchestrates stages 1–2, appends to pipeline log |
| `automation/scripts/daily-run-dev.sh` | (calls developer + optional report) | Pipeline wrapper | — | Orchestrates stage 3 (+ report), appends to pipeline log |

### Recipe Collections

- **Main recipes** (`.goose/recipes/main/`): Full workflows (researcher, product manager, developer, tester, strategy chief, wallet guides, etc.).
- **Subrecipes** (`.goose/recipes/subrecipes/`): Reusable modules such as `code-quality.yaml`, backend validators, QA runs, security analysis.
- **Specialists** (`.goose/recipes/specialists/`): Provider-specific agents (Railgun, Aztec, Privacy Cash, Bitcoin, Zama).
- **Utilities** (`.goose/recipes/utilities/`): Helper flows (continue work, session reporter, marketing, release ops).

Main recipes typically chain subrecipes—for instance, `recipe-developer.yaml` invokes `code-quality.yaml` and `security-analysis.yaml`. The PM recipe depends on builtin extensions (`web_search`, `repo_context`, `developer`) declared near the end of the file.

## High-Level Flow

```mermaid
graph TD
    subgraph Context["Context & Reference Inputs"]
        WC[workspace/current/*]
        WH[workspace/hubs/*]
        WS[workspace/sessions/<br/>latest continuation.md]
        STRAT[strategy/active/current.md]
    end

    PREP[prepare-context.sh] -->|writes| CONTEXT[.goose/data/context/current-session.md]
    WC --> PREP
    WH --> PREP
    WS --> PREP
    STRAT --> PREP

    CONTEXT --> PMR[run-pm-research.sh]
    CONTEXT --> PM[run-product-manager.sh]
    CONTEXT --> DEV[daily-run-dev.sh → run-developer.sh]

    PMR -->|handoff| HUBR[workspace/hubs/research-latest.md]
    PMR -->|report (legacy)| REPORTS[reports/pm-market-research-YYYY-MM-DD.md]
    PMR --> PIPELOG[workspace/hubs/pipeline-log.md]
    HUBR --> PM

    PM -->|strategy docs| PROD[strategy/product/*]
    PM -->|hand-off| HUBS[workspace/hubs/strategy-hand-off.md]
    PM --> PIPELOG

    HUBS --> DEV
    DEV -->|code changes| SDK[sdk/**]
    DEV -->|session logs| SESSIONS[workspace/sessions/YYYY-MM-DD/*]
    DEV -->|hand-off| HUBD[workspace/hubs/dev-hand-off.md]
    DEV --> PIPELOG

    DEV --> REPORT[generate-daily-report.sh]
    REPORT -->|daily summary| INSIGHTS[insights/daily/YYYY/MM/DD/daily-summary.md]
    REPORT --> PIPELOG

    HUBD --> DOCSAGENTS[run-example-writer.sh / run-test-writer.sh]
    HUBS --> DOCSAGENTS
    DOCSAGENTS -->|docs & examples| DOCOUT[docs/, sdk/examples/]
    DOCSAGENTS -->|insights| INSIGHTS
    DOCSAGENTS -->|hand-off| HUBDOC[workspace/hubs/docs-hand-off.md]
    DOCSAGENTS --> PIPELOG
```

All pipeline stages append a breadcrumb to `workspace/hubs/pipeline-log.md`, making it easy to audit which automation ran most recently.

## Shared Context & Inputs

- **Context bundle:** `.goose/data/context/current-session.md` combines `workspace/current/*.md`, the latest `workspace/sessions/*/continuation.md`, and all hub files. Regenerate it with `automation/scripts/prepare-context.sh`.
- **Goose hints:** `.goose/.goosehints` provides model-specific background; recipes automatically load it.
- **Required reads:** The rules in `.goose/RULES.md` still force each agent to read the sprint plan, blockers, continuation note, and role memory before acting.

## Stage 1 – Research Agent

- **Script:** `automation/scripts/run-pm-research.sh` (or `daily-run-strategy.sh` step 1).
- **Inputs:** Context bundle, `.goose/recipes/main/recipe-privacy-cash-researcher.yaml`.
- **Outputs:**
  - `reports/pm-market-research-YYYY-MM-DD.md` – current canonical report (legacy location until migration to `insights/research/`).
  - `insights/research/` – optional deep-dive summaries when generated manually.
  - `workspace/hubs/research-latest.md` – summary + preview for downstream agents.
  - `workspace/hubs/pipeline-log.md` – timestamped entry (`pm-research ...`).
- **Follow-up:** Product Manager agent reads the hub file to incorporate the latest findings.

## Stage 2 – Product Strategy Agent

- **Scripts:** `automation/scripts/run-product-manager.sh`, wrapped by `daily-run-strategy.sh`.
- **Inputs:** Research hand-off, context bundle, `.goose/recipes/main/recipe-product-manager.yaml`.
- **Outputs:**
  - `strategy/product/*.md` – personas, requirements, architecture, GTM.
  - `workspace/hubs/strategy-hand-off.md` – lists new docs + quick previews.
  - `workspace/hubs/pipeline-log.md` – `product-manager ...` entry.
- **Next hops:** Developer pipeline and comms/doc agents consume `strategy-hand-off.md`.

## Stage 3 – Developer Agent

- **Scripts:** `automation/scripts/run-developer.sh` or `daily-run-dev.sh` (the latter also calls `generate-daily-report.sh` by default).
- **Inputs:** Strategy hand-off, context bundle, `.goose/recipes/main/recipe-developer.yaml`.
- **Outputs:**
  - Code under `sdk/packages/**`.
  - Session notes under `workspace/sessions/YYYY-MM-DD/`.
  - `workspace/hubs/dev-hand-off.md` – summary with link to the latest session log.
  - Optional coverage output from the `npm test --coverage` call.
  - Pipeline breadcrumb (`developer ...`) in `workspace/hubs/pipeline-log.md`.
- **Hand-off:** Update `workspace/current/sprint.md` and continuation files per `.goose/RULES.md`.

## Stage 4 – Docs, Blog, and Social Agents

- **Scripts:** `automation/scripts/run-example-writer.sh`, `automation/scripts/run-test-writer.sh`, plus custom Goose runs.
- **Inputs:** Strategy hand-off + dev hand-off hub files.
- **Outputs:** Documentation in `docs/`, examples in `sdk/examples/`, content in `insights/daily/...`, and status notes appended to `workspace/hubs/docs-hand-off.md`.
- **Reminder:** Drop any external-facing summary (tweets, blog drafts) into `insights/daily/` following the date structure.

## Stage 5 – Reporting & Continuity

- `automation/scripts/generate-daily-report.sh` aggregates the day into `insights/daily/YYYY/MM-MonthName/DD/daily-summary.md`.
- `workspace/sessions/YYYY-MM-DD/continuation.md` documents the next actions for whoever picks up later.
- `workspace/current/sprint.md` remains the single source for in-flight goals; update the checklist after each agent run.

## Running the Pipeline

- **Full strategy pass:** `automation/scripts/daily-run-strategy.sh`
- **Developer focus:** `automation/scripts/daily-run-dev.sh -- [developer args]`
- **Manual steps:** You can still call `run-pm-research.sh`, `run-product-manager.sh`, or `run-developer.sh` individually; each script refreshes the context bundle and hub files before launching Goose.

Keep the hub files tidy: every script overwrites its own hand-off file so the next agent always sees the latest state. If you add a new specialist (QA, marketing, etc.), give it a dedicated hub file in `workspace/hubs/` and update `prepare-context.sh` to include it in the context packet.

## Cleanup & Directory Decisions

- **Move research reports**: Update `automation/scripts/run-pm-research.sh` (and wrappers) to publish under `insights/research/` or dated `insights/daily/` folders, then retire `reports/`.
- **Consolidate plans**: Point any documents or scripts to `strategy/roadmap/` and remove the duplicate `plans/` directory once references are updated.
- **Canonical memory**: Keep `workspace/memory/` as the only writable memory tree; archive or delete the root-level `memory/` after confirming no recipes read it.
- **Decide on `knowledge/`**: Either seed it with curated references or archive it to reduce tree noise.
- **Vendor repositories**: Evaluate converting `privacy-cash-sdk/` and `goose/` to Git submodules or relocating them outside the main workspace to shrink the repo footprint.
- After any move, rerun `automation/scripts/prepare-context.sh` so `.goose/data/context/current-session.md` reflects the new layout.

## Quick Checklist Before Running Agents

1. `workspace/current/` only contains sprint/blockers/decisions (move long-term docs to `strategy/`).
2. `workspace/hubs/*.md` exist (empty or containing the latest snapshot).
3. `.goose/data/context/current-session.md` is freshly generated (`automation/scripts/prepare-context.sh`).
4. Vendor repos (`goose/`, `privacy-cash-sdk/`) are in known states or referenced via submodules.
5. Legacy folders like `defi_research/` are treated as read-only archives.
