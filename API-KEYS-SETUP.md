# API Keys Setup - Quick Reference

**Last Updated:** October 26, 2025

This guide shows how to quickly add and manage multiple OpenRouter API keys for parallel agent execution.

---

## 🔑 How Goose Stores Keys

**Primary Key (OPENROUTER_API_KEY):**
- Stored in **macOS Keychain** (secure)
- Used automatically by Goose for single-agent sessions
- Check with: `security find-generic-password -s "goose" -w`

**Additional Keys (for parallel agents):**
- Exported as environment variables
- Only needed when running multiple agents simultaneously
- Prevents rate limiting

---

## ⚡ Quick Setup (Copy & Paste)

### For 2 Agents (PrivacyCash + Railgun)

```bash
# Export keys
export OPENROUTER_API_KEY="sk-or-v1-your-primary-key"
export OPENROUTER_API_KEY_2="sk-or-v1-your-second-key"

# Run agents
scripts/orchestrate-all.sh --agents privacycash,railgun --mode tmux
```

### For 3 Agents (PrivacyCash + Railgun + Aztec)

```bash
# Export keys
export OPENROUTER_API_KEY="sk-or-v1-your-primary-key"
export OPENROUTER_API_KEY_2="sk-or-v1-your-second-key"
export OPENROUTER_API_KEY_3="sk-or-v1-your-third-key"

# Run agents
scripts/orchestrate-all.sh --agents privacycash,railgun,aztec --mode tmux
```

### For All 5 Agents

```bash
# Export keys (minimum 2 recommended, 3+ ideal)
export OPENROUTER_API_KEY="sk-or-v1-your-primary-key"
export OPENROUTER_API_KEY_2="sk-or-v1-your-second-key"
export OPENROUTER_API_KEY_3="sk-or-v1-your-third-key"
export OPENROUTER_API_KEY_4="sk-or-v1-your-fourth-key"   # Optional
export OPENROUTER_API_KEY_5="sk-or-v1-your-fifth-key"    # Optional

# Run all agents
scripts/orchestrate-all.sh --mode tmux
```

---

## 🎯 Which Agent Uses Which Key?

From `.goose/config/multi-agent.yaml`:

| Agent | API Key Used | Fallback |
|-------|--------------|----------|
| **PrivacyCash** | `OPENROUTER_API_KEY` | - |
| **Railgun** | `OPENROUTER_API_KEY_2` | Falls back to `OPENROUTER_API_KEY` |
| **Aztec** | `OPENROUTER_API_KEY_3` | Falls back to `OPENROUTER_API_KEY` |
| **Bitcoin** | `OPENROUTER_API_KEY` | - |
| **FHE** | `OPENROUTER_API_KEY` | - |

**Current Configuration (from multi-agent.yaml):**
```yaml
api_keys:
  privacycash: "${OPENROUTER_API_KEY}"
  railgun: "${OPENROUTER_API_KEY_2:-${OPENROUTER_API_KEY}}"
  aztec: "${OPENROUTER_API_KEY_3:-${OPENROUTER_API_KEY}}"
  bitcoin: "${OPENROUTER_API_KEY}"
  fhe: "${OPENROUTER_API_KEY}"
```

---

## 🔄 Adding More Keys (Step-by-Step)

### Step 1: Get New OpenRouter Key
1. Go to OpenRouter dashboard
2. Create new API key
3. Copy the key (starts with `sk-or-v1-...`)

### Step 2: Export Key
```bash
# For 4th agent (if you add Bitcoin specialist with dedicated key)
export OPENROUTER_API_KEY_4="sk-or-v1-your-new-key"

# For 5th agent
export OPENROUTER_API_KEY_5="sk-or-v1-your-new-key"
```

### Step 3: Update Config (if needed)
Edit `.goose/config/multi-agent.yaml`:
```yaml
api_keys:
  bitcoin: "${OPENROUTER_API_KEY_4:-${OPENROUTER_API_KEY}}"
  fhe: "${OPENROUTER_API_KEY_5:-${OPENROUTER_API_KEY}}"
```

---

## 💾 Permanent Setup (Optional)

If you run agents frequently, add to your shell profile:

