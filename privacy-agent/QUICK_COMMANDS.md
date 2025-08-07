# 🚀 Quick Command Reference

## Most Common Commands

### Daily Development Work
```bash
# Morning development session
goose run --recipe recipe-developer.yaml --name "dev_$(date +%m%d)" --max-turns 10

# Create Twitter thread about the work  
goose run --recipe recipe-social.yaml --name "social_$(date +%m%d)" --max-turns 3
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

- `recipe-developer.yaml` - Coding work
- `recipe-social.yaml` - Twitter/blog content
- `recipe-strategy-chief.yaml` - Strategic planning
- `recipe-marketing-growth.yaml` - Marketing analysis
- `recipe-research-intelligence.yaml` - Competitive research
- `recipe-tester.yaml` - Quality assurance
- `recipe-release-operations.yaml` - Release management
