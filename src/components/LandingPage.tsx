import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Leaf,
  Sparkles,
  Bike,
  CarFront,
  Droplets,
  Recycle,
  MessageSquareMore,
  Bot,
  MoveHorizontal,
  ArrowUpRight,
  Sprout,
  Flower2,
  TreePine,
  Shield,
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [transport, setTransport] = useState(42);
  const [electricity, setElectricity] = useState(58);
  const [food, setFood] = useState(46);
  const [shopping, setShopping] = useState(30);
  const [earthMode, setEarthMode] = useState(58);
  const [activePrompt, setActivePrompt] = useState(0);

  const calculator = useMemo(() => {
    const carbonScore = Math.round(100 - (transport * 0.28 + electricity * 0.22 + food * 0.24 + shopping * 0.18));
    const footprint = Math.max(1.2, (transport * 0.031 + electricity * 0.028 + food * 0.024 + shopping * 0.019));
    const futureScore = clamp(Math.round(carbonScore + (100 - carbonScore) * 0.62), 45, 98);
    const futureFootprint = Math.max(0.7, footprint * (1 - (futureScore - carbonScore) / 120));
    const carbonReduction = Math.max(0.2, footprint - futureFootprint);
    const treesEquivalent = Math.max(2, Math.round((100 - carbonScore) * 0.24));
    const savings = Math.max(80, Math.round((100 - carbonScore) * 14));

    return {
      carbonScore: clamp(carbonScore, 18, 96),
      futureScore,
      footprint: footprint.toFixed(1),
      carbonReduction: carbonReduction.toFixed(1),
      treesEquivalent,
      savings,
    };
  }, [transport, electricity, food, shopping]);

  const earthGreen = earthMode;
  const earthPollution = 100 - earthMode;

  const comparisonItems = [
    { label: 'Car', value: 86, icon: <CarFront className="h-5 w-5" />, note: 'High daily emissions' },
    { label: 'Bicycle', value: 14, icon: <Bike className="h-5 w-5" />, note: 'Near-zero footprint' },
    { label: 'Single-use bottle', value: 78, icon: <Droplets className="h-5 w-5" />, note: 'Disposable waste' },
    { label: 'Reusable bottle', value: 12, icon: <Recycle className="h-5 w-5" />, note: 'Low-waste habit' },
  ];

  const starterPrompts = [
    'How can I reduce my footprint as a student?',
    'Which habits matter most?',
    'How can I save electricity?',
  ];

  const coachResponses = [
    'Start with transport and electricity: walk or share short trips twice a week, then set one nightly power-down ritual. That gives you visible progress without needing a full lifestyle reset.',
    'Your highest-leverage habits are the repeatable ones: cooling, commuting, food waste, and single-use plastic. EcoTwin rewards consistency because small defaults compound.',
    'Set AC one degree warmer, cut one hour of runtime, unplug idle chargers, and use natural light for one work block. It is simple, measurable, and your future score responds quickly.',
  ];

  return (
    <div className="premium-shell overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 right-0 h-[32rem] w-[32rem] rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-[26rem] w-[26rem] rounded-full bg-sky-300/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-amber-200/15 blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-6 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-dark shadow-lg shadow-brand-primary/20">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-950">EcoTwin</div>
            <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">Carbon Footprint Intelligence</div>
          </div>
        </div>

        <motion.button
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-white/70 px-4 py-2 text-xs font-bold text-brand-dark backdrop-blur-xl transition hover-lift"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Take Assessment
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 pb-16 md:px-8">
        <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:min-h-[calc(100vh-96px)]">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-brand-dark backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-brand-primary animate-pulse" />
              Track • Understand • Reduce
            </div>
            <h1 className="max-w-xl text-5xl font-bold leading-[1.03] text-slate-950 md:text-7xl">
              Meet Your Future Sustainable Self.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              EcoTwin helps individuals understand, visualize, track, and reduce their carbon footprint through personalized insights and sustainable actions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <motion.button
                onClick={onStart}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-dark px-6 py-4 text-sm font-bold text-white shadow-lg shadow-brand-primary/20"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Assessment
                <ArrowRight className="h-4 w-4" />
              </motion.button>
              <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/60 px-5 py-4 text-sm font-semibold text-slate-600 backdrop-blur-xl">
                <MoveHorizontal className="h-4 w-4 text-brand-primary" />
                Explore before you commit
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="chamber-gradient relative overflow-hidden rounded-[2rem] border border-slate-200 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.12)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.75),transparent_44%)]" />
            <div className="relative flex min-h-[29rem] flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                <span>EcoTwin Growth Chamber</span>
                <span className="text-brand-dark">Live</span>
              </div>

              <div className="relative mx-auto flex h-64 w-64 items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full bg-brand-primary/10 blur-2xl"
                  animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.8, 0.45] }}
                  transition={{ duration: 4.5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-6 rounded-full border border-slate-200 bg-white/55 backdrop-blur-xl"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-12 rounded-full border border-brand-primary/15 bg-gradient-to-b from-brand-light/80 to-white/75 backdrop-blur-md"
                  animate={{ y: [-2, 4, -2] }}
                  transition={{ duration: 4.8, repeat: Infinity }}
                />
                <motion.div
                  className="absolute bottom-8 left-8 flex items-center gap-2 rounded-full border border-brand-primary/20 bg-white/80 px-3 py-2 text-xs font-bold text-brand-dark shadow-sm backdrop-blur-xl"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity }}
                >
                  <Leaf className="h-3.5 w-3.5 text-brand-primary" />
                  Eco Seed
                </motion.div>
                <motion.div
                  className="absolute right-7 top-10 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-bold text-brand-dark backdrop-blur-xl"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.6, repeat: Infinity }}
                >
                  +42 growth points
                </motion.div>
                <motion.div
                  className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-dark text-white shadow-2xl shadow-brand-primary/20 overflow-hidden"
                  animate={{ scale: [1, 1.04, 1], boxShadow: ['0 0 0 rgba(34,197,94,0)', '0 0 35px rgba(34,197,94,0.35)', '0 0 0 rgba(34,197,94,0)'] }}
                  transition={{ duration: 3.8, repeat: Infinity }}
                >
                  <svg className="w-20 h-20 text-white" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="28" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
                    <circle cx="32" cy="32" r="24" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
                    <circle cx="32" cy="36" r="10" fill="url(#seedGradient)" />
                    <path d="M32 20C32 20 26 28 26 34C26 37.3137 28.6863 40 32 40C35.3137 40 38 37.3137 38 34C38 28 32 20 32 20Z" fill="url(#seedCore)" />
                    <path d="M32 22C34.5 17 38.5 16 38.5 16C38.5 16 36.5 20 34 22.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="seedGradient" x1="32" y1="26" x2="32" y2="46" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4ADE80" />
                        <stop offset="1" stopColor="#15803D" />
                      </linearGradient>
                      <linearGradient id="seedCore" x1="32" y1="20" x2="32" y2="40" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#F59E0B" />
                        <stop offset="1" stopColor="#22C55E" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ['Current Score', `${calculator.carbonScore}`],
                ['Future Score', `${calculator.futureScore}`],
                ['Carbon Reduction', `${calculator.carbonReduction} tons`],
              ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur-xl">
                    <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</div>
                    <div className="mt-1 text-2xl font-bold text-slate-950">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <motion.section
          className="grid gap-6 lg:grid-cols-2"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
        >
          <div className="rounded-[2rem] border border-slate-200 bg-white/65 p-6 backdrop-blur-xl">
            <div className="mb-6">
              <div className="section-kicker mb-2">Transformation simulator</div>
              <h2 className="panel-title">Move from Current You to Future EcoTwin.</h2>
            </div>
            <div className="grid gap-4">
              {[
                ['Transportation', transport, setTransport],
                ['Electricity Usage', electricity, setElectricity],
                ['Food Habits', food, setFood],
                ['Shopping Habits', shopping, setShopping],
              ].map(([label, value, setter]) => (
                <label key={label as string} className="grid gap-2">
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                    <span>{label as string}</span>
                    <span className="text-brand-dark">{value as number}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value as number}
                    onChange={(e) => (setter as Dispatch<SetStateAction<number>>)(Number(e.target.value))}
                    className="h-2 w-full appearance-none rounded-full bg-slate-200 accent-brand-primary"
                  />
                </label>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ['Current Score', calculator.carbonScore],
                ['Future Score', calculator.futureScore],
                ['Trees Saved', calculator.treesEquivalent],
                ['Carbon Cut', `${calculator.carbonReduction}t`],
              ].map(([label, value]) => (
                <div key={label as string} className="rounded-2xl border border-slate-200/70 bg-white/75 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">{label as string}</div>
                  <div className="mt-1 text-xl font-bold text-slate-950">{value as string | number}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-brand-primary/15 bg-brand-light/35 p-4">
              <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                <span>Sustainability potential</span>
                <span className="text-brand-dark">+{calculator.futureScore - calculator.carbonScore} score</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/80">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-dark"
                  animate={{ width: `${calculator.futureScore}%` }}
                  transition={{ duration: 0.45 }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white/65 p-6 backdrop-blur-xl">
            <div className="mb-6">
              <div className="section-kicker mb-2">Eco impact visualizer</div>
              <h2 className="panel-title">Tiny swaps, dramatic impact.</h2>
            </div>
            <div className="grid gap-3">
              {comparisonItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light/70 text-brand-dark">{item.icon}</div>
                    <div>
                      <div className="font-semibold text-slate-950">{item.label}</div>
                      <div className="text-sm text-slate-500">{item.note}</div>
                    </div>
                  </div>
                  <div className="w-28 overflow-hidden rounded-full bg-slate-200">
                    <motion.div
                      className="h-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-dark"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
        >
          <div className="rounded-[2rem] border border-slate-200 bg-white/65 p-6 backdrop-blur-xl">
            <div className="mb-6">
              <div className="section-kicker mb-2">Future Earth simulator</div>
              <h2 className="panel-title">Slide from today&apos;s world into a sustainable one.</h2>
            </div>
            <label className="block">
              <div className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>Current Lifestyle</span>
                <span>Sustainable Lifestyle</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={earthMode}
                onChange={(e) => setEarthMode(Number(e.target.value))}
                className="h-3 w-full appearance-none rounded-full bg-slate-200 accent-brand-primary"
              />
            </label>
            <div className="mt-6 rounded-[1.5rem] border border-slate-200/70 bg-gradient-to-br from-sky-100 via-white to-emerald-100 p-6">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                <span>Earth state</span>
                <span>{earthMode}% greener</span>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-white/75 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Trees</div>
                  <div className="mt-2 text-3xl font-bold text-brand-dark">{Math.round(earthGreen / 8)}</div>
                </div>
                <div className="rounded-2xl bg-white/75 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Pollution</div>
                  <div className="mt-2 text-3xl font-bold text-slate-950">{earthPollution}%</div>
                </div>
                <div className="rounded-2xl bg-white/75 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Carbon score</div>
                  <div className="mt-2 text-3xl font-bold text-slate-950">{clamp(100 - earthMode, 12, 90)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white/65 p-6 backdrop-blur-xl">
              <div className="mb-4">
                <div className="section-kicker mb-2">EcoTwin product demo</div>
                <h2 className="panel-title">Current user becomes your future EcoTwin.</h2>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 text-center">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Current user</div>
                  <div className="mt-4 text-5xl">🌱</div>
                </div>
                <ArrowUpRight className="h-6 w-6 rotate-45 text-brand-primary" />
                <div className="rounded-2xl border border-brand-primary/20 bg-brand-light/50 p-4 text-center">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-dark">Future EcoTwin</div>
                  <div className="mt-4 text-5xl">🌳</div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white/65 p-6 backdrop-blur-xl">
              <div className="mb-4">
                <div className="section-kicker mb-2">AI Eco Coach preview</div>
                <h2 className="panel-title">Ask better questions before you measure anything.</h2>
              </div>
              <div className="grid gap-3">
                {starterPrompts.map((prompt, idx) => (
                  <button
                    key={prompt}
                    onClick={() => setActivePrompt(idx)}
                    className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                      activePrompt === idx
                        ? 'border-brand-primary/25 bg-brand-light/45'
                        : 'border-slate-200/70 bg-white/80 hover:border-brand-primary/20'
                    }`}
                  >
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light/70 text-brand-dark">
                      {idx === 0 ? <Bot className="h-4 w-4" /> : <MessageSquareMore className="h-4 w-4" />}
                    </div>
                    <div className="text-sm font-medium text-slate-700">{prompt}</div>
                  </button>
                ))}
              </div>
              <motion.div
                key={activePrompt}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-4 rounded-2xl border border-brand-primary/15 bg-white/80 p-4 text-sm leading-6 text-slate-600"
              >
                {coachResponses[activePrompt]}
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="rounded-[2rem] border border-slate-200 bg-white/65 p-6 backdrop-blur-xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
        >
          <div className="mb-6">
            <div className="section-kicker mb-2">EcoTwin journey</div>
            <h2 className="panel-title">A living progression from seed to guardian.</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-5">
            {[
              ['Seed', '🌱', 'Learning the baseline', Sprout],
              ['Sprout', '🌿', 'Small changes begin to stick', Flower2],
              ['Explorer', '🍀', 'Testing better habits', Leaf],
              ['Tree', '🌳', 'Becoming visibly greener', TreePine],
              ['Guardian', '🌲', 'A climate leader emerges', Shield],
            ].map(([label, emoji, copy, Icon]) => (
              <div key={label as string} className="rounded-2xl border border-slate-200/70 bg-white/80 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-2xl">{emoji as string}</div>
                  <Icon className="h-4 w-4 text-brand-primary" />
                </div>
                <div className="mt-4 text-sm font-bold text-slate-950">{label as string}</div>
                <div className="mt-1 text-sm leading-6 text-slate-500">{copy as string}</div>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
