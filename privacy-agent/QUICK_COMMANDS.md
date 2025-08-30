# 🚀 Quick Command Reference

## Most Common Commands

### Daily Development Work
```bash
# Morning development session
goose run --recipe recipes/recipe-developer.yaml --name "dev_$(date +%m%d)" --max-turns 10

# Create Twitter thread about the work  
goose run --recipe recipes/recipe-social.yaml --name "social_$(date +%m%d)" --max-turns 3
```

### Check What Happened
```bash
# See latest session logs
ls -la ~/.local/share/goose/sessions/ | tail -5

# Check generated social content
ls -la outputs/social/

# View latest Twitter thread
find outputs/social/ -name "twitter_*" | tail -1 | xargs cat
```

### Full Strategic System
```bash
# Launch everything coordinated
bash launch-strategic-system.sh
# Choose option 1
```

## File Locations

- **Session logs**: `~/.local/share/goose/sessions/`
- **Generated content**: `outputs/social/`  
- **System logs**: `outputs/logs/`
- **Reports**: `outputs/reports/`

## Agent Recipes

- `recipes/recipe-developer.yaml` - Coding work
- `recipes/recipe-social.yaml` - Twitter/blog content
- `recipes/recipe-strategy-chief.yaml` - Strategic planning
- `recipes/recipe-marketing-growth.yaml` - Marketing analysis
- `recipes/recipe-research-intelligence.yaml` - Competitive research
- `recipes/recipe-tester.yaml` - Quality assurance
- `recipes/recipe-release-operations.yaml` - Release management
