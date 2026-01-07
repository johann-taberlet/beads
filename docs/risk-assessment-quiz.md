# PRD: Interactive Risk Assessment Quiz

## 1. Overview
A lead-generation tool for insurance brokers to automate the initial "discovery" phase. It replaces 30-minute introductory calls with a dynamic, interactive quiz that identifies a prospect's risk profile and captures their data.

## 2. Problem Statement
Brokers spend excessive time on discovery calls gathering basic facts (e.g., "Do you own a dog?", "What's your roof type?"). These calls are repetitive and delay the actual quoting process.

## 3. Solution
A custom, Typeform-style dynamic form built with Next.js and Tailwind CSS that uses conditional logic to ask only relevant questions and provides immediate value to the lead via a "Risk Profile" visualization.

## 4. Key Features

### 4.1. Dynamic Form Engine
- **JSON-based Schema**: Questions, options, and logic defined in a structured JSON for flexibility.
- **Complex Branching Logic**: Support for multi-condition boolean logic (e.g., Show Q3 if Q1 == 'Yes' AND Q2 == 'Commercial').
- **Smooth Transitions**: Vertical/horizontal slide animations between questions for a premium feel.
- **Input Types**:
  - Single-choice (Radio)
  - Multi-select (Checkbox)
  - Numeric/Text (for later phases, primary focus on choice-based for prototype)

### 4.2. Risk Profile Generation
- **Hardcoded Weighting**: Each answer choice maps to specific risk scores (e.g., "Pitched Roof" -> +10% Fire coverage, "Flat Roof" -> -5%).
- **Visual Gauges**: Results presented using interactive progress bars or gauges for different risk categories (Fire, Legal, Theft, etc.).
- **Dynamic CTA**: The "Next Steps" button changes based on the highest risk area identified (e.g., "Secure your Home now" vs "Get Legal Protection").

### 4.3. Lead Capture & Delivery
- **Upfront Gating**: Contact information (Name, Email, Phone) is collected before the quiz begins to ensure lead capture.
- **Curated Summary**: The final data payload includes a summary of risks and key facts rather than just a raw dump of answers.
- **Fake Delivery**: For the prototype, the "Send to Broker" action will log the curated summary to the console and show a success modal.

### 4.4. Persistence
- **Local Persistence**: Quiz progress is saved in `LocalStorage`, allowing users to resume if they refresh or close the tab.

## 5. Technical Stack
- **Frontend**: Next.js (App Router), Tailwind CSS, Framer Motion (for smooth transitions).
- **State Management**: React State/Context or a lightweight store like Zustand for quiz progress.
- **Storage**: `LocalStorage` for session persistence.
- **Logic Engine**: Custom JavaScript evaluator for the JSON logic schema.

## 6. User Flow
1. **Landing**: Brief introduction and "Start Assessment" button.
2. **Lead Capture**: Form for Name, Email, and Phone.
3. **Quiz**: Series of dynamic questions with branching logic.
4. **Early Exit**: If logic determines no more questions are relevant, jump straight to results.
5. **Results**: Visual Risk Profile (Gauges) + Dynamic CTA.
6. **Completion**: "Data sent" confirmation modal (simulated).

## 7. Future Considerations (Post-Prototype)
- Database integration (e.g., PostgreSQL/Prisma) for storing leads.
- Server-side email delivery (e.g., Resend).
- Advanced input types (Address autocomplete, Sliders).
- PDF generation of the Risk Profile for the client.
- Broker dashboard to view collected leads.
