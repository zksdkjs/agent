---
sidebar_position: 5
---

# Complete Recipe Catalog

zkSDK uses **31 Goose recipes** organized into 4 categories. Each recipe is a specialized AI agent with specific instructions and capabilities. This is the complete catalog of every recipe in the system.

## 📚 Recipe Organization

```
.goose/recipes/
├── main/           # 12 core workflow agents
├── specialists/    # 5 provider-specific experts
├── subrecipes/     # 7 reusable sub-workflows
└── utilities/      # 7 helper agents
```

**Total: 31 recipes**

---

## 🎯 Main Workflows (12 recipes)

These are the primary agents that run the development pipeline.

### 1. recipe-developer.yaml
**Purpose:** Code implementation and feature development
**Model:** Qwen3-Coder-Plus (32B)
**Script:** `automation/scripts/run-developer.sh`

**What it does:**
- Implements new SDK features
- Creates provider packages
- Writes TypeScript/Rust code
- Fixes bugs and refactors
- Creates initial tests
- Updates package.json files

**Invokes subrecipes:**
- `code-quality.yaml` - Code analysis
- `security-analysis.yaml` - Security checks

**Parameters:**
- `provider_name` - Which provider to work on (railgun, aztec, etc.)
- `work_type` - feature, bugfix, test, refactor, docs
- `test_coverage_target` - Target coverage % (default: 90)
- `session_duration` - quick, medium, full

**Outputs:**
- Code in `sdk/packages/**`
- `workspace/hubs/dev-hand-off.md`
- Session logs

**Recent work:** Built wallet-connect package, auto-provider detection

---

### 2. recipe-tester.yaml
**Purpose:** Test generation and quality assurance
**Model:** Qwen3-Coder-Plus (32B)
**Script:** `automation/scripts/run-test-writer.sh`

**What it does:**
- Writes Jest test suites
- Improves code coverage
- Integration testing
- Performance benchmarks
- Security validation
- Mock external dependencies

**Parameters:**
- `target` - Package to test (auto, wallet-connect, railgun, etc.)
- `coverage_target` - Target % (default: 90)
- `session_duration` - quick, medium, full

**Standards:**
- Minimum 90% coverage
- Unit + integration tests
- Mock network calls
- Test both success & failure cases

**Outputs:**
- Tests in `sdk/packages/**/__tests__/`
- Coverage reports in `sdk/coverage/`
- `workspace/hubs/docs-hand-off.md`

**Recent achievements:** Core 0% → 100%, overall +2.5%

---

### 3. recipe-product-manager.yaml
**Purpose:** Product strategy and requirements
**Model:** Claude Opus
**Script:** `automation/scripts/run-product-manager.sh`

**What it does:**
- Define product strategy
- Create user personas
- Write technical specs
- Plan go-to-market
- Set success metrics
- Prioritize features

**Invokes:**
- Web search for market data
- Repo context for codebase understanding

**Outputs:**
- `strategy/product/*.md`
  - user-personas.md
  - market-analysis.md
  - technical-architecture.md
  - unified-interface-spec.md
  - product-requirements-v1.md
  - defi-integration-patterns.md
  - metrics-dashboard.md
  - go-to-market.md
- `workspace/hubs/strategy-hand-off.md`

**Deliverables (Oct 2025):** 8 comprehensive strategy docs totaling 88KB

---

### 4. recipe-privacy-cash-researcher.yaml
**Purpose:** Market research and competitive analysis
**Model:** Claude Opus
**Script:** `automation/scripts/run-pm-research.sh`

**What it does:**
- Market research on privacy protocols
- Competitive analysis
- Developer needs assessment
- Technology trends
- Opportunity sizing

**Capabilities:**
- Web search integration
- GitHub repository analysis
- Documentation reviews
- Community sentiment analysis

**Outputs:**
- `insights/research/pm-market-research-*.md`
- `workspace/hubs/research-latest.md`
- Market sizing reports

---

### 5. recipe-doc-site-writer.yaml
**Purpose:** Marketing documentation and guides
**Model:** Claude Opus
**Script:** `automation/scripts/run-doc-site-writer.sh`

**What it does:**
- Write marketing docs
- Create technical guides
- Weekly/daily updates
- Blog posts
- SEO optimization
- Tutorial content

**Targets:**
- `../zk-landing/docs/zksdkjs/**`
- Weekly updates
- Architecture docs
- Integration guides

