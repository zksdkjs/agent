# GOOSE BEST PRACTICES FOR CONTINUOUS WORK

## 1. USE MEMORY FILES
Always create memory files that agents read FIRST:
- `.goose/CLAUDE.md` - Project context
- `memory/CURRENT_WORK.md` - Work status
- `memory/session_*.md` - Session-specific context

## 2. RECIPE STRUCTURE
```yaml
instructions: |
  CRITICAL: First read memory/CURRENT_WORK.md
  YOU ARE CONTINUING WORK - DO NOT START OVER
  
  COMPLETED: [list what's done]
  FOCUS ON: [specific task]
  
  DO NOT: waste turns on pwd, ls, reading README
```

## 3. HIGH MAX-TURNS
Use 300-500 turns so agent doesn't stop mid-work:
```bash
goose run --recipe recipe.yaml --max-turns 500
```

## 4. SESSION SCRIPTS
Create scripts that:
1. Update memory files
2. Show current status  
3. Launch with context
4. Check what was built

## 5. EXPLICIT PATHS
Tell agents exact paths to work on:
- `sdk/packages/providers/railgun/src/`
- Don't let them search/explore

## 6. CHECK COMPLETION
Scripts should check ALL files, not just index.ts:
```bash
find $dir/src -name "*.ts" -exec cat {} \; | wc -l
```

## 7. AUTO-RESTART
Use while loops with time limits:
```bash
END_TIME=$(($(date +%s) + 3600))
while [ $(date +%s) -lt $END_TIME ]; do
    goose run --recipe recipe.yaml --max-turns 500
    sleep 5
done
```

## 8. FOCUS RECIPES
Create specific recipes for each task:
- `recipe-railgun-complete.yaml`
- `recipe-light-implement.yaml`
- Don't use generic recipes

## 9. PREVENT REDUNDANT WORK
List what's complete in the recipe:
```yaml
instructions: |
  FHEVM is COMPLETE (927 lines) - DO NOT TOUCH
```

## 10. USE PROMPT FIELD
Always include a prompt field that's specific:
```yaml
prompt: |
  Complete Railgun Recipe→Step→ComboMeal implementation.
  Create recipe.ts, steps/, and combomeals/ directories.
```