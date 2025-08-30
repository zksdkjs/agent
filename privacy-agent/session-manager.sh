#!/bin/bash

# zkSDK Session Manager
echo "🎯 zkSDK Agent Session Manager"
echo "=============================="

echo ""
echo "📋 Available Sessions:"
goose session list | grep -E "(research|dev|social|strategy)" | head -10

echo ""
echo "🚀 Quick Commands:"
echo ""
echo "# Start Main Sessions (Consistent Names)"
echo "goose session --name 'zkSDK_research'"
echo "goose session --name 'zkSDK_developer'" 
echo "goose session --name 'zkSDK_social'"
echo "goose session --name 'zkSDK_strategy'"
echo ""
echo "# Resume Main Sessions"
echo "goose session --resume --name 'zkSDK_research'"
echo "goose session --resume --name 'zkSDK_developer'"
echo "goose session --resume --name 'zkSDK_social'"
echo "goose session --resume --name 'zkSDK_strategy'"
echo ""
echo "# Or use recipes (for new sessions)"
echo "goose run --recipe recipes/recipe-research-intelligence.yaml --name 'zkSDK_research' --max-turns 30"
echo "goose run --recipe recipes/recipe-developer.yaml --name 'zkSDK_developer' --max-turns 30"
echo "goose run --recipe recipes/recipe-social.yaml --name 'zkSDK_social' --max-turns 15"
echo ""

# Show current active sessions
echo "🔄 Currently Active Sessions:"
ps aux | grep "goose" | grep -v grep | head -5
