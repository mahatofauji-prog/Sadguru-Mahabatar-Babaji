import { motion } from 'motion/react';
import { Sparkles, HeartHandshake, Shield, Sun } from 'lucide-react';
import { useImageContext } from '../context/ImageContext';
import { useSiteContent } from '../context/SiteContentContext';
import { SingleImageUploader } from './ImageUploader';

export default function AboutSection() {
  const { images, getImageUrl } = useImageContext();
  const { content } = useSiteContent();

  return (
    <section id="about" className="py-24 bg-coffee-950 relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-saffron-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading & Subheading */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/30 bg-coffee-900/50 text-gold-400 text-xs font-semibold tracking-widest uppercase mb-4">
            <Sparkles size={14} className="text-saffron-400" />
            <span>{content.about.title}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold gold-gradient-text leading-tight mb-2">
            SADGURU MAHAVATAR BABAJI <br className="hidden md:block" /> SARAL DHYAN YOG PEETH
          </h2>
          <h3 className="font-sans text-2xl sm:text-3xl md:text-4xl font-bold text-gold-200 leading-tight mb-4 drop-shadow-md">
            सद्गुरु महावतार बाबाजी <br />
            सरल ध्यान योग पीठ
          </h3>

          <h3 className="font-serif text-xl sm:text-2xl text-saffron-400 font-medium tracking-wide">
            {content.about.subtitle}
          </h3>

          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Images Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-6 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-2xl overflow-hidden border-2 border-gold-500/40 shadow-[0_0_25px_rgba(212,175,55,0.2)] group relative w-full aspect-[3/4] sm:aspect-[4/5] bg-coffee-900 flex items-center justify-center"
            >
              <SingleImageUploader imageKey="aboutGuruji" label="गुरुजी फोटो बदलें" badgePosition="top-right">
                <img
                  src={getImageUrl('aboutGuruji') || '/assets/IMG-20260806-WA0004-3.jpg'}
                  alt="Guruji Image"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </SingleImageUploader>
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-950/90 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-3 left-3 right-3 text-center pointer-events-none">
                <span className="text-xs text-gold-300 font-semibold bg-coffee-900/80 px-2.5 py-1 rounded-full border border-gold-500/30 inline-block">
                  सदगुरू दर्शन
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="rounded-2xl overflow-hidden border-2 border-gold-500/40 shadow-[0_0_25px_rgba(212,175,55,0.2)] group relative w-full aspect-[3/4] sm:aspect-[4/5] bg-coffee-900 flex items-center justify-center"
            >
              <SingleImageUploader imageKey="aboutBabaji" label="बाबाजी फोटो बदलें" badgePosition="top-right">
                <img
                  src={getImageUrl('aboutBabaji') || '/assets/IMG-20260804-WA0009.jpg'}
                  alt="Mahavatar Babaji Shrine"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </SingleImageUploader>
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-950/90 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-3 left-3 right-3 text-center pointer-events-none">
                <span className="text-xs text-saffron-300 font-semibold bg-coffee-900/80 px-2.5 py-1 rounded-full border border-saffron-500/30 inline-block">
                  महावतार बाबाजी
                </span>
              </div>
            </motion.div>
          </div>

          {/* Exact Introductory Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 bg-gradient-to-br from-coffee-900/70 via-coffee-950 to-divine-blue/80 p-8 sm:p-10 rounded-3xl border border-gold-500/30 shadow-2xl backdrop-blur-xl relative"
          >
            {/* Top lotus accent */}
            <div className="absolute -top-5 right-8 w-10 h-10 rounded-full bg-gold-500 text-coffee-50 flex items-center justify-center font-bold text-xl shadow-lg border-2 border-gold-200">
              🪷
            </div>

            <div className="space-y-6 text-lg sm:text-xl text-gold-100/90 font-serif leading-relaxed">
              <p className="font-semibold text-2xl text-gold-300 leading-snug border-b border-gold-500/20 pb-4">
                {content.about.description1}
              </p>

              <p className="text-gold-100/80 leading-relaxed font-sans text-base sm:text-lg">
                {content.about.description2}
              </p>

              <div className="p-6 rounded-2xl bg-gradient-to-r from-saffron-500/20 via-gold-500/10 to-transparent border-l-4 border-saffron-500 mt-6">
                <p className="font-serif text-2xl font-bold text-saffron-300">
                  "आइए, ध्यान करें और जीवन बदलें।"
                </p>
              </div>
            </div>

            {/* Core Values badges */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gold-500/20 text-center">
              <div className="flex flex-col items-center">
                <Sun className="text-gold-400 mb-1" size={24} />
                <span className="text-xs font-semibold text-gold-200">सहज ध्यान</span>
              </div>
              <div className="flex flex-col items-center">
                <Shield className="text-saffron-400 mb-1" size={24} />
                <span className="text-xs font-semibold text-gold-200">ऊर्जा कवच</span>
              </div>
              <div className="flex flex-col items-center">
                <HeartHandshake className="text-gold-400 mb-1" size={24} />
                <span className="text-xs font-semibold text-gold-200">समग्र जनसेवा</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