### For zsh (~/.zshrc):
```bash
# zkSDK Multi-Agent API Keys
export OPENROUTER_API_KEY="sk-or-v1-your-primary-key"
export OPENROUTER_API_KEY_2="sk-or-v1-your-second-key"
export OPENROUTER_API_KEY_3="sk-or-v1-your-third-key"
```

### For bash (~/.bashrc):
```bash
# zkSDK Multi-Agent API Keys
export OPENROUTER_API_KEY="sk-or-v1-your-primary-key"
export OPENROUTER_API_KEY_2="sk-or-v1-your-second-key"
export OPENROUTER_API_KEY_3="sk-or-v1-your-third-key"
```

**Then reload:**
```bash
source ~/.zshrc  # or ~/.bashrc
```

---

## ✅ Verify Keys Are Set

```bash
# Check all keys
echo "Key 1: ${OPENROUTER_API_KEY:0:20}..."
echo "Key 2: ${OPENROUTER_API_KEY_2:0:20}..."
echo "Key 3: ${OPENROUTER_API_KEY_3:0:20}..."

# Or check if they exist
if [ -n "$OPENROUTER_API_KEY" ]; then echo "✓ Primary key set"; fi
if [ -n "$OPENROUTER_API_KEY_2" ]; then echo "✓ Key 2 set"; fi
if [ -n "$OPENROUTER_API_KEY_3" ]; then echo "✓ Key 3 set"; fi
```

---

## 🚨 Security Notes

**DO NOT:**
- ❌ Commit actual keys to git
- ❌ Share keys in chat/messages
- ❌ Store keys in plain text files

**DO:**
- ✅ Use environment variables
- ✅ Store in macOS Keychain (for primary key)
- ✅ Rotate keys if compromised
- ✅ Keep `.env.example` template only (no real keys)

**If you accidentally expose a key:**
1. Go to OpenRouter dashboard immediately
2. Regenerate/rotate the key
3. Update your exports with new key

---

## 📊 Rate Limiting Guidelines

**OpenRouter Rate Limits** (approximate):
- Free tier: ~60 requests/minute per key
- Paid tier: Higher limits (check your plan)

**Agent Usage:**
- Each agent makes ~1-3 requests per turn
- 60 turns per session
- Multiple sessions per agent

**Recommendations:**
- **2 agents:** Use 2 keys (ideal)
- **3 agents:** Use 2-3 keys
- **5 agents:** Use 3+ keys (or sequential mode)

**If you hit rate limits:**
```bash
# Use sequential mode (slower but no rate limit issues)
scripts/orchestrate-all.sh --mode sequential

# Or reduce concurrent agents
scripts/orchestrate-all.sh --agents privacycash,railgun --mode parallel
```

---

## 🎯 Quick Commands Reference

```bash
# 2 agents with tmux (recommended)
export OPENROUTER_API_KEY="..." && export OPENROUTER_API_KEY_2="..." && \
scripts/orchestrate-all.sh --agents privacycash,railgun --mode tmux

# 2 agents in background
export OPENROUTER_API_KEY="..." && export OPENROUTER_API_KEY_2="..." && \
scripts/orchestrate-all.sh --agents privacycash,railgun --mode parallel

# Monitor progress
scripts/monitor-agents.sh

# One-line check
if [ -n "$OPENROUTER_API_KEY_2" ]; then echo "✓ Ready for parallel"; else echo "✗ Set OPENROUTER_API_KEY_2"; fi
```

---

## 🔧 Troubleshooting

### Problem: "OPENROUTER_API_KEY not set"
**Solution:**
```bash
# Check if set
echo $OPENROUTER_API_KEY

# Export if missing
export OPENROUTER_API_KEY="sk-or-v1-..."
```

### Problem: Rate limit errors during parallel execution
**Solutions:**
1. Add more keys (export OPENROUTER_API_KEY_2, etc.)
2. Use sequential mode: `--mode sequential`
3. Reduce concurrent agents: `--agents privacycash,railgun`

### Problem: Keys don't persist across terminals
**Solution:** Add exports to ~/.zshrc or ~/.bashrc (see Permanent Setup)

---

**Quick Start:** See `MULTI-AGENT-QUICKSTART.md` for full system documentation.
