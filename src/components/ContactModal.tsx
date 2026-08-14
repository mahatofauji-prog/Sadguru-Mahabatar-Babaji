import { useState, FormEvent } from 'react';
import { X, Send, PhoneCall, CheckCircle2, Sparkles } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Auto open whatsapp with prefilled message
      const text = `जय गुरुदेव! मेरा नाम ${name} है। शहर: ${city}। संदेश: ${message}`;
      window.open(`https://wa.me/919422163066?text=${encodeURIComponent(text)}`, '_blank');
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-coffee-900 via-coffee-950 to-divine-navy rounded-3xl border-2 border-gold-500/50 shadow-[0_0_50px_rgba(212,175,55,0.4)] p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-coffee-800 text-gold-300 hover:text-white hover:bg-gold-500/20 transition-all cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gold-500/20 border border-gold-400 flex items-center justify-center mx-auto mb-2">
            <PhoneCall size={22} className="text-gold-400" />
          </div>
          <h3 className="font-serif text-2xl font-bold gold-gradient-text">
            संपर्क व साधना मार्गदर्शन
          </h3>
          <p className="text-xs text-gold-200/80 font-sans mt-1">
            सरल ध्यान साधना वर्ग या संस्था सेवा संबंधी जानकारी के लिए संदेश भेजें।
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 size={48} className="text-green-400 mx-auto animate-bounce" />
            <h4 className="font-serif text-xl font-bold text-gold-300">धन्यवाद!</h4>
            <p className="text-xs text-gold-100/80">
              आपको WhatsApp पर पुनर्प्रेषित किया जा रहा है...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gold-300 mb-1">
                पूरा नाम (Full Name) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="आपका नाम दर्ज करें"
                className="w-full bg-coffee-950 border border-gold-500/40 rounded-xl px-4 py-2.5 text-gold-100 text-sm focus:outline-none focus:border-gold-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gold-300 mb-1">
                  मोबाइल नंबर (Phone) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-coffee-950 border border-gold-500/40 rounded-xl px-4 py-2.5 text-gold-100 text-sm focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gold-300 mb-1">
                  शहर (City)
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="नाशिक / पुणे / मुंबई"
                  className="w-full bg-coffee-950 border border-gold-500/40 rounded-xl px-4 py-2.5 text-gold-100 text-sm focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gold-300 mb-1">
                संदेश या प्रश्न (Message)
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="ध्यान शिविर या संस्था सेवा संबंधी प्रश्न..."
                className="w-full bg-coffee-950 border border-gold-500/40 rounded-xl px-4 py-2.5 text-gold-100 text-sm focus:outline-none focus:border-gold-400"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-saffron-500 via-gold-500 to-gold-400 text-coffee-50 font-bold text-sm tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send size={16} />
              <span>WhatsApp द्वारा भेजें (Send via WhatsApp)</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
