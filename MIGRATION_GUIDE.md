# Migration Guide: prd.json → Beads

This guide helps you migrate from the traditional prd.json + progress.txt workflow to Beads.

## Quick Comparison

| Aspect | Old (prd.json) | New (Beads) |
|--------|----------------|-------------|
| **Task Storage** | JSON file | SQLite + JSONL (git-tracked) |
| **Memory** | progress.txt | Git commits + issue descriptions |
| **Dependencies** | Manual in JSON | `bd dep add` command |
| **Priority** | JSON field | P0-P4 system |
| **Status Tracking** | JSON `"passes": true` | `open/in_progress/closed` |
| **Multi-Agent** | File conflicts | Git merge + conflict resolution |
| **Sync** | Manual file edits | `bd sync` (git-based) |
| **Context Recovery** | Re-read files | `bd prime` (auto-called by hooks) |

## Converting Tasks

### Before (prd.json):
```json
{
  "category": "drawing_quality",
  "description": "Implement Pixel-Perfect Drawing Mode",
  "steps": [
    "Add 'bool pixelPerfect' toggle to PencilTool",
    "After Bresenham generates points, apply pixel-perfect cleanup",
    "For each sequence of 3 consecutive pixels forming an L-shape...",
    "WIRE TO UI: Add pixel-perfect toggle button...",
    "UNIT TEST: Draw diagonal from (0,0) to (10,10)...",
    "VISUAL TEST via MCP: Enable pixel-perfect...",
    "Run 'flutter analyze'"
  ],
  "passes": true
}
```

### After (Beads):
```bash
bd create \
  --title="Implement Pixel-Perfect Drawing Mode" \
  --type=feature \
  --priority=1 \
  --description="Add pixel-perfect drawing cleanup algorithm.

Implementation:
- Add 'bool pixelPerfect' toggle to PencilTool
- After Bresenham generates points, apply pixel-perfect cleanup
- For each sequence of 3 consecutive pixels forming an L-shape, remove corner pixel
- This eliminates double-wide diagonal segments
- Algorithm: if points[i-1], points[i], points[i+1] form 90° corner, remove points[i]

UI:
- Add pixel-perfect toggle button to tool options when Pencil selected (Icons.auto_awesome)

Testing:
- UNIT TEST: Draw diagonal from (0,0) to (10,10) with pixelPerfect=true -> verify no adjacent pixels on same row/column
- VISUAL TEST via MCP: Enable pixel-perfect -> draw diagonal line -> screenshot -> verify clean 1px diagonal
- Run 'flutter analyze'
"
```

Result: `beads-abc`

## Converting Dependencies

### Before (manual tracking):
```json
{
  "description": "Implement onion skinning",
  "steps": [
    "Note: Requires animation frames to be completed first",
    ...
  ]
}
```

### After (explicit dependencies):
```bash
# Create tasks
bd create --title="Implement animation frames" --type=feature --priority=1
# Output: beads-xxx

bd create --title="Implement onion skinning" --type=feature --priority=2
# Output: beads-yyy

# Add dependency (onion skinning depends on animation frames)
bd dep add beads-yyy beads-xxx

# Now beads-yyy won't show in 'bd ready' until beads-xxx is closed
```

## Converting Priority

### Mapping:
| prd.json | Beads | Meaning |
|----------|-------|---------|
| Critical/P0 | `--priority=0` | Blocks everything |
| High/P1 | `--priority=1` | Important features |
| Medium/P2 | `--priority=2` | Standard work |
| Low/P3 | `--priority=3` | Nice to have |
| Backlog/P4 | `--priority=4` | Future work |

**Note:** Use numbers (0-4) or P-notation (P0-P4), NOT "high"/"medium"/"low".

## Converting progress.txt

### Before:
```markdown
# Progress Log
## Current Work
- 2026-01-06: Implemented Pixel-Perfect Drawing Mode
  - Added applyPixelPerfect() in algorithms.dart
  - Removes L-shaped corners from Bresenham lines
  - PencilTool with ChangeNotifier mixin
  - Added pixelPerfect/togglePixelPerfect methods
  - _PixelPerfectToggleButton in EditorTopBar
  - Icons.auto_awesome, orange when active
  - Appears when pencil tool selected
  - 23 new unit tests (1375 total)

## History
- 2026-01-06: Implemented Vertical Symmetry...
```

### After (Beads + Git):

**Task description (in Beads):**
```bash
bd create --title="Implement Pixel-Perfect Drawing Mode" \
  --description="Add pixel-perfect drawing cleanup algorithm..." \
  --type=feature
```

**Git commit (after completion):**
```bash
git commit -m "feat: pixel-perfect drawing mode

- Added applyPixelPerfect() algorithm in algorithms.dart
- PencilTool now supports pixelPerfect toggle
- UI toggle button in EditorTopBar (Icons.auto_awesome)
- 23 new unit tests covering diagonal line cleanup

Closes beads-abc"
```

**Close the issue:**
```bash
bd close beads-abc
```

**Result:** History is in git log, current work is in `bd list --status=in_progress`, future work is in `bd ready`.

## Migration Workflow

### Step 1: Create all tasks from prd.json
```bash
# For each task in prd.json, run:
bd create --title="..." --description="..." --type=feature --priority=1
```

**Tip:** Use parallel subagents for bulk creation:
```bash
# Create 10 tasks simultaneously
for task in task1 task2 task3...; do
  bd create --title="$task" ... &
done
wait
```

