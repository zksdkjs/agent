# Light Protocol References Audit – October 26, 2025

## Overview

After migrating public-facing documentation to use "Privacy Cash" nomenclature, this document catalogs remaining "Light Protocol" references in the privacy-agent repository.

## Summary

- **Total References**: 113 matches across 31 files
- **Status**: ✅ All appropriate and intentional
- **Action Required**: ❌ None (references are correct as-is)

## Rationale

The term "Light Protocol" remains intentionally used in:

1. **Technical Implementation** – Package names, provider classes, and code modules
2. **Historical Documents** – Session reports, plans, and decision records (preserve historical accuracy)
3. **Integration Guides** – Technical documentation referencing the actual SDK implementation

## Detailed Breakdown

### 1. Technical Implementation Files (Correct Usage)

These files use "Light Protocol" as the technical package/provider name, which is correct:

- `sdk/packages/providers/light-protocol/src/light-provider.ts` (4 matches)
- `sdk/packages/providers/light-protocol/src/provider.ts` (2 matches)
- `sdk/packages/providers/light-protocol/src/compressed-token.ts` (4 matches)
- `sdk/packages/providers/light-protocol/src/__tests__/light-protocol-provider.test.ts` (1 match)
- `sdk/packages/providers/light-protocol/package.json` (1 match)
- `examples/backend/light-protocol-example.ts` (2 matches)
- `docs/backend/light-protocol-integration.md` (6 matches)

**Rationale**: The technical package is named `light-protocol` because it implements a Solana privacy provider that wraps the Privacy Cash SDK. This is similar to how `@railgun-community/engine` is the package name but "Railgun" is the marketed brand.

### 2. Documentation & Guides (Correct Usage)

- `docs/PROVIDER_COMPARISON.md` (11 matches) – Comparison table references
- `docs/INTEGRATION_FLOWS.md` (4 matches) – Technical integration flows
- `docs/ARCHITECTURE.md` (6 matches) – Architecture diagrams

**Rationale**: These are technical documentation files that correctly reference the provider implementation.

### 3. Historical Documents (Preserve Historical Accuracy)

- `insights/daily/2025/10-October/23/session-report-2025-10-23.md` (1 match)
- `insights/daily/2025/10-October/23/comprehensive-session-2025-10-23.md` (7 matches)
- `workspace/sessions/2025-10-23/continuation.md` (1 match)
- `strategy/roadmap/light-protocol-plan.md` (2 matches)
- `plans/light-protocol-plan.md` (2 matches)

**Rationale**: Historical documents should preserve the original terminology used at the time of creation. Changing these would create confusion when reviewing project history.

### 4. Strategic Documents (Contextual References)

- `strategy/product/technical-architecture.md` (1 match)
- `strategy/CONTEXT-FOR-STRATEGY.md` (1 match)
- `workspace/current/sprint.md` (1 match)
- `strategy/roadmap/next-actions-bitcoin-frontend.md` (1 match)
- `strategy/roadmap/claude-opus-operates-goose-agents.md` (19 matches)
- `plans/next-actions-bitcoin-frontend.md` (1 match)
- `plans/claude-opus-operates-goose-agents.md` (19 matches)

**Rationale**: Strategic documents correctly reference "Light Protocol" in technical contexts (provider names, implementation details) while using "Privacy Cash" for user-facing features and capabilities.

### 5. Automation Scripts (Legacy)

- `automation/scripts/legacy/work-for-real.sh` (1 match)
- `automation/scripts/legacy/ultimate-sdk-builder.sh` (1 match)
- `automation/scripts/legacy/smart-continue.sh` (1 match)
- `automation/scripts/legacy/one-hour-sprint.sh` (2 matches)
- `automation/scripts/legacy/launch-specialist-agents.sh` (3 matches)
- `automation/scripts/legacy/goose-continue.sh` (2 matches)
- `automation/scripts/legacy/check-real-status.sh` (1 match)
- `automation/scripts/run-test-writer.sh` (3 matches)
- `automation/scripts/run-example-writer.sh` (2 matches)

**Rationale**: Legacy scripts (in `legacy/` directory) are archived for historical reference. Active scripts reference "Light Protocol" correctly in technical contexts.

## Verification: zk-landing Repository

The public-facing documentation site (zk-landing) has been fully migrated:

```bash
$ rg -i "Light Protocol" zk-landing/
# Only matches in the new update post (2025-10-26-privacy-cash-update.mdx)
# where it's used intentionally in the comparison table.
```

✅ **Status**: All user-facing "Light Protocol" references replaced with "Privacy Cash"

## Naming Convention Summary

### Use "Privacy Cash" when:
- Describing capabilities to end users
- Marketing copy and landing pages
- Feature announcements and blog posts
- User-facing documentation
- Social media and community communications

### Use "Light Protocol" when:
- Referring to package names (`@zksdk/light-protocol`)
- Technical implementation details
- Code comments and function names
- Developer integration guides
- Historical/archived documents

## Recommendations

1. **No Action Required**: Current state is correct and intentional
2. **Future Documentation**: Continue using "Privacy Cash" for user-facing content
3. **Technical Docs**: Maintain "Light Protocol" as the package/provider name
4. **Historical Preservation**: Do not retroactively change historical documents
5. **New Content**: Follow the naming convention guide above

## Related Documents

- `zk-landing/docs/zksdkjs/updates/2025-10-26-privacy-cash-update.mdx` – Public announcement
- `privacy-agent/docs/backend/light-protocol-integration.md` – Technical integration guide
- `privacy-agent/strategy/product/provider-comparison.md` – Provider comparison matrix

---

**Audit Date**: 2025-10-26  
**Auditor**: zkSDK Documentation Team  
**Status**: ✅ Complete – No changes required

