import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronDown, CheckCircle2 } from 'lucide-react';

interface SaralDhyanYogProps {
  onOpenDedicatedPage?: () => void;
}

export default function SaralDhyanYog({ onOpenDedicatedPage }: SaralDhyanYogProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const benefits = [
    {
      num: '01',
      emoji: '🧠',
      title: 'Mental Clarity & Stress Reduction',
      hindiTitle: 'मानसिक स्पष्टता व तनाव मुक्ति',
      desc: 'Quiets overactive thoughts, reduces anxiety, and enhances focus through natural breath-based awareness.',
      details: 'Through simple breath-synchronized stillness, the brain transitions from frantic Beta waves to calm Alpha and Theta waves, eliminating mental fatigue and anxiety.'
    },
    {
      num: '02',
      emoji: '⚡',
      title: 'Bio-Energetic Shielding',
      hindiTitle: 'ऊर्जा कवच व सुरक्षा',
      desc: 'Strengthens the subtle aura, shielding the body from negative environmental energies and stress.',
      details: 'Activates the pranic meridian system, sealing bio-field leaks so negative emotional charges or electromagnetic fatigue cannot deplete your inner vitality.'
    },
    {
      num: '03',
      emoji: '🪷',
      title: 'Emotional Balance',
      hindiTitle: 'भावनात्मक संतुलन व आनंद',
      desc: 'Harmonizes heart and mind, cultivating deep emotional resilience, forgiveness, and inner joy.',
      details: 'Releases suppressed emotional blocks, opening the Anahata (Heart) chakra to foster patience, deep self-love, and unconditional peace.'
    },
    {
      num: '04',
      emoji: '🌿',
      title: 'Physical Rejuvenation',
      hindiTitle: 'शारीरिक पुनरुज्जीवन व आरोग्य',
      desc: 'Deep relaxation lowers blood pressure, boosts immunity, and revitalizes cellular health.',
      details: 'Triggers the parasympathetic nervous system, lowering cortisol levels, accelerating cellular repair, and promoting deep restful sleep.'
    },
    {
      num: '05',
      emoji: '✨',
      title: 'Spiritual Awakening & Quantum Alignment',
      hindiTitle: 'आत्मजागृति व कॉस्मिक संरेखण',
      desc: 'Connects individual consciousness to the universal field, unlocking higher states of intuition and peace.',
      details: 'Establishes a direct channel to cosmic intelligence, facilitating spiritual evolution under the sacred lineage of Sadguru Mahavatar Babaji.'
    }
  ];

  return (
    <section id="saral-dhyan" className="py-24 bg-coffee-950 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gold-500/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Exact Heading */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/30 bg-coffee-900/60 text-gold-400 text-xs font-semibold tracking-widest uppercase mb-4">
            <Sparkles size={14} className="text-saffron-400" />
            <span>पावन साधना पद्धति</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold gold-gradient-text leading-tight mb-6">
            🧘 Saral Dhyan Yog: The Science of Quantum Stillness
          </h2>

          {/* Exact Description */}
          <p className="text-lg sm:text-xl text-gold-100/90 leading-relaxed font-sans max-w-3xl mx-auto bg-coffee-900/50 p-6 rounded-2xl border border-gold-500/30 backdrop-blur-md mb-6">
            Saral Dhyan Yog is an ancient, accessible, and scientifically grounded meditation technique that harmonizes the mind, body, and spirit. Designed for modern life, it allows practitioners to quiet mental chatter, balance bio-energy, and access states of deep peace effortlessly.
          </p>

          {onOpenDedicatedPage && (
            <button
              onClick={onOpenDedicatedPage}
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-saffron-500 via-gold-500 to-gold-400 text-coffee-50 font-bold text-sm sm:text-base shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:shadow-[0_0_30px_rgba(255,215,0,0.7)] hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={18} className="fill-coffee-950" />
              <span>विशेष पेज देखें: क्वांटम शून्यता और आंतरिक रूपांतरण का संपूर्ण विज्ञान →</span>
            </button>
          )}

          <div className="w-28 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-8"></div>
        </div>

        {/* 5 Numbered Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => {
            const isExpanded = expandedIndex === idx;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`glass-card-glow p-8 rounded-3xl relative flex flex-col justify-between transition-all duration-300 border-2 ${
                  isExpanded ? 'border-gold-400 bg-coffee-900/95 shadow-[0_0_30px_rgba(255,215,0,0.3)]' : 'border-gold-500/30'
                }`}
              >
                {/* Number Badge & Emoji */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-serif font-extrabold text-gold-500/40">
                      {benefit.num}
                    </span>
                    <span className="text-4xl p-2 bg-coffee-900/80 rounded-2xl border border-gold-500/20 shadow-md">
                      {benefit.emoji}
                    </span>
                  </div>

                  {/* Title & Hindi Subtitle */}
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-gold-300 mb-1">
                    {benefit.title}
                  </h3>
                  <span className="text-xs font-semibold text-saffron-400 block mb-4">
                    {benefit.hindiTitle}
                  </span>

                  {/* Exact Description */}
                  <p className="text-gold-100/80 text-sm sm:text-base leading-relaxed mb-6">
                    {benefit.desc}
                  </p>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-4 border-t border-gold-500/20 text-xs sm:text-sm text-gold-200/90 leading-relaxed font-sans bg-coffee-950/60 p-4 rounded-xl mb-4"
                      >
                        <div className="flex items-start gap-2">
                          <CheckCircle2 size={16} className="text-gold-400 mt-0.5 shrink-0" />
                          <span>{benefit.details}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Expand Toggle Button */}
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="mt-4 pt-4 border-t border-gold-500/15 flex items-center justify-between text-xs font-bold text-gold-400 hover:text-gold-200 transition-colors w-full cursor-pointer"
                >
                  <span>{isExpanded ? 'गहन विवरण छुपाएँ (Show Less)' : 'विस्तार से पढ़ें (Learn More)'}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-saffron-400' : ''}`}
                  />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
