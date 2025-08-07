#!/bin/bash

# zkSDK 24/7 Autonomous Development System Startup Script

echo "🚀 Starting zkSDK 24/7 Autonomous Development System"
echo "=============================================="

# Set working directory
cd "$(dirname "$0")"

# Check if Goose is installed
if ! command -v goose &> /dev/null; then
    echo "❌ Error: Goose is not installed"
    echo ""
    echo "📦 Installing Goose CLI..."
    curl -fsSL https://github.com/block/goose/releases/download/stable/download_cli.sh | bash
    
    if ! command -v goose &> /dev/null; then
        echo "❌ Goose installation failed. Please install manually:"
        echo "   https://block.github.io/goose/docs/getting-started/installation/"
        exit 1
    fi
    
    echo "✅ Goose installed successfully"
fi

# Check if required Python packages are installed
echo "📋 Checking Python dependencies..."
python3 -c "import schedule" 2>/dev/null || {
    echo "📦 Installing required Python packages..."
    pip3 install schedule
}

# Validate all recipe files
echo "🔍 Validating recipe files..."
for recipe in recipe-*.yaml; do
    echo "  Validating $recipe..."
    if ! goose validate "$recipe"; then
        echo "❌ Recipe validation failed: $recipe"
        exit 1
    fi
done
echo "✅ All recipes validated successfully"

# Check API keys
echo "🔐 Checking API key configuration..."
if [ -z "$ANTHROPIC_API_KEY" ] && [ -z "$OPENAI_API_KEY" ] && [ -z "$GROQ_API_KEY" ]; then
    echo "⚠️  Warning: No API keys found in environment"
    echo "   Please set at least one of:"
    echo "   - ANTHROPIC_API_KEY (for Claude/Orchestrator)"
    echo "   - OPENAI_API_KEY (for Qwen Coder/Developer)"  
    echo "   - GROQ_API_KEY (for fast social media)"
    echo ""
    echo "   Example: export ANTHROPIC_API_KEY='your-key-here'"
    echo ""
fi

# Create required directories
mkdir -p outputs/{code,social,blogs,reports,sessions,logs}

# Show system status
echo ""
echo "📊 System Configuration:"
echo "  Working Directory: $(pwd)"
echo "  Goose Version: $(goose --version 2>/dev/null || echo 'Unknown')"
echo "  Python Version: $(python3 --version)"
echo "  Recipes Available: $(ls recipe-*.yaml | wc -l)"
echo ""

# Start the system
echo "🎯 Starting 24/7 development system..."
echo "  - Developer Agent: Continuous coding (Qwen Coder)"
echo "  - Tester Agent: Every 2 hours (Qwen Coder)" 
echo "  - Social Agent: Every 6 hours (Groq)"
echo "  - Orchestrator: 3x daily (Claude)"
echo "  - Research Agent: Weekly Monday (Claude)"
echo ""

# Offer different start modes
echo "Choose startup mode:"
echo "1) Full System - Start all agents (recommended)"
echo "2) Test Single Agent - Test one agent first"
echo "3) Developer Only - Just start continuous coding"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "🚀 Starting full 24/7 system..."
        python3 scripts/run-24-7.py --mode full
        ;;
    2)
        echo "Available agents: developer, tester, social, orchestrator, research"
        read -p "Which agent to test? " agent
        echo "🧪 Testing $agent agent..."
        python3 scripts/run-24-7.py --mode agent --agent "$agent"
        ;;
    3)
        echo "👨‍💻 Starting developer-only mode..."
        python3 scripts/run-24-7.py --mode agent --agent developer --focus features
        ;;
    *)
        echo "Invalid choice. Starting full system..."
        python3 scripts/run-24-7.py --mode full
        ;;
esac