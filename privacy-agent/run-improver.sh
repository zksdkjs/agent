#!/bin/bash

# Run Goose Improvement Agent
echo "🚀 Running Goose Improvement Agent..."

# Set working directory
cd "$(dirname "$0")"

# Create analysis request file
echo "# Goose System Analysis

## Current Questions:
1. Is our .goose folder properly configured? (currently empty)
2. Are our recipes in the right places?
3. Does our folder structure have duplicates or need cleaning?
4. What are Goose best practices for multi-agent systems?

## Requested Analysis:
- Research official Goose documentation on .goose directory contents
- Analyze our current recipe placement and structure
- Identify any duplicate or unnecessary files
- Provide specific recommendations for improvement" > GOOSE_ANALYSIS_REQUEST.md

# Create a temporary instruction file
echo "Please analyze the current privacy-agent project setup and provide specific recommendations for improvement. Focus on Goose best practices, directory organization, and actionable next steps." > /tmp/goose_instructions.txt

# Run the improvement agent with instruction file
goose run --recipe recipes/recipe-goose-improver.yaml --name "goose_improver_$(date +%Y%m%d_%H%M)" --max-turns 10 --instructions /tmp/goose_instructions.txt

# Clean up
rm -f /tmp/goose_instructions.txt

echo "✅ Goose Improvement Agent run completed!"
echo "Check outputs for recommendations."
