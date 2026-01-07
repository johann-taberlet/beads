import { create } from "zustand";
import type { QuizStore, AnswerValue } from "@/types/quiz";

export const useQuizStore = create<QuizStore>((set) => ({
  currentStep: 0,
  answers: {},
  setAnswer: (questionId: string, answer: AnswerValue) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  previousStep: () =>
    set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
  reset: () => set({ currentStep: 0, answers: {} }),
}));

