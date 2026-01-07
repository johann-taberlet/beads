"use client";

import { useState } from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { useQuizStore } from "@/store/use-quiz-store";

export function LeadForm() {
  const { setLead, nextStep } = useQuizStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "At least 10 digits required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setLead(formData);
      nextStep();
    }
  };

  return (
    <FadeIn direction="up" className="w-full max-w-lg mx-auto">
      <div className="glass p-8 md:p-12 rounded-[2.5rem] shadow-premium-lg border border-border/50 backdrop-blur-2xl">
        <div className="mb-10 text-center">
          <div className="inline-block px-3 py-1 mb-6 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full bg-primary/5 border border-primary/10 text-primary/60">
            Step 01 &mdash; Identity
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tightest mb-3 leading-tight">
            TELL US <br />
            <span className="text-muted-foreground/20 italic">WHO YOU ARE</span>
          </h2>
          <p className="text-muted-foreground text-sm font-medium">
            We need these details to personalize your risk profile.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground/40 ml-1"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              className={`w-full h-14 px-6 rounded-2xl bg-secondary/30 border ${
                errors.name ? "border-destructive/50" : "border-border/30"
              } focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-muted-foreground/20 font-bold text-foreground`}
            />
            {errors.name && (
              <p className="text-destructive text-[10px] font-black tracking-wider uppercase mt-1 ml-1 animate-in fade-in slide-in-from-left-1">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground/40 ml-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              className={`w-full h-14 px-6 rounded-2xl bg-secondary/30 border ${
                errors.email ? "border-destructive/50" : "border-border/30"
              } focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-muted-foreground/20 font-bold text-foreground`}
            />
            {errors.email && (
              <p className="text-destructive text-[10px] font-black tracking-wider uppercase mt-1 ml-1 animate-in fade-in slide-in-from-left-1">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground/40 ml-1"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              autoComplete="tel"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: "" });
              }}
              className={`w-full h-14 px-6 rounded-2xl bg-secondary/30 border ${
                errors.phone ? "border-destructive/50" : "border-border/30"
              } focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-muted-foreground/20 font-bold text-foreground`}
            />
            {errors.phone && (
              <p className="text-destructive text-[10px] font-black tracking-wider uppercase mt-1 ml-1 animate-in fade-in slide-in-from-left-1">
                {errors.phone}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="group relative w-full h-16 mt-4 rounded-2xl bg-primary text-primary-foreground font-black tracking-widest uppercase shadow-premium hover:shadow-premium-lg hover:-translate-y-0.5 transition-all active:scale-[0.98] overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Start Assessment
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Arrow Right</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </form>

        <p className="mt-8 text-center text-[9px] font-bold tracking-widest uppercase text-muted-foreground/30">
          Your data is encrypted and secure.
        </p>
      </div>
    </FadeIn>
  );
}
