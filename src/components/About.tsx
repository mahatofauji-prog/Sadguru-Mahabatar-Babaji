import { motion } from 'motion/react';
import { useImageContext } from '../context/ImageContext';

export default function About() {
  const { getImageUrl } = useImageContext();
  const aboutImg = getImageUrl('aboutMain') || '/assets/IMG-20260806-WA0004.jpg';

  return (
    <section id="about" className="py-16 md:py-24 bg-coffee-950 relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-b from-coffee-900/80 to-coffee-950/90 rounded-3xl overflow-hidden shadow-2xl border border-gold-500/20 backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Image */}
            <div className="relative h-[400px] lg:h-auto">
              <img
                src={aboutImg}
                alt="Guruji"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                 <div className="p-8">
                    <p className="text-white font-serif text-2xl drop-shadow-md">सरल ध्यान, सुंदर जीवन</p>
                 </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-100 rounded-bl-full -z-10 opacity-50"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gold-500 text-2xl">🪷</span>
                <h2 className="font-serif text-4xl text-gold-500 font-bold">हमारे विषय में</h2>
              </div>

              <div className="space-y-6 text-lg text-gold-100/80">
                <p className="font-medium text-xl text-gold-100 leading-relaxed">
                  सदगुरू महावतार बाबाजी की कृपा से सबको सहज, शांत और दिव्य ध्यान साधना सिखाने वाली यह आध्यात्मिक संस्था है।
                </p>
                <p>
                  यह साधना किसी भी धर्म, जाति, आयु या लिंग की सीमा से परे है। प्रत्येक व्यक्ति इसे सरलता से कर सकता है। हमारा उद्देश्य समाज में मानसिक शांति, शारीरिक स्वास्थ्य और आध्यात्मिक उन्नति का प्रसार करना है।
                </p>
                <p className="font-serif text-2xl text-gold-500 font-medium py-4">
                  "आइए, ध्यान करें और जीवन बदलें।"
                </p>
              </div>

              <div className="mt-8 flex gap-4">
                <button className="px-8 py-4 bg-gold-500 text-coffee-50 font-bold text-sm tracking-widest rounded shadow-xl border border-gold-100/20 transition-all hover:bg-gold-400">
                  अधिक जानें
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
