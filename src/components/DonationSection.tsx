import React from 'react';
import { Heart, Sparkles, ArrowRight, ShieldCheck, Smartphone, CheckCircle2 } from 'lucide-react';
import { DONATION_PURPOSES, DonationPurpose } from '../types/donation';

interface DonationSectionProps {
  onOpenDonateWithPurpose: (purpose?: DonationPurpose) => void;
}

export const DonationSection: React.FC<DonationSectionProps> = ({ onOpenDonateWithPurpose }) => {
  return (
    <section id="donate-section" className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-coffee-950 via-[#1d0d06] to-coffee-950">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-saffron-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-500/10 border border-saffron-500/30 text-saffron-400 text-xs sm:text-sm font-semibold">
            <Heart size={16} className="fill-saffron-400" />
            <span>पावन दान एवं सेवा सहयोग (Online Sacred Seva)</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-black gold-gradient-text leading-tight">
            धर्म एवं जनसेवा हेतु ऑनलाइन दान करें
          </h2>

          <p className="text-sm sm:text-base text-gold-200/80 font-sans leading-relaxed">
            आश्रम निर्माण, गौशाला, अन्नदानम, वृद्धाश्रम एवं महावतार बाबाजी ध्यान केंद्र के विस्तार हेतु अपना पावन योगदान दें। प्रत्येक दान की स्वचालित डिजिटल रसीद (Automated Receipt) तुरंत प्राप्त करें।
          </p>
        </div>

        {/* DONATION CAUSES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {DONATION_PURPOSES.map((cause) => (
            <div
              key={cause.key}
              className="bg-gradient-to-b from-coffee-900/90 to-coffee-950/90 p-5 rounded-3xl border border-gold-500/30 hover:border-saffron-500/60 transition duration-300 shadow-xl flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="text-4xl mb-3 group-hover:scale-110 transition transform">{cause.icon}</div>
                <h3 className="font-serif font-bold text-lg text-gold-200 group-hover:text-saffron-400 transition">
                  {cause.labelHi}
                </h3>
                <p className="text-xs text-gold-300/70 mt-1 font-sans">
                  {cause.labelEn}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-gold-500/20 flex items-center justify-between">
                <span className="text-[11px] text-gold-300/60 font-semibold">80G टैक्स छूट मान्य</span>
                <button
                  type="button"
                  onClick={() => onOpenDonateWithPurpose(cause.key)}
                  className="px-3.5 py-1.5 bg-saffron-500/20 hover:bg-saffron-500 text-saffron-300 hover:text-coffee-50 border border-saffron-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>दान करें</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PROMINENT MAIN DONATE BANNER */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border-2 border-gold-500/50 shadow-[0_0_50px_rgba(212,175,55,0.25)] flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-saffron-400 font-bold">
              <ShieldCheck size={18} />
              <span>100% Verified Public Charitable Trust (Regd No: E-4092/2026)</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-gold-100">
              तत्काल दान करें एवं 80G टैक्स रसीद पाएं
            </h3>

            <p className="text-xs sm:text-sm text-gold-200/80 leading-relaxed font-sans">
              Pay via UPI (यू.पी.आई.) या डायरेक्ट बैंक ट्रांसफर द्वारा किसी भी राशि का दान दें। दान पूरा होते ही तुरंत 80G प्रमाणित PDF रसीद डाउनलोड करें।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => onOpenDonateWithPurpose()}
              className="px-8 py-4 bg-gradient-to-r from-saffron-500 via-gold-500 to-saffron-500 hover:from-saffron-400 hover:to-gold-400 text-coffee-50 font-black text-lg rounded-2xl shadow-2xl transition transform active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Heart size={22} className="fill-coffee-950" />
              <span>अभी दान करें (Donate Now)</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