**Parameters:**
- `--scope` - daily, weekly, major
- `--site-root` - Path to zk-landing repo

**Recent updates:** zkWalletConnect announcement, agent pipeline docs, Oct 23/25 updates

---

### 6. recipe-frontend-integration-examples.yaml
**Purpose:** Create usage examples and demos
**Model:** Qwen3-Coder-Plus (32B)
**Script:** `automation/scripts/run-example-writer.sh`

**What it does:**
- Write usage examples
- Create integration demos
- Quick-start templates
- Best practices code
- Framework-specific examples (React, Vue, Svelte)

**Outputs:**
- `sdk/examples/**`
- `sdk/packages/*/examples/`
- Integration templates

**Example types:**
- Basic transfers
- Wallet connection
- Multi-provider usage
- React hooks
- Error handling

---

### 7. recipe-strategy-chief.yaml
**Purpose:** High-level strategic planning
**Model:** Claude Opus

**What it does:**
- Long-term roadmap
- Cross-agent coordination
- Risk assessment
- Priority decisions
- Strategic pivots
- Resource allocation

**Focus areas:**
- Q4 2025 → Q1 2026 planning
- Feature prioritization
- Market positioning
- Partnership strategy

---

### 8. recipe-task-coordinator.yaml
**Purpose:** Workflow orchestration
**Model:** Claude Sonnet

**What it does:**
- Agent sequencing
- Dependency management
- Conflict resolution
- Task distribution
- Progress tracking

---

### 9. recipe-architecture-overview.yaml
**Purpose:** Architecture documentation
**Model:** Claude Opus

**What it does:**
- System architecture docs
- Component diagrams
- Data flow patterns
- Security model
- Integration flows

**Outputs (Oct 23):**
- ARCHITECTURE.md (398 lines)
- PROVIDER_COMPARISON.md (425 lines)
- INTEGRATION_FLOWS.md (597 lines)

---

### 10. recipe-strategy-optimizer.yaml
**Purpose:** Strategy refinement and optimization
**Model:** Claude Opus

**What it does:**
- Analyze current strategy
- Identify optimization opportunities
- Refine approach based on data
- Adjust priorities
- Update roadmaps

---

### 11. recipe-frontend-wallet-guides.yaml
**Purpose:** Wallet integration documentation
**Model:** Claude Opus

**What it does:**
- Create wallet setup guides
- Provider-specific instructions
- Troubleshooting docs
- Best practices
- Security guidelines

---

### 12. recipe-wallet-connect-system.yaml
**Purpose:** Build zkWalletConnect unified interface
**Model:** Qwen3-Coder-Plus (32B)

**What it does:**
- Create wallet-connect package
- Build provider adapters
- Auto-detection logic
- Unified wallet API
- Handle provider-specific quirks

**Deliverables (Oct 25):**
- `@zksdk/wallet-connect` package
- Railgun & Aztec adapters
- Auto-provider detection

---

## 🔬 Provider Specialists (5 recipes)

Deep-dive experts for each privacy protocol.

### 1. recipe-railgun-specialist.yaml
**Purpose:** Railgun EVM privacy expert
**Model:** Qwen3-Coder-Plus (32B)

**Expertise:**
- Railgun engine integration
- Proof generation
- Shield/unshield flows
- RPC configuration
- Gas optimization

**Focus:**
- `@zksdk/providers-railgun`
- Recipe→Step→ComboMeal patterns
- Production readiness

---

### 2. recipe-aztec-specialist.yaml
**Purpose:** Aztec zkEVM expert
**Model:** Qwen3-Coder-Plus (32B)

**Expertise:**
- PXE service integration
- Account abstraction
- Noir contract compilation
- Aztec wallet patterns
- Cross-chain messaging

**Focus:**
- `@zksdk/providers-aztec`
- Aztec.nr integration
- Contract interactions

---

### 3. recipe-zama-fhe-specialist.yaml
**Purpose:** Zama fhEVM encrypted compute expert
**Model:** Qwen3-Coder-Plus (32B)

**Expertise:**
- Encrypted transactions
- Gateway integration
- TFHE operations
- Key management
- Decryption flows

**Focus:**
- `@zksdk/providers-fhevm`
- Inco Network support
- Confidential compute patterns

---

