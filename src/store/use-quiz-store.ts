import { create } from "zustand";
import type { QuizStore, AnswerValue } from "@/types/quiz";

export const useQuizStore = create<QuizStore>((set) => ({
  currentStep: 0,
  answers: {},
  history: [],
  isComplete: false,
  setAnswer: (questionId: string, answer: AnswerValue) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),
  setStep: (step: number) =>
    set((state) => ({
      currentStep: step,
      history: [...state.history, state.currentStep],
    })),
  nextStep: () =>
    set((state) => ({
      currentStep: state.currentStep + 1,
      history: [...state.history, state.currentStep],
    })),
  previousStep: () =>
    set((state) => {
      if (state.history.length === 0) {
        return { currentStep: Math.max(0, state.currentStep - 1) };
      }
      const newHistory = [...state.history];
      const lastStep = newHistory.pop();
      if (lastStep === undefined) return state;
      return {
        currentStep: lastStep,
        history: newHistory,
      };
    }),
  finish: () => set({ isComplete: true }),
  reset: () =>
    set({ currentStep: 0, answers: {}, history: [], isComplete: false }),
}));

