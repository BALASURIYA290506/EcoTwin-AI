import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { useMemo } from 'react';


const LEAF_EMOJIS = ['🍃', '🌿', '🌱', '🍂', '✨', '🌟', '🍀'];

interface FutureSelfAvatarSVGProps {
  stage: 'seed' | 'sprout' | 'explorer' | 'tree' | 'guardian';
  className?: string;
  size?: number;
}

export function LeafParticle({ delay, index }: { delay: number; index: number }) {
  const { destX, destY, emoji, size, duration, rotate } = useMemo(() => {
    const angle = (index / 36) * 2 * Math.PI;
    const speed = 70 + Math.random() * 95;
    const destX = Math.cos(angle) * speed;
    const destY = Math.sin(angle) * speed - 50; // drift upward
    const emoji = LEAF_EMOJIS[Math.floor(Math.random() * LEAF_EMOJIS.length)];
    const size = 12 + Math.random() * 18;
    const duration = 1.4 + Math.random() * 0.8;
    const rotate = (Math.random() - 0.5) * 720;
    return { destX, destY, emoji, size, duration, rotate };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
      animate={{
        scale: [0, 1, 1, 0],
        opacity: [1, 1, 0.7, 0],
        x: destX,
        y: destY,
        rotate: [0, rotate],
      }}
      transition={{ duration, delay, ease: "easeOut" }}
      className="absolute"
      style={{ fontSize: size }}
    >
      {emoji}
    </motion.div>
  );
}

export default function FutureSelfAvatarSVG({ stage, className = '', size = 120 }: FutureSelfAvatarSVGProps) {
  // Common animations
    const breatheTransition: Transition = {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  };

  const rotateTransition: Transition = {
    duration: 12,
    repeat: Infinity,
    ease: "linear"
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {stage === 'seed' && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Glass Sphere Outer */}
          <circle cx="50" cy="50" r="40" stroke="#4ADE80" strokeWidth="2" strokeOpacity="0.4" />
          <circle cx="50" cy="50" r="38" fill="url(#glassGrad)" fillOpacity="0.15" />
          
          {/* Rotating energy track */}
          <motion.circle 
            cx="50" cy="50" r="32" 
            stroke="url(#accentGrad)" strokeWidth="1" strokeDasharray="6 20" 
            animate={{ rotate: 360 }}
            transition={rotateTransition}
          />
          
          {/* Ambient light glow */}
          <motion.circle 
            cx="50" cy="58" r="14" 
            fill="#22C55E" fillOpacity="0.2" 
            filter="blur(6px)"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={breatheTransition}
          />

          {/* Golden Seed core */}
          <motion.path 
            d="M50 38C50 38 41 49 41 57C41 62 45 66 50 66C55 66 59 62 59 57C59 49 50 38 50 38Z" 
            fill="url(#seedCoreGrad)" 
            animate={{ scale: [1, 1.05, 1], y: [0, -1, 0] }}
            transition={breatheTransition}
          />

          {/* Tiny Sprout Leaf starting to emerge */}
          <motion.path 
            d="M50 42C53 36 58 35 58 35C58 35 55 40 52 43" 
            stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" 
            animate={{ rotate: [0, 4, 0] }}
            transition={breatheTransition}
          />
          
          <defs>
            <linearGradient id="glassGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" />
              <stop offset="1" stopColor="#22C55E" />
            </linearGradient>
            <linearGradient id="accentGrad" x1="18" y1="50" x2="82" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#22C55E" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="seedCoreGrad" x1="50" y1="38" x2="50" y2="66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop offset="1" stopColor="#22C55E" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {stage === 'sprout' && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Dirt Soil Pot base */}
          <ellipse cx="50" cy="74" rx="26" ry="10" fill="#3F2E23" />
          <ellipse cx="50" cy="74" rx="20" ry="7" fill="#2E2018" />

          {/* Growing Stem */}
          <path d="M50 74C50 74 48 50 50 36" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />
          <path d="M50 56C50 56 54 46 58 42" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />

          {/* Leaf Left */}
          <motion.path 
            d="M50 36C45 31 32 30 32 30C32 30 38 41 47 38Z" 
            fill="url(#leafGrad)" 
            animate={{ rotate: [0, -4, 0] }}
            transition={breatheTransition}
          />
          
          {/* Leaf Right */}
          <motion.path 
            d="M58 42C64 39 72 32 72 32C72 32 68 43 59 44Z" 
            fill="#86EFAC" 
            animate={{ rotate: [0, 5, 0] }}
            transition={{ ...breatheTransition, delay: 0.3 }}
          />

          {/* Aura background halo */}
          <circle cx="50" cy="40" r="18" stroke="#22C55E" strokeWidth="1" strokeDasharray="3 5" strokeOpacity="0.3" />

          <defs>
            <linearGradient id="leafGrad" x1="32" y1="30" x2="50" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4ADE80" />
              <stop offset="1" stopColor="#15803D" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {stage === 'explorer' && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Glowing Aura Spheres */}
          <circle cx="50" cy="50" r="36" fill="none" stroke="#22C55E" strokeWidth="1.5" strokeOpacity="0.25" />
          <motion.circle 
            cx="50" cy="50" r="42" 
            fill="none" stroke="#10B981" strokeWidth="1" strokeDasharray="4 12" strokeOpacity="0.4"
            animate={{ rotate: -360 }}
            transition={rotateTransition}
          />

          {/* Cute Eco-Explorer Badge Shield */}
          <motion.g
            animate={{ y: [0, -3, 0] }}
            transition={breatheTransition}
          >
            {/* Shield Outline */}
            <path d="M50 18L72 26V48C72 61 62 72 50 78C38 72 28 61 28 48V26L50 18Z" fill="url(#shieldGrad)" stroke="#FFFFFF" strokeWidth="2" />
            
            {/* Inside Leaf Emblem */}
            <path d="M50 32C50 32 40 42 40 50C40 55.5 44.5 60 50 60C55.5 60 60 55.5 60 50C60 42 50 32 50 32Z" fill="#FFFFFF" fillOpacity="0.25" />
            <path d="M50 36C50 36 43 44 43 50C43 53.8 46.1 57 50 57C53.9 57 57 53.8 57 50C57 44 50 36 50 36Z" fill="#15803D" />
            
            {/* Sparkle star */}
            <polygon points="50,23 52,27 56,28 52,30 50,34 48,30 44,28 48,27" fill="#F59E0B" />
          </motion.g>

          <defs>
            <linearGradient id="shieldGrad" x1="28" y1="18" x2="72" y2="78" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10B981" />
              <stop offset="0.5" stopColor="#22C55E" />
              <stop offset="1" stopColor="#15803D" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {stage === 'tree' && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Earth/soil platform */}
          <ellipse cx="50" cy="80" rx="36" ry="12" fill="url(#groundGrad)" />
          
          {/* Deep Roots */}
          <path d="M46 76C43 82 36 84 36 84" stroke="#482F24" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M54 76C57 82 64 84 64 84" stroke="#482F24" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M50 78V88" stroke="#482F24" strokeWidth="3" strokeLinecap="round" />

          {/* Mature Trunk */}
          <path d="M50 80C50 80 46 64 47 48" stroke="#6F4E37" strokeWidth="7.5" strokeLinecap="round" />
          <path d="M50 80C50 80 54 64 53 52" stroke="#5C3A21" strokeWidth="6" strokeLinecap="round" />

          {/* Rotating Ecosystem Aura */}
          <motion.ellipse 
            cx="50" cy="40" rx="34" ry="24" 
            stroke="#10B981" strokeWidth="1" strokeDasharray="3 7" strokeOpacity="0.4"
            animate={{ rotate: 360 }}
            transition={rotateTransition}
          />

          {/* Layered Foliage Leaves */}
          <motion.g
            animate={{ scale: [1, 1.03, 1] }}
            transition={breatheTransition}
          >
            {/* Top foliage circle */}
            <circle cx="50" cy="32" r="16" fill="#22C55E" />
            <circle cx="50" cy="32" r="16" fill="url(#foliageTop)" fillOpacity="0.5" />
            
            {/* Left foliage circle */}
            <circle cx="38" cy="44" r="14" fill="#15803D" />
            
            {/* Right foliage circle */}
            <circle cx="62" cy="44" r="14" fill="#4ADE80" />
            
            {/* Center crown */}
            <path d="M50 20C42 20 38 28 38 36C38 44 45 48 50 48C55 48 62 44 62 36C62 28 58 20 50 20Z" fill="url(#treeCoreGrad)" />
          </motion.g>

          <defs>
            <linearGradient id="groundGrad" x1="14" y1="80" x2="86" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#15803D" stopOpacity="0.8" />
              <stop offset="1" stopColor="#3F2E23" />
            </linearGradient>
            <radialGradient id="foliageTop" cx="50" cy="32" r="16" fx="46" fy="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#86EFAC" />
              <stop offset="1" stopColor="transparent" />
            </radialGradient>
            <linearGradient id="treeCoreGrad" x1="50" y1="20" x2="50" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4ADE80" />
              <stop offset="1" stopColor="#166534" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {stage === 'guardian' && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Double shield rings */}
          <motion.circle 
            cx="50" cy="50" r="46" 
            stroke="#22C55E" strokeWidth="1" strokeDasharray="5 15" strokeOpacity="0.3"

            animate={{ rotate: 360 }}
            transition={rotateTransition}
          />
          <motion.circle 
            cx="50" cy="50" r="42" 
            stroke="#F59E0B" strokeWidth="1" strokeDasharray="8 6" strokeOpacity="0.25"
            animate={{ rotate: -360 }}
            transition={{ ...rotateTransition, duration: 8 }}
          />

          {/* Futuristic Planet Guardian Base body */}
          <g filter="url(#glowGuardian)">
            {/* Glowing Angel Leaf Wings */}
            <motion.path 
              d="M50 45C38 35 20 30 14 36C8 42 12 60 26 65C38 68 46 56 50 45Z" 
              fill="url(#wingLeftGrad)"
              animate={{ rotate: [0, -3, 0], scale: [1, 1.02, 1] }}
              transition={breatheTransition}
            />
            <motion.path 
              d="M50 45C62 35 80 30 86 36C92 42 88 60 74 65C62 68 54 56 50 45Z" 
              fill="url(#wingRightGrad)"
              animate={{ rotate: [0, 3, 0], scale: [1, 1.02, 1] }}
              transition={{ ...breatheTransition, delay: 0.1 }}
            />

            {/* Glowing earth sphere in hands */}
            <motion.circle 
              cx="50" cy="52" r="10" 
              fill="url(#earthGrad)" 
              animate={{ scale: [1, 1.08, 1], y: [0, -1, 0] }}
              transition={breatheTransition}
            />
            {/* Green continents details */}
            <path d="M47 50C48 48 51 46 51 46C51 46 53 49 51 51C49 53 46 52 47 50Z" fill="#22C55E" />
            <path d="M52 54C53 53 55 54 57 53C57 55 55 57 53 57C51 57 51 55 52 54Z" fill="#15803D" />

            {/* Main torso guardian silhouette */}
            <path d="M44 76L50 60L56 76H44Z" fill="url(#bodyGrad)" />
            <circle cx="50" cy="42" r="5" fill="#FFFFFF" />
          </g>

          <defs>
            <filter id="glowGuardian" x="8" y="24" width="84" height="60" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="wingLeftGrad" x1="14" y1="36" x2="50" y2="65" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4ADE80" />
              <stop offset="1" stopColor="transparent" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="wingRightGrad" x1="86" y1="36" x2="50" y2="65" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10B981" />
              <stop offset="1" stopColor="transparent" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="earthGrad" x1="40" y1="42" x2="60" y2="62" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60A5FA" />
              <stop offset="1" stopColor="#1E3A8A" />
            </linearGradient>
            <linearGradient id="bodyGrad" x1="44" y1="60" x2="56" y2="76" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>
      )}
    </div>
  );
}
