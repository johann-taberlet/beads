"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { LeadForm } from "@/components/quiz/lead-form";
import { QuestionComponent } from "@/components/quiz/question";
import { useFormEngine } from "@/hooks/use-form-engine";
import quizData from "@/schemas/quiz.json";
import { useQuizStore } from "@/store/use-quiz-store";
import type { QuizSchema } from "@/types/quiz";

export default function AssessmentPage() {
  const quiz = quizData as QuizSchema;
  const { lead } = useQuizStore();
  const {
    currentQuestion,
    currentVisibleIndex,
    progress,
    currentAnswer,
    setAnswer,
    goNext,
    goBack,
    canProceed,
    canGoBack,
  } = useFormEngine(quiz);

  // We only show LeadForm if lead is null
  if (!lead) {
    return (
      <div className="relative min-h-screen bg-background flex flex-col items-center selection:bg-primary selection:text-primary-foreground overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Header */}
        <nav className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-20">
          <Link
            href="/"
            className="text-xl font-black tracking-tighter hover:opacity-70 transition-opacity"
          >
            BEADS
          </Link>
          <Link
            href="/"
            className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground/40 hover:text-primary transition-colors"
          >
            Exit Assessment
          </Link>
        </nav>

        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center relative z-10">
          <LeadForm />
        </main>

        <footer className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-center text-[9px] font-black tracking-[0.2em] uppercase text-muted-foreground/10">
          &copy; {new Date().getFullYear()} BEADS PLATFORM &mdash; DATA SECURITY
          PROTOCOL ACTIVE
        </footer>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center selection:bg-primary selection:text-primary-foreground overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-20">
        <Link
          href="/"
          className="text-xl font-black tracking-tighter hover:opacity-70 transition-opacity"
        >
          BEADS
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="text-[9px] font-black tracking-[0.2em] uppercase text-muted-foreground/40">
              Assessment Progress
            </span>
            <div className="h-1 w-32 bg-secondary/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="h-full bg-primary"
              />
            </div>
          </div>
          <span className="text-xs font-black tracking-tighter text-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/50">
            {progress}%
          </span>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-xl mx-auto px-6 py-12 flex flex-col items-center relative z-10">
        <AnimatePresence mode="wait">
          {currentQuestion ? (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <div className="mb-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-black text-primary">
                  {currentVisibleIndex}
                </div>
                <div className="h-px flex-1 bg-linear-to-r from-border/50 to-transparent" />
              </div>

              <QuestionComponent
                question={currentQuestion}
                value={currentAnswer}
                onChange={(val) => setAnswer(currentQuestion.id, val)}
              />

              <div className="mt-16 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={!canGoBack}
                  className="h-14 px-8 rounded-2xl border border-border/50 text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canProceed}
                  className="h-14 flex-1 rounded-2xl bg-primary text-primary-foreground font-black tracking-[0.2em] uppercase shadow-premium hover:shadow-premium-lg hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group"
                >
                  <span className="flex items-center justify-center gap-2">
                    Continue
                    <svg
                      className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <title>Continue</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center glass p-12 rounded-[3rem] border border-border/50 max-w-md w-full"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
                <svg
                  className="w-10 h-10 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>Success</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-black tracking-tightest mb-4">
                ASSESSMENT <br />
                <span className="text-muted-foreground/20 italic">
                  COMPLETE
                </span>
              </h2>
              <p className="text-muted-foreground font-medium mb-10">
                We've gathered all the necessary data to evaluate your profile.
                Our specialists will review the results.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-black tracking-[0.2em] uppercase shadow-premium hover:shadow-premium-lg transition-all"
              >
                Back to Home
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-center text-[9px] font-black tracking-[0.2em] uppercase text-muted-foreground/10">
        &copy; {new Date().getFullYear()} BEADS PLATFORM &mdash; DATA SECURITY
        PROTOCOL ACTIVE
      </footer>
    </div>
  );
}
