export type RiskCategory = "Fire" | "Theft" | "Legal" | "Natural" | "Cyber";

export interface RiskScores {
  [category: string]: number;
}

export type QuestionType = "single-choice" | "multi-select" | "text" | "number";

export interface Option {
  id: string;
  label: string;
  riskScores?: RiskScores;
}

export type LogicOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "gt"
  | "lt";

export type AnswerValue = string | number | boolean | string[];

export interface BasicCondition {
  questionId: string;
  operator: LogicOperator;
  value: AnswerValue;
}

export interface LogicCondition {
  and?: (LogicCondition | BasicCondition)[];
  or?: (LogicCondition | BasicCondition)[];
}

export type Condition = BasicCondition | LogicCondition;

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  description?: string;
  options?: Option[];
  placeholder?: string;
  logic?: Condition;
}

export interface QuizSchema {
  id: string;
  title: string;
  version: string;
  questions: Question[];
}

export interface Lead {
  name: string;
  email: string;
  phone: string;
}

export interface QuizState {
  currentStep: number;
  answers: Record<string, AnswerValue>;
  history: number[];
  isComplete: boolean;
  lead: Lead | null;
}

export interface QuizStore extends QuizState {
  setAnswer: (questionId: string, answer: AnswerValue) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  setLead: (lead: Lead) => void;
  finish: () => void;
  reset: () => void;
}
