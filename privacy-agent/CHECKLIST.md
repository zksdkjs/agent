# zkSDK Strategic System Checklist

Mark each when done. Keep runs inside `privacy-agent/`.

## 0) Critical one-time fixes
- [x] Rename workspace to remove spaces/parens (prevents tool JSON errors):
      `mv "/Users/saeeddawod/Desktop/agent_workspace (2)" \
          "/Users/saeeddawod/Desktop/agent_workspace_2"`
- [x] From now on, run here: `/Users/saeeddawod/Desktop/agent_workspace_2/privacy-agent`
- [x] Use consistent session names: `zkSDK_developer`, `zkSDK_research_main`, `zkSDK_social`
- [x] Archive legacy tree to `archive/`: `minimax-m1-agent-space/` (done)

## 1) Provider/config sanity
- [x] OpenRouter configured in Goose (global). Do NOT set model in recipes
- [x] Recipes validated:
      `goose recipe validate recipes/recipe-developer.yaml`
      `goose recipe validate recipes/recipe-research-intelligence.yaml`
- [x] Extensions: use built-ins only (`developer`, `memory`, `web_search`, `repo_context`)

## 2) Daily automation (Dev → Social)
- [x] Run: `bash scripts/daily-run.sh`
- [ ] Check dev summary: `outputs/social/dev_summary_YYYYMMDD.md`
- [ ] Check social thread: `outputs/social/twitter_YYYYMMDD.md`

## 3) Research loop (reliable sources)
- [x] Start: `goose run --recipe recipes/recipe-research-intelligence.yaml --name "zkSDK_research_main" --max-turns 25`
- [ ] If prompted to continue:
      `bash scripts/resume-continue.sh zkSDK_research_main 30 "Yes, continue and complete the plan, then summarize."`
- [ ] Outputs reviewed: `research_temp/`, `outputs/reports/`

## 4) Developer performance loop
- [ ] Choose task from `MASTER_PLAN.md` (+ issues); `PROJECT_STATUS.docx` optional
- [ ] Plan exact files/symbols to change
- [ ] Search fast (`glob`/grep), edit minimal regions
- [ ] Typecheck/lint/tests (affected first, then full if needed)
- [ ] Summarize to `outputs/social/dev_summary_YYYYMMDD.md`
- [ ] Run: `goose run --recipe recipes/recipe-developer.yaml --name "zkSDK_developer" --max-turns 35`

## 5) Specialists (deep bursts)
- [ ] Railgun: `goose run --recipe recipes/recipe-railgun-specialist.yaml --name "railgun_specialist" --max-turns 20`
- [ ] Aztec: `goose run --recipe recipes/recipe-aztec-specialist.yaml --name "aztec_specialist" --max-turns 20`

## 6) Strategy/self-improvement (proposals, not auto-edits)
- [ ] Run: `goose run --recipe recipes/recipe-strategy-chief.yaml --name "zkSDK_strategy" --max-turns 15 --text "Review outputs and PROJECT_PLAN. Propose concrete improvements into plans/agent_improvements.md. Do not modify recipes directly."`
- [ ] Review `plans/agent_improvements.md` and apply selected changes

## 7) Memory management
- [ ] Prefer consistent session names; resume with:
      `bash scripts/resume-continue.sh <SESSION> 20 "Yes, continue…"`
- [ ] If context gets heavy, start a fresh session and reference prior summaries
- [ ] Session logs live in `~/.local/share/goose/sessions/*.jsonl` and local `sessions/`

## 8) Health/monitoring
- [x] Quick check: `bash scripts/health-check.sh`
- [x] Inspect sessions: `goose session list`

## 9) Scheduling (launchd on macOS)
- [x] Create `~/Library/LaunchAgents/com.zksdk.daily.plist` to run `bash scripts/daily-run.sh`
- [x] Set WorkingDirectory to the `privacy-agent/` path WITHOUT spaces
- [x] Load & start: `launchctl load ~/Library/LaunchAgents/com.zksdk.daily.plist` then `launchctl start com.zksdk.daily`



