"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { slideUp, staggerContainer } from "@/lib/motion";

const FEATURES = [
  {
    title: "Dynamic Flow Engine",
    description:
      "Context-aware questions that adapt in real-time based on previous answers, ensuring a relevant and personalized experience.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        role="img"
        aria-labelledby="flow-icon-title"
      >
        <title id="flow-icon-title">Dynamic Flow Icon</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
  },
  {
    title: "Advanced Risk Scoring",
    description:
      "Sophisticated weighted evaluation logic that quantifies risk and lead potential with data-driven precision.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        role="img"
        aria-labelledby="scoring-icon-title"
      >
        <title id="scoring-icon-title">Risk Scoring Icon</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    title: "Premium Experience",
    description:
      "Modern glassmorphism UI with smooth micro-animations designed to maximize user engagement and completion rates.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        role="img"
        aria-labelledby="experience-icon-title"
      >
        <title id="experience-icon-title">Premium Experience Icon</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
  },
];

const VALUE_PROPS = [
  "Real-time scoring based on dynamic user input",
  "Modular question structures for infinite scalability",
  "Comprehensive analytics and lead insights",
  "Seamless integration with your existing CRM",
];

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center bg-background selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation (Transparent) */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-20">
        <div className="text-xl font-black tracking-tighter">BEADS</div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground/80">
          <Link
            href="#features"
            className="hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#process"
            className="hover:text-foreground transition-colors"
          >
            Process
          </Link>
          <Link
            href="/docs"
            className="hover:text-foreground transition-colors"
          >
            Docs
          </Link>
          <Link
            href="/assessment"
            className="px-5 py-2 rounded-full bg-primary text-primary-foreground hover:shadow-premium transition-all font-semibold"
          >
            Start No-Cost Trial
          </Link>
        </div>
      </nav>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-10 flex flex-col items-center w-full"
      >
        {/* Hero Section */}
        <header className="pt-20 pb-32 px-6 flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            variants={slideUp}
            className="inline-block px-3 py-1 mb-8 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full bg-primary/5 border border-primary/10 text-primary/60"
          >
            Next-Gen Lead Evaluation
          </motion.div>

          <motion.h1
            variants={slideUp}
            className="text-5xl md:text-8xl font-black tracking-tightest mb-8 leading-[0.9] text-foreground"
          >
            ASSESS RISK <br />
            <span className="text-muted-foreground/20 italic">
              WITH PRECISION
            </span>
          </motion.h1>

          <motion.p
            variants={slideUp}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Transform complex risk evaluations into seamless user journeys.
            Capture high-quality leads with our data-driven engine and premium
            dynamic assessment architecture.
          </motion.p>

          <motion.div
            variants={slideUp}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="/assessment"
              className="group relative h-16 px-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center transition-all hover:shadow-premium-lg hover:-translate-y-1 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">Start Assessment</span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            <Link
              href="/docs"
              className="h-16 px-12 rounded-full glass font-semibold flex items-center justify-center transition-all hover:bg-accent/50 hover:-translate-y-1 active:scale-95"
            >
              View Documentation
            </Link>
          </motion.div>
        </header>

        {/* Features Section */}
        <section
          id="features"
          className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-border/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {FEATURES.map((feature, i) => (
              <FadeIn
                key={feature.title}
                delay={0.1 * i}
                direction="up"
                className="p-8 rounded-3xl glass hover:shadow-premium-lg transition-all border-border/50 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 text-primary border border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {feature.description}
                </p>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="w-full bg-primary text-primary-foreground py-32 px-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[60%] h-full bg-[radial-gradient(circle_at_center,var(--color-primary-foreground)_0%,transparent_70%)] opacity-[0.03] pointer-events-none" />

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-8">
                Designed for high-stakes conversion.
              </h2>
              <ul className="space-y-6">
                {VALUE_PROPS.map((item) => (
                  <li key={item} className="flex items-start gap-4">
                    <div className="mt-1.5 w-5 h-5 rounded-full border border-primary-foreground/30 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                    </div>
                    <span className="text-lg text-primary-foreground/80 font-medium">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 relative">
              <div className="w-full aspect-square rounded-full border border-primary-foreground/10 absolute -inset-10 animate-pulse" />
              <div className="w-full aspect-square rounded-full border border-primary-foreground/5 absolute -inset-20" />
              <div className="relative glass bg-white/5 border-white/10 p-12 rounded-[3rem] shadow-2xl backdrop-blur-2xl">
                <div className="space-y-4">
                  <div className="h-2 w-1/3 bg-primary-foreground/20 rounded-full" />
                  <div className="h-10 w-full bg-primary-foreground/10 rounded-2xl" />
                  <div className="h-2 w-1/2 bg-primary-foreground/20 rounded-full" />
                  <div className="h-32 w-full bg-primary-foreground/5 rounded-3xl flex items-center justify-center">
                    <span className="text-4xl font-black italic opacity-20 tracking-widest text-primary-foreground">
                      CHART
                    </span>
                  </div>
                  <div className="h-14 w-full bg-primary-foreground rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
          <div className="flex flex-col items-center text-center gap-8 mb-20">
            <h2 className="text-3xl font-black tracking-tight">
              Ready to evaluate?
            </h2>
            <Link
              href="/assessment"
              className="h-16 px-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center transition-all hover:shadow-premium-lg hover:-translate-y-1 active:scale-95"
            >
              Start Free Assessment
            </Link>
          </div>

          <div className="w-full pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold tracking-widest uppercase text-muted-foreground/40">
            <div>
              &copy; {new Date().getFullYear()} Beads Platform. All rights
              reserved.
            </div>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
            <div>Built for Excellence.</div>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