### Step 2: Add dependencies
```bash
# Review your task relationships
# Add dependencies with: bd dep add <dependent> <dependency>
bd dep add beads-ui-task beads-foundation-task
```

### Step 3: Delete prd.json and progress.txt
```bash
# Archive old files
mkdir -p archive
mv prd.json archive/
mv progress.txt archive/

# Commit
git add archive/ prd.json progress.txt
git commit -m "chore: migrate to Beads

Replaced prd.json task tracking with Beads issue system.
See 'bd ready' for available work."
```

### Step 4: Start using automation
```bash
./automate.sh 10
```

## Automation Script Migration

### Old Script (prd.json-based):
```bash
result=$(claude -p "Context files: @plans/prd.json and @progress.txt
Instructions:
    1. Find the highest-priority feature to work on
    2. Check types/tests
    3. Update the PRD
    4. Update progress.txt
    5. Commit
    6. ONLY WORK ON A SINGLE FEATURE")
```

### New Script (Beads-based):
```bash
result=$(claude -p "Tasks: $(bd ready)
Instructions:
    1. Pick ONE task (bd show <id> for details)
    2. Implement it
    3. Check types/tests
    4. Commit
    5. Close with: bd close <id>")
```

**Key differences:**
- ❌ No manual PRD updates
- ❌ No progress.txt management
- ✅ Beads auto-tracks everything
- ✅ Git hooks auto-sync
- ✅ Dependencies managed by Beads

## Handling Special Cases

### Epics (parent tasks)
```bash
# Create epic
bd create --title="EPIC: Animation System" --type=feature --priority=1
# Output: beads-epic

# Create sub-tasks
bd create --title="Frame management" --type=task --priority=1
# Output: beads-task1
bd create --title="Timeline UI" --type=task --priority=1
# Output: beads-task2

# Epic depends on all sub-tasks
bd dep add beads-epic beads-task1
bd dep add beads-epic beads-task2

# Now epic won't be "ready" until all sub-tasks complete
```

### Task Lists (multiple small items)
```bash
# Option 1: Single task with checklist in description
bd create --title="UI Polish" --description="
- [ ] Fix button alignment
- [ ] Update color scheme
- [ ] Add loading states
"

# Option 2: Multiple small tasks (preferred for tracking)
bd create --title="Fix button alignment" --type=task --priority=3
bd create --title="Update color scheme" --type=task --priority=3
bd create --title="Add loading states" --type=task --priority=3
```

### Recurring Work
```bash
# For weekly/recurring tasks, reopen or create new ones
bd create --title="Weekly dependency updates" --type=task --priority=3

# After completion
bd close beads-xxx

# Next week, create a new one
bd create --title="Weekly dependency updates (2026-W2)" --type=task --priority=3
```

## Tips for Success

### 1. Write Good Descriptions
**Bad:**
```bash
bd create --title="Fix bug"
```

**Good:**
```bash
bd create --title="Fix bug: Canvas not rendering on iOS" \
  --description="Canvas strokes don't appear on iOS 17+ devices.

Reproduction:
1. Open app on iOS 17 device
2. Draw with pencil tool
3. No strokes appear

Expected: Strokes should render immediately

Possible cause: Metal shader compilation issue"
```

### 2. Use Types Appropriately
- `feature` - New functionality
- `bug` - Something broken
- `task` - General work item
- `epic` - Large feature with sub-tasks

### 3. Keep Priority Consistent
- P0: Blocks everything (setup, critical bugs)
- P1: Core features
- P2: Standard features
- P3: Polish, nice-to-have
- P4: Future/backlog

### 4. Review Dependencies Regularly
```bash
# See what's blocking progress
bd blocked

# Visualize the dependency graph
bd show beads-xxx  # Shows "Depends on" and "Blocks"
```

## Troubleshooting

### "Too many open tasks, can't find what to work on"
```bash
# See only high-priority ready work
bd ready | grep P0
bd ready | grep P1

# Filter by type
bd list --status=open | grep feature
```

### "Lost track of what I was working on"
```bash
# See your active work
bd list --status=in_progress

# See recent activity
bd stats

# Check git log
git log --oneline -10
```

### "Need to reference old progress.txt notes"
Keep an archive and reference as needed, but avoid duplicating information into Beads that should be in git commits or code comments.

## Example: Full Migration

### Before (prd.json):
```json
{
  "phase": "2",
  "tasks": [
    {
      "category": "tools",
      "description": "Implement Line Tool",
      "steps": ["Create LineTool class", "Add shift constraint", ...],
      "passes": false
    },
    {
      "category": "tools",
      "description": "Implement Rectangle Tool",
      "steps": ["Create RectangleTool class", ...],
      "passes": false,
      "depends_on": ["Line Tool"]
    }
  ]
}
```

### After (Beads):
```bash
# Create tasks
bd create --title="Implement Line Tool" \
  --type=feature \
  --priority=1 \
  --description="Create LineTool class with shift constraint for straight lines"
# Output: beads-123

bd create --title="Implement Rectangle Tool" \
  --type=feature \
  --priority=1 \
  --description="Create RectangleTool class for drawing rectangles"
# Output: beads-456

# Add dependency
bd dep add beads-456 beads-123

# Check ready work
bd ready
# Output: Only beads-123 shows (beads-456 is blocked)

# Start working
./automate.sh 10
```

---

**Ready to migrate?** Start by running `bd create` for all your prd.json tasks, then test with `./automate-minimal.sh 1` to see the workflow in action!
