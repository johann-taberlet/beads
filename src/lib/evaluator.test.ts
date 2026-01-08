import { describe, expect, it } from "bun:test";
import type { AnswerValue, Condition, QuizSchema } from "../types/quiz";
import { calculateRiskScores, evaluateCondition } from "./evaluator";

describe("evaluateCondition", () => {
  const answers: Record<string, AnswerValue> = {
    "q-property-type": "commercial",
    "q-high-value-items": ["electronics", "jewelry"],
    "q-has-dog": "yes",
    "q-construction-year": 1990,
  };

  it("should return true for undefined condition", () => {
    expect(evaluateCondition(undefined, answers)).toBe(true);
  });

  describe("BasicCondition", () => {
    it("should evaluate 'equals'", () => {
      const condition: Condition = {
        questionId: "q-property-type",
        operator: "equals",
        value: "commercial",
      };
      expect(evaluateCondition(condition, answers)).toBe(true);

      const conditionFalse: Condition = {
        questionId: "q-property-type",
        operator: "equals",
        value: "residential",
      };
      expect(evaluateCondition(conditionFalse, answers)).toBe(false);
    });

    it("should evaluate 'not_equals'", () => {
      const condition: Condition = {
        questionId: "q-property-type",
        operator: "not_equals",
        value: "residential",
      };
      expect(evaluateCondition(condition, answers)).toBe(true);
    });

    it("should evaluate 'contains'", () => {
      const condition: Condition = {
        questionId: "q-high-value-items",
        operator: "contains",
        value: "electronics",
      };
      expect(evaluateCondition(condition, answers)).toBe(true);

      const conditionFalse: Condition = {
        questionId: "q-high-value-items",
        operator: "contains",
        value: "art",
      };
      expect(evaluateCondition(conditionFalse, answers)).toBe(false);
    });

    it("should evaluate 'gt' and 'lt'", () => {
      const conditionGt: Condition = {
        questionId: "q-construction-year",
        operator: "gt",
        value: 1980,
      };
      expect(evaluateCondition(conditionGt, answers)).toBe(true);

      const conditionLt: Condition = {
        questionId: "q-construction-year",
        operator: "lt",
        value: 2000,
      };
      expect(evaluateCondition(conditionLt, answers)).toBe(true);
    });
  });

  describe("LogicCondition", () => {
    it("should evaluate 'and'", () => {
      const condition: Condition = {
        and: [
          {
            questionId: "q-property-type",
            operator: "equals",
            value: "commercial",
          },
          {
            questionId: "q-high-value-items",
            operator: "contains",
            value: "electronics",
          },
        ],
      };
      expect(evaluateCondition(condition, answers)).toBe(true);

      const conditionFalse: Condition = {
        and: [
          {
            questionId: "q-property-type",
            operator: "equals",
            value: "residential",
          },
          {
            questionId: "q-high-value-items",
            operator: "contains",
            value: "electronics",
          },
        ],
      };
      expect(evaluateCondition(conditionFalse, answers)).toBe(false);
    });

    it("should evaluate 'or'", () => {
      const condition: Condition = {
        or: [
          {
            questionId: "q-property-type",
            operator: "equals",
            value: "residential",
          },
          {
            questionId: "q-high-value-items",
            operator: "contains",
            value: "electronics",
          },
        ],
      };
      expect(evaluateCondition(condition, answers)).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should handle missing answers", () => {
      const condition: Condition = {
        questionId: "q-missing",
        operator: "equals",
        value: "something",
      };
      expect(evaluateCondition(condition, answers)).toBe(false);

      const conditionNotEquals: Condition = {
        questionId: "q-missing",
        operator: "not_equals",
        value: "something",
      };
      expect(evaluateCondition(conditionNotEquals, answers)).toBe(true);
    });
  });
});

describe("calculateRiskScores", () => {
  const schema: QuizSchema = {
    id: "test-quiz",
    title: "Test Quiz",
    version: "1.0.0",
    questions: [
      {
        id: "q1",
        text: "Question 1",
        type: "single-choice",
        options: [
          {
            id: "opt1",
            label: "Option 1",
            riskScores: { Fire: 0.1, Theft: 0.2 },
          },
          { id: "opt2", label: "Option 2", riskScores: { Fire: -0.05 } },
        ],
      },
      {
        id: "q2",
        text: "Question 2",
        type: "multi-select",
        options: [
          { id: "m1", label: "Multi 1", riskScores: { Legal: 0.3 } },
          {
            id: "m2",
            label: "Multi 2",
            riskScores: { Legal: 0.1, Fire: 0.05 },
          },
        ],
      },
    ],
  };

  it("should aggregate scores for single-choice", () => {
    const answers: Record<string, AnswerValue> = { q1: "opt1" };
    const scores = calculateRiskScores(schema, answers);
    expect(scores).toEqual({ Fire: 0.1, Theft: 0.2 });
  });

  it("should aggregate scores for multi-select", () => {
    const answers: Record<string, AnswerValue> = { q2: ["m1", "m2"] };
    const scores = calculateRiskScores(schema, answers);
    expect(scores).toEqual({ Legal: 0.4, Fire: 0.05 });
  });

  it("should aggregate scores from multiple questions", () => {
    const answers: Record<string, AnswerValue> = {
      q1: "opt1",
      q2: ["m1"],
    };
    const scores = calculateRiskScores(schema, answers);
    expect(scores).toEqual({ Fire: 0.1, Theft: 0.2, Legal: 0.3 });
  });

  it("should handle negative scores and subtotals", () => {
    const answers: Record<string, AnswerValue> = {
      q1: "opt2",
      q2: ["m2"],
    };
    const scores = calculateRiskScores(schema, answers);
    // q1 opt2: Fire: -0.05
    // q2 m2: Legal: 0.1, Fire: 0.05
    // Total Fire: 0, Legal: 0.1
    expect(scores.Fire).toBeCloseTo(0);
    expect(scores.Legal).toBe(0.1);
  });

  it("should return empty object if no answers", () => {
    const scores = calculateRiskScores(schema, {});
    expect(scores).toEqual({});
  });
});
