import { motion } from 'motion/react';
import { Sparkles, ChevronDown, Heart, Compass, ShieldCheck, Award } from 'lucide-react';
import { useImageContext } from '../context/ImageContext';
import { useSiteContent } from '../context/SiteContentContext';
import { SingleImageUploader } from './ImageUploader';

interface HeroProps {
  onOpenDonate: () => void;
  onOpenContact: () => void;
  onOpenMembership?: () => void;
}

export default function Hero({ onOpenDonate, onOpenMembership }: HeroProps) {
  const { images, getImageUrl } = useImageContext();
  const { content } = useSiteContent();

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-6 sm:pt-10 md:pt-14 pb-12 overflow-hidden bg-[#120804] text-[#FFF9E1]">
      {/* Background Image: Himalayan Divine Temple & Sunrise Rays */}
      <div className="absolute inset-0 z-0 group">
        <SingleImageUploader imageKey="heroBg" label="बैकग्राउंड फोटो बदलें" badgePosition="top-right">
          <img
            src={getImageUrl('heroBg') || '/hero-bg.jpg'}
            alt="Sadguru Mahavatar Babaji Divine Background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-80 scale-100 transition-all duration-700 absolute inset-0"
          />
        </SingleImageUploader>
        {/* Subtle Gradients to Ensure Text Legibility while Keeping Image Clear */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#120804]/90 via-[#120804]/70 to-[#120804]/80 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#120804] via-transparent to-[#120804]/75 pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FFD700]/15 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-[#FF8000]/15 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col gap-8">
        {/* Top Row: Main Title on Left, Round Shape Portrait on RIGHT */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center justify-between w-full">
          {/* Main Title on Left */}
          <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start min-w-0 w-full">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/50 bg-[#2c1a15]/90 backdrop-blur-md text-[#FFD700] text-xs font-medium tracking-widest uppercase mb-4"
            >
              <Sparkles size={14} className="text-[#FF9933]" />
              <span>{content.hero.badgeText}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
            >
              <span className="block bg-gradient-to-r from-[#FFF9E1] via-[#FFD700] to-[#D4AF37] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">
                SADGURU MAHAVATAR BABAJI
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl text-[#FF9933] font-semibold mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                SARAL DHYAN YOG PEETH
              </span>
              
              {/* Hindi Text Addition */}
              <span className="block text-xl sm:text-2xl lg:text-3xl text-[#FFE099] font-bold mt-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-sans">
                सद्गुरु महावतार बाबाजी
              </span>
              <span className="block text-lg sm:text-xl lg:text-2xl text-[#FF8000] font-semibold mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-sans">
                सरल ध्यान योग पीठ
              </span>
            </motion.h1>
          </div>

          {/* Round Portrait Image Section on RIGHT */}
          <div className="w-full md:w-[45%] lg:w-[40%] xl:w-[35%] flex justify-center md:justify-end relative shrink-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px] mx-auto md:ml-auto md:mr-0 flex flex-col items-center"
            >
              {/* Glowing Backdrop */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D4AF37]/35 via-[#FF8000]/25 to-transparent blur-xl"></div>

              {/* Main Round Portrait Frame */}
              <SingleImageUploader imageKey="heroPortrait" label="फोटो बदलें" badgePosition="top-right">
                <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 mx-auto rounded-full p-2 bg-gradient-to-br from-[#FFD700] via-[#D4AF37] to-[#FF8000] shadow-[0_0_50px_rgba(212,175,55,0.5)]">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#120804] bg-[#2c1a15]">
                    <img
                      src={getImageUrl('heroPortrait') || '/assets/IMG-20260806-WA0004.jpg'}
                      alt="Sadguru Mahavatar Babaji & Guruji"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </SingleImageUploader>

              {/* Floating Badge */}
              <div className="mt-4 px-3.5 py-1.5 rounded-full bg-[#2c1a15]/95 border border-[#FFD700] text-[#FFE099] text-xs font-semibold tracking-wider flex items-center gap-1.5 shadow-2xl backdrop-blur-md whitespace-nowrap z-10">
                <Sparkles size={14} className="text-[#FF9933]" />
                <span>अनंत चैतन्य गुरु परंपरा</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section: Full-width Text, Quotation & CTA Buttons BELOW the top section */}
        <div className="w-full text-center md:text-left bg-[#120804]/85 p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/30 backdrop-blur-md shadow-2xl">
          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-[#FFE099] font-serif font-medium tracking-wide mb-5 leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
          >
            {content.hero.subtitle}
          </motion.p>

          {/* Tagline / Quotation */}
          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-sm sm:text-base md:text-lg text-[#FF9933] font-light bg-[#2c1a15]/80 border-l-4 border-[#D4AF37] p-4 rounded-r-xl mb-8 backdrop-blur-md shadow-lg max-w-4xl"
          >
            "{content.hero.quoteText}"
          </motion.blockquote>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-start items-center"
          >
            <a
              href="#saral-dhyan"
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-[#FF8000] via-[#FFD700] to-[#D4AF37] text-[#120804] font-bold text-xs sm:text-sm tracking-wider shadow-[0_0_25px_rgba(255,153,51,0.5)] hover:shadow-[0_0_35px_rgba(255,215,0,0.7)] hover:scale-105 transition-all flex items-center gap-2"
            >
              <Compass size={18} />
              <span>साधना शुरू करें (Begin Practice)</span>
            </a>

            {onOpenMembership && (
              <button
                onClick={onOpenMembership}
                className="px-5 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#FF8000] text-[#120804] hover:brightness-110 font-bold text-xs sm:text-sm tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.5)] hover:shadow-[0_0_30px_rgba(255,153,51,0.6)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Award size={18} />
                <span>सदस्यता प्रमाणपत्र (Membership Certificate)</span>
              </button>
            )}

            <a
              href="#vision"
              className="px-5 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-[#2c1a15]/90 border border-[#D4AF37]/60 text-[#FFE099] hover:bg-[#D4AF37]/20 font-bold text-xs sm:text-sm tracking-wider transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <ShieldCheck size={18} className="text-[#FFD700]" />
              <span>वैश्विक दृष्टि (Global Vision)</span>
            </a>

            <button
              onClick={onOpenDonate}
              className="px-5 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-[#2c1a15]/90 border border-[#FF8000]/70 text-[#FF9933] hover:bg-[#FF8000]/20 font-bold text-xs sm:text-sm tracking-wider transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <Heart size={18} className="fill-[#FF8000]/30 text-[#FF9933]" />
              <span>पावन दान (Donate)</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center text-[#FFD700]/80 text-xs tracking-widest uppercase cursor-pointer"
        onClick={() => {
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="mb-1 text-[10px]">नीचे जाएँ (Scroll)</span>
        <ChevronDown size={18} />
      </motion.div>
    </section>
  );
}
