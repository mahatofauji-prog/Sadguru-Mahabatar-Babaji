import { motion } from 'motion/react';
import { Quote, Sparkles, Star } from 'lucide-react';
import { useImageContext } from '../context/ImageContext';

export default function Testimonials() {
  const { getImageUrl } = useImageContext();

  const testimonials = [
    {
      quote: "ध्यान से मेरे जीवन में बहुत सकारात्मक बदलाव आया है। मन शांत रहता है और काम में एकाग्रता बढ़ी है।",
      name: "विजय पाटिल",
      city: "नाशिक",
      img: getImageUrl('testimonial1') || "/assets/indian_sadhak_new1.jpg",
      role: "साधक"
    },
    {
      quote: "यहाँ सिखाई गई साधना सरल और प्रभावी है। रोजमर्रा के जीवन में आनंद और समाधान मिलता है।",
      name: "स्वाति जोशी",
      city: "पुणे",
      img: getImageUrl('testimonial2') || "/assets/indian_sadhika_new2.jpg",
      role: "साधिका"
    },
    {
      quote: "महावतार बाबाजी की कृपा से मुझे सही मार्ग मिला। यह संस्था बहुत प्रेरणादायक है।",
      name: "राहुल देशमुख",
      city: "औरंगाबाद",
      img: getImageUrl('testimonial3') || "/assets/indian_sadhak_new3.jpg",
      role: "साधक"
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-coffee-950 via-coffee-900 to-coffee-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-gold-500/30 bg-coffee-900/60 text-gold-400 text-xs font-semibold tracking-widest uppercase mb-3">
            <Sparkles size={14} className="text-saffron-400" />
            <span>साधक अनुभव</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold gold-gradient-text">
            🪷 साधक अनुभव (Sadhak Testimonials) 🪷
          </h2>
          <p className="text-sm text-gold-200/80 mt-2 font-sans">
            Real experiences of peace, healing, and spiritual transformation through Saral Dhyan Yog.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="glass-card-glow p-8 rounded-3xl relative border-2 border-gold-500/30 flex flex-col justify-between"
            >
              <Quote size={40} className="text-gold-500/20 absolute top-6 left-6" />

              <div>
                <div className="flex items-center gap-1 text-gold-400 mb-4 pt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-gold-400" />
                  ))}
                </div>

                <p className="text-gold-100/90 font-serif text-base leading-relaxed mb-8 relative z-10">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-gold-500/20 pt-6">
                <img
                  src={t.img}
                  alt={t.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border-2 border-gold-400 shadow-lg"
                />
                <div>
                  <h4 className="font-serif font-bold text-gold-300 text-lg">{t.name}</h4>
                  <span className="text-xs text-saffron-400 font-semibold">{t.role} • {t.city}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
