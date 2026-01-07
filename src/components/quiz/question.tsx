"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FadeIn } from "@/components/ui/fade-in";
import type { AnswerValue, Option, Question } from "@/types/quiz";

interface QuestionProps {
  question: Question;
  value?: AnswerValue;
  onChange: (value: AnswerValue) => void;
}

export function QuestionComponent({
  question,
  value,
  onChange,
}: QuestionProps) {
  const { text, description, type, options, placeholder } = question;

  const handleOptionClick = (optionId: string) => {
    if (type === "single-choice") {
      onChange(optionId);
    } else if (type === "multi-select") {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionId)) {
        onChange(currentValues.filter((v) => v !== optionId));
      } else {
        onChange([...currentValues, optionId]);
      }
    }
  };

  const isSelected = (optionId: string) => {
    if (type === "single-choice") {
      return value === optionId;
    }
    if (type === "multi-select") {
      return Array.isArray(value) && value.includes(optionId);
    }
    return false;
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <FadeIn direction="up">
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {text}
            </h2>
            {description && (
              <p className="text-slate-500 text-lg leading-relaxed max-w-xl">
                {description}
              </p>
            )}
          </div>

          <div className="grid gap-4">
            {type === "single-choice" || type === "multi-select" ? (
              options?.map((option, index) => (
                <OptionItem
                  key={option.id}
                  option={option}
                  selected={isSelected(option.id)}
                  onClick={() => handleOptionClick(option.id)}
                  type={type}
                  index={index}
                />
              ))
            ) : type === "text" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <input
                  type="text"
                  placeholder={placeholder || "Type your answer here..."}
                  value={(value as string) || ""}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full p-4 text-lg rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </motion.div>
            ) : type === "number" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <input
                  type="number"
                  placeholder={placeholder || "0"}
                  value={(value as number) || ""}
                  onChange={(e) => onChange(Number.parseFloat(e.target.value))}
                  className="w-full p-4 text-lg rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </motion.div>
            ) : null}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

interface OptionItemProps {
  option: Option;
  selected: boolean;
  onClick: () => void;
  type: "single-choice" | "multi-select";
  index: number;
}

function OptionItem({
  option,
  selected,
  onClick,
  type,
  index,
}: OptionItemProps) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 + 0.2, duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`
        relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 group
        ${
          selected
            ? "border-blue-600 bg-blue-50/50 shadow-sm ring-4 ring-blue-500/10"
            : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50"
        }
      `}
    >
      <div className="flex items-center gap-5">
        <div
          className={`
          shrink-0 w-7 h-7 flex items-center justify-center transition-all duration-300
          ${type === "single-choice" ? "rounded-full" : "rounded-lg"}
          ${
            selected
              ? "bg-blue-600 border-blue-600 text-white scale-110 shadow-lg shadow-blue-500/25"
              : "bg-white border-2 border-slate-300 group-hover:border-slate-400"
          }
        `}
        >
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <title>Selected</title>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex-1">
          <span
            className={`text-xl font-semibold transition-colors duration-300 ${
              selected ? "text-blue-900" : "text-slate-700"
            }`}
          >
            {option.label}
          </span>
        </div>
      </div>

      {/* Subtle indicator for selection */}
      {selected && (
        <motion.div
          layoutId="selection-glow"
          className="absolute inset-0 rounded-2xl bg-blue-500/5 -z-10"
        />
      )}
    </motion.button>
  );
}
