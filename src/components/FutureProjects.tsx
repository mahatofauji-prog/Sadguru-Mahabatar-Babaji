import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Maximize2, X, Compass } from 'lucide-react';
import { useImageContext, SingleImageKey } from '../context/ImageContext';

interface ProjectImage {
  src: string;
  title: string;
  englishTitle: string;
}

const FUTURE_PROJECTS: ProjectImage[] = [
  {
    src: '/images/future-projects/IMG-20260804-WA0010.jpg',
    title: 'महाअवतार बाबाजी भव्य मंदिर प्रारूप',
    englishTitle: 'Mahavatar Babaji Grand Temple Blueprint'
  },
  {
    src: '/images/future-projects/IMG-20260804-WA0011.jpg',
    title: 'नवीन ध्यान साधना कक्ष',
    englishTitle: 'Proposed Dhyan Sadhana Hall'
  },
  {
    src: '/images/future-projects/IMG-20260804-WA0012.jpg',
    title: 'आश्रम परिसर मास्टर प्लान',
    englishTitle: 'Ashram Campus Master Development Plan'
  },
  {
    src: '/images/future-projects/IMG-20260804-WA0013.jpg',
    title: 'गौशाला विस्तार परियोजना',
    englishTitle: 'Sacred Gaushala Expansion Project'
  },
  {
    src: '/images/future-projects/IMG-20260804-WA0014.jpg',
    title: 'सद्गुरु कुटीर निर्माण कार्य',
    englishTitle: 'Sadguru Kutir Construction Layout'
  },
  {
    src: '/images/future-projects/IMG-20260804-WA0015.jpg',
    title: 'भव्य यज्ञशाला सौन्दर्यीकरण',
    englishTitle: 'Grand Yajnashala Beautification Blueprint'
  },
  {
    src: '/images/future-projects/IMG-20260804-WA0016.jpg',
    title: 'सत्संग एवं प्रवचन भवन',
    englishTitle: 'Satsang & Spiritual Discourse Center'
  },
  {
    src: '/images/future-projects/IMG-20260804-WA0017.jpg',
    title: 'निःशुल्क आयुर्वेदिक चिकित्सा केंद्र',
    englishTitle: 'Charitable Ayurvedic Medical Dispensary'
  },
  {
    src: '/images/future-projects/IMG-20260804-WA0018.jpg',
    title: 'साधक अतिथि गृह परियोजना',
    englishTitle: 'Sadhak Guest House Facility'
  },
  {
    src: '/images/future-projects/IMG-20260804-WA0019.jpg',
    title: 'सरल ध्यान योग अनुसंधान केंद्र',
    englishTitle: 'Saral Dhyan Yog Research & Training Wing'
  },
  {
    src: '/images/future-projects/IMG-20260804-WA0020.jpg',
    title: 'दिव्य भोजनालय एवं लंगर हॉल',
    englishTitle: 'Divine Kitchen & Langar Dining Hall'
  },
  {
    src: '/images/future-projects/IMG-20260804-WA0021.jpg',
    title: 'प्राकृतिक चिकित्सा एवं योगशाला',
    englishTitle: 'Naturopathy & Yogashala Center'
  },
  {
    src: '/images/future-projects/IMG-20260804-WA0022.jpg',
    title: 'गोशाला एवं पशु सेवा',
    englishTitle: 'Gaushala & Animal Welfare'
  },
  {
    src: '/images/future-projects/IMG-20260804-WA0023.jpg',
    title: 'नूतन हवन कुंड संरचना',
    englishTitle: 'New Sacred Havan Kund Infrastructure'
  },
  {
    src: '/images/future-projects/IMG-20260804-WA0024.jpg',
    title: 'हरित ऊर्जा सौर विद्युत संयत्र',
    englishTitle: 'Green Solar Energy Plant Project'
  }
];

