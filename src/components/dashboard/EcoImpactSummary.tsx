import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Leaf, Wind, Droplets, Recycle, TrendingUp, Award } from 'lucide-react';
import { calculateImpact } from '../../utils/dashboardStore';

interface EcoImpactSummaryProps {
  totalCO2SavedKg: number;
}

// ── Animated counter hook ───────────────────────────────────────────────────
function useCountUp(target: number, duration = 2000, inView = false) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setValue(parseFloat((target * eased).toFixed(1)));
      if (elapsed < 1) raf.current = requestAnimationFrame(step);
      else setValue(target);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, inView]);

  return value;
}

// ── Card definitions ────────────────────────────────────────────────────────
interface StatCard {
  key: string;
  label: string;
  emoji: string;
  Icon: React.ElementType;
  value: number;
  unit: string;
  description: string;
  iconBg: string;
  iconColor: string;
  accentColor: string;
  barColor: string;
  highlight: string;
  beforeLabel: string;
  afterLabel: string;
  beforeValue: string;
}

function buildCards(
  co2: number,
  trees: number,
  drivingKm: number,
  energyKwh: number
): StatCard[] {
  return [
    {
      key: 'trees',
      label: 'Trees Saved',
      emoji: '🌳',
      Icon: Leaf,
      value: trees,
      unit: trees === 1 ? 'tree' : 'trees',
      description: 'Trees worth of CO₂ absorbed from the atmosphere',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      accentColor: 'text-emerald-700',
      barColor: 'from-emerald-400 to-emerald-500',
      highlight: 'border-emerald-200',
      beforeLabel: 'Before EcoTwin',
      afterLabel: 'After EcoTwin',
      beforeValue: '0 trees',
    },
    {
      key: 'co2',
      label: 'CO₂ Reduced',
      emoji: '🌍',
      Icon: Wind,
      value: co2,
      unit: 'kg',
      description: 'Kilograms of CO₂ kept out of the atmosphere',
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-600',
      accentColor: 'text-sky-700',
      barColor: 'from-sky-400 to-sky-500',
      highlight: 'border-sky-200',
      beforeLabel: 'Before EcoTwin',
      afterLabel: 'After EcoTwin',
      beforeValue: '0 kg',
    },
    {
      key: 'water',
      label: 'Driving Avoided',
      emoji: '🚗',
      Icon: Droplets,
      value: drivingKm,
      unit: 'km',
      description: 'Equivalent car-driving kilometres avoided',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      accentColor: 'text-blue-700',
      barColor: 'from-blue-400 to-blue-500',
      highlight: 'border-blue-200',
      beforeLabel: 'Before EcoTwin',
      afterLabel: 'After EcoTwin',
      beforeValue: '0 km',
    },
    {
      key: 'energy',
      label: 'Energy Saved',
      emoji: '⚡',
      Icon: Recycle,
      value: energyKwh,
      unit: 'kWh',
      description: 'Kilowatt-hours of clean energy equivalent saved',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      accentColor: 'text-amber-700',
      barColor: 'from-amber-400 to-amber-500',
      highlight: 'border-amber-200',
      beforeLabel: 'Before EcoTwin',
      afterLabel: 'After EcoTwin',
      beforeValue: '0 kWh',
    },
  ];
}

