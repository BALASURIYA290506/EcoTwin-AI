import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AssessmentWizard from './components/AssessmentWizard';
import Dashboard from './components/Dashboard';
import { calculateCarbonReport } from './utils/carbonEngine';
import type { CompleteCarbonReport } from './utils/carbonEngine';
import { Loader2 } from 'lucide-react';
import EcoCoachWidget from "./components/chat/EcoCoachWidget";

type AppView = 'landing' | 'assessment' | 'loading' | 'reveal' | 'dashboard';

const LOADING_STEPS = [
  'Measuring transit emissions...',
  'Calculating household heat capacity...',
  'Analyzing diet and food-waste metrics...',
  'Processing packaging resource indices...',
  'Synthesizing data into Carbon Score...',
  'Generating Future EcoTwin profile...',
];

export default function App() {
  const [view, setView] = useState<AppView>('landing');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [report, setReport] = useState<CompleteCarbonReport | null>(null);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);

  const [isNewAssessment, setIsNewAssessment] = useState(false);

  // Cycling text on loading transition screen
  useEffect(() => {
    if (view !== 'loading') return;

    const stepInterval = setInterval(() => {
      setLoadingStepIdx((prev) => {
        if (prev < LOADING_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    const completionTimeout = setTimeout(() => {
      const calculatedReport = calculateCarbonReport(answers);
      setReport(calculatedReport);
      setView('dashboard');
    }, 2800);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(completionTimeout);
    };
  }, [view, answers]);

  const handleStartAssessment = () => {
    setAnswers({});
    setReport(null);
    setLoadingStepIdx(0);
    setIsNewAssessment(false);
    setView('assessment');
  };

  const handleCompleteAssessment = (finalAnswers: Record<string, string>) => {
    setAnswers(finalAnswers);
    setIsNewAssessment(true);
    setView('loading');
  };

  const handleReset = () => {
    setAnswers({});
    setReport(null);
    setLoadingStepIdx(0);
    setIsNewAssessment(false);
    setView('landing');
  };

  return (
    <div className="w-full min-h-screen bg-brand-bg font-sans selection:bg-brand-light selection:text-brand-dark">
      {view === 'landing' && (
        <main>
          <LandingPage onStart={handleStartAssessment} />
        </main>
      )}

      {view === 'assessment' && (
        <main id="main-content">
          <AssessmentWizard
            onComplete={handleCompleteAssessment}
            onBackToHome={handleReset}
          />
        </main>
      )}

      {view === 'loading' && (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-brand-bg text-center" role="status" aria-live="polite" aria-label="Loading carbon footprint calculation" id="main-content">
          <div className="glass rounded-3xl p-10 max-w-md w-full border border-slate-200 shadow-xl flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-brand-primary animate-spin mb-6" aria-hidden="true" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Eco Calculations
            </h3>
            <p className="text-brand-dark font-semibold text-sm animate-pulse">
              {LOADING_STEPS[loadingStepIdx]}
            </p>

            {/* Loading micro bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-6 overflow-hidden">
              <div
                className="bg-brand-primary h-full rounded-full transition-all duration-300"
                style={{
                  width: `${((loadingStepIdx + 1) / LOADING_STEPS.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {view === 'dashboard' && (
        <main id="main-content">
          <Dashboard
            report={report}
            onReset={handleReset}
            isNewAssessment={isNewAssessment}
            onClearNewAssessment={() => setIsNewAssessment(false)}
          />
        </main>
      )}
      <EcoCoachWidget
        score={report?.currentYou.overallScore ?? 0}
        level={2}
        stage={"Eco Seed"}
      />
    </div>
  );
}