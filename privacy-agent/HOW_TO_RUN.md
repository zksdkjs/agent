# 🎯 zkSDK Strategic System - How to Run

## 🚀 Quick Start

### Option 1: Full Strategic System (Recommended)
```bash
bash launch-strategic-system.sh
# Choose option 1 for complete strategic management
```

### Option 2: Individual Agents
```bash
# Run developer work first
goose run --recipe recipes/recipe-developer.yaml --name "dev_$(date +%m%d)" --max-turns 10

# Then create social content about the work
goose run --recipe recipes/recipe-social.yaml --name "social_$(date +%m%d)" --max-turns 3
```

---

## 📊 What Each Agent Does

### 🧠 **Chief Strategy Officer** (`recipes/recipe-strategy-chief.yaml`)
- **Purpose**: Master project coordination and strategic planning
- **When to run**: Daily for strategic oversight
- **Command**: `goose run --recipe recipes/recipe-strategy-chief.yaml --name "strategy_$(date +%m%d)"`

### 👨‍💻 **Developer Agent** (`recipes/recipe-developer.yaml`) 
- **Purpose**: 24/7 coding - implements Railgun, Aztec, Solana privacy features
- **When to run**: Continuously for development work
- **Command**: `goose run --recipe recipes/recipe-developer.yaml --name "dev_$(date +%m%d)" --max-turns 10`
- **What it does**: 
  - Implements privacy providers (Railgun, Aztec, Solana)
  - Writes comprehensive tests
  - Fixes bugs and optimizes performance
  - Updates documentation

### 📱 **Social Agent** (`recipes/recipe-social.yaml`)
- **Purpose**: Creates Twitter threads, blog posts, and summaries of development work
- **When to run**: After developer sessions to create content
- **Command**: `goose run --recipe recipes/recipe-social.yaml --name "social_$(date +%m%d)"`
- **What it creates**:
  - Daily Twitter threads about development progress
  - Weekly blog posts about new features
  - Development summaries for the community
  - Release notes and tutorials

### 🧪 **Tester Agent** (`recipes/recipe-tester.yaml`)
- **Purpose**: Quality assurance and comprehensive testing
- **Command**: `goose run --recipe recipes/recipe-tester.yaml --name "test_$(date +%m%d)"`

### 📈 **Marketing & Growth Agent** (`recipes/recipe-marketing-growth.yaml`)
- **Purpose**: Market analysis, developer adoption, growth strategies
- **Command**: `goose run --recipe recipes/recipe-marketing-growth.yaml --name "marketing_$(date +%m%d)"`

### 🔍 **Research & Intelligence Agent** (`recipes/recipe-research-intelligence.yaml`)
- **Purpose**: Competitive analysis, market research, technology trends
- **Command**: `goose run --recipe recipes/recipe-research-intelligence.yaml --name "research_$(date +%m%d)"`

### ⚙️ **Release & Operations Agent** (`recipes/recipe-release-operations.yaml`)
- **Purpose**: Release management, operations, enterprise support
- **Command**: `goose run --recipe recipes/recipe-release-operations.yaml --name "ops_$(date +%m%d)"`

---

## 📁 Where Everything Gets Saved

### Session Logs (Automatic)
- **Location**: `~/.local/share/goose/sessions/`
- **Contains**: Complete conversation logs, commands run, outputs
- **Files**: `agent_name_MMDD.jsonl`

### Structured Outputs
- **Location**: `outputs/`
- **Structure**:
  ```
  outputs/
  ├── logs/           # System logs
  ├── sessions/       # Session summaries  
  ├── social/         # Twitter threads, blog posts
  ├── strategic/      # Strategic planning documents
  ├── marketing/      # Marketing content and analysis
  ├── intelligence/   # Research and competitive analysis
  ├── releases/       # Release notes and documentation
  └── reports/        # Daily/weekly progress reports
  ```

---

## 🎬 Typical Daily Workflow

### Morning (Start Development)
```bash
# 1. Run developer agent for morning work session
goose run --recipe recipes/recipe-developer.yaml --name "dev_morning_$(date +%m%d)" --max-turns 8

# 2. Check what was accomplished
ls -la ~/.local/share/goose/sessions/dev_morning_*
```

### Afternoon (Create Content)
```bash
# 3. Run social agent to create Twitter thread about morning's work
goose run --recipe recipes/recipe-social.yaml --name "social_$(date +%m%d)" --max-turns 3

# 4. Check the generated content
ls -la outputs/social/
```

### Evening (Strategic Planning)
```bash
# 5. Run strategy agent for planning tomorrow
goose run --recipe recipes/recipe-strategy-chief.yaml --name "strategy_evening_$(date +%m%d)" --max-turns 4
```

---

## 🔧 Advanced Usage

### Long Development Sessions
```bash
# For extended development work (up to 20 turns)
goose run --recipe recipes/recipe-developer.yaml --name "dev_deep_work_$(date +%m%d)" --max-turns 20
```

### Generate Weekly Summary
```bash
# Create comprehensive weekly report
goose run --recipe recipes/recipe-social.yaml --name "weekly_summary_$(date +%m%d)" --max-turns 5 --system "Focus on creating a weekly summary of all development progress"
```

### Debug Mode (See Everything)
```bash
# Run with full debug output
goose run --recipe recipes/recipe-developer.yaml --name "debug_session" --max-turns 5 --debug
```

---

## 📊 How to Check Progress

### View Latest Session
```bash
# See what the last developer session accomplished
tail -50 ~/.local/share/goose/sessions/dev_*.jsonl | jq '.'
```

### Check Social Content
```bash
# See generated Twitter threads and blog posts
ls -la outputs/social/
cat outputs/social/twitter_$(date +%Y%m%d).md
```

### View System Status
```bash
# Check all output directories
find outputs/ -name "*.md" -o -name "*.json" | head -10
```

---

## 🚨 Troubleshooting

### If Agent Fails to Start
1. Check you're in the right directory: `/privacy-agent`
2. Verify recipe file exists: `ls -la recipe-*.yaml`
3. Check Goose configuration: `goose info`

### If No Content Generated
1. Check session logs: `ls -la ~/.local/share/goose/sessions/`
2. Verify outputs directory: `ls -la outputs/`
3. Run social agent with debug: `goose run --recipe recipes/recipe-social.yaml --debug`

### If Sessions Are Empty
1. Make sure agents complete successfully (no errors)
2. Check max-turns isn't too low (use 5+ for meaningful work)
3. Verify OpenRouter API key is working: `goose info`

---

## 🎯 Pro Tips

1. **Use descriptive session names** with dates for easy tracking
2. **Run social agent after developer work** to get immediate summaries
3. **Check outputs/ directory regularly** to see generated content
4. **Use --max-turns 10+** for substantial development work
5. **Save important outputs** before running new sessions

---

## 🔄 Full System Launch

For complete autonomous operation:
```bash
# Launch the full strategic system
bash launch-strategic-system.sh

# Choose:
# 1 = Full system (all agents coordinated)
# 2 = Strategic briefing only  
# 3 = Single agent testing
# 4 = Development focus mode
```

This will run multiple agents in coordination with proper logging and reporting!
