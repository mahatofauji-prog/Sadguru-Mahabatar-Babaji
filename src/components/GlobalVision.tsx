import { motion } from 'motion/react';
import { Globe, Sparkles, Shield, Orbit, HeartHandshake } from 'lucide-react';

export default function GlobalVision() {
  const pillars = [
    {
      icon: <Orbit className="text-gold-400" size={28} />,
      title: 'Quantum Stillness',
      desc: 'Accessing deep meditative frequencies to quiet the mind and harmonize individual consciousness with universal energy.'
    },
    {
      icon: <Shield className="text-saffron-400" size={28} />,
      title: 'Bio-Energetic Shielding',
      desc: 'Strengthening human aura and energetic resilience against modern environmental stress, illness, and negativity.'
    },
    {
      icon: <Sparkles className="text-gold-400" size={28} />,
      title: 'Kriya Yog Synthesis',
      desc: 'Transmitting authentic, ancient breath-based Kriya techniques under the direct blessings of Sadguru Mahavatar Babaji.'
    },
    {
      icon: <HeartHandshake className="text-saffron-400" size={28} />,
      title: 'Sacred Seva & Yajnas',
      desc: 'Integrating spiritual awakening with cow conservation, elderly care homes, and Vedic sound frequency rituals for global peace.'
    }
  ];

  return (
    <section id="vision" className="py-24 bg-gradient-to-b from-coffee-950 via-coffee-900 to-coffee-950 relative overflow-hidden">
      {/* Background Mandala overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Exact Heading */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-saffron-500/40 bg-coffee-900/60 text-saffron-400 text-xs font-semibold tracking-widest uppercase mb-4">
            <Globe size={14} className="text-gold-400" />
            <span>वैश्विक दृष्टि</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold gold-gradient-text leading-tight mb-6">
            🌌 Our Global Vision: The Synthesis of Power and Grace
          </h2>

          <div className="w-28 h-1 bg-gradient-to-r from-transparent via-saffron-500 to-transparent mx-auto"></div>
        </div>

        {/* Main Exact Vision Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-panel p-8 sm:p-12 rounded-3xl border-2 border-gold-500/40 shadow-[0_0_40px_rgba(212,175,55,0.2)] relative mb-16 max-w-5xl mx-auto"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1 rounded-full bg-gradient-to-r from-gold-500 to-saffron-500 text-coffee-50 font-bold text-xs uppercase tracking-widest shadow-lg">
            Guiding Philosophy
          </div>

          <p className="font-serif text-xl sm:text-2xl lg:text-3xl text-gold-100 leading-relaxed text-center font-normal">
            "To awaken human consciousness through Quantum Stillness, Bio-Energetic Shielding, and Kriya Yog. We serve as a sanctuary of light, guiding souls to transcend stress, unlock inner vitality, and align with cosmic wisdom. Under the eternal guidance of Sadguru Mahavatar Babaji, our mission spans global peace, cow conservation, elderly care, and sacred Vedic Yajnas."
          </p>
        </motion.div>

        {/* Pillars Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="glass-card-glow p-6 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-xl bg-coffee-900/80 border border-gold-500/40 flex items-center justify-center mb-5 shadow-lg">
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-gold-400 mb-2">
                  {item.title}
                </h3>
                <p className="text-gold-100 font-medium text-sm leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
