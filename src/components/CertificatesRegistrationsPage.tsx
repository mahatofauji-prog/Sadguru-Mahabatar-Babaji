import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  ShieldCheck, 
  Award,
  Heart
} from 'lucide-react';
import { CERTIFICATE_DEFINITIONS } from '../types/certificate';

interface CertificatesRegistrationsPageProps {
  onBackToHome: () => void;
  onOpenDonate: () => void;
  onOpenContact: () => void;
}

export default function CertificatesRegistrationsPage({
  onBackToHome,
  onOpenDonate,
  onOpenContact,
}: CertificatesRegistrationsPageProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="py-24 bg-gradient-to-b from-coffee-950 via-coffee-900 to-coffee-950 relative overflow-hidden min-h-screen">
      {/* Background Ornaments / Radial Lights */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-saffron-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <button
            onClick={onBackToHome}
            id="back-to-home-btn"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-coffee-900/80 border border-gold-500/40 text-coffee-200 hover:text-coffee-50 hover:border-gold-500 hover:bg-coffee-900 transition-all text-xs font-bold shadow-md cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>मुखपृष्ठ (Back to Home)</span>
          </button>
        </motion.div>

        {/* Page Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-saffron-500/40 bg-coffee-900/80 text-coffee-300 text-xs font-bold tracking-widest uppercase mb-4"
          >
            <ShieldCheck size={14} className="text-saffron-500" />
            <span>वैधता, पारदर्शिता एवं प्रमाण</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-coffee-100 leading-tight mb-4"
          >
            Our Certificates & Registrations
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-coffee-300 tracking-wide mb-3"
          >
            SADGURU MAHAAVTAR BABAJI SARAL DHYAN YOG PITH
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-base text-coffee-200 font-sans max-w-2xl mx-auto font-medium"
          >
            सद्गुरु देव भगवान के पावन आशीर्वाद से जन कल्याण एवं सेवा कार्यों के लिए पूर्ण रूप से पंजीकृत, पारदर्शी और समर्पित धार्मिक एवं आध्यात्मिक लोक-न्यास (Public Trust) की आधिकारिक जानकारी।
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-28 h-1 bg-gradient-to-r from-transparent via-saffron-500 to-transparent mx-auto mt-6"
          ></motion.div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CERTIFICATE_DEFINITIONS.map((cert, idx) => (
            <motion.div
              key={cert.id}
              id={`cert-card-${cert.id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card-glow rounded-3xl border-2 border-gold-500/30 bg-coffee-950/90 p-6 flex flex-col justify-between group hover:border-saffron-500/50 transition-all duration-300 shadow-xl"
            >
              <div>
                {/* Top Header inside Card */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-saffron-500/15 border border-saffron-500/40 flex items-center justify-center text-saffron-600 shrink-0">
                    <Award size={20} />
                  </div>
                  <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-coffee-300 bg-coffee-900/80 px-2.5 py-1 rounded-full border border-gold-500/30">
                    OFFICIAL REGISTRATION
                  </span>
                </div>

                {/* Title and Descriptions */}
                <h3 className="font-serif text-lg sm:text-xl font-bold text-coffee-100 group-hover:text-coffee-300 transition-colors mb-1">
                  {cert.name}
                </h3>
                <p className="text-[11px] text-coffee-400 font-mono font-bold tracking-wider uppercase mb-3">
                  {cert.englishName}
                </p>
                <p className="text-xs text-coffee-200 leading-relaxed mb-6 font-sans font-medium">
                  {cert.description}
                </p>

                {/* Registration Number Badge with Copy Button */}
                <div className="bg-coffee-900/60 border border-gold-500/35 rounded-xl p-4 flex items-center justify-between gap-3 shadow-inner">
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-coffee-400 font-bold block uppercase font-mono tracking-wider mb-0.5">पंजीकरण संख्या (Registration No.)</span>
                    <span className="text-base font-mono font-bold text-coffee-50 select-all block truncate tracking-wide">
                      {cert.number}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(cert.number, cert.id)}
                    className="p-2.5 rounded-lg hover:bg-gold-500/20 text-coffee-300 hover:text-coffee-100 transition-colors shrink-0 cursor-pointer"
                    title="कॉपी करें"
                  >
                    {copiedId === cert.id ? (
                      <Check size={18} className="text-emerald-500" />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call-to-Action Bottom Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-saffron-500/15 via-gold-500/10 to-saffron-500/15 border-2 border-gold-500/35 text-center max-w-4xl mx-auto backdrop-blur-md shadow-xl"
        >
          <Award className="text-gold-400 mx-auto mb-4 animate-bounce" size={40} />
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-coffee-100 mb-3">
            सत्यता, शुचिता एवं अटूट सेवा का पावन संकल्प
          </h3>
          <p className="text-xs sm:text-sm text-coffee-200 leading-relaxed font-sans max-w-2xl mx-auto mb-6 font-medium">
            श्री सरल ध्यान योग पीठ एक पंजीकृत लोक न्यास है जो बिना किसी व्यावसायिक लाभ के पूर्ण पारदर्शिता के साथ आध्यात्मिक उन्नति, सामूहिक ध्यान प्रचार, जन-सेवा, गऊशाला संचालन एवं धार्मिक आयोजनों का निर्वहन करता है। आपके द्वारा प्रदान किया गया सेवा सहयोग ८०जी (80G) के अंतर्गत आयकर छूट के लिए मान्य है।
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onOpenDonate}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-saffron-500 via-gold-500 to-gold-400 text-coffee-50 font-bold text-xs sm:text-sm shadow-lg hover:brightness-110 hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Heart size={14} className="fill-coffee-950" />
              <span>सहयोग दान करें (Donate Now)</span>
            </button>
            <button
              onClick={onOpenContact}
              className="px-6 py-2.5 rounded-full bg-transparent border border-gold-500/70 text-coffee-200 hover:bg-gold-500/15 font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>हमसे संपर्क करें (Contact Us)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
