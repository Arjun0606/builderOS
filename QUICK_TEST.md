# DevFlow - Quick Test Guide

## Test the CLI Now

### 1. Test the Default Command
```bash
cd /Users/arjun/BuilderOS/cli
node dist/index.js
```

Should show:
```
✨ DevFlow - Terminal AI for Developers

Commands:
  devflow commit  →  AI-powered commit messages
  devflow stats   →  See your progress
  devflow setup   →  Install shell integration
```

### 2. Test Stats Command
```bash
node dist/index.js stats
```

Should show your progress (0 for now since we just started).

### 3. Test AI Commit (Make a Small Change First)
```bash
# Make a small change
echo "# Test" >> QUICK_TEST.md

# Stage it
git add QUICK_TEST.md

# Run AI commit
node dist/index.js commit
```

This will:
1. Analyze the diff with Claude 4.5
2. Generate a professional commit message
3. Show it to you
4. Wait for Enter to confirm
5. Commit with that message
6. Log it to your local database

### 4. Test Setup Command
```bash
node dist/index.js setup
```

This will add aliases to your `.zshrc`:
- `flow` → `devflow`
- `fc` → `devflow commit`

Then run:
```bash
source ~/.zshrc
```

Now you can use:
```bash
flow commit
fc           # Quick commit
flow stats
```

---

## Make It Global (Optional)

To use `devflow` from anywhere:

```bash
cd /Users/arjun/BuilderOS/cli
npm link
```

Then from any directory:
```bash
devflow commit
devflow stats
```

---

## What's Working

✅ **AI Commit Messages** - Claude 4.5 generates professional commits
✅ **Progress Tracking** - Local SQLite database tracks everything
✅ **Shell Integration** - Easy aliases for quick access
✅ **Beautiful CLI** - Colored output, clear messages

---

## What's Next (Tomorrow)

- Polish commit command (handle edge cases)
- Enhanced stats (streaks, trends, visuals)
- Start terminal autocomplete
- Better TUI

---

## Try It Now! 🚀

