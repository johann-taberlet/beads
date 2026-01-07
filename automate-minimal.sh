#!/bin/bash
set -e

# Ultra-minimal automation script that trusts Beads hooks
# Usage: ./automate-minimal.sh <iterations>

[ -z "$1" ] && echo "Usage: $0 <iterations>" && exit 1

for ((i=1; i<=$1; i++)); do
  echo ""
  echo "=== 🔄 Iteration $i / $1 ==="

  # Pull remote changes
  bd sync

  # Get ready tasks
  ready=$(bd ready)

  # Check if any tasks remain
  if [ -z "$(echo "$ready" | grep -E '^\[P[0-4]\]')" ]; then
    echo "✅ All tasks complete!"
    exit 0
  fi

  # Run Claude agent
  result=$(claude --dangerously-skip-permissions -p "Ready Tasks:
\`\`\`
$ready
\`\`\`

Instructions:
1. Pick ONE task (use 'bd show <id>' for details)
2. Implement it completely
3. Run tests (pnpm typecheck && pnpm test if applicable)
4. Commit your work
5. Close the task: bd close <id>
6. Output: <completed>beads-xxx</completed>

Work on ONLY ONE TASK.")

  echo "$result"

  # Extract and display completed task
  if [[ "$result" =~ \<completed\>(beads-[a-z0-9]+)\</completed\> ]]; then
    echo "✅ Completed: ${BASH_REMATCH[1]}"
  fi

  # Push changes
  bd sync
  echo ""
done

echo "Batch complete. Run: $0 <iterations> to continue."
