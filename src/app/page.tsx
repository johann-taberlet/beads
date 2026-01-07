"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeIn, slideUp, staggerContainer } from "@/lib/motion";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-10 flex flex-col items-center text-center max-w-3xl"
      >
        <motion.header variants={slideUp} className="mb-12">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest uppercase rounded-full bg-primary/5 border border-primary/10 text-primary/60">
            Platform Alpha
          </div>
          <h1 className="text-7xl font-black tracking-tightest mb-6 bg-linear-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
            BEADS
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
            The premium dynamic assessment platform for modern lead capture and
            risk evaluation.
          </p>
        </motion.header>

        <motion.main
          variants={slideUp}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/assessment"
            className="group relative h-14 px-10 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center transition-all hover:shadow-premium-lg hover:-translate-y-1 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10">Start Assessment</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
          <Link
            href="/docs"
            className="h-14 px-10 rounded-full glass font-semibold flex items-center justify-center transition-all hover:bg-accent/50 hover:-translate-y-1 active:scale-95"
          >
            Documentation
          </Link>
        </motion.main>

        <motion.footer
          variants={fadeIn}
          className="mt-32 text-sm font-medium text-muted-foreground/50 tracking-wide uppercase"
        >
          &copy; {new Date().getFullYear()} Beads Platform. Built for
          Excellence.
        </motion.footer>
      </motion.div>
    </div>
  );
}
