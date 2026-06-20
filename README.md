# 🌱 EcoTwin AI

### AI-Powered Behavior Change Platform for Sustainable Living

**Transforming Carbon Awareness into Action**

EcoTwin AI is an intelligent sustainability platform that goes beyond carbon footprint calculation to actively drive behavior change. By combining personalized carbon assessment, AI-powered coaching, gamified missions, and measurable impact tracking, EcoTwin transforms environmental awareness into concrete, sustainable habits.

---

## 🌍 Problem Statement

**The Climate Action Gap**

Most people want to live sustainably but face critical barriers:

- **Information Overload:** Conflicting advice makes it hard to know where to start
- **Lack of Personalization:** Generic tips don't address individual lifestyles
- **No Clear Path:** Users don't see a roadmap from current habits to sustainable ones
- **Low Motivation:** Without feedback and rewards, sustainable habits don't stick
- **Invisible Impact:** Users can't see the real-world effect of their actions

**The Result:** Good intentions remain just intentions, and individual carbon footprints stay unchanged.

---

## ✨ Solution Overview

EcoTwin AI bridges the gap between awareness and action through:

1. **Personalized Carbon Assessment** - Category-specific footprint analysis
2. **AI-Powered EcoCoach** - Real-time sustainability mentoring
3. **Behavior Change Roadmap** - Clear milestones from current to potential impact
4. **Gamified Mission System** - Daily actionable challenges with XP rewards
5. **Measurable Impact Tracking** - Real-time CO2 savings and environmental equivalents
6. **Avatar Growth System** - Visual representation of sustainability journey

**Key Innovation:** EcoTwin doesn't just display information—it actively guides users through a structured behavior change process with measurable outcomes.

---

## 🎯 Key Features

### 🧮 Personalized Carbon Assessment
Analyze lifestyle habits across 6 categories with 15+ detailed questions:

- **Transportation** - Commute patterns, vehicle choices, travel frequency
- **Energy Usage** - Heating, cooling, appliances, phantom loads
- **Food Consumption** - Diet patterns, food waste, sourcing habits
- **Shopping Habits** - Fast fashion, electronics, secondhand preferences
- **Waste Management** - Plastic use, recycling, composting
- **Lifestyle Systems** - Water usage, community involvement, advocacy

**Output:** Detailed carbon score (0-100), category breakdown, strengths, weaknesses, and personalized improvement recommendations.

### 🤖 EcoCoach AI
An AI-powered sustainability mentor using Google Gemini API:

- **Context-Aware Responses** - Understands user's current carbon profile and progress
- **Personalized Recommendations** - Tailored advice based on individual habits
- **Progress Tracking** - Remembers conversation history for continuity
- **Action-Oriented** - Focuses on concrete next steps rather than general advice
- **Safety First** - Input validation, length limits, and error handling

### 🗺️ Behavior Change Roadmap
**NEW:** Structured path from current habits to sustainable potential:

- **5 Progressive Milestones** - Clear targets with timeframes (1 week to 1 year)
- **Estimated Impact** - Projected CO2 reduction and cost savings for each milestone
- **Key Actions** - Specific, achievable steps for each milestone
- **Visual Progress** - Track advancement through sustainability levels

### 🎯 Weekly Eco-Goals
**NEW:** Focused weekly targets based on weakest category:

- **Category-Specific Goals** - 3 goals targeting user's biggest improvement area
- **Measurable Targets** - Clear values and units (e.g., "3 plant-based meals")
- **Impact Tracking** - CO2 reduction estimate for each goal
- **Deadline Management** - Weekly commitment structure

### 📊 Annual Impact Projection
**NEW:** Long-term impact visualization:

- **Current vs. Potential** - Annual CO2 comparison
- **Reduction Estimates** - Projected yearly savings in kg CO2 and USD
- **Environmental Equivalents** - Trees planted, car km avoided, homes powered
- **Confidence Levels** - Data-driven accuracy assessment based on user engagement

### 🎮 Gamified Mission System
Daily sustainability challenges with rewards:

- **12 Mission Types** - Covering all sustainability categories
- **XP Rewards** - 20-35 XP per completed mission
- **Streak Tracking** - Consecutive day bonuses
- **Achievement System** - Unlockable badges and milestones
- **Leaderboard Potential** - Competitive sustainability tracking

### 🌱 Avatar Growth System
Visual representation of sustainability journey:

- **5 Growth Stages** - Seed → Sprout → Explorer → Tree → Guardian
- **Level-Based Progression** - XP requirements with exponential scaling
- **Stage Unlocking** - Automatic avatar evolution at level thresholds
- **Visual Feedback** - Dynamic gradients, glow effects, and particle animations

### 📈 Analytics Dashboard
Comprehensive progress tracking:

- **Real-Time Score** - Current sustainability score with improvement tracking
- **XP Progress** - Experience points with level progression
- **Carbon Improvement** - Percentage improvement over time
- **Mission Statistics** - Completion rates, streaks, weekly progress
- **Environmental Impact** - Total CO2 saved, trees equivalent, energy saved

---

## 🛠 Tech Stack

