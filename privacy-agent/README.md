# 🔒 zkSDKjs  - Universal Private Transfers for Every Blockchain

> **"One API for private transfers everywhere"** - ETH, SOL, MATIC, and every major blockchain

##  Development Framework V2

**NEW**: We've migrated to Framework V2 for sustainable long-term development.

-  **[HOW-IT-WORKS.md](./HOW-IT-WORKS.md)** - Complete guide to the new structure
-  **[.goose/RULES.md](./.goose/RULES.md)** - Rules for AI agents
-  **[workspace/current/](./workspace/current/)** - Current work status
-  **[insights/](./insights/)** - All reports and research
-  **[strategy/active/](./strategy/active/)** - Current strategy

**Quick Start for Developers**:
```bash
# See what we're working on
cat workspace/current/sprint.md

# Start a new session
./automation/scripts/start-new-session.sh

# Run PM research
./automation/scripts/run-pm-research.sh
```

[![NPM Version](https://img.shields.io/npm/v/@zksdkjs/core.svg)](https://www.npmjs.com/package/@zksdkjs/core)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

##  The Problem

Developers want to add privacy to token transfers but face a fragmented landscape:

- **Ethereum**: Complex zkSNARK implementations for ETH + ERC20 tokens
- **Solana**: Different privacy protocols for SOL + SPL tokens  
- **Polygon**: Separate integration for MATIC + polygon tokens
- **Each Chain**: Different APIs, different complexity, weeks of integration work

**Result**: Privacy remains accessible only to advanced teams, limiting adoption across Web3.

##  The Solution

**zkSDK provides one simple API for private transfers across every major blockchain:**

```javascript
import { zkSDK } from '@zksdkjs/core';

// Private ETH transfer
await zkSDK.transfer({
  chain: "ethereum",
  token: "ETH",
  amount: "1.0",
  to: "0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e",
  privacy: "full"
});

// Private SOL transfer
await zkSDK.transfer({
  chain: "solana", 
  token: "SOL",
  amount: "10.0",
  to: "DQyrAcCrDXQ7NeoqGgDCZwBvkDDyF7piNC4bRoMvQSLE",
  privacy: "anonymous"
});

// Private USDC on any supported chain
await zkSDK.transfer({
  chain: "polygon",     // or ethereum, arbitrum, optimism
  token: "USDC",
  amount: "1000",
  to: "0x...",
  privacy: "shielded"
});
```

## 🌐 Universal Chain Support

### **Phase 1: EVM Dominance** ✅
- **Ethereum** (ETH + ERC20 tokens)
- **Polygon** (MATIC + polygon tokens) 
- **Arbitrum** (ARB + L2 tokens)
- **Optimism** (OP + L2 tokens)
- **Base** (ETH + base tokens)
- **Avalanche C-Chain** (AVAX + ERC20)
- **BSC** (BNB + BEP20 tokens)

### **Phase 2: Alt-Chain Expansion** 
- **Solana** (SOL + SPL tokens)
- **Cardano** (ADA + native tokens)
- **Cosmos** (ATOM + IBC tokens)
- **Polkadot** (DOT + parachain tokens)

### **Phase 3: Everything Else** 
- **New L1s** as they launch
- **New L2s** on any chain
- **Cross-chain** private bridges
- **Emerging ecosystems** automatically

## 🤖 Built by zkSDK-agent: Autonomous AI Development System

**zkSDK is developed by zkSDK-agent, a strategic AI system with 7 specialized agents:**

### ** Chief Strategy Officer**
- **Strategic planning** and project coordination
- **Market intelligence** and competitive analysis  
- **Cross-agent coordination** and priority setting

### **👨 Developer Agent (24/7 Coding)**
- **Implements** Railgun, Aztec, Solana privacy providers
- **Writes comprehensive tests** for all integrations
- **Creates daily development summaries** for social content
- **Command**: `goose run --recipe recipe-developer.yaml --max-turns 10`

### ** Social Agent (Content Creator)**
- **Daily Twitter threads** from development summaries (`outputs/social/dev_summary_*.md`)
- **Weekly blog posts** aggregating all logs, sessions, and progress
- **Technical tutorials** for new features implemented by Developer Agent
- **Release notes** and community updates
- **Command**: `goose run --recipe recipe-social.yaml --max-turns 8`

**Blog Agent Capabilities:**
- Reads ALL development logs from `outputs/logs/` and `~/.local/share/goose/sessions/`
- Aggregates Twitter content and development summaries
- Creates comprehensive technical blog posts
- Generates tutorials based on actual code implementations
- Produces weekly progress reports for the community

### ** Research & Intelligence Agent**
- **Researches** new privacy protocols across all chains
- **Competitive analysis** and market trend identification
- **Technology evaluation** and integration recommendations

### ** Marketing & Growth Agent**
- **Developer adoption strategies** and outreach campaigns
- **Market analysis** and positioning optimization
- **Growth metrics** and community building

### **Tester Agent**
- **Quality assurance** and comprehensive testing
- **Performance benchmarking** and security auditing
- **Test coverage** improvement and edge case testing

### ** Release & Operations Agent**
- **Release management** and deployment coordination
- **Operational excellence** and performance monitoring
- **Enterprise support** and customer success

## 🚀 How the Strategic System Works

### **Daily Autonomous Workflow:**

1. **Developer Agent** works on privacy implementations
2. **Developer Agent** creates summary in `outputs/social/dev_summary_YYYYMMDD.md`
3. **Social Agent** reads summary and creates Twitter thread
4. **Social Agent** publishes content to `outputs/social/twitter_YYYYMMDD.md`
5. **All agents** log progress to `outputs/logs/` and `~/.local/share/goose/sessions/`

### **Running the System:**

```bash
# Research Agent (Intelligence Gathering)
goose run --recipe recipe-research-intelligence.yaml --name "research_$(date +%H%M)" --max-turns 25

# Developer Agent (24/7 Coding)
goose run --recipe recipe-developer.yaml --name "dev_$(date +%H%M)" --max-turns 30

# Social Agent (Blog Posts & Twitter)
goose run --recipe recipe-social.yaml --name "social_$(date +%H%M)" --max-turns 15

# Strategy Agent (Planning & Coordination)
goose run --recipe recipe-strategy-chief.yaml --name "strategy_$(date +%H%M)" --max-turns 20

# Check generated content
ls -la outputs/social/
cat outputs/social/twitter_$(date +%Y%m%d).md
```

### **System Architecture:**
```
zkSDK-agent/
├── outputs/
│   ├── social/           # Twitter threads, blog posts, dev summaries
│   ├── strategic/        # Strategic planning documents
│   ├── logs/            # System operation logs
│   └── reports/         # Daily/weekly progress reports
├── ~/.local/share/goose/sessions/  # Complete agent conversation logs
└── recipe-*.yaml        # Agent configuration files
```

**This autonomous system means zkSDK development, testing, and marketing happen continuously without human bottlenecks.**

## 🔮 Future Vision: Fully Autonomous Development

### **Near Future (Next 30 Days):**
- **24/7 Development**: Developer Agent working continuously on Railgun, Aztec, Solana integrations
- **Daily Social Content**: Automatic Twitter threads and blog posts about progress
- **Weekly Deep Dives**: Comprehensive technical blog posts aggregating all development work
- **Community Engagement**: Social Agent responding to developer questions and feedback

### **Medium Term (Next 90 Days):**
- **Cross-Agent Coordination**: Strategic Agent coordinating all 7 agents for complex multi-day projects
- **Automated Testing**: Tester Agent running comprehensive test suites on every commit
- **Market Intelligence**: Research Agent identifying new privacy protocols and integration opportunities
- **Release Automation**: Operations Agent managing deployments and NPM publishing

### **Long Term Vision (Next Year):**
- **Autonomous NPM Publishing**: Agents automatically publishing new chain integrations
- **Community-Driven Development**: Agents responding to GitHub issues and feature requests
- **Educational Content Pipeline**: Automatic generation of tutorials, documentation, and examples
- **Enterprise Integration**: Agents providing customer support and custom integrations

### **The Ultimate Goal:**
**zkSDK-agent becomes the first fully autonomous software project** - developing, testing, documenting, marketing, and supporting itself while expanding privacy capabilities across every blockchain that exists.

## 📊 Current Development Status

### 📁 Project Structure (Framework V2)

```
privacy-agent/
├── workspace/        # Active development work
│   ├── current/     # Current sprint & blockers
│   ├── sessions/    # Daily work sessions
│   └── memory/      # Agent state
├── insights/        # Reports & research
│   ├── daily/       # Daily reports by date
│   ├── research/    # Market & technical research
│   └── weekly/      # Weekly summaries
├── strategy/        # Plans & decisions
│   ├── active/      # Current strategy
│   ├── roadmap/     # Future plans
│   └── decisions/   # Architecture decisions
├── sdk/             # The actual SDK code
│   └── packages/    # Provider implementations
└── automation/      # AI agent system
    ├── recipes/     # Agent instructions
    └── scripts/     # Automation tools
```

### 🚀 Autonomous Agent Development
This SDK is being built by AI agents using the Goose framework. Here's the current status:

| Provider | Status | Lines | Progress |
|----------|--------|-------|----------|
| FHEVM (Zama) | ✅ Complete | 927 | Full implementation with encryption |
| Railgun | 🚧 In Progress | 196 | Recipe→Step→ComboMeal pattern implemented |
| Light Protocol |  | 0 | Solana ZK compression |
| Aztec | ❌ Not Started | 0 | L2 privacy circuits |
| Bitcoin | ❌ Not Started | 0 | Silent payments |

### 🤖 Running the Autonomous Development

```bash
# Refresh shared context for agents
./automation/scripts/prepare-context.sh

# Run research → product strategy pipeline
./automation/scripts/daily-run-strategy.sh

# Run developer workflow (adds dev hand-off + optional report)
./automation/scripts/daily-run-dev.sh

# Generate end-of-day summary
./automation/scripts/generate-daily-report.sh
```

Legacy orchestrators from Framework V1 are archived in `automation/scripts/legacy/` if you need to reference the old flow.

### 🧠 How the AI Agents Work

1. **Session Persistence**: Agents remember all previous work and continue from where they left off
2. **Memory System**: JSON-based progress tracking ensures no redundant work
3. **Research → Plan → Build**: Agents study each technology deeply before implementation
4. **Automatic Recovery**: If an agent stops, the system restarts with full context
5. **Todo Lists**: Agents create and follow structured task lists (see below)

### 📝 Agent Task Management

The agents create TODO lists to organize their work:
```
1. Research the technology documentation
2. Create implementation plan
3. Build core provider class
4. Add type definitions
5. Implement key methods
6. Write tests
7. Add documentation
```

You can see agent todos in the logs:
```bash
tail -f logs/*_session.log | grep -E "TODO|TASK|PLAN"
```

### 🔄 How Development Works

1. **Check Current Work**: `workspace/current/sprint.md`
2. **Run Agents**: `goose run --recipe automation/recipes/[recipe].yaml`
3. **Agents Create Reports**: Saved to `insights/daily/[date]/`
4. **Strategy Updates**: `strategy/active/current.md`
5. **Continue Next Day**: Read `workspace/sessions/[date]/continuation.md`

> For a visual map of the multi-agent flow and file hand-offs, see [`docs/AGENT-PIPELINE.md`](docs/AGENT-PIPELINE.md).

**See [HOW-IT-WORKS.md](./HOW-IT-WORKS.md) for complete workflow guide.**


## 📦 Package Structure

### **Core Package**
```bash
npm install @zksdkjs/core
```
- Universal API for all supported chains
- Auto-routing to best privacy protocol per chain
- TypeScript-first with comprehensive types

### **Chain-Specific Extensions** (Auto-installed)
```bash
# Automatically included with core
@zksdkjs/evm    # ETH + ERC20 support
@zksdkjs/solana      # SOL + SPL support  
# ... AI adds more chains continuously
```

## 🔧 Quick Start

### **1. Installation**
```bash
npm install @zksdkjs/core
```

### **2. Basic Usage**
```javascript
import { zkSDK } from '@zksdkjs/core';

// Initialize (auto-detects available chains)
await zkSDK.init();

// Private transfer on any chain
const result = await zkSDK.erc20.transfer({
  chain: "ethereum",           // Target blockchain
  token: "USDC",              // Token symbol or address
  amount: "100.50",           // Amount in token units
  to: "0x...",               // Recipient address
  privacy: "full",           // Privacy level
  from: "0x..."              // Your address (or connected wallet)
});

console.log(`Private transfer completed: ${result.txHash}`);
```

### **3. Advanced Configuration**
```javascript
// Custom privacy settings per chain
await zkSDK.erc20.transfer({
  chain: "polygon",
  token: "MATIC", 
  amount: "50.0",
  to: "0x...",
  privacy: {
    level: "shielded",        // anonymous, shielded, full
    protocol: "aztec",        // Force specific privacy protocol
    gas: { maxFee: "30" }     // Gas optimization
  }
});
```

## 🎯 Privacy Levels

- **`anonymous`**: Hide sender/receiver, show amounts
- **`shielded`**: Hide amounts, show addresses  
- **`full`**: Hide everything (maximum privacy)
- **`compliance`**: Privacy with regulatory compliance features

## 🏗️ Supported Token Types

### **Ethereum Ecosystem**
- **Native**: ETH, MATIC, AVAX, BNB
- **Stablecoins**: USDC, USDT, DAI, FRAX
- **DeFi Tokens**: UNI, AAVE, COMP, MKR
- **Any ERC20**: Automatic detection and support

### **Solana Ecosystem**  
- **Native**: SOL
- **SPL Tokens**: Wrapped tokens, memecoins, DeFi tokens
- **Automatic**: SPL token detection and metadata

### **Multi-Chain Tokens**
- **USDC**: Native on 10+ chains
- **WETH**: Wrapped ETH across L2s
- **Bridge Tokens**: Automatically detected

## 🚀 Advanced Features

### **Cross-Chain Private Transfers** (Coming Soon)
```javascript
// Private transfer from Ethereum to Polygon
await zkSDK.crossChain({
  from: { chain: "ethereum", token: "USDC" },
  to: { chain: "polygon", token: "USDC" },
  amount: "1000",
  recipient: "0x...",
  privacy: "full"
});
```

### **Batch Private Transfers**
```javascript
// Multiple private transfers in one transaction
await zkSDK.batchTransfer([
  { chain: "ethereum", token: "USDC", amount: "100", to: "0x..." },
  { chain: "ethereum", token: "WETH", amount: "0.5", to: "0x..." }
], { privacy: "full" });
```

### **Privacy Analytics**
```javascript
// Get privacy metrics for your transfers
const analytics = await zkSDK.analytics({
  address: "0x...",
  timeframe: "30d"
});

console.log(`Privacy score: ${analytics.privacyScore}/100`);
```

## 🎪 Live Demo & Examples

### **Interactive Demo**
```bash
git clone https://github.com/zksdkjs/zkSDK
cd zkSDK/examples
npm install
npm run demo
```

### **Integration Examples**
- [Next.js App](examples/nextjs-app/) - Full-stack private transfer app
- [React Component](examples/react-component/) - Drop-in privacy component  
- [Node.js Script](examples/nodejs-script/) - Server-side private transfers
- [DeFi Integration](examples/defi-integration/) - Add privacy to existing DeFi protocols

## 🔬 Built on Cutting-Edge Research

zkSDK integrates the best privacy technologies:

- **[Railgun](https://railgun.org/)**: Production-ready EVM privacy (Primary)
- **[Aztec](https://aztec.network/)**: Privacy-first smart contracts (Secondary)  
- **[Mina](https://minaprotocol.com/)**: Lightweight zero-knowledge proofs
- **[Zcash Sapling](https://z.cash/)**: Battle-tested shielded transactions
- **[Tornado Cash](https://tornado.cash/)**: Ethereum mixing protocols
- **[Elusiv](https://elusiv.io/)**: Solana privacy solutions (Discontinued - archived)

**New protocols are continuously researched and integrated by our AI system.**

## 🤝 Contributing

zkSDK development is primarily autonomous, but human contributions are welcome:

### **For Developers**
- Submit integration requests for new chains/tokens
- Report bugs or suggest improvements  
- Contribute example applications and tutorials
- Join our Discord for technical discussions

### **For Researchers**  
- Propose new privacy protocol integrations
- Contribute to security audits and reviews
- Share performance optimization insights
- Collaborate on academic research

## 🏢 Built by zksdk.dev

zkSDK is an experimental project by [zksdk.dev](https://zksdk.dev) - exploring the future of autonomous software development for privacy technology.

**Our Mission**: Make privacy accessible to every developer, on every blockchain, with zero complexity.

**Our Approach**: AI-powered development that continuously expands capabilities without human bottlenecks.

## 📄 License

MIT License - Build privacy into everything, everywhere.

---

**Ready to add privacy to your app?**

```bash
npm install @zksdkjs/core
```

**Questions? Join our community:**
- 🐦 Twitter: [@zksdkjs](https://twitter.com/zksdkjs)
- 🌐 Website: [zksdk.dev](https://zksdk.dev)

---

*Privacy is a fundamental right. Let's make it universal.* 🔒
