import { motion } from 'motion/react';
import { Calendar, Clock, Users, Sparkles, CheckCircle, Shield } from 'lucide-react';

const programs = [
  { icon: <Calendar size={32} />, title: 'मुफ्त सरल ध्यान शिविर', desc: 'प्रत्येक रविवार' },
  { icon: <Clock size={32} />, title: 'ऑनलाइन ध्यान सत्र', desc: 'प्रतिदिन सुबह 5:30 से 6:00' },
  { icon: <Users size={32} />, title: 'नियमित वर्ग', desc: 'व प्रशिक्षण' },
  { icon: <Sparkles size={32} />, title: 'विशेष शिविर', desc: 'साधना व ध्यान प्रशिक्षण' },
];

export default function Programs() {
  return (
    <section id="programs" className="py-20 bg-coffee-950 text-gold-100 relative">
      <div className="absolute inset-0 bg-coffee-950 opacity-50 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-gold-500 text-2xl">🪷</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold gold-gradient-text">नियमित कार्यक्रम</h2>
            <span className="text-gold-500 text-2xl">🪷</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Programs Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {programs.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-gradient-to-b from-coffee-900/80 to-coffee-950/90 text-gold-100 rounded-xl p-8 text-center flex flex-col items-center border border-gold-500/20 backdrop-blur-sm hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)] transition-all hover:-translate-y-1"
              >
                <div className="text-gold-500 mb-4 bg-coffee-900/50 p-4 rounded-full border border-gold-500/30">
                  {p.icon}
                </div>
                <h3 className="font-serif text-xl font-bold mb-2 text-gold-500">{p.title}</h3>
                <p className="text-gold-100/60 font-medium">{p.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact / QR Box */}
          <motion.div
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="bg-gradient-to-br from-coffee-900/90 to-coffee-950 rounded-xl p-8 border border-gold-500/40 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-[30px]"></div>
            <h3 className="font-serif text-3xl font-bold text-gold-400 mb-8 relative z-10">आज ही संपर्क करें !</h3>
            <div className="bg-white/90 p-4 rounded-lg mb-8 inline-block shadow-[0_0_15px_rgba(212,175,55,0.2)] relative z-10">
               <img
                 src="/assets/whatsapp_qr.jpg"
                 alt="QR Code"
                 className="w-32 h-32 object-contain mx-auto"
                 referrerPolicy="no-referrer"
               />
            </div>
            
            <div className="space-y-4 w-full relative z-10">
              <div className="flex items-center gap-3 text-gold-100">
                <Shield className="text-gold-500" size={24} />
                <span className="text-lg font-medium">योग्य मार्गदर्शन</span>
              </div>
              <div className="flex items-center gap-3 text-gold-100">
                <CheckCircle className="text-gold-500" size={24} />
                <span className="text-lg font-medium">सरल प्रशिक्षण</span>
              </div>
              <div className="flex items-center gap-3 text-gold-100">
                <Users className="text-gold-500" size={24} />
                <span className="text-lg font-medium">आजीवन साथ</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
