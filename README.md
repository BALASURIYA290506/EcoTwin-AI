# 🌱 EcoTwin AI

### AI-Powered Sustainability Companion

EcoTwin AI helps users understand, track, and improve their environmental impact through carbon footprint analysis, AI-powered coaching, gamified missions, and progress tracking.

---

## 🚀 Problem

Most people want to live sustainably but don't know:

- How their lifestyle affects the environment
- Which habits contribute most to carbon emissions
- What practical actions they can take to improve

EcoTwin transforms sustainability data into personalized and actionable insights.

---

## ✨ Features

### 🧮 Carbon Footprint Assessment
Analyze lifestyle habits across:

- Transportation
- Energy Usage
- Food Consumption
- Waste Management
- Shopping Habits

Generate a personalized sustainability score with category breakdowns.

### 🤖 EcoCoach AI
An AI-powered sustainability mentor that:

- Answers user questions
- Provides personalized recommendations
- Suggests eco-friendly improvements
- Guides users step-by-step

### 🎯 Daily Missions
Complete sustainability challenges and earn XP rewards.

### 🌱 EcoTwin Growth System
Grow your EcoTwin through different stages (Seed → Guardian) as you improve your sustainability score.

### 🏆 Achievements & XP
Unlock achievements and track progress through a gamified experience.

### 📊 Analytics Dashboard
Monitor:

- Sustainability Score
- XP Progress
- Carbon Improvement
- Mission Completion
- Environmental Impact Metrics

---

## 🛠 Tech Stack

**Frontend**
- React 19
- TypeScript
- Vite

**UI & Styling**
- Tailwind CSS v4
- Framer Motion
- Lucide React Icons

**AI**
- Google Gemini API

**Testing**
- Vitest
- React Testing Library
- jest-dom

**Development**
- ESLint
- TypeScript ESLint

---

## 🏗 Architecture

### Project Structure
```
src/
├── components/
│   ├── chat/              # AI chatbot components
│   ├── dashboard/         # Dashboard UI components
│   ├── AssessmentWizard.tsx
│   ├── Dashboard.tsx
│   └── LandingPage.tsx
├── utils/
│   ├── carbonEngine.ts    # Carbon calculation logic
│   ├── dashboardStore.ts  # State management & persistence
│   ├── actionEngine.ts    # Action planning & insights
│   └── gemini.ts          # AI integration
└── test/                  # Test files
```

### Key Design Patterns
- **Component-based architecture** with React hooks for state management
- **LocalStorage persistence** for dashboard state
- **Type-safe TypeScript** throughout the application
- **Modular utility functions** for business logic separation

---

## 🧪 Testing

The project includes comprehensive test coverage using Vitest and React Testing Library.

### Test Coverage
- Component rendering tests
- User interaction tests
- State management tests
- Utility function tests
- Score calculation tests

### Running Tests
```bash
npm test              # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:ui       # Run tests with UI
```

### Test Files
- `App.test.tsx` - Main application flow tests
- `AssessmentWizard.test.tsx` - Assessment component tests
- `carbonEngine.test.tsx` - Carbon calculation logic tests
- `dashboardStore.test.tsx` - State management tests
- `EcoCoachWidget.test.tsx` - Chat widget tests

---

## ♿ Accessibility

EcoTwin is built with accessibility in mind:

- **Semantic HTML** with proper heading hierarchy
- **ARIA labels** on all interactive elements
- **Keyboard navigation** support
- **Screen reader friendly** with live regions for dynamic content
- **Focus management** for modal dialogs
- **Color contrast** meeting WCAG standards

### Accessibility Features
- `aria-label` on icon-only buttons
- `aria-live` regions for dynamic updates
- `role="progressbar"` with proper ARIA attributes
- Semantic `<main>` and `<header>` landmarks
- Proper form labels and associations

---

## 🔒 Security

Security best practices implemented:

- **Input validation** on all user inputs
- **Data sanitization** before storage
- **API key validation** with fallback handling
- **Error handling** with user-friendly messages
- **LocalStorage validation** to prevent data corruption
- **Length limiting** on text inputs to prevent abuse

### Security Measures
- Chat input limited to 500 characters
- Conversation history limited to 2000 characters
- AI response length limiting
- Score validation (0-100 range enforcement)
- Type checking on all external data

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Environment Variables
Create a `.env` file in the root directory:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

---

## 🚀 Built With Antigravity

EcoTwin was developed using Antigravity IDE to accelerate prototyping, UI development, debugging, and AI integration.

All product design, sustainability logic, AI workflow design, and implementation were independently developed by the creator.

---

## 🌟 What Makes EcoTwin Different?

Unlike traditional carbon calculators, EcoTwin combines:

✅ Carbon Footprint Analysis

✅ AI-Powered Coaching

✅ Personalized Recommendations

✅ Gamified Progress Tracking

✅ Sustainability Education

✅ Comprehensive Testing

✅ Accessibility-First Design

✅ Security Best Practices

in one interactive platform.

---

## 🔄 User Journey

1. Complete Assessment
2. Get EcoTwin Score
3. View Sustainability Insights
4. Chat with EcoCoach AI
5. Complete Missions
6. Earn XP & Achievements
7. Improve Environmental Impact

---

## 👨‍💻 Developer

**Balasuriya**  
B.Tech Artificial Intelligence & Machine Learning  
Saveetha Engineering College

Designed and developed as an individual project focused on making sustainability engaging, measurable, and actionable through AI.

---

## 🌱 Vision

> "Small actions today create a greener tomorrow."
