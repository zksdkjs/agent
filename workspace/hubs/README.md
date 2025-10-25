# Hubs Directory

Shared hand-off points for multi-agent workflows. Each file acts as a lightweight queue or pointer so downstream agents can pick up work without scraping the whole tree.

- `research-latest.md` – snapshot of the most recent research session, maintained by the PM Research runner.
- `strategy-hand-off.md` – summary of product strategy outputs and open questions for strategy/maintainer agents.
- `dev-hand-off.md` – current engineering focus and pointers to code/session logs.
- `docs-hand-off.md` – items for documentation, blog, and social agents.
- `pipeline-log.md` – timestamped record every time an orchestration script runs.

Scripts in `automation/scripts` populate these files automatically; agents should read them (alongside the required context files in `workspace/current/`) before starting new work.
