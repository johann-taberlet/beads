import type {
  AnswerValue,
  BasicCondition,
  Condition,
  LogicCondition,
} from "../types/quiz";

/**
 * Evaluates a logical condition against the current set of answers.
 *
 * @param condition The condition to evaluate (Basic or Logic condition)
 * @param answers A record of question IDs to their corresponding answer values
 * @returns boolean indicating if the condition is met
 */
export function evaluateCondition(
  condition: Condition | undefined,
  answers: Record<string, AnswerValue>,
): boolean {
  if (!condition) return true;

  // Handle LogicCondition (AND/OR)
  if ("and" in condition || "or" in condition) {
    const logicCondition = condition as LogicCondition;

    if (logicCondition.and) {
      return logicCondition.and.every((c) => evaluateCondition(c, answers));
    }

    if (logicCondition.or) {
      return logicCondition.or.some((c) => evaluateCondition(c, answers));
    }

    return true; // Empty logic condition defaults to true
  }

  // Handle BasicCondition
  const basicCondition = condition as BasicCondition;
  const answer = answers[basicCondition.questionId];

  // If no answer yet, most conditions (except maybe not_equals/not_contains) fail
  if (answer === undefined) {
    if (basicCondition.operator === "not_equals") return true;
    if (basicCondition.operator === "not_contains") return true;
    return false;
  }

  switch (basicCondition.operator) {
    case "equals":
      return answer === basicCondition.value;

    case "not_equals":
      return answer !== basicCondition.value;

    case "contains":
      if (Array.isArray(answer)) {
        return answer.includes(basicCondition.value as string);
      }
      return false;

    case "not_contains":
      if (Array.isArray(answer)) {
        return !answer.includes(basicCondition.value as string);
      }
      return true;

    case "gt":
      return (answer as number) > (basicCondition.value as number);

    case "lt":
      return (answer as number) < (basicCondition.value as number);

    default:
      return false;
  }
}
