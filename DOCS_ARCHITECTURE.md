# Architecture Decisions

## Framework & Tools
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Package Manager**: Bun

## Folder Structure
- `src/app`: Page routes and layouts.
- `src/components`: UI components and layouts.
  - `src/components/ui`: Atomic, reusable components (buttons, inputs, etc.).
  - `src/components/layout`: Larger layout components.
- `src/lib`: Utility functions, third-party library configurations.
- `src/hooks`: Custom React hooks.
- `src/store`: Zustand stores.
- `src/types`: TypeScript interfaces and types.
- `src/schemas`: JSON/Zod schemas for data validation.

## Path Aliases
- `@/*` points to `src/*`.

## Coding Standards
- Use functional components and hooks.
- Prefer server components for data fetching when possible.
- Use Tailwind for all styling.
- Maintain strong typing with TypeScript.