### 4. recipe-bitcoin-privacy-specialist.yaml
**Purpose:** Bitcoin privacy expert
**Model:** Qwen3-Coder-Plus (32B)

**Expertise:**
- Silent Payments
- CoinJoin protocols
- UTXO management
- Lightning privacy
- Taproot optimization

**Focus:**
- `@zksdk/providers-bitcoin`
- On-chain privacy
- Lightning integration

---

### 5. recipe-privacy-cash-sdk.yaml
**Purpose:** Solana/Privacy Cash expert
**Model:** Qwen3-Coder-Plus (32B)

**Expertise:**
- Solana ZK compression
- Privacy Cash integration
- Solana wallet patterns
- SPL token privacy
- Compressed accounts

**Focus:**
- `@zksdk/providers-light-protocol`
- Privacy Cash integration
- Solana-specific patterns

---

## 🔧 Subrecipes (7 recipes)

Reusable modules invoked by main recipes. Like helper functions for agents.

### 1. code-quality.yaml
**Purpose:** Code quality analysis
**Invoked by:** Developer, Tester

**Checks:**
- TypeScript standards
- ESLint compliance
- Code complexity
- Naming conventions
- Documentation completeness

**Parameters:**
- `target_path` - File/directory to analyze
- `check_level` - basic, standard, strict
- `fix_issues` - Auto-fix if true

---

### 2. security-analysis.yaml
**Purpose:** Security vulnerability scanning
**Invoked by:** Developer, Release Operations

**Checks:**
- Dependency vulnerabilities
- Insecure patterns
- Private key exposure
- SQL injection risks
- XSS vulnerabilities

---

### 3. recipe-qa-full-integration.yaml
**Purpose:** Full end-to-end QA workflow
**Invoked by:** Release Operations

**Tests:**
- Integration tests
- E2E workflows
- Cross-provider scenarios
- Performance benchmarks
- Load testing

---

### 4. recipe-qa-fix-tests.yaml
**Purpose:** Fix failing tests
**Invoked by:** Tester, Developer

**Actions:**
- Analyze test failures
- Fix broken assertions
- Update mocks
- Resolve type issues
- Re-run tests

---

### 5. recipe-railgun-backend-validator.yaml
**Purpose:** Validate Railgun backend integration
**Invoked by:** Railgun Specialist

**Validates:**
- Engine initialization
- Wallet creation
- Proof generation
- Transaction submission
- Balance queries

---

### 6. recipe-aztec-backend-validator.yaml
**Purpose:** Validate Aztec backend integration
**Invoked by:** Aztec Specialist

**Validates:**
- PXE connection
- Account creation
- Contract deployment
- Transaction execution
- Noir compilation

---

### 7. recipe-fhevm-backend-validator.yaml
**Purpose:** Validate fhEVM backend integration
**Invoked by:** Zama Specialist

**Validates:**
- Gateway connection
- Encrypted operations
- Key management
- Decryption flows
- Gas estimation

---

## 🛠️ Utilities (7 recipes)

Helper agents for specific tasks.

### 1. recipe-session-reporter.yaml
**Purpose:** Generate daily summaries
**Script:** `automation/scripts/generate-daily-report.sh`

**Creates:**
- `insights/daily/YYYY/MM-Month/DD/daily-summary.md`
- Session summaries
- Progress metrics
- Next actions

---

### 2. recipe-continue-work.yaml
**Purpose:** Resume interrupted sessions

**Actions:**
- Read continuation.md
- Load agent memory
- Restore context
- Resume from checkpoint

---

### 3. recipe-marketing-growth.yaml
**Purpose:** Community engagement and marketing
**Model:** Claude Opus

**Activities:**
- Twitter threads
- Blog posts
- Community updates
- Partner outreach
- Developer evangelism

---

### 4. recipe-release-operations.yaml
**Purpose:** Release management
**Model:** Claude Sonnet

**Tasks:**
- Version bumping
- Changelog generation
- Deployment checklists
- Release notes
- Launch coordination

---

### 5. recipe-social.yaml
**Purpose:** Social media content
**Model:** Claude Opus

**Creates:**
- Twitter threads
- LinkedIn posts
- Blog drafts
- Tutorials
- Announcements

---

### 6. recipe-goose-improver.yaml
**Purpose:** Optimize Goose setup

**Analyzes:**
- Recipe organization
- Memory management
- Session handling
- Multi-agent patterns
- Performance optimization

