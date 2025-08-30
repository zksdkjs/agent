#!/bin/bash
# STRATEGIC AGENT SYSTEM - Full orchestration with memory and persistence

set -euo pipefail

echo "🚀 STRATEGIC AGENT SYSTEM LAUNCHER"
echo "=================================="
echo ""

# Configuration
MEMORY_DIR="$(pwd)/memory"
LOGS_DIR="$(pwd)/logs"
SDK_DIR="$(pwd)/sdk/packages/providers"
SESSION_DATA="${HOME}/.local/share/goose/sessions"

# Ensure directories exist
mkdir -p "$MEMORY_DIR" "$LOGS_DIR" "$SESSION_DATA"

# Function to update build progress
update_build_progress() {
    echo "📊 Updating build progress..."
    
    # Create Python script to update JSON
    cat > /tmp/update_progress.py << 'EOF'
import json
import os
from datetime import datetime
from pathlib import Path

def count_lines_in_dir(dir_path):
    """Count TypeScript lines in a directory"""
    if not os.path.exists(dir_path):
        return 0, {}
    
    total = 0
    files = {}
    
    for root, dirs, filenames in os.walk(dir_path):
        for filename in filenames:
            if filename.endswith('.ts'):
                filepath = os.path.join(root, filename)
                try:
                    with open(filepath, 'r') as f:
                        lines = len(f.readlines())
                        total += lines
                        rel_path = os.path.relpath(filepath, dir_path)
                        files[rel_path] = lines
                except:
                    pass
    
    return total, files

# Load existing progress
progress_file = 'memory/build_progress.json'
if os.path.exists(progress_file):
    with open(progress_file, 'r') as f:
        progress = json.load(f)
else:
    progress = {"providers": {}, "last_check": ""}

# Update each provider
providers = ['fhevm', 'railgun', 'light-protocol', 'aztec', 'bitcoin']
for provider in providers:
    # Check both src/ and root directory
    provider_dir = f'sdk/packages/providers/{provider}/src'
    if not os.path.exists(provider_dir):
        provider_dir = f'sdk/packages/providers/{provider}'
    lines, files = count_lines_in_dir(provider_dir)
    
    if provider not in progress['providers']:
        progress['providers'][provider] = {
            "status": "not_started",
            "lines": 0,
            "files": {},
            "tests": False,
            "documentation": False
        }
    
    # Update status
    progress['providers'][provider]['lines'] = lines
    progress['providers'][provider]['files'] = files
    progress['providers'][provider]['last_updated'] = datetime.now().strftime('%Y-%m-%d')
    
    # Determine status
    if lines == 0:
        progress['providers'][provider]['status'] = "not_started"
    elif lines < 300:
        progress['providers'][provider]['status'] = "partial"
    else:
        progress['providers'][provider]['status'] = "complete"
    
    # Check for tests
    test_dir = f'sdk/packages/providers/{provider}/src/__tests__'
    if os.path.exists(test_dir) and any(f.endswith('.test.ts') for f in os.listdir(test_dir)):
        progress['providers'][provider]['tests'] = True

progress['last_check'] = datetime.now().isoformat()

# Save progress
with open(progress_file, 'w') as f:
    json.dump(progress, f, indent=2)

# Print summary
print("\n📊 Current Build Status:")
print("=" * 50)
for provider, data in progress['providers'].items():
    status_emoji = "✅" if data['status'] == "complete" else "🚧" if data['status'] == "partial" else "❌"
    print(f"{status_emoji} {provider}: {data['lines']} lines ({data['status']})")
EOF

    python3 /tmp/update_progress.py
    rm /tmp/update_progress.py
}

