import { motion } from 'motion/react';
import { Sparkles, Heart, Flame, Shield, Home } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface GlobalSevaProps {
  onOpenDonate: () => void;
}

export default function GlobalSeva({ onOpenDonate }: GlobalSevaProps) {
  const { content } = useSiteContent();

  const sevaList = [
    {
      num: 'I',
      title: 'Trimbakeshwar & Nashik Sevashram (Guru Seva Dham)',
      hindiTitle: content.seva.seva1Title,
      desc: content.seva.seva1Desc,
      icon: <Home className="text-gold-400" size={28} />
    },
    {
      num: 'II',
      title: 'Indigenous Gaushala (Sovereign Cow Conservation)',
      hindiTitle: content.seva.seva2Title,
      desc: content.seva.seva2Desc,
      icon: <Shield className="text-saffron-400" size={28} />
    },
    {
      num: 'III',
      title: 'Elderly Sanctuary (Abhaya Dham)',
      hindiTitle: content.seva.seva3Title,
      desc: content.seva.seva3Desc,
      icon: <Heart className="text-gold-400" size={28} />
    },
    {
      num: 'IV',
      title: 'Abhedya Mantra Yajnas (Cosmic Sound Science)',
      hindiTitle: content.seva.seva4Title,
      desc: content.seva.seva4Desc,
      icon: <Flame className="text-saffron-400" size={28} />
    }
  ];

  return (
    <section id="seva" className="py-24 bg-gradient-to-b from-coffee-950 via-coffee-900 to-coffee-950 relative overflow-hidden">
      {/* Radial Lights */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-saffron-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Exact Heading */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-saffron-500/40 bg-coffee-900/60 text-saffron-400 text-xs font-semibold tracking-widest uppercase mb-4">
            <Sparkles size={14} className="text-gold-400" />
            <span>जनसेवा व धर्म कार्य</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold gold-gradient-text leading-tight mb-4">
            🛠️ {content.seva.title}
          </h2>

          <p className="text-base sm:text-lg text-gold-200/80 font-sans max-w-2xl mx-auto">
            {content.seva.subtitle}
          </p>

          <div className="w-28 h-1 bg-gradient-to-r from-transparent via-saffron-500 to-transparent mx-auto mt-6"></div>
        </div>

        {/* 4 Cards Grid - 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {sevaList.map((seva, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
              className="glass-card-glow rounded-3xl p-8 border-2 border-gold-500/30 flex flex-col justify-between group bg-coffee-950/80 shadow-xl relative overflow-hidden"
            >
              <div>
                {/* Header with Icon and Numeral */}
                <div className="flex items-center justify-between mb-6">
                  <div className="px-3.5 py-1 rounded-full bg-coffee-900 border border-gold-500/40 text-gold-300 font-serif font-extrabold text-sm shadow-md">
                    Seva {seva.num}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-coffee-900 border border-gold-400 flex items-center justify-center shadow-md">
                    {seva.icon}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="font-serif text-2xl font-bold text-gold-300 mb-2 leading-snug">
                  {seva.num}. {seva.title}
                </h3>
                <span className="text-xs font-semibold text-saffron-400 block mb-4">
                  {seva.hindiTitle}
                </span>

                <p className="text-gold-100/80 text-base leading-relaxed font-sans mb-8">
                  {seva.desc}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-gold-500/10">
                <button
                  onClick={onOpenDonate}
                  className="w-full py-3.5 px-4 rounded-xl bg-coffee-900/90 border border-gold-500/40 text-gold-300 hover:bg-gold-500 hover:text-coffee-50 font-bold text-sm tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Heart size={16} className="fill-current text-saffron-500 group-hover:text-coffee-50" />
                  <span>इस सेवा में सहयोग करें (Support Seva)</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