**Frontend Framework**
- React 19 with TypeScript
- Vite for fast development and optimized builds

**UI & Styling**
- Tailwind CSS v4 for utility-first styling
- Framer Motion for smooth animations
- Lucide React for consistent iconography

**AI Integration**
- Google Gemini API (gemini-2.5-flash model)
- Context-aware prompt engineering
- Input validation and sanitization

**State Management**
- React hooks (useState, useEffect, useCallback)
- LocalStorage for persistence
- Type-safe state structures

**Testing**
- Vitest for fast unit testing
- React Testing Library for component testing
- jest-dom for enhanced assertions
- 94+ tests covering edge cases and error handling

**Development Tools**
- ESLint with TypeScript support
- PostCSS with Autoprefixer
- Git version control

---

## 🏗 Architecture

### Project Structure
```
src/
├── components/
│   ├── chat/              # AI chatbot components
│   │   ├── EcoCoachWidget.tsx
│   │   └── ChatWindow.tsx
│   ├── dashboard/         # Dashboard UI components
│   │   ├── ui/           # Reusable dashboard UI elements
│   │   ├── DailyMissions.tsx
│   │   ├── HeroProfile.tsx
│   │   ├── ProgressTracker.tsx
│   │   ├── FutureEarthSimulator.tsx
│   │   └── ...
│   ├── AssessmentWizard.tsx
│   ├── Dashboard.tsx
│   └── LandingPage.tsx
├── utils/
│   ├── carbonEngine.ts    # Carbon calculation logic
│   ├── dashboardStore.ts  # State management & persistence
│   ├── actionEngine.ts    # Action planning & insights
│   ├── gemini.ts          # AI integration
│   └── behaviorChange.ts  # NEW: Behavior change engine
└── test/                  # Comprehensive test suite
    ├── setup.ts           # Test configuration
    ├── App.test.tsx
    ├── AssessmentWizard.test.tsx
    ├── carbonEngine.test.ts
    ├── dashboardStore.test.ts
    ├── EcoCoachWidget.test.tsx
    ├── edgeCases.test.ts   # NEW: Edge case testing
    └── behaviorChange.test.ts # NEW: Behavior change testing
```

### Key Design Patterns

**Component Architecture**
- Functional components with hooks
- Props drilling for simple state
- Context for complex state (future enhancement)
- Separation of UI and business logic

**State Management**
- Local component state for UI
- LocalStorage for persistence
- Validation and sanitization on all external data
- Type-safe interfaces throughout

**Business Logic Separation**
- Utility functions in `/utils` directory
- Pure functions for calculations
- No side effects in pure functions
- Comprehensive error handling

**Type Safety**
- Strict TypeScript configuration
- Interface definitions for all data structures
- Type guards for runtime validation
- No `any` types in production code

---

## 🧪 Testing Strategy

### Test Coverage: 94+ Tests

**Component Testing**
- Rendering tests for all major components
- User interaction testing
- State management verification
- Accessibility attribute validation

**Unit Testing**
- Carbon calculation logic (10 tests)
- Dashboard state management (25 tests)
- Action planning and insights (integrated)
- Behavior change engine (38 tests)
- Edge case handling (38 tests)

**Integration Testing**
- Full assessment flow
- Dashboard persistence
- AI chat integration
- Mission completion workflow

**Error Handling Testing**
- Invalid inputs (negative numbers, strings, null)
- localStorage failures
- API error scenarios
- Empty state handling

**Test Configuration**
```bash
npm test              # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:ui       # Run tests with UI
```

### Test Quality
- No artificial coverage - only meaningful tests
- Edge case coverage for all utility functions
- Input validation testing
- Error scenario testing
- Professional-grade test practices

---

## ♿ Accessibility

EcoTwin is built with WCAG 2.1 AA compliance in mind:

**Semantic HTML**
- Proper heading hierarchy (h1 → h2 → h3)
- Landmark regions (main, header, footer, nav)
- Semantic elements for all interactive components

**ARIA Attributes**
- `aria-label` on all icon-only buttons
- `aria-live` regions for dynamic content updates
- `role="progressbar"` with proper ARIA attributes
- `aria-hidden` for decorative elements
- `aria-describedby` for form field associations

**Keyboard Navigation**
- Skip link for keyboard users
- All interactive elements keyboard accessible
- Focus management for modals
- Visible focus indicators

**Screen Reader Support**
- Live regions for dynamic updates
- Descriptive labels for all controls
- Status announcements for important changes
- Proper reading order

**Color Contrast**
- WCAG AA compliant color combinations
- Focus states with high contrast
- Text readable on all backgrounds

---

## 🔒 Security

Security best practices implemented throughout:

**Input Validation**
- All user inputs validated and sanitized
- Length limits on text inputs (500 characters max)
- Type checking on all external data
- No raw HTML injection

**Data Protection**
- LocalStorage data sanitization before storage
- Sensitive data never exposed in logs
- API keys stored in environment variables
- No hardcoded credentials

**API Security**
- API key validation with fallback handling
- Request/response validation
- Error messages don't expose sensitive information
- Rate limiting awareness

