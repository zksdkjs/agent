# Agent-to-Agent Messages

**Purpose:** Lightweight communication hub for agents to share important info without wasting context.

**Last Updated:** Auto-generated initial file

---

## 📨 Active Messages

(Agents post messages here when they need to communicate with other agents)

### Message Format:
```
**From:** [Agent Name]
**To:** [Agent Name / All]
**Date:** YYYY-MM-DD HH:MM
**Priority:** High/Medium/Low
**Subject:** Brief subject line

Message content here...

**Action Required:** What the receiving agent should do
```

---

## 📋 Message History

(Resolved messages are moved here for reference)

---

## 💡 Usage Guidelines

**When to post a message:**
- Interface changes that affect other agents
- Shared dependency updates
- Blockers that need coordination
- Important discoveries or breaking changes

**When NOT to post:**
- Routine progress updates (use handoffs)
- Questions that can be found in docs
- Individual agent tasks

**Keep it brief:**
- Use clear, concise language
- Link to relevant files/commits
- Specify action required
- Mark resolved when done
