import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Leaf, Droplets, Trees } from 'lucide-react';
import { calculateImpact } from '../../utils/dashboardStore';

interface FutureEarthSimulatorProps {
  totalCO2Saved: number;
}

export default function FutureEarthSimulator({ totalCO2Saved }: FutureEarthSimulatorProps) {
  const impact = calculateImpact(totalCO2Saved);
  const [counters, setCounters] = useState({
    currentAQI: 95,
    futureAQI: 95,
    currentCO2: 8.5,
    futureCO2: 8.5,
    trees: 0,
    waterSaved: 0
  });

  useEffect(() => {
    // Math simulations
    const targetFutureAQI = Math.max(38, Math.round(95 - totalCO2Saved * 0.12));
    const targetFutureCO2 = Math.max(2.8, Math.round((8.5 - totalCO2Saved * 0.005) * 10) / 10);
    const targetTrees = Math.max(2, impact.treesEquivalent);
    const targetWater = Math.max(120, Math.round(totalCO2Saved * 5.8));

    const duration = 1200;
    const steps = 25;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step += 1;
      const progress = Math.min(step / steps, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      setCounters({
        currentAQI: 95,
        futureAQI: Math.round(95 - (95 - targetFutureAQI) * eased),
        currentCO2: 8.5,
        futureCO2: Math.round((8.5 - (8.5 - targetFutureCO2) * eased) * 10) / 10,
        trees: Math.round(targetTrees * eased),
        waterSaved: Math.round(targetWater * eased)
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [totalCO2Saved, impact.treesEquivalent]);

  const cards = [
    {
      title: 'Air Quality Index',
      currentLabel: 'Current AQI',
      currentVal: `${counters.currentAQI}`,
      futureLabel: 'Future AQI',
      futureVal: `${counters.futureAQI}`,
      desc: 'Lower AQI indicates healthier, clearer urban atmospheres.',
      icon: <Wind className="w-5 h-5" />,
      colorClass: 'text-sky-500',
      bgClass: 'bg-sky-500/10',
      progress: Math.max(15, Math.round((counters.futureAQI / 95) * 100))
    },
    {
      title: 'Carbon Profile',
      currentLabel: 'Current CO₂',
      currentVal: `${counters.currentCO2} t/yr`,
      futureLabel: 'Future CO₂',
      futureVal: `${counters.futureCO2} t/yr`,
      desc: 'Annual greenhouse emissions per household.',
      icon: <Leaf className="w-5 h-5" />,
      colorClass: 'text-emerald-500',
      bgClass: 'bg-emerald-500/10',
      progress: Math.max(15, Math.round((counters.futureCO2 / 8.5) * 100))
    },
    {
      title: 'Green Coverage',
      currentLabel: 'Baseline',
      currentVal: '0 added',
      futureLabel: 'Ecosystem',
      futureVal: `+${counters.trees} Trees`,
      desc: 'Equivalent carbon absorption capacity planted.',
      icon: <Trees className="w-5 h-5" />,
      colorClass: 'text-green-600',
      bgClass: 'bg-green-600/10',
      progress: Math.min(100, Math.round((counters.trees / 25) * 100))
    },
    {
      title: 'Water Protection',
      currentLabel: 'Baseline',
      currentVal: '0 Saved',
      futureLabel: 'Saved',
      futureVal: `${counters.waterSaved.toLocaleString()} L`,
      desc: 'Annual clean water preserved via home habits.',
      icon: <Droplets className="w-5 h-5" />,
      colorClass: 'text-blue-500',
      bgClass: 'bg-blue-500/10',
      progress: Math.min(100, Math.round((counters.waterSaved / 1500) * 100))
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-1">
        <span className="section-kicker text-xs uppercase tracking-widest text-brand-dark">Simulator</span>
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">Future Earth Simulator</h2>
        <p className="text-sm text-slate-500">
          Environmental Transformation Preview: Compare your baseline metrics against optimized habits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            className="glass-elevated rounded-3xl p-5 border border-slate-200 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            <div>
              {/* Header Icon + Title */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className={`p-2 rounded-xl ${card.bgClass} ${card.colorClass}`}>
                  {card.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-700">{card.title}</h3>
              </div>

              {/* Comparisons */}
              <div className="grid grid-cols-2 gap-2 mt-4 mb-4">
                <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200/20">
                  <span className="text-[10px] text-slate-500 block font-semibold">{card.currentLabel}</span>
                  <span className="text-sm font-bold text-slate-600 block mt-0.5">{card.currentVal}</span>
                </div>
                <div className="bg-brand-primary/5 p-2.5 rounded-xl border border-brand-primary/10">
                  <span className="text-[10px] text-brand-dark block font-bold">{card.futureLabel}</span>
                  <span className="text-sm font-black text-brand-dark block mt-0.5">{card.futureVal}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                {card.desc}
              </p>
            </div>

            {/* Micro Graph representation */}
            <div className="mt-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1.5 uppercase">
                <span>Projection</span>
                <span className="text-brand-dark">{card.progress}% optimized</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${card.progress}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