**Error Handling**
- Comprehensive try-catch blocks
- Graceful degradation on failures
- User-friendly error messages
- No stack traces in production

**XSS Prevention**
- React's built-in XSS protection
- No dangerouslySetInnerHTML
- Input sanitization
- Content Security Policy ready

---

## 🌱 Sustainability Impact

### Measurable Behavior Change

**From Awareness to Action**
- Traditional carbon calculators: Display information only
- EcoTwin AI: Guides users through structured behavior change

**Quantifiable Impact**
- **Carbon Reduction Roadmap:** Clear path with projected savings
- **Weekly Eco-Goals:** Focused, achievable targets
- **Annual Projections:** Long-term impact visualization
- **Real-Time Tracking:** Immediate feedback on actions

**User Engagement Features**
- Gamification drives habit formation
- AI coaching provides personalized guidance
- Progress visualization maintains motivation
- Social proof through achievements

**Projected Annual Impact** (per active user)
- **CO2 Reduction:** 2,000-5,000 kg/year
- **Cost Savings:** $100-250/year
- **Trees Equivalent:** 90-225 trees planted
- **Car km Avoided:** 9,500-24,000 km/year

### Environmental Equivalents
For every 1,000 kg CO2 saved:
- **45 trees** absorbing carbon for one year
- **4,760 km** of average car travel avoided
- **2,380 kWh** of grid electricity
- **64 days** of energy for a small apartment

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API key (optional for AI features)

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/ecotwin.git
cd ecotwin

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your VITE_GEMINI_API_KEY
```

### Development
```bash
npm run dev
```
Open http://localhost:5173

### Production Build
```bash
npm run build
```
Optimized production build in `dist/` directory

### Preview Production Build
```bash
npm run preview
```

### Testing
```bash
npm test              # Watch mode
npm run test:run      # Single run
npm run test:ui       # UI mode
```

---

## 📊 AI Features

### EcoCoach AI Integration

**Context-Aware Prompting**
The AI receives:
- User's current carbon score and level
- Avatar stage and progress
- Conversation history
- Category-specific weaknesses

**Safety Measures**
- Input validation (max 500 characters)
- Response length limiting
- Error handling with fallback messages
- No sensitive data in prompts

**Response Characteristics**
- Conversational tone
- Action-oriented advice
- Personalized to user's profile
- Maximum 50 words per response
- No markdown formatting

---

## 🎯 Future Scope

**Phase 4: Community Features**
- Social sharing of progress
- Team challenges and competitions
- Local sustainability events integration
- User-generated eco-tips

**Phase 5: Advanced Analytics**
- Carbon trend analysis over time
- Comparative analytics (anonymized)
- Predictive recommendations
- Integration with smart home devices

**Phase 6: Mobile App**
- React Native mobile application
- Push notifications for missions
- Offline mode support
- Location-based suggestions

**Phase 7: Enterprise Features**
- Corporate sustainability tracking
- Team challenges for companies
- CSR reporting integration
- Carbon credit marketplace

---

## 👨‍💻 Developer

**Balasuriya**  
B.Tech Artificial Intelligence & Machine Learning  
Saveetha Engineering College

Designed and developed as an individual project focused on making sustainability engaging, measurable, and actionable through AI.

---

## 🌟 What Makes EcoTwin Different?

Unlike traditional carbon calculators, EcoTwin combines:

✅ **Personalized Assessment** - Category-specific footprint analysis

✅ **AI-Powered Coaching** - Real-time, context-aware sustainability mentoring

✅ **Behavior Change Roadmap** - Structured path from current to potential impact

✅ **Gamified Progress Tracking** - Missions, XP, achievements, and avatar growth

✅ **Measurable Impact** - Real-time CO2 savings with environmental equivalents

✅ **Annual Projections** - Long-term impact visualization

✅ **Weekly Eco-Goals** - Focused, achievable targets

✅ **Comprehensive Testing** - 94+ tests with edge case coverage

✅ **Accessibility-First Design** - WCAG AA compliant

✅ **Security Best Practices** - Input validation and data protection

✅ **Professional Code Quality** - Type-safe, well-documented, maintainable

**One interactive platform transforming awareness into action.**

---

## 🔄 User Journey

1. **Assessment** → Complete personalized carbon footprint quiz
2. **Analysis** → Receive detailed score and category breakdown
3. **Roadmap** → View personalized behavior change milestones
4. **Coaching** → Chat with AI for personalized recommendations
5. **Action** → Complete daily missions and weekly eco-goals
6. **Progress** → Track XP, level up, evolve avatar
7. **Impact** → See real-time CO2 savings and environmental equivalents
8. **Projection** → View annual impact and long-term potential

---

## 🌱 Vision

> "Transforming individual environmental awareness into collective action, one sustainable habit at a time."

**The Problem:** Good intentions without action won't solve climate change.

**The Solution:** EcoTwin AI - bridging the gap between awareness and behavior change through personalized guidance, gamification, and measurable impact.

**The Impact:** Thousands of users making small, daily changes that collectively reduce carbon emissions and create a sustainable future.
