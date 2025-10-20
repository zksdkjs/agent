# Repository Guidelines

## Project Structure & Module Organization
The repository is anchored in `sdk/`, a TypeScript workspace. `sdk/packages/core` exposes the primary SDK facade, `sdk/packages/providers/*` contains chain-specific integrations, and `sdk/packages/recipes` holds composed privacy workflows. Use `sdk/examples` for runnable demos and `sdk/scripts` for scripted showcases. Automation entry points live in `automation/scripts/*.sh` and `automation/recipes/*.yaml`; consult these before orchestrating multi-agent runs. Planning artifacts reside in `plans/` and should be reviewed before large roadmap shifts.

## Build, Test, and Development Commands
Install dependencies once inside `sdk/` with `npm install`. Key commands:

```bash
npm run build         # Compile TypeScript via tsc
npm test              # Execute Jest suite with ts-jest
npm run lint          # ESLint across packages/*/src
npm run example:aztec # Run Aztec integration example
npm run demo:aztec    # Demonstrate scripted Aztec workflow
```

Automation flows use `goose run --recipe <file>`; prefer the curated recipes shipped in `automation/recipes`.

## Coding Style & Naming Conventions
Write modern TypeScript with ES modules. Keep two-space indentation (see `sdk/packages/core/src/sdk.ts`), `camelCase` for variables and functions, `PascalCase` for classes, and `UPPER_SNAKE_CASE` for constants. Match filename patterns such as `railgun-private-transfer-step.ts`. Retain concise JSDoc blocks for public APIs and align implementations with interfaces defined in `sdk/types`.

## Testing Guidelines
Unit tests sit alongside code under `__tests__` directories using the `.test.ts` suffix. Mirror provider behaviors with realistic fixtures (e.g., `sdk/packages/providers/bitcoin/src/__tests__/bitcoin-provider.test.ts`). Run `npm test` before opening a PR; add targeted tests when introducing new providers, recipes, or steps. Document any intentional coverage gaps in the pull request.

## Commit & Pull Request Guidelines
Follow the conventional style observed in history: optional emoji + `type: summary` (`🎉 feat: Add railgun provider`). Keep commit messages imperative, scoped, and reference issue IDs when available. Pull requests must include a brief problem statement, summary of changes, test evidence (`npm test`), and any rollout considerations. Request review from maintainers responsible for affected providers or shared abstractions.

## Security & Configuration Tips
Never commit API keys or secrets—use the environment variables described in `SETUP.md`. Validate new automation scripts and outputs against `.gitignore` before committing. When integrating third-party privacy SDKs, document configuration flags and default safeguards in the pull request description.
