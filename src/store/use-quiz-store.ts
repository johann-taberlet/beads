import { create } from "zustand";

interface QuizState {
  currentStep: number;
  answers: Record<string, any>;
  setAnswer: (questionId: string, answer: any) => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  currentStep: 0,
  answers: {},
  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  previousStep: () =>
    set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
  reset: () => set({ currentStep: 0, answers: {} }),
}));