---

### 7. recipe-research-intelligence.yaml
**Purpose:** Deep research on new topics

**Capabilities:**
- Protocol analysis
- Technology deep-dives
- Competitive research
- Trend analysis
- Opportunity identification

---

## 🔗 Recipe Chaining

### How Recipes Work Together

**Main Recipe invokes Subrecipes:**
```yaml
# recipe-developer.yaml includes:
invoke_subrecipe: code-quality.yaml
invoke_subrecipe: security-analysis.yaml
```

**Pipeline Chains Main Recipes:**
```bash
daily-run-strategy.sh:
  1. recipe-privacy-cash-researcher.yaml
  2. recipe-product-manager.yaml

daily-run-dev.sh:
  3. recipe-developer.yaml
     ├─> code-quality.yaml
     └─> security-analysis.yaml

daily-run-post-dev.sh:
  4. recipe-tester.yaml
  5. recipe-frontend-integration-examples.yaml
  6. recipe-doc-site-writer.yaml
  7. recipe-session-reporter.yaml
```

**Specialists Called On-Demand:**
```bash
# When working on specific provider
goose run --recipe .goose/recipes/specialists/recipe-railgun-specialist.yaml
  ├─> recipe-railgun-backend-validator.yaml
  └─> code-quality.yaml
```

---

## 📊 Recipe Usage Stats (October 2025)

| Recipe | Times Run | Lines Generated | Primary Output |
|--------|-----------|-----------------|----------------|
| Developer | 12 | ~2,000 | SDK code |
| Tester | 8 | ~1,500 | Test suites |
| Product Manager | 3 | ~5,000 | Strategy docs |
| Doc Site Writer | 10 | ~3,000 | Marketing docs |
| Railgun Specialist | 6 | ~1,200 | Provider impl |
| Session Reporter | 15 | ~800 | Daily summaries |

---

## 🎯 When to Use Which Recipe

### Building Features
→ `recipe-developer.yaml` (with provider specialists as needed)

### Improving Quality
→ `recipe-tester.yaml` + `code-quality.yaml` subrecipe

### Planning Strategy
→ `recipe-product-manager.yaml` + `recipe-strategy-chief.yaml`

### Research
→ `recipe-privacy-cash-researcher.yaml` or `recipe-research-intelligence.yaml`

### Documentation
→ `recipe-doc-site-writer.yaml` + `recipe-frontend-integration-examples.yaml`

### Release
→ `recipe-release-operations.yaml` + `recipe-qa-full-integration.yaml`

### Marketing
→ `recipe-marketing-growth.yaml` + `recipe-social.yaml`

### Debugging
→ `recipe-continue-work.yaml` + `recipe-qa-fix-tests.yaml`

---

## 🚀 Running Recipes

### Via Scripts (Recommended)
```bash
# Main workflows
./automation/scripts/run-developer.sh
./automation/scripts/run-test-writer.sh
./automation/scripts/run-product-manager.sh

# Full pipelines
./automation/scripts/daily-run-strategy.sh
./automation/scripts/daily-run-dev.sh --with-post-dev
```

### Direct Goose Commands
```bash
# Main recipe
goose run --recipe .goose/recipes/main/recipe-developer.yaml \
  --params "provider_name=railgun" \
  --params "work_type=feature"

# Specialist
goose run --recipe .goose/recipes/specialists/recipe-aztec-specialist.yaml \
  --max-turns 30

# Utility
goose run --recipe .goose/recipes/utilities/recipe-session-reporter.yaml
```

### With Parameters
```bash
# Developer with specific settings
./automation/scripts/run-developer.sh railgun feature 95 full

# Test writer with target
./automation/scripts/run-test-writer.sh wallet-connect 90
```

---

## 📚 Resources

- **Recipe Files:** `.goose/recipes/` in privacy-agent repo
- **Automation Scripts:** `automation/scripts/`
- **Agent Guide:** `/docs/zksdkjs/agents`
- **Pipeline Guide:** `/docs/zksdkjs/agent-pipeline`

---

**Last Updated:** October 25, 2025
**Total Recipes:** 31 (12 main + 5 specialists + 7 subrecipes + 7 utilities)
**Framework:** Goose by Block
**Models:** Qwen3-Coder-Plus (32B), Claude Opus/Sonnet
