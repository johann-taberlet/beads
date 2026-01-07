"use client";

import { useCallback, useMemo } from "react";
import { evaluateCondition } from "@/lib/evaluator";
import { useQuizStore } from "@/store/use-quiz-store";
import type { AnswerValue, Question, QuizSchema } from "@/types/quiz";

interface FormEngineResult {
  /** The current question to display, or null if assessment is complete */
  currentQuestion: Question | null;
  /** The 1-based index of the current visible question */
  currentVisibleIndex: number;
  /** Total number of visible questions based on current answers */
  totalVisibleQuestions: number;
  /** Progress percentage (0-100) */
  progress: number;
  /** Current answer for the displayed question */
  currentAnswer: AnswerValue | undefined;
  /** Set the answer for a question */
  setAnswer: (questionId: string, value: AnswerValue) => void;
  /** Navigate to the next visible question */
  goNext: () => void;
  /** Navigate to the previous visible question */
  goBack: () => void;
  /** Whether the current question has a valid answer */
  canProceed: boolean;
  /** Whether we can go back (not at first question) */
  canGoBack: boolean;
  /** Whether the assessment is complete */
  isComplete: boolean;
}

/**
 * A form engine hook that handles conditional question navigation.
 * It evaluates the `logic` field on each question to determine visibility
 * and provides navigation functions that skip hidden questions.
 */
export function useFormEngine(quiz: QuizSchema): FormEngineResult {
  const { currentStep, answers, setAnswer, setStep, history, isComplete } =
    useQuizStore();

  /**
   * Returns all questions that should be visible based on current answers.
   */
  const visibleQuestions = useMemo(() => {
    return quiz.questions.filter((q) => evaluateCondition(q.logic, answers));
  }, [quiz.questions, answers]);

  /**
   * Find the index of the next visible question starting from a given index.
   * Returns -1 if no more visible questions exist.
   */
  const findNextVisibleIndex = useCallback(
    (fromIndex: number): number => {
      for (let i = fromIndex + 1; i < quiz.questions.length; i++) {
        const question = quiz.questions[i];
        if (evaluateCondition(question.logic, answers)) {
          return i;
        }
      }
      return -1; // No more visible questions
    },
    [quiz.questions, answers],
  );

  /**
   * Find the previous visible question from history.
   */
  const findPreviousStep = useCallback((): number | null => {
    if (history.length === 0) return null;

    // Walk back through history to find a question that's still visible
    for (let i = history.length - 1; i >= 0; i--) {
      const stepIndex = history[i];
      const question = quiz.questions[stepIndex];
      if (question && evaluateCondition(question.logic, answers)) {
        return stepIndex;
      }
    }

    return null;
  }, [history, quiz.questions, answers]);

  const currentQuestion = quiz.questions[currentStep] ?? null;

  // If current question exists but shouldn't be visible, skip it
  const actualCurrentQuestion = useMemo(() => {
    if (!currentQuestion) return null;
    if (!evaluateCondition(currentQuestion.logic, answers)) {
      return null;
    }
    return currentQuestion;
  }, [currentQuestion, answers]);

  const currentVisibleIndex = useMemo(() => {
    if (!actualCurrentQuestion) return 0;
    const idx = visibleQuestions.findIndex(
      (q) => q.id === actualCurrentQuestion.id,
    );
    return idx + 1; // 1-based index
  }, [visibleQuestions, actualCurrentQuestion]);

  const totalVisibleQuestions = visibleQuestions.length;

  const progress = useMemo(() => {
    if (totalVisibleQuestions === 0) return 100;
    if (!actualCurrentQuestion) return 100;
    return Math.round(
      ((currentVisibleIndex - 1) / totalVisibleQuestions) * 100,
    );
  }, [currentVisibleIndex, totalVisibleQuestions, actualCurrentQuestion]);

  const currentAnswer = actualCurrentQuestion
    ? answers[actualCurrentQuestion.id]
    : undefined;

  const canProceed = useMemo(() => {
    if (!actualCurrentQuestion) return false;

    // Text and number inputs can proceed even without a value
    if (
      actualCurrentQuestion.type === "text" ||
      actualCurrentQuestion.type === "number"
    ) {
      return true;
    }

    // For choice types, require a selection
    return currentAnswer !== undefined;
  }, [actualCurrentQuestion, currentAnswer]);

  const canGoBack = history.length > 0;

  const goNext = useCallback(() => {
    const nextIndex = findNextVisibleIndex(currentStep);
    if (nextIndex === -1) {
      // No more questions - mark as complete
      useQuizStore.getState().finish();
    } else {
      setStep(nextIndex);
    }
  }, [currentStep, findNextVisibleIndex, setStep]);

  const goBack = useCallback(() => {
    const prevStep = findPreviousStep();
    if (prevStep !== null) {
      // Remove the current step from history and go to previous
      const newHistory = [...history];
      // Pop entries until we get back to the target step
      while (
        newHistory.length > 0 &&
        newHistory[newHistory.length - 1] !== prevStep
      ) {
        newHistory.pop();
      }
      newHistory.pop(); // Remove the target step itself (we're going there)

      useQuizStore.setState({
        currentStep: prevStep,
        history: newHistory,
      });
    }
  }, [findPreviousStep, history]);

  return {
    currentQuestion: actualCurrentQuestion,
    currentVisibleIndex,
    totalVisibleQuestions,
    progress,
    currentAnswer,
    setAnswer,
    goNext,
    goBack,
    canProceed,
    canGoBack,
    isComplete,
  };
}
