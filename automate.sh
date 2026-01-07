#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations>"
  exit 1
fi

# Function to count ready tasks
count_ready() {
  bd ready 2>/dev/null | grep -cE '^\[P[0-4]\]' || echo "0"
}

for ((i=1; i<=$1; i++)); do
  echo ""
  echo "========================================="
  echo "🔄 Iteration $i / $1"
  echo "========================================="

  # Sync before starting (in case of remote changes)
  echo "📥 Syncing with remote..."
  bd sync

  ready_count=$(count_ready)

  if [ "$ready_count" -eq 0 ]; then
    echo "🎉 No ready tasks remaining. Project complete!"
    exit 0
  fi

  echo "📋 Ready tasks: $ready_count"

  # Get ready tasks
  ready_tasks=$(bd ready)

  # Run Claude - NOTE: Hooks already loaded context at session start
  result=$(claude --dangerously-skip-permissions -p "Ready Tasks ($ready_count available):
\`\`\`
$ready_tasks
\`\`\`

Instructions:
    1. SELECT one task from the ready list above.
       - Use 'bd show <id>' to get full details
       - Prioritize: P0 > P1 > P2 > P3
       - Consider: dependencies, logical sequence, your judgment

    2. IMPLEMENT the task completely:
       - Write clean, tested code
       - Run: pnpm typecheck && pnpm test (or equivalent for this project)
       - Fix all failures before proceeding

    3. GIT COMMIT your changes:
       - Write a descriptive commit message
       - Git hooks will auto-sync beads (no manual 'bd sync' needed in commit)

    4. CLOSE the issue:
       - Run: bd close <id>
       - Optionally add --reason for clarity

    5. OUTPUT completion signal:
       - <completed>beads-xxx</completed>

    WORK ON EXACTLY ONE TASK PER ITERATION.

    Note: Beads context was auto-loaded at session start via hooks.
    Git hooks will auto-sync on commit, but you should still 'bd close' manually.")

  echo "$result"
  echo ""

  # Verify completion
  if [[ "$result" =~ \<completed\>(beads-[a-z0-9]+)\</completed\> ]]; then
    completed_id="${BASH_REMATCH[1]}"

    # Small delay for sync to complete
    sleep 1

    # Verify task was actually closed
    if bd show "$completed_id" 2>/dev/null | grep -q "Status: closed"; then
      echo "✅ SUCCESS: $completed_id completed and closed"
    else
      echo "⚠️  WARNING: $completed_id reported complete but may not be closed"
      echo "   Running manual close..."
      bd close "$completed_id" || true
    fi
  else
    echo "⚠️  No completion signal detected. Review output above."
  fi

  # Sync after completion to push changes
  echo "📤 Syncing to remote..."
  bd sync

  # Show updated stats
  new_ready_count=$(count_ready)
  echo "📊 Progress: $ready_count → $new_ready_count ready tasks"
  echo ""
done

echo ""
echo "========================================="
echo "Batch complete!"
echo "Run again to continue: $0 <iterations>"
echo "========================================="
