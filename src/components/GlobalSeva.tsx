import { motion } from 'motion/react';
import { Sparkles, Heart, Flame, Shield, Home } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { useImageContext } from '../context/ImageContext';

interface GlobalSevaProps {
  onOpenDonate: () => void;
}

export default function GlobalSeva({ onOpenDonate }: GlobalSevaProps) {
  const { content } = useSiteContent();
  const { getImageUrl } = useImageContext();

  const sevaList = [
    {
      num: 'I',
      title: 'Trimbakeshwar & Nashik Sevashram (Guru Seva Dham)',
      hindiTitle: content.seva.seva1Title,
      desc: content.seva.seva1Desc,
      icon: <Home className="text-gold-400" size={28} />,
      image: getImageUrl('seva1Image')
    },
    {
      num: 'II',
      title: 'Indigenous Gaushala (Sovereign Cow Conservation)',
      hindiTitle: content.seva.seva2Title,
      desc: content.seva.seva2Desc,
      icon: <Shield className="text-saffron-400" size={28} />,
      image: getImageUrl('seva2Image')
    },
    {
      num: 'III',
      title: 'Elderly Sanctuary (Abhaya Dham)',
      hindiTitle: content.seva.seva3Title,
      desc: content.seva.seva3Desc,
      icon: <Heart className="text-gold-400" size={28} />,
      image: getImageUrl('seva3Image')
    },
    {
      num: 'IV',
      title: 'Abhedya Mantra Yajnas (Cosmic Sound Science)',
      hindiTitle: content.seva.seva4Title,
      desc: content.seva.seva4Desc,
      icon: <Flame className="text-saffron-400" size={28} />,
      image: getImageUrl('seva4Image')
    }
  ];

  const galleryImages = [
    getImageUrl('seva5Image'),
    getImageUrl('seva6Image'),
    getImageUrl('seva7Image')
  ].filter(Boolean);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-16">
          {sevaList.map((seva, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
              className="glass-card-glow rounded-3xl border-2 border-gold-500/30 flex flex-col justify-between group bg-coffee-950/80 shadow-xl relative overflow-hidden"
            >
              {seva.image && (
                <div className="h-64 sm:h-72 w-full overflow-hidden relative border-b border-gold-500/30 bg-coffee-950 flex items-center justify-center">
                  {/* Ambient Blurred Background to fill the entire box without gaps */}
                  <img
                    src={seva.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-45 scale-125 select-none pointer-events-none"
                  />
                  {/* Foreground Complete Uncropped Image */}
                  <img
                    src={seva.image}
                    alt={seva.hindiTitle}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/IMG-20260811-WA0042.jpg';
                    }}
                    className="w-full h-full object-contain relative z-10 p-1 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-coffee-950 via-coffee-950/40 to-transparent z-10 pointer-events-none"></div>
                </div>
              )}
              
              <div className="p-8 flex-1 flex flex-col">
                {/* Header with Icon and Numeral */}
                <div className="flex items-center justify-between mb-6 -mt-10 relative z-20">
                  <div className="px-3.5 py-1 rounded-full bg-coffee-900 border border-gold-500/40 text-gold-300 font-serif font-extrabold text-sm shadow-lg">
                    Seva {seva.num}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-coffee-900 border border-gold-400 flex items-center justify-center shadow-lg">
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
                <p className="text-gold-100/80 text-base leading-relaxed font-sans mb-8 flex-1">
                  {seva.desc}
                </p>

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
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Seva Gallery (remaining images) */}
        {galleryImages.length > 0 && (
          <div className="mt-8 border-t border-gold-500/20 pt-16">
            <div className="text-center mb-10">
               <h3 className="font-serif text-2xl text-gold-300 font-bold mb-2">सेवा कार्य दर्शन</h3>
               <p className="text-sm text-gold-200/70">Glimpses of Global Seva Initiatives</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {galleryImages.map((src, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="rounded-2xl overflow-hidden border border-gold-500/30 aspect-[4/3] group relative bg-coffee-950 flex items-center justify-center shadow-lg"
                >
                  <img
                    src={src}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-125 select-none pointer-events-none"
                  />
                  <img
                    src={src}
                    alt={`Seva Gallery ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain relative z-10 p-1 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-saffron-500/0 group-hover:bg-saffron-500/10 transition-colors duration-500 z-20 pointer-events-none"></div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
