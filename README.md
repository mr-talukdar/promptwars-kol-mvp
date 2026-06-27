# Sahaara 🌟

**Sahaara** is an AI-powered emotional pattern discovery and mindset tracking platform designed specifically for developers and high-stress professionals. It goes beyond basic mood trackers by analyzing written reflection logs using generative AI, mapping out hidden mental stress patterns, and providing actionable insights before burnout happens.

---

## 🚀 Key Features

- **Deep Reflection Intake**: Share your current state, concerns, or daily thoughts in plain text.
- **Gemini-Powered Mindset Analysis**: Analyzes text inputs to detect primary emotions, stress triggers, confidence levels, and cognitive distortions.
- **Interactive Mood Projection Graph**: Maps emotional metrics (Confidence, Stress DNA, and Hidden Emotional Patterns) over time.
- **Historical Insights Log**: Access past reflection logs along with AI analysis history to track your mental well-being trajectory.
- **Google OAuth Integration**: Simple, secure sign-in powered by Supabase.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend / Database**: [Supabase](https://supabase.com/) (Auth, Database access, and local SSR configuration)
- **AI Integration**: [@google/genai SDK](https://www.npmjs.com/package/@google/genai) (using `gemini-3.5-flash`)
- **Testing**: [Vitest](https://vitest.dev/) & React Testing Library
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📋 Environment Configuration

Create a `.env.local` file in the root directory of your project with the following keys:

```bash
# Supabase Keys
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_anon_key

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_GEMINI_MODEL=gemini-3.5-flash
```

---

## 💻 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 3. Build for Production
```bash
npm run build
npm run start
```

### 4. Running Tests
Ensure all components, utilities, and validation layers function correctly with Vitest:
```bash
npm run test
```

### 5. Code Quality & Linting
Run ESLint check:
```bash
npm run lint
```

---

## 📁 Directory Structure

```
├── src/
│   ├── app/                # Next.js App Router (pages: dashboard, reflect, auth)
│   ├── components/         # Reusable UI components & layouts (Navbar, AuthButton)
│   ├── lib/                # Core business logic, type definitions, and client utilities
│   │   ├── gemini.ts       # Gemini SDK client setup and prompt orchestration
│   │   ├── mood-utils.ts   # Formatting & chart helper logic
│   │   ├── types.ts        # TypeScript declarations
│   │   └── validators.ts   # Form/data validators (Zod schemas)
│   ├── utils/              # Helper utilities (Supabase SSR client generators)
│   └── __tests__/          # Vitest suite for component and utility coverage
```