export default function FutureProjects() {
  const [activeImage, setActiveImage] = useState<ProjectImage | null>(null);
  const { getImageUrl } = useImageContext();

  const projectKeys: SingleImageKey[] = [
    'futureProject1',
    'futureProject2',
    'futureProject3',
    'futureProject4',
    'futureProject5',
    'futureProject6',
    'futureProject7',
    'futureProject8',
    'futureProject9',
    'futureProject10',
    'futureProject11',
    'futureProject12',
    'futureProject13',
    'futureProject14',
    'futureProject15'
  ];

  const dynamicProjects = FUTURE_PROJECTS.map((p, idx) => {
    const key = projectKeys[idx];
    const customSrc = key ? getImageUrl(key) : '';
    if (customSrc) return { ...p, src: customSrc };
    return p;
  });

  // Duplicate the array to make the sliding animation seamless
  const doubledProjects = [...dynamicProjects, ...dynamicProjects];

  return (
    <section id="future-projects" className="py-24 bg-coffee-950 relative overflow-hidden">
      {/* Background Decorative Gradient Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-saffron-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-gold-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12">
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-gold-500/30 bg-coffee-900/60 text-gold-400 text-xs font-semibold tracking-widest uppercase mb-3">
            <Sparkles size={14} className="text-saffron-400 animate-pulse" />
            <span>भविष्य की परिकल्पना</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold gold-gradient-text leading-tight">
            हमारे आगामी प्रोजेक्ट (Our Future Project)
          </h2>
          <p className="text-sm text-gold-200/80 mt-3 font-sans max-w-2xl mx-auto">
            सद्गुरु महावतार बाबाजी सरल ध्यान योग पीठ के भव्य विकास और जनकल्याणकारी योजनाओं का दिव्य प्रारूप।
          </p>
        </div>
      </div>

      {/* Non-stop Left Scrolling Marquee Container with fade edge masks */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Side fade masks for professional premium aesthetic */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-coffee-950 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-coffee-950 to-transparent z-10 pointer-events-none"></div>

        {/* Sliding element */}
        <div className="flex w-full overflow-hidden">
          <div className="animate-marquee flex gap-6 py-2">
            {doubledProjects.map((project, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImage(project)}
                className="w-[280px] sm:w-[320px] md:w-[360px] flex-shrink-0 group cursor-pointer bg-coffee-900/40 rounded-2xl border border-gold-500/15 p-3.5 hover:border-saffron-500/40 hover:bg-coffee-900/70 transition-all duration-300 shadow-xl"
              >
                {/* Image Wrap */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-coffee-950 border border-gold-500/10 flex items-center justify-center group/img">
                  <img
                    src={project.src}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                  />
                  
                  {/* Hover Overlay with Icon */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="p-3 rounded-full bg-saffron-500 text-coffee-50 font-bold hover:scale-110 transition-transform shadow-lg">
                      <Maximize2 size={18} />
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="mt-3.5">
                  <div className="flex items-center gap-1.5 text-saffron-400 text-[10px] uppercase tracking-wider font-semibold mb-1">
                    <Compass size={11} className="animate-spin" style={{ animationDuration: '8s' }} />
                    <span>आगामी योजना (Upcoming Project)</span>
                  </div>
                  <h4 className="text-sm font-bold text-gold-100 group-hover:text-gold-300 transition-colors truncate">
                    {project.title}
                  </h4>
                  <p className="text-[11px] text-gold-300/50 truncate font-mono mt-0.5">
                    {project.englishTitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Lightbox View Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          {/* Top Bar inside Lightbox */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-50">
            <div className="max-w-[75%]">
              <h4 className="font-serif text-gold-100 font-bold text-base sm:text-lg truncate">
                {activeImage.title}
              </h4>
              <p className="text-xs text-saffron-400 font-mono truncate">
                {activeImage.englishTitle}
              </p>
            </div>
            <button
              onClick={() => setActiveImage(null)}
              className="p-2.5 rounded-full bg-coffee-900 border border-gold-500/30 text-gold-300 hover:text-white transition-all shadow-md flex items-center justify-center cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Large High-Res Image Card */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative max-w-4xl max-h-[75vh] bg-coffee-950 border-2 border-gold-400 p-2 sm:p-3 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage.src}
              alt={activeImage.title}
              className="max-w-full max-h-[68vh] object-contain rounded-xl shadow-inner"
            />
          </motion.div>
          
          <p className="text-[10px] text-gold-300/40 mt-5 font-sans uppercase tracking-widest text-center select-none">
            SADGURU MAHAAVTAR BABAJI SARAL DHYAN YOG PITH • MASTER VISION
          </p>
        </div>
      )}

      {/* CSS Stylesheet Injection for Custom Animations */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 12px)); /* Correct calculation for flex gap offsets */
          }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 45s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
