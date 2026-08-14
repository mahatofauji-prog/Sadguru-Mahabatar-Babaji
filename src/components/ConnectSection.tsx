import { motion } from 'motion/react';
import { MapPin, Phone, MessageCircle, Mail, Heart, Sparkles, Send, Clock, ShieldCheck, Facebook, Youtube, Instagram } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { useImageContext } from '../context/ImageContext';

interface ConnectSectionProps {
  onOpenDonate: () => void;
  onOpenContact: () => void;
}

export default function ConnectSection({ onOpenDonate, onOpenContact }: ConnectSectionProps) {
  const { content } = useSiteContent();
  const { getImageUrl } = useImageContext();

  return (
    <section id="contact" className="py-24 bg-coffee-950 relative overflow-hidden">
      {/* Background Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold-500/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/30 bg-coffee-900/60 text-gold-400 text-xs font-semibold tracking-widest uppercase mb-4">
            <Sparkles size={14} className="text-saffron-400" />
            <span>{content.contact.title}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold gold-gradient-text leading-tight mb-4">
            ✨ Connect with the Source
          </h2>

          <p className="text-lg text-gold-200/90 font-serif max-w-2xl mx-auto">
            "{content.contact.subtitle}"
          </p>

          <div className="w-28 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Contact Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 glass-panel p-8 sm:p-10 rounded-3xl border-2 border-gold-500/30 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-serif text-2xl font-bold text-gold-400 mb-6 flex items-center gap-3">
                <span>सद्गुरु ध्यान पीठ संपर्क केंद्र</span>
              </h3>

              <div className="space-y-6 text-gold-100/90 text-base sm:text-lg">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-coffee-900 border border-gold-500/40 flex items-center justify-center shrink-0 mt-1">
                    <MapPin className="text-gold-400" size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gold-300 text-sm uppercase tracking-wider mb-1">स्थान व पता (Location)</h4>
                    <p className="leading-relaxed">
                      {content.contact.address}<br />
                      <span className="text-sm text-gold-200/70">त्र्यंबकेश्वर व नाशिक (Trimbakeshwar & Nashik, Maharashtra, India)</span>
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-coffee-900 border border-gold-500/40 flex items-center justify-center shrink-0 mt-1">
                    <Phone className="text-gold-400" size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gold-300 text-sm uppercase tracking-wider mb-1">फोन (Calling Contact)</h4>
                    <a href={`tel:${content.contact.phone1}`} className="text-lg font-bold text-gold-200 hover:text-gold-400 transition-colors">
                      {content.contact.phone1}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-coffee-900 border border-green-500/40 flex items-center justify-center shrink-0 mt-1">
                    <MessageCircle className="text-green-400" size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-green-400 text-sm uppercase tracking-wider mb-1">WhatsApp संदेश</h4>
                    <a
                      href={`https://wa.me/91${content.contact.whatsapp.replace(/\D/g,'')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-bold text-green-300 hover:text-green-200 transition-colors"
                    >
                      {content.contact.whatsapp}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-coffee-900 border border-gold-500/40 flex items-center justify-center shrink-0 mt-1">
                    <Mail className="text-gold-400" size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gold-300 text-sm uppercase tracking-wider mb-1">ईमेल (Official Email)</h4>
                    <a href={`mailto:${content.contact.email}`} className="text-base text-gold-200 hover:text-gold-400 transition-colors">
                      {content.contact.email}
                    </a>
                  </div>
                </div>

                {/* Daily Meditation Timings */}
                <div className="flex items-start gap-4 pt-4 border-t border-gold-500/20">
                  <div className="w-11 h-11 rounded-xl bg-coffee-900 border border-saffron-500/40 flex items-center justify-center shrink-0 mt-1">
                    <Clock className="text-saffron-400" size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-saffron-400 text-sm uppercase tracking-wider mb-1">ऑनलाइन व ऑफलाइन ध्यान सत्र</h4>
                    <p className="text-sm text-gold-100/90">
                      प्रतिदिन प्रातः 5:30 से 6:00 (Daily Morning 5:30 AM - 6:00 AM)<br />
                      रविवार विशेष निःशुल्क ध्यान शिविर
                    </p>
                  </div>
                </div>

                {/* Social Media Channels */}
                <div className="pt-4 border-t border-gold-500/20">
                  <h4 className="font-bold text-gold-300 text-sm uppercase tracking-wider mb-3">
                    सोशल मीडिया चैनल (Official Channels)
                  </h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href="https://www.facebook.com/share/19CFfqRdex/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-coffee-900 border border-blue-500/40 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <Facebook size={16} />
                      <span>Facebook</span>
                    </a>
                    <a
                      href="https://youtube.com/@dr.nirmalgirimaharaj?si=gWx7yYJGfZ42bGA0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-coffee-900 border border-red-500/40 text-red-400 hover:bg-red-600 hover:text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <Youtube size={16} />
                      <span>YouTube</span>
                    </a>
                    <a
                      href="https://www.instagram.com/mahamandaleshwar_drnnirmalgiri?igsh=MW5mcTBhNGsxZ2Jreg=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-coffee-900 border border-pink-500/40 text-pink-400 hover:bg-gradient-to-tr hover:from-amber-500 hover:to-pink-500 hover:text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <Instagram size={16} />
                      <span>Instagram</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 pt-6 border-t border-gold-500/20">
              <button
                onClick={onOpenDonate}
                className="py-4 px-6 rounded-2xl bg-gradient-to-r from-saffron-500 via-gold-500 to-gold-400 text-coffee-50 font-bold text-base shadow-[0_0_20px_rgba(255,153,51,0.4)] hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart size={20} className="fill-coffee-950" />
                <span>पावन दान (Donate)</span>
              </button>

              <button
                onClick={onOpenContact}
                className="py-4 px-6 rounded-2xl bg-coffee-900/90 border-2 border-gold-500 text-gold-300 hover:bg-gold-500 hover:text-coffee-50 font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Send size={20} />
                <span>संदेश भेजें (Message Us)</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: QR Code & Direct Whatsapp Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 glass-panel p-6 sm:p-10 rounded-3xl border-2 border-gold-500/40 flex flex-col items-center justify-center text-center shadow-2xl relative"
          >
            {/* Top Badge: Certified Spiritual Center (Normal Flow, No Overlap) */}
            <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-saffron-500/20 border border-saffron-500/40 text-saffron-300 text-[11px] sm:text-xs font-semibold tracking-wide mb-4 sm:mb-5 max-w-full shadow-sm">
              <ShieldCheck size={14} className="text-saffron-400 shrink-0" />
              <span>प्रमाणित आध्यात्मिक केंद्र</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gold-300 mb-2.5 leading-tight">
              तुरंत WhatsApp से जुड़ें
            </h3>
            <p className="text-xs sm:text-sm text-gold-200/80 mb-6 max-w-md font-sans leading-relaxed">
              Scan the QR Code to join our official Saral Dhyan Yog WhatsApp channel and receive daily meditation guidance.
            </p>

            {/* QR Code Container */}
            <div className="p-3.5 sm:p-4 bg-white rounded-2xl border-4 border-gold-500 shadow-[0_0_25px_rgba(212,175,55,0.3)] mb-6 flex items-center justify-center">
              <img
                src={getImageUrl('whatsappQr') || '/assets/whatsapp_qr.jpg'}
                alt="WhatsApp QR Code"
                className="w-36 h-36 sm:w-44 sm:h-44 max-w-full h-auto object-contain mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>

            <a
              href="https://wa.me/919422163066"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm sm:text-base shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-105 mb-4"
            >
              <MessageCircle size={20} />
              <span>Direct WhatsApp Chat (+91 94221 63066)</span>
            </a>

            <p className="text-xs text-gold-300/60 font-serif">
              "ध्यान मार्ग पर प्रथम कदम बढ़ाएँ — महावतार बाबाजी की कृपा सर्वत्र उपलब्ध है।"
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
