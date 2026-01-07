import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <header className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-6xl font-black tracking-tighter mb-4">BEADS</h1>
        <p className="text-xl text-muted-foreground max-w-lg mx-auto">
          The premium dynamic assessment platform for modern lead capture and
          risk evaluation.
        </p>
      </header>

      <main className="grid gap-6 sm:flex sm:items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        <Link
          href="/assessment"
          className="h-12 px-8 rounded-full bg-primary text-primary-foreground font-medium flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        >
          Get Started
        </Link>
        <Link
          href="/docs"
          className="h-12 px-8 rounded-full border border-border font-medium flex items-center justify-center transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          View Documentation
        </Link>
      </main>

      <footer className="mt-24 text-sm text-muted-foreground animate-in fade-in duration-1000 delay-500">
        &copy; {new Date().getFullYear()} Beads Platform. All rights reserved.
      </footer>
    </div>
  );
}