# Function to create session context
create_session_context() {
    local provider=$1
    local session_id=$(date +%s)
    
    cat > "$MEMORY_DIR/current_session.md" << EOF
# ACTIVE SESSION: $session_id
## Provider: $provider
## Started: $(date)

## CRITICAL INSTRUCTIONS
1. DO NOT start from scratch - check existing files first
2. Read memory/build_progress.json for current status
3. Continue from where previous work stopped
4. Focus ONLY on $provider - ignore other providers

## Current Status
$(cat "$MEMORY_DIR/build_progress.json" | python3 -c "
import json, sys
data = json.load(sys.stdin)
provider = '$provider'
if provider in data['providers']:
    p = data['providers'][provider]
    print(f\"Status: {p['status']}\")
    print(f\"Lines: {p['lines']}\")
    print(f\"Files: {len(p['files'])}\")
    if p['files']:
        print(\"\\nExisting files:\")
        for f, lines in p['files'].items():
            print(f\"  - {f}: {lines} lines\")
")

## Session Goals
$(python3 -c "
import json
with open('memory/build_progress.json', 'r') as f:
    data = json.load(f)
    p = data['providers'].get('$provider', {})
    if p.get('status') == 'not_started':
        print('- Create initial provider structure')
        print('- Implement core provider class')
        print('- Add type definitions')
        print('- Create basic tests')
    elif p.get('status') == 'partial':
        print('- Complete the provider implementation')
        print('- Add missing methods')
        print('- Improve test coverage')
        print('- Add documentation')
    else:
        print('- Review and optimize existing code')
        print('- Add advanced features')
        print('- Improve test coverage')
")

## Files to work on:
- sdk/packages/providers/$provider/src/provider.ts
- sdk/packages/providers/$provider/src/types.ts
- sdk/packages/providers/$provider/src/index.ts
- sdk/packages/providers/$provider/src/__tests__/*.test.ts
EOF
}

# Function to determine next provider to work on
get_next_provider() {
    python3 -c "
import json
with open('memory/build_progress.json', 'r') as f:
    data = json.load(f)
    providers = data['providers']
    
    # Priority: partial > not_started > complete
    for status in ['partial', 'not_started', 'complete']:
        for provider, info in providers.items():
            if info['status'] == status:
                print(provider)
                exit(0)
    
    print('railgun')  # default
"
}

# Function to launch agent with proper context
launch_agent() {
    local provider=$1
    local recipe=""
    local agent_name=""
    
    case $provider in
        "railgun")
            recipe="recipes/recipe-railgun-specialist.yaml"
            agent_name="railgun_specialist"
            ;;
        "fhevm")
            recipe="recipes/recipe-zama-fhe-specialist.yaml"
            agent_name="zama_fhe"
            ;;
        "light-protocol")
            recipe="recipes/recipe-light-protocol-specialist.yaml"
            agent_name="light_protocol"
            ;;
        "aztec")
            recipe="recipes/recipe-aztec-specialist.yaml"
            agent_name="aztec_l2"
            ;;
        "bitcoin")
            recipe="recipes/recipe-bitcoin-privacy-specialist.yaml"
            agent_name="bitcoin_privacy"
            ;;
        *)
            echo "Unknown provider: $provider"
            return 1
            ;;
    esac
    
    echo ""
    echo "🎯 Launching agent for: $provider"
    echo "   Recipe: $recipe"
    echo "   Agent: $agent_name"
    echo ""
    
    # Check for existing session
    EXISTING_SESSION=$(ls -t "$SESSION_DATA"/${agent_name}_*.jsonl 2>/dev/null | head -1 || true)
    
    if [[ -n "$EXISTING_SESSION" ]]; then
        SESSION_ID=$(basename "$EXISTING_SESSION" .jsonl | sed 's/.*_session/session/')
        echo "📂 Found existing session: $SESSION_ID"
        echo "   Resuming work..."
        
        goose run \
            --recipe "$recipe" \
            --name "$agent_name" \
            --resume "$SESSION_ID" \
            --max-turns 300 \
            2>&1 | tee -a "$LOGS_DIR/${agent_name}_session.log"
    else
        echo "🆕 Starting new session..."
        
        goose run \
            --recipe "$recipe" \
            --name "$agent_name" \
            --max-turns 300 \
            2>&1 | tee -a "$LOGS_DIR/${agent_name}_session.log"
    fi
}

# Main execution flow
main() {
    # Update build progress
    update_build_progress
    
    # Determine what to work on
    NEXT_PROVIDER=$(get_next_provider)
    echo ""
    echo "📋 Next priority: $NEXT_PROVIDER"
    
    # Create session context
    create_session_context "$NEXT_PROVIDER"
    
    # Launch the agent
    launch_agent "$NEXT_PROVIDER"
    
    # Update progress after agent completes
    echo ""
    echo "🔄 Agent completed. Updating progress..."
    update_build_progress
}

# Handle arguments
if [[ $# -eq 0 ]]; then
    # Auto mode - work on next priority
    main
elif [[ $# -eq 1 ]]; then
    # Specific provider mode
    PROVIDER=$1
    create_session_context "$PROVIDER"
    launch_agent "$PROVIDER"
    update_build_progress
else
    echo "Usage: $0 [provider]"
    echo "Providers: railgun, fhevm, light-protocol, aztec, bitcoin"
    echo "No args = work on next priority"
    exit 1
fi