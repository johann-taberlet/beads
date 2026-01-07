# Beads Automation Scripts

Automated execution of Beads issues using Claude Code CLI.

## Overview

These scripts automate the development workflow by having Claude Code work through Beads issues one at a time in a continuous loop.

**Philosophy:** Beads is an *execution tool*, not a planning tool. It manages the task graph and dependencies while the agent focuses on implementation.

## Scripts

### 1. `automate.sh` (Recommended)
**Full-featured automation with verification and error handling.**

Features:
- ✅ Syncs before/after each iteration
- ✅ Verifies task completion
- ✅ Shows progress statistics
- ✅ Handles errors gracefully
- ✅ Auto-retries failed closures

Usage:
```bash
./automate.sh 10  # Run 10 iterations
```

### 2. `automate-minimal.sh`
**Ultra-minimal version that trusts Beads hooks.**

Features:
- ⚡ Fast and simple
- ⚡ Minimal output
- ⚡ Trusts git hooks to handle sync

Usage:
```bash
./automate-minimal.sh 5  # Run 5 iterations
```

## How It Works

Each iteration:
1. **Sync** - Pull latest changes from remote (`bd sync`)
2. **Check** - Get ready tasks (`bd ready`)
3. **Execute** - Claude picks ONE task and implements it
4. **Test** - Run type checks and tests
5. **Commit** - Git commit (hooks auto-sync beads)
6. **Close** - Mark task complete (`bd close <id>`)
7. **Sync** - Push changes to remote (`bd sync`)

## Setup

### Prerequisites
```bash
# Install Beads
brew install steveyegge/tap/bd

# Install Claude Code CLI
# (follow installation instructions for your platform)

# Ensure project has Beads initialized
bd doctor
```

### Configuration

The scripts expect:
- **Beads installed** with hooks configured
- **Claude Code CLI** accessible as `claude` command
- **Test command**: Adjust `pnpm typecheck && pnpm test` if using different tools

## Workflow Integration

### Session Hooks
Your project already has session startup hooks that auto-load Beads context:
```
SessionStart:startup hook success: # Beads Workflow Context
```

### Git Hooks
Git hooks auto-sync on:
- `pre-commit` - Before committing
- `post-merge` - After pulling
- `pre-push` - Before pushing

**This means:** You don't need to manually run `bd sync` in commits—hooks handle it!

## Examples

### Run continuous development
```bash
# Work through 20 tasks
./automate.sh 20
```

### Quick iteration
```bash
# Do a few quick tasks
./automate-minimal.sh 3
```

### Marathon session
```bash
# Keep going until all ready tasks are done
while ./automate.sh 10; do
  echo "Continuing..."
done
```

## Expected Output

```
=========================================
🔄 Iteration 1 / 10
=========================================
📥 Syncing with remote...
✓ Sync complete

📋 Ready tasks: 27

[Claude implements task beads-5tz...]

✅ SUCCESS: beads-5tz completed and closed
📤 Syncing to remote...
✓ Pushed to remote

📊 Progress: 27 → 26 ready tasks
```

## Task Selection

Claude agent will select tasks based on:
1. **Priority** - P0 > P1 > P2 > P3
2. **Dependencies** - Only picks tasks with no blockers
3. **Logical sequence** - Considers what makes sense to do next
4. **Agent judgment** - Claude uses its understanding of the project

## Stopping Conditions

The script stops when:
- ✅ All ready tasks are complete
- ✅ Specified iterations completed
- ❌ Fatal error occurs (script exits with error code)

## Troubleshooting

### "No ready tasks"
```bash
# Check what's blocking tasks
bd blocked

# See all open tasks
bd list --status=open

# Check project health
bd doctor
```

### Task not closing
```bash
# Manually close if needed
bd close beads-xxx

# Verify status
bd show beads-xxx
```

### Sync conflicts
```bash
# Pull latest and resolve
bd sync

# Check sync status
bd sync --status
```

## Best Practices

### ✅ DO:
- Let hooks handle auto-sync in commits
- Sync at iteration boundaries (before/after loops)
- Trust `bd ready` to respect dependencies
- Use `bd close` explicitly after task completion
- Work on ONE task per iteration

### ❌ DON'T:
- Create separate progress.txt (Beads IS your memory)
- Manually track dependencies (Beads manages the graph)
- Skip `bd sync` between iterations
- Batch close multiple tasks without syncing

## Customization

### Change test command
Edit the scripts and replace:
```bash
pnpm typecheck && pnpm test
```
with your project's test command:
```bash
npm test
make test
cargo test
flutter test
# etc.
```

### Adjust prompt
Modify the Claude prompt in either script to:
- Add project-specific guidelines
- Include architecture constraints
- Specify coding standards
- Add custom completion criteria

## Comparison with Traditional Workflow

### Traditional (prd.json):
```json
{
  "category": "feature",
  "description": "Implement feature X",
  "steps": ["Step 1", "Step 2", ...]
}
```
+ progress.txt for memory

### Beads Workflow:
```bash
bd create --title="Implement feature X" \
  --description="..." \
  --priority=1
bd dep add beads-yyy beads-xxx  # Dependencies
```
+ Git commits for history
+ Beads tracks everything automatically

**Advantage:** No manual progress tracking, better multi-agent coordination, git-native.

## Related Commands

```bash
# View project stats
bd stats

# See what's blocking progress
bd blocked

# Check next available work
bd ready

# View task details
bd show beads-xxx

# Manual sync
bd sync

# Health check
bd doctor
```

## Further Reading

- [Beads Best Practices](https://steve-yegge.medium.com/beads-best-practices-2db636b9760c) by Steve Yegge
- [Introducing Beads](https://steve-yegge.medium.com/introducing-beads-a-coding-agent-memory-system-637d7d92514a)
- [Beads GitHub](https://github.com/steveyegge/beads)

---

**Note:** These scripts use `--dangerously-skip-permissions` for automated execution. In interactive mode, you may want to remove this flag for safer operation.
