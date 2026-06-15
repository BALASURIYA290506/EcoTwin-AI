import { useState, useEffect } from 'react';
import { Footprints, Lightbulb, Droplet, Zap, Trash2, Utensils, Car, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EcoInsight {
  text: string;
  category: string;
  sub: string;
  iconType: 'footprints' | 'droplet' | 'zap' | 'waste' | 'food' | 'transport';
}

const INSIGHTS: EcoInsight[] = [
  {
    text: "Replacing one short car trip per week with walking could save 120kg CO₂ per year.",
    category: "Transport Shift",
    sub: "120kg CO₂ / yr",
    iconType: "transport",
  },
  {
    text: "Using a reusable bottle can prevent hundreds of plastic bottles from entering landfills.",
    category: "Waste Reduction",
    sub: "Zero waste",
    iconType: "waste",
  },
  {
    text: "Lowering your heating thermostat by just 1°C can reduce energy use and emissions by up to 10%.",
    category: "Energy Saving",
    sub: "10% energy saved",
    iconType: "zap",
  },
  {
    text: "Eating plant-based just one day a week saves approximately 350kg of CO₂ annually per person.",
    category: "Diet Shift",
    sub: "350kg CO₂ / yr",
    iconType: "food",
  },
  {
    text: "Turning off the tap while brushing your teeth can save up to 24 liters of water per day.",
    category: "Water Saving",
    sub: "24L water / day",
    iconType: "droplet",
  },
  {
    text: "Unplugging household appliances when not in use can save up to 10% on electricity bills.",
    category: "Energy Saving",
    sub: "Phantom load check",
    iconType: "zap",
  },
  {
    text: "Washing clothes at 30°C instead of higher temperatures uses around 40% less electricity.",
    category: "Eco Laundry",
    sub: "40% energy saved",
    iconType: "zap",
  }
];

export default function EcoInsightCard() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % INSIGHTS.length);
    }, 15000); // Rotate every 15s
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % INSIGHTS.length);
  };

  const current = INSIGHTS[index];

  const getIcon = (type: string) => {
    const iconClass = "w-5 h-5 text-brand-dark";
    switch (type) {
      case 'transport': return <Car className={iconClass} />;
      case 'waste': return <Trash2 className={iconClass} />;
      case 'zap': return <Zap className={iconClass} />;
      case 'food': return <Utensils className={iconClass} />;
      case 'droplet': return <Droplet className={iconClass} />;
      default: return <Footprints className={iconClass} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08 }}
      whileHover={{ y: -4 }}
      className="glass-elevated rounded-2xl p-6 md:p-7 border border-slate-200 smooth-transition hover-lift relative overflow-hidden"
    >
      {/* Ambient Gradient Backdrop */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-brand-primary/8 filter blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-24 rounded-full bg-brand-accent/5 filter blur-2xl pointer-events-none" />

      <div className="relative flex items-start gap-4">
        {/* Glowing Insight Icon */}
        <motion.div
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-light to-brand-primary/10 flex items-center justify-center text-brand-dark border border-brand-primary/25 shrink-0 glow-soft"
          animate={{
            boxShadow: [
              '0 0 0 rgba(34,197,94,0)',
              '0 0 20px rgba(34,197,94,0.3)',
              '0 0 0 rgba(34,197,94,0)',
            ],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Lightbulb className="w-6 h-6" />
        </motion.div>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <motion.span 
                  className="text-[11px] font-bold uppercase tracking-widest text-slate-400"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Environmental Insight
                </motion.span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/60 backdrop-blur-md border border-brand-primary/20 text-[11px] font-bold text-brand-dark glow-soft">
                  {getIcon(current.iconType)}
                  <span>{current.category}</span>
                </span>
                <span className="inline-flex items-center text-[10px] font-bold text-brand-dark bg-brand-light/50 border border-brand-primary/15 rounded-lg px-2 py-1">
                  {current.sub}
                </span>
              </div>

              <p className="text-base md:text-lg font-medium text-slate-700 leading-relaxed pr-8">
                {current.text}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Premium Indicator & Navigation */}
          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center gap-2">
              {INSIGHTS.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === index ? 'w-5 h-2 bg-gradient-to-r from-brand-primary to-brand-accent' : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to insight ${i + 1}`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
            
            <motion.button
              onClick={handleNext}
              className="ml-auto w-9 h-9 rounded-full border border-brand-primary/20 bg-white/70 backdrop-blur-md hover:bg-brand-light hover:border-brand-primary/40 flex items-center justify-center shrink-0 cursor-pointer hover-lift text-slate-600 hover:text-brand-dark"
              title="Next Insight"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

