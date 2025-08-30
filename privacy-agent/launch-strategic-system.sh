#!/bin/bash

# zkSDK Strategic Management System Launch Script
# Top-tier strategic orchestration for complex privacy SDK development

echo "🎯 zkSDK Strategic Management System"
echo "===================================="
echo "Building the 'LangChain of Privacy' with world-class strategic execution"
echo ""

# Set working directory
cd "$(dirname "$0")"

# Check system requirements
echo "🔍 Checking system requirements..."

# Check Goose installation
if ! command -v goose &> /dev/null; then
    echo "❌ Error: Goose is not installed"
    echo "📦 Installing Goose CLI..."
    curl -fsSL https://github.com/block/goose/releases/download/stable/download_cli.sh | bash
    
    if ! command -v goose &> /dev/null; then
        echo "❌ Goose installation failed. Please install manually."
        exit 1
    fi
    echo "✅ Goose installed successfully"
fi

# Check Python requirements
echo "📋 Checking Python dependencies..."
python3 -c "import schedule" 2>/dev/null || {
    echo "📦 Installing required Python packages..."
    pip3 install schedule asyncio
}

# Validate strategic agent recipes
echo "🔍 Validating strategic agent recipes..."
strategic_recipes=(
    "recipes/recipe-strategy-chief.yaml"
    "recipes/recipe-marketing-growth.yaml" 
    "recipes/recipe-research-intelligence.yaml"
    "recipes/recipe-release-operations.yaml"
    "recipes/recipe-developer.yaml"
    "recipes/recipe-tester.yaml"
    "recipes/recipe-social.yaml"
)

for recipe in "${strategic_recipes[@]}"; do
    echo "  Validating $recipe..."
    if [ -f "$recipe" ]; then
        if ! goose recipe validate "$recipe" >/dev/null 2>&1; then
            echo "❌ Recipe validation failed: $recipe"
            exit 1
        fi
    else
        echo "❌ Missing recipe: $recipe"
        exit 1
    fi
done
echo "✅ All strategic recipes validated successfully"

# Check API key configuration
echo "🔐 Checking strategic API key configuration..."
api_keys_found=0

if [ -n "$ANTHROPIC_API_KEY" ]; then
    echo "✅ Anthropic API key configured (Claude for strategic planning)"
    api_keys_found=$((api_keys_found + 1))
fi

if [ -n "$OPENAI_API_KEY" ]; then
    echo "✅ OpenAI API key configured (Qwen Coder for development)"  
    api_keys_found=$((api_keys_found + 1))
fi

if [ -n "$GROQ_API_KEY" ]; then
    echo "✅ Groq API key configured (Fast marketing and social)"
    api_keys_found=$((api_keys_found + 1))
fi

# Check for OpenRouter configuration (Goose's preferred method)
if [ -n "$OPENROUTER_API_KEY" ] || goose info &>/dev/null; then
    echo "✅ Goose/OpenRouter configuration detected"
    api_keys_found=$((api_keys_found + 1))
fi

if [ $api_keys_found -eq 0 ]; then
    echo "⚠️  Warning: No API keys configured!"
    echo "   For strategic system, please set:"
    echo "   - ANTHROPIC_API_KEY (required for strategic planning)"
    echo "   - OPENAI_API_KEY (recommended for development)"
    echo "   - GROQ_API_KEY (recommended for marketing)"
    echo "   - OR configure Goose with: goose configure"
    echo ""
    read -p "Continue anyway? (y/N): " continue_choice
    if [[ ! $continue_choice =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create strategic directories
echo "📁 Creating strategic directory structure..."
mkdir -p outputs/{strategic,intelligence,marketing,releases,sessions,logs}
mkdir -p outputs/strategic/{strategy_chief,marketing_growth,research_intelligence,release_operations}

# Show strategic system configuration
echo ""
echo "📊 Strategic System Configuration:"
echo "  Project: zkSDK - The LangChain of Privacy"
echo "  Working Directory: $(pwd)"
echo "  Goose Version: $(goose --version 2>/dev/null || echo 'Unknown')"
echo "  Python Version: $(python3 --version)"
echo "  Strategic Agents: ${#strategic_recipes[@]}"
echo "  API Keys Configured: $api_keys_found/3"
echo ""

echo "🎯 Strategic Agent Team:"
echo "  🧠 Chief Strategy Officer: Master project leadership & coordination"
echo "  📈 Marketing & Growth Engine: Market dominance & developer adoption" 
echo "  🔍 Research & Intelligence: Competitive advantage & market insights"
echo "  ⚙️ Release & Operations: World-class delivery & operational excellence"
echo "  👨‍💻 Developer Agent: 24/7 coding engine (Qwen Coder)"
echo "  🧪 Tester Agent: Quality assurance (Qwen Coder)"
echo "  📱 Social Agent: Community building (Groq)"
echo ""

# Launch mode selection
echo "🚀 Choose Strategic Launch Mode:"
echo ""
echo "1) Full Strategic System - Complete strategic management (RECOMMENDED)"
echo "   • Chief Strategy Officer coordination"
echo "   • Marketing & growth execution" 
echo "   • Research & competitive intelligence"
echo "   • Release & operations management"
echo "   • 24/7 development engine"
echo ""
echo "2) Strategic Briefing Only - Morning strategic briefing"
echo "   • Cross-agent strategic coordination"
echo "   • Market intelligence gathering"
echo "   • Strategic decision support"
echo ""
echo "3) Single Strategic Agent - Test individual agent"
echo "   • strategy_chief, marketing_growth, research_intelligence, release_operations"
echo ""
echo "4) Development Focus - Enhanced development with strategic oversight"
echo "   • 24/7 coding with strategic coordination"
echo "   • Quality assurance and testing"
echo "   • Strategic development guidance"
echo ""

read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🎯 Launching Full Strategic Management System..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "This will run:"
        echo "• Morning strategic briefings at 8:00 AM"
        echo "• Continuous strategic coordination"
        echo "• Marketing campaigns every 4 hours"
        echo "• Research & intelligence daily"
        echo "• Release & operations management" 
        echo "• 24/7 development engine"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        python3 scripts/strategic-orchestration.py --mode full
        ;;
    2)
        echo ""
        echo "📊 Running Strategic Morning Briefing..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        python3 scripts/strategic-orchestration.py --mode briefing
        ;;
    3)
        echo ""
        echo "Available strategic agents:"
        echo "• strategy_chief - Chief Strategy Officer"
        echo "• marketing_growth - Marketing & Growth Engine" 
        echo "• research_intelligence - Research & Intelligence"
        echo "• release_operations - Release & Operations"
        echo ""
        read -p "Which strategic agent to test? " agent
        echo ""
        echo "🧪 Testing strategic agent: $agent"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        python3 scripts/strategic-orchestration.py --mode agent --agent "$agent"
        ;;
    4)
        echo ""
        echo "👨‍💻 Launching Development Focus Mode..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "• 24/7 development with strategic coordination"
        echo "• Quality assurance and testing"
        echo "• Strategic oversight and guidance"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        # Run strategic system but focus on development
        python3 scripts/strategic-orchestration.py --mode full
        ;;
    *)
        echo ""
        echo "Invalid choice. Launching Full Strategic System..."
        python3 scripts/strategic-orchestration.py --mode full
        ;;
esac