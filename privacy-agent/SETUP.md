# zkSDK Strategic System Setup

## 🚀 Quick Start

### 1. Install Goose
```bash
curl -sSL https://block.github.io/goose/install.sh | bash
```

### 2. Configure API Access
You need ONE of these options:

**Option A: OpenRouter (Recommended)**
```bash
export OPENROUTER_API_KEY="your_openrouter_key_here"
goose configure
# Select: openrouter as provider
# Select: qwen/qwen3-coder as model
```

**Option B: Direct API Keys**
```bash
export ANTHROPIC_API_KEY="your_key_here"
# or
export OPENAI_API_KEY="your_key_here"
```

### 3. Launch the System
```bash
./launch-strategic-system.sh
```

## 🤖 Available Agents

- **Developer Agent**: `goose run --recipe recipe-developer.yaml`
- **Social Agent**: `goose run --recipe recipe-social.yaml`  
- **Tester Agent**: `goose run --recipe recipe-tester.yaml`
- **Strategy Chief**: `goose run --recipe recipe-strategy-chief.yaml`

## 📁 Important Files

- `HOW_TO_RUN.md` - Detailed usage instructions
- `QUICK_COMMANDS.md` - Common commands reference
- `outputs/` - All agent outputs and logs

## 🔐 Security

- Never commit API keys to git
- All sensitive data is in `.gitignore`
- Use environment variables for credentials

## 🎯 Daily Workflow

1. Run developer agent → Creates code
2. Developer creates summary → `outputs/social/dev_summary_YYYYMMDD.md`
3. Run social agent → Reads summary, creates Twitter thread
4. All outputs saved in `outputs/` directory

## 🛠️ Troubleshooting

- Check API keys: `goose info`
- Validate recipes: `goose recipe validate recipe-name.yaml`
- View logs: `~/.local/share/goose/sessions/`
