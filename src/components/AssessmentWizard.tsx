import { useState } from 'react';
import { QUESTIONS } from '../utils/carbonEngine';
import type { Question, Category } from '../utils/carbonEngine';
import { 
  Car, 
  Zap, 
  Utensils, 
  ShoppingBag, 
  Trash2, 
  Activity, 
  ArrowLeft, 
  ArrowRight,
  Check
} from 'lucide-react';

interface AssessmentWizardProps {
  onComplete: (answers: Record<string, string>) => void;
  onBackToHome: () => void;
}

export default function AssessmentWizard({ onComplete, onBackToHome }: AssessmentWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const currentQuestion: Question = QUESTIONS[currentStep];
  const totalSteps = QUESTIONS.length;

  const handleSelectOption = (optionId: string) => {
    // Validate optionId
    if (!optionId || typeof optionId !== 'string') {
      console.error('Invalid option ID');
      return;
    }

    // Check if option exists for current question
    const validOption = currentQuestion.options.find(opt => opt.id === optionId);
    if (!validOption) {
      console.error('Option not found in current question');
      return;
    }

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]) return; // Must select an option
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBackToHome();
    }
  };

  // Helper to render matching category icon
  const getCategoryIcon = (category: Category) => {
    const iconClass = "w-6 h-6 text-brand-dark";
    switch (category) {
      case 'transport':
        return <div className="p-2 bg-blue-100 rounded-xl"><Car className={iconClass} /></div>;
      case 'energy':
        return <div className="p-2 bg-yellow-100 rounded-xl"><Zap className={iconClass} /></div>;
      case 'food':
        return <div className="p-2 bg-orange-100 rounded-xl"><Utensils className={iconClass} /></div>;
      case 'shopping':
        return <div className="p-2 bg-purple-100 rounded-xl"><ShoppingBag className={iconClass} /></div>;
      case 'waste':
        return <div className="p-2 bg-green-100 rounded-xl"><Trash2 className={iconClass} /></div>;
      case 'lifestyle':
        return <div className="p-2 bg-brand-light rounded-xl"><Activity className={iconClass} /></div>;
    }
  };

  const selectedOptionId = answers[currentQuestion.id];
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-between px-4 py-8">
      {/* Assessment Header */}
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={handleBack}
            aria-label={currentStep === 0 ? 'Go back to home' : 'Go to previous question'}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {currentStep === 0 ? 'Home' : 'Back'}
          </button>
          <span className="text-xs font-extrabold tracking-wide uppercase text-slate-400" aria-live="polite">
            Question {currentStep + 1} of {totalSteps}
          </span>
        </div>

        {/* Custom Progress Bar */}
        <div className="w-full h-3 bg-slate-200/60 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Assessment progress">
          <div 
            className="h-full bg-brand-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card container */}
      <main className="w-full max-w-2xl flex-1 flex flex-col justify-center my-8">
        <div className="glass rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 animate-fade-in">
          {/* Category Label */}
          <div className="flex items-center gap-3 mb-6">
            {getCategoryIcon(currentQuestion.category)}
            <span className="text-sm font-extrabold uppercase tracking-widest text-slate-500">
              {currentQuestion.category}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight mb-8" id="question-text">
            {currentQuestion.questionText}
          </h2>

          {/* Option list */}
          <div className="flex flex-col gap-3.5" role="radiogroup" aria-labelledby="question-text">
            {currentQuestion.options.map(option => {
              const isSelected = selectedOptionId === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  aria-pressed={isSelected}
                  aria-label={`Select: ${option.text}`}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                    isSelected 
                      ? 'border-brand-primary bg-brand-light/35 shadow-md shadow-brand-primary/5' 
                      : 'border-slate-200 hover:border-slate-350 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex-1 pr-4">
                    <span className={`text-base font-semibold transition-colors ${
                      isSelected ? 'text-brand-dark' : 'text-slate-700'
                    }`}>
                      {option.text}
                    </span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'border-brand-primary bg-brand-primary' 
                      : 'border-slate-300 group-hover:border-slate-400'
                  }`} aria-hidden="true">
                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Navigation Footer */}
      <div className="w-full max-w-2xl flex items-center justify-end">
        <button
          onClick={handleNext}
          disabled={!selectedOptionId}
          aria-label={currentStep === totalSteps - 1 ? 'Calculate your carbon footprint' : 'Continue to next question'}
          className={`group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 ${
            selectedOptionId
              ? 'bg-brand-primary hover:bg-brand-dark text-white cursor-pointer shadow-md shadow-brand-primary/10 active:scale-98'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {currentStep === totalSteps - 1 ? 'Calculate Footprint' : 'Continue'}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
