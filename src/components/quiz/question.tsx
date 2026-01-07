"use client";

import { AnimatePresence, motion } from "framer-motion";
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
    <div className="w-full">
      <div className="space-y-10">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-black tracking-tightest leading-[1.1] text-foreground">
            {text.toUpperCase()}
          </h2>
          {description && (
            <p className="text-muted-foreground text-base md:text-lg font-medium leading-relaxed max-w-lg">
              {description}
            </p>
          )}
        </div>

        <div className="grid gap-3">
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
                className="w-full h-16 px-8 text-lg rounded-2xl bg-secondary/30 border border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-muted-foreground/20 font-bold"
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
                className="w-full h-16 px-8 text-lg rounded-2xl bg-secondary/30 border border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-muted-foreground/20 font-bold"
              />
            </motion.div>
          ) : null}
        </div>
      </div>
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 + 0.1, duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.01, x: 5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative w-full text-left px-6 py-5 rounded-2xl border transition-all duration-300 group
        ${
          selected
            ? "border-primary bg-primary/5 shadow-premium ring-4 ring-primary/5"
            : "border-border/50 bg-secondary/20 hover:bg-secondary/40 hover:border-border"
        }
      `}
    >
      <div className="flex items-center gap-5">
        <div
          className={`
          shrink-0 w-6 h-6 flex items-center justify-center transition-all duration-300
          ${type === "single-choice" ? "rounded-full" : "rounded-lg"}
          ${
            selected
              ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg"
              : "bg-background border border-border/50 group-hover:border-primary/30"
          }
        `}
        >
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3 h-3"
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
            className={`text-lg font-black tracking-tight transition-colors duration-300 ${
              selected
                ? "text-primary"
                : "text-foreground/70 group-hover:text-foreground"
            }`}
          >
            {option.label.toUpperCase()}
          </span>
        </div>
      </div>

      {selected && (
        <motion.div
          layoutId="selection-glow"
          className="absolute inset-0 rounded-2xl bg-primary/5 -z-10"
        />
      )}
    </motion.button>
  );
}