// ── Single animated stat card ────────────────────────────────────────────────
function ImpactCard({ card, idx, inView }: { card: StatCard; idx: number; inView: boolean }) {
  const animatedValue = useCountUp(card.value, 2000 + idx * 150, inView);
  const displayValue  = Number.isInteger(card.value) ? Math.round(animatedValue) : animatedValue;
  const progressPct   = Math.min((card.value / Math.max(card.value * 1.25, 1)) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`
        relative bg-white rounded-2xl border ${card.highlight}
        shadow-sm hover:shadow-xl hover:shadow-slate-200/60
        p-5 md:p-6 flex flex-col gap-4 overflow-hidden
        transition-all duration-300 cursor-default
      `}
    >
      {/* Background emoji watermark */}
      <span className="absolute -bottom-2 -right-2 text-[72px] opacity-[0.04] select-none pointer-events-none leading-none">
        {card.emoji}
      </span>

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className={`w-11 h-11 ${card.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
          <card.Icon className={`w-5 h-5 ${card.iconColor}`} />
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mt-1">
          Impact
        </span>
      </div>

      {/* Main counter */}
      <div>
        <div className="flex items-baseline gap-2">
          <motion.span
            className={`text-3xl md:text-4xl font-black ${card.accentColor} tabular-nums leading-none`}
            key={inView ? 'active' : 'idle'}
          >
            {displayValue}
          </motion.span>
          <span className={`text-sm font-bold ${card.accentColor} opacity-70`}>{card.unit}</span>
        </div>
        <p className="text-[13px] font-semibold text-slate-800 mt-1">{card.label} {card.emoji}</p>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{card.description}</p>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progress</span>
          <span className={`text-[10px] font-extrabold ${card.accentColor}`}>
            {inView ? Math.round(progressPct) : 0}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${card.barColor}`}
            initial={{ width: 0 }}
            animate={inView ? { width: `${progressPct}%` } : { width: 0 }}
            transition={{ duration: 1.4, delay: 0.3 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* Before / After comparison */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
        <div className="flex-1 text-center">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{card.beforeLabel}</p>
          <p className="text-[13px] font-bold text-slate-400 mt-0.5">{card.beforeValue}</p>
        </div>
        <div className="flex flex-col items-center">
          <TrendingUp className="w-4 h-4 text-brand-primary" />
          <span className="text-[8px] font-extrabold text-brand-primary uppercase tracking-wider mt-0.5">Now</span>
        </div>
        <div className="flex-1 text-center">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{card.afterLabel}</p>
          <p className={`text-[13px] font-bold ${card.accentColor} mt-0.5`}>
            {displayValue} {card.unit}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function EcoImpactSummary({ totalCO2SavedKg }: EcoImpactSummaryProps) {
  const impact    = calculateImpact(totalCO2SavedKg);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView    = useInView(sectionRef, { once: true, margin: '-80px' });

  const cards = buildCards(
    impact.co2SavedKg,
    impact.treesEquivalent,
    impact.drivingKmAvoided,
    impact.energySavedKwh,
  );

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-label="Eco Impact Summary"
    >
      {/* Section header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-brand-primary" />
            <h2 className="text-[1.35rem] font-extrabold text-slate-800 tracking-tight">
              Your Eco Impact
            </h2>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Real-world difference you've made — feel the change, not just the numbers
          </p>
        </div>

        {/* Total CO₂ pill */}
        <div className="shrink-0 bg-brand-light border border-brand-primary/20 rounded-2xl px-4 py-2.5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Total Saved</p>
          <p className="text-lg font-black text-brand-dark leading-tight mt-0.5">
            {totalCO2SavedKg} <span className="text-xs font-bold">kg CO₂</span>
          </p>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <ImpactCard key={card.key} card={card} idx={idx} inView={inView} />
        ))}
      </div>

      {/* Bottom motivational banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-5 bg-gradient-to-r from-brand-light via-white to-brand-light
                   border border-brand-primary/20 rounded-2xl p-4
                   flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌍</span>
          <div>
            <p className="text-[13px] font-extrabold text-slate-800">
              Every action compounds
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              You're {impact.treesEquivalent > 0
                ? `equivalent to planting ${impact.treesEquivalent} tree${impact.treesEquivalent !== 1 ? 's' : ''} this year`
                : 'building momentum — keep going!'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-brand-primary/20 rounded-xl px-4 py-2 shrink-0">
          <TrendingUp className="w-4 h-4 text-brand-primary" />
          <span className="text-[12px] font-extrabold text-brand-dark">
            Growing impact 📈
          </span>
        </div>
      </motion.div>
    </motion.section>
  );
}
