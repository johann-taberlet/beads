import { describe, expect, it } from "bun:test";
import type { AnswerValue, Condition } from "../types/quiz";
import { evaluateCondition } from "./evaluator";

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
