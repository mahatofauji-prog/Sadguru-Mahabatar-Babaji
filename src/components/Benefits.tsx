import { Brain, Wind, Target, Heart, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const benefits = [
  {
    icon: <Brain size={24} className="text-gold-500 opacity-60" />,
    title: 'मनःशांति',
    desc: 'अशांत मन को शांति की गहराइयों में ले जाने का सरल मार्ग।',
  },
  {
    icon: <Wind size={24} className="text-gold-500 opacity-60" />,
    title: 'प्राणशक्ति',
    desc: 'आंतरिक ऊर्जा को जागृत कर जीवन में स्फूर्ति का संचार।',
  },
  {
    icon: <Target size={24} className="text-coffee-50" />,
    title: 'एकाग्रता',
    desc: 'ध्यान की शक्ति से चित्त की स्थिरता और तीव्र एकाग्रता प्राप्त करें।',
    highlight: true
  },
  {
    icon: <Heart size={24} className="text-gold-500 opacity-60" />,
    title: 'संतुलन',
    desc: 'भावनाओं पर नियंत्रण और जीवन में अद्भुत सामंजस्य।',
  },
  {
    icon: <Sparkles size={24} className="text-gold-500 opacity-60" />,
    title: 'आत्मजागृति',
    desc: 'स्वयं के दिव्य स्वरूप को जानने का आध्यात्मिक सफर।',
  },
];

export default function Benefits() {
  return (
    <div id="benefits" className="relative z-20 -mt-16 md:-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {benefits.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`group p-5 rounded-xl border flex flex-col items-center text-center gap-3 backdrop-blur-sm shadow-2xl transition-all ${
              b.highlight 
                ? 'bg-gold-500 border-gold-500 scale-105' 
                : 'bg-gradient-to-b from-coffee-900/80 to-coffee-950/90 border-gold-500/20 hover:-translate-y-2'
            }`}
          >
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center mb-1 ${
              b.highlight ? 'border-coffee-950' : 'border-gold-500'
            }`}>
              {b.icon}
            </div>
            <h3 className={`text-base font-bold ${b.highlight ? 'text-coffee-50' : 'text-gold-500'}`}>{b.title}</h3>
            <p className={`text-[10px] leading-relaxed ${b.highlight ? 'text-coffee-50/80' : 'text-gold-100/60'}`}>{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
