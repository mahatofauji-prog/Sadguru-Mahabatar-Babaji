import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useImageContext, SingleImageKey } from '../context/ImageContext';
import {
  Sparkles,
  ArrowLeft,
  Heart,
  Languages,
  CheckCircle2,
  Shield,
  Zap,
  Flame,
  Brain,
  Compass,
  Moon,
  Sun,
  Award,
  PhoneCall,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const DHIVYA_MOMENTS = [
  {
    src: '/assets/IMG-20260811-WA0053.jpg',
    title: 'सद्गुरु देव ध्यान साधना दर्शन',
    english: 'Sadguru Divine Meditation Darshan'
  },
  {
    src: '/assets/IMG-20260811-WA0054.jpg',
    title: 'सरल ध्यान योग दीक्षा सत्र',
    english: 'Saral Dhyan Yog Initiation Session'
  },
  {
    src: '/assets/IMG-20260811-WA0056.jpg',
    title: 'सामूहिक शून्यता ध्यान शिविर',
    english: 'Mass Shunya Meditation Camp'
  },
  {
    src: '/assets/IMG-20260811-WA0057.jpg',
    title: 'दिव्य शक्तिपात एवं प्राण संचार',
    english: 'Divine Shaktipat & Pranic Transmission'
  },
  {
    src: '/assets/IMG-20260811-WA0058.jpg',
    title: 'सद्गुरु प्रवचन एवं मार्गदर्शन',
    english: 'Sadguru Discourse & Guidance'
  },
  {
    src: '/assets/IMG-20260811-WA0059.jpg',
    title: 'साधकों के साथ दिव्य सत्संग वार्ता',
    english: 'Divine Satsang Interaction'
  },
  {
    src: '/assets/IMG-20260811-WA0060.jpg',
    title: 'अखंड शांति ध्यान ऊर्जा क्षेत्र',
    english: 'Eternal Meditative Energy Field'
  },
  {
    src: '/assets/IMG-20260811-WA0061.jpg',
    title: 'शून्यता ध्यान साधना',
    english: 'Shunya Meditation Practice'
  },
  {
    src: '/assets/IMG-20260811-WA0062.jpg',
    title: 'प्राण योग क्रिया',
    english: 'Prana Yog Kriya'
  },
  {
    src: '/assets/IMG-20260811-WA0062.jpg',
    title: 'आत्म साक्षात्कार दर्शन',
    english: 'Self Realization Vision'
  }
];

interface SaralDhyanYogPageProps {
  onBackToHome: () => void;
  onOpenDonate: () => void;
  onOpenContact: () => void;
}

export default function SaralDhyanYogPage({
  onBackToHome,
  onOpenDonate,
  onOpenContact
}: SaralDhyanYogPageProps) {
  const { images, getImageUrl } = useImageContext();

  const dhyanImageKeys: SingleImageKey[] = [
    'dhyanYogHero1',
    'dhyanYogHero2',
    'dhyanYogHero3',
    'dhyanYogHero4',
    'dhyanYogHero5',
    'dhyanYogSection1',
    'dhyanYogSection2',
    'dhyanYogSection3',
    'dhyanYogSection4',
    'dhyanYogSection5'
  ];

  const dynamicMoments = DHIVYA_MOMENTS.map((m, idx) => {
    const key = dhyanImageKeys[idx];
    const customSrc = key ? getImageUrl(key) : '';
    if (customSrc) return { ...m, src: customSrc };
    return m;
  });

  const userUploaded = images.galleryImages.filter(img => img.category === 'dhyan');
  const activeMoments = userUploaded.length > 0
    ? [...userUploaded.map(img => ({ src: img.src, title: img.title, english: img.title })), ...dynamicMoments]
    : dynamicMoments;

  const [language, setLanguage] = useState<'english' | 'hindi' | 'both'>('both');
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<{ src: string; title: string; english: string } | null>(null);
  const [heroImgIndex, setHeroImgIndex] = useState(0);

  const HERO_SLIDES = activeMoments.slice(0, 5);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroImgIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [HERO_SLIDES.length]);

  const englishContent = {
    pageTitle: 'Saral Dhyan Yog: The Science of Quantum Stillness & Inner Transformation',
    subtitle: '🌌 SPECIAL PAGE CONTENT (ENGLISH)',
    introTitle: 'Introduction: What is Saral Dhyan Yog?',
    introPara1:
      'Under the divine consciousness of the immortal Himalayan Master, Mahavatar Babaji, and guided by His Holiness Sri Sri 1008 Anant Vibhushit Mahamandaleshwar Swami Dr. Nirmal Ji Maharaj, Saral Dhyan Yog is a supreme, highly advanced, yet effortlessly simple science of bio-vibrational alignment.',
    introPara2:
      'Unlike conventional meditation techniques that require years of rigid mental control, Saral Dhyan Yog works directly with your subtle energy channels (Sushumna Nadi) and cellular frequency. It naturally slows down hyperactive brainwaves, taking the practitioner into Theta and Delta states—the exact state of Shunya (The Quantum Void) experienced by Himalayan masters in deep Samadhi.',
    foundationsTitle: 'The Metaphysical & Scientific Foundations',
    foundations: [
      {
        title: 'Activation of Sushumna Nadi:',
        text: 'The human body contains 72,000 Nadis (energy channels). Saral Dhyan Yog gently awakens the central channel—the Sushumna Nadi—allowing vital life force (Prana) to ascend effortlessly from the Root Chakra (Muladhara) to the Crown Chakra (Sahasrara).'
      },
      {
        title: 'Brainwave Entrainment (Shift to Theta/Delta):',
        text: 'Modern life forces the brain into stressful Beta waves. Through direct subtle transmission, Saral Dhyan Yog induces deep relaxation, activating parasympathetic nervous responses that instantly calm the vagus nerve.'
      },
      {
        title: 'Bio-Energetic Shielding (Divya Kavach):',
        text: 'Daily practice creates a resilient electromagnetic aura around the practitioner. This Divya Kavach protects the practitioner\'s mind and physical body from negative external vibrations, psychic attacks, and environmental stress.'
      }
    ],
    benefitsTitle: 'Key Benefits of the Practice',
    benefits: [
      {
        title: 'Dissolution of Chronic Stress & Anxiety:',
        text: 'Instantly calms the nervous system, balances blood pressure, improves sleep quality, and restores emotional equilibrium.'
      },
      {
        title: 'Awakening of Higher Intuition (Ajna Chakra):',
        text: 'Activates the pineal gland, enhancing clarity, decision-making, foresight, and direct cosmic insights.'
      },
      {
        title: 'Karmic Cord Cutting & Detoxification:',
        text: 'Under spiritual initiation (Shaktipat), parasitic karmic ties and emotional burdens from past conditioning are severed.'
      },
      {
        title: 'Manifestation of Abundance (Sthir Lakshmi):',
        text: 'Clears stagnant blockages in the lower chakras, bringing clarity, stability, and growth to professional and financial endeavors.'
      }
    ],
    stepsTitle: 'How to Begin Your Practice (Core Steps)',
    steps: [
      {
        title: 'Sacred Alignment & Posture:',
        text: 'Sit comfortably with a straight spine in a quiet space, keeping head, neck, and trunk aligned to facilitate smooth pranic flow.'
      },
      {
        title: 'Breath Awareness (Prana Samyama):',
        text: 'Transition from shallow thoracic breathing to deep, rhythmic abdominal breathing, observing the subtle gap between inhalation and exhalation.'
      },
      {
        title: 'Mantra & Sound Vibration:',
        text: 'Engage in inner sound resonance to quiet mental chatter and center consciousness within the Heart (Anahata) or Third Eye (Ajna).'
      },
      {
        title: 'Surrender to Shunya (The Quantum Void):',
        text: 'Release all effort and rest in pure, unconditioned awareness—the state of effortless stillness.'
      }
    ]
  };

  const hindiContent = {
    pageTitle: 'सरल ध्यान योग: क्वांटम शून्यता और आंतरिक रूपांतरण का विज्ञान',
    subtitle: '🌌 SPECIAL PAGE CONTENT (HINDI / हिंदी)',
    introTitle: 'प्रस्तावना: सरल ध्यान योग क्या है?',
    introPara1:
      'अमर हिमालयी योगी महावतार बाबाजी की दिव्य चेतना के संरक्षण में और परम पूज्य श्री श्री १००८ अनंत विभूषित महामंडलेश्वर स्वामी डॉ. निर्मल जी महाराज के मार्गदर्शन में, सरल ध्यान योग जैव-कंपन संरेखण (Bio-Vibrational Alignment) का एक परम, अत्यंत उन्नत लेकिन सहज और सरल विज्ञान है।',
    introPara2:
      'वर्षों के कड़े मानसिक नियंत्रण की मांग करने वाली पारंपरिक ध्यान तकनीकों के विपरीत, सरल ध्यान योग सीधे आपकी सूक्ष्म ऊर्जा नाड़ियों (सुषुम्ना नाड़ी) और कोशिकीय आवृत्ति पर कार्य करता है। यह स्वाभाविक रूप से अतिसक्रिय मस्तिष्क तरंगों को धीमा करता है, जिससे साधक थीटा (Theta) और डेल्टा (Delta) अवस्थाओं में प्रवेश करता है—यह वही शून्यता (Quantum Void) की स्थिति है जिसे हिमालयी सिद्ध पुरुष गहरी समाधि में अनुभव करते हैं।',
    foundationsTitle: 'आध्यात्मिक एवं वैज्ञानिक आधार',
    foundations: [
      {
        num: '१.',
        title: 'सुषुम्ना नाड़ी का जागरण:',
        text: 'मानव शरीर में ७२,००० नाड़ियाँ होती हैं। सरल ध्यान योग मध्य नाड़ी—सुषुम्ना नाड़ी—को सहजता से जागृत करता है, जिससे प्राण ऊर्जा मूलाधार चक्र से सहस्रार चक्र की ओर सुगमता से प्रवाहित होने लगती me।'
      },
      {
        num: '२.',
        title: 'मस्तिष्क तरंगों का परिवर्तन (थीटा/डेल्टा अवस्था):',
        text: 'आधुनिक जीवनशैली मस्तिष्क को तनावपूर्ण बीटा तरंगों में रखती है। सूक्ष्म शक्तिपात और तकनीक के माध्यम से, यह योग पैरासिम्पेथेटिक तंत्रिका तंत्र को सक्रिय करता है, जिससे वेगस तंत्रिका को तुरंत शांति मिलती है।'
      },
      {
        num: '३.',
        title: 'जैव-ऊर्जात्मक सुरक्षा कवच (दिव्य कवच):',
        text: 'नियमित अभ्यास साधक के चारों ओर एक अभेद्य विद्युत चुंबकीय आभामंडल (Aura) का निर्माण करता है। यह दिव्य कवच साधक के मन और शरीर को बाहरी नकारात्मक ऊर्जाओं, मानसिक हमलों और पर्यावरणीय तनाव से सुरक्षित रखता है।'
      }
    ],
    benefitsTitle: 'साधना के मुख्य लाभ',
    benefits: [
      {
        title: 'जीर्ण तनाव और चिंता से मुक्ति:',
        text: 'तंत्रिका तंत्र को तुरंत शांत करता है, रक्तचाप को संतुलित करता है, अनिद्रा को दूर करता है और भावनात्मक संतुलन बहाल करता me।'
      },
      {
        title: 'उच्च अंतर्ज्ञान का जागरण (आज्ञा चक्र):',
        text: 'पीनियल ग्रंथि को सक्रिय करता है, जिससे निर्णय लेने की क्षमता, स्पष्टता और ब्रह्मांडीय अंतर्दृष्टि में वृद्धि होती है।'
      },
      {
        title: 'कर्म बंधनों से मुक्ति (Cord Cutting):',
        text: 'शक्तिपात दीक्षा के माध्यम से, अतीत की नकारात्मक ऊर्जाओं, परजीवी कर्म बंधनों और मानसिक बोझ से मुक्ति मिलती है।'
      },
      {
        title: 'स्थिर लक्ष्मी (समृद्धि) का प्रकटीकरण:',
        text: 'निचले चक्रों में ऊर्जा रुकावटों को दूर कर जीवन में स्थिरता, वित्तीय स्पष्टता और व्यावसायिक समृद्धि लाता है।'
      }
    ],
    stepsTitle: 'साधना कैसे शुरू करें (मुख्य चरण)',
    steps: [
      {
        num: '१.',
        title: 'पवित्र आसन और स्थिति:',
        text: 'शांत वातावरण में रीढ़ की हड्डी सीधी रखकर आरामदायक स्थिति में बैठें। सिर, गर्दन और धड़ को एक सीधी रेखा में रखें।'
      },
      {
        num: '२.',
        title: 'प्राण संयम (श्वास जागरूकता):',
        text: 'उथली सांसों के बजाय गहरी, लयबद्ध सांस लें। श्वास लेने और छोड़ने के बीच के सूक्ष्म अंतराल पर ध्यान केंद्रित करें।'
      },
      {
        num: '३.',
        title: 'मंत्र एवं ध्वनि स्पंदन:',
        text: 'मन के विचारों को शांत करने के लिए सूक्ष्म ध्वनि स्पंदन का उपयोग करें और चेतना को अनाहत (हृदय) या आज्ञा (तीसरी आँख) चक्र पर स्थिर करें।'
      },
      {
        num: '४.',
        title: 'शून्य में समर्पण:',
        text: 'सभी प्रयासों को छोड़ दें और शुद्ध, निष्काम चेतना में विश्राम करें—यही सहज शून्यता की परम अवस्था है।'
      }
    ]
  };

  // Correcting any typo in hindi text data to match exact requested string
  hindiContent.foundations[0].text =
    'मानव शरीर में ७२,००० नाड़ियाँ होती हैं। सरल ध्यान योग मध्य नाड़ी—सुषुम्ना नाड़ी—को सहजता से जागृत करता है, जिससे प्राण ऊर्जा मूलाधार चक्र से सहस्रार चक्र की ओर सुगमता से प्रवाहित होने लगती है।';
  hindiContent.benefits[0].text =
    'तंत्रिका तंत्र को तुरंत शांत करता है, रक्तचाप को संतुलित करता है, अनिद्रा को दूर करता है और भावनात्मक संतुलन बहाल करता है।';

  return (
    <div className="pt-28 pb-20 bg-coffee-950 text-gold-100 min-h-screen relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-saffron-500/15 via-gold-500/10 to-transparent rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation / Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-coffee-900/80 p-4 sm:p-5 rounded-2xl border border-gold-500/30 backdrop-blur-md shadow-xl">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 font-bold text-sm border border-gold-500/30 transition-all hover:-translate-x-1 cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span>मुख्यपृष्ठ पर जाएँ (Back to Home)</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-coffee-950/80 p-1.5 rounded-xl border border-gold-500/30">
            <Languages size={18} className="text-saffron-400 ml-2" />
            <span className="text-xs font-semibold text-gold-400 hidden sm:inline mr-1">
              भाषा (Language):
            </span>
            <button
              onClick={() => setLanguage('both')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                language === 'both'
                  ? 'bg-gradient-to-r from-saffron-500 to-gold-400 text-coffee-50 shadow-md'
                  : 'text-gold-200 hover:text-gold-400'
              }`}
            >
              दोनों (Both)
            </button>
            <button
              onClick={() => setLanguage('hindi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                language === 'hindi'
                  ? 'bg-gradient-to-r from-saffron-500 to-gold-400 text-coffee-50 shadow-md'
                  : 'text-gold-200 hover:text-gold-400'
              }`}
            >
              हिंदी (Hindi)
            </button>
            <button
              onClick={() => setLanguage('english')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                language === 'english'
                  ? 'bg-gradient-to-r from-saffron-500 to-gold-400 text-coffee-50 shadow-md'
                  : 'text-gold-200 hover:text-gold-400'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Hero Section Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 bg-gradient-to-b from-coffee-900/90 via-coffee-900/60 to-coffee-950 p-6 sm:p-10 md:p-12 rounded-3xl border-2 border-gold-500/40 shadow-[0_0_50px_rgba(212,175,55,0.15)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-saffron-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/40 bg-saffron-500/10 text-saffron-400 text-xs font-bold tracking-widest uppercase">
                <Sparkles size={16} />
                <span>विशेष साधना पृष्ठ (SPECIAL PAGE CONTENT)</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold gold-gradient-text leading-tight">
                Saral Dhyan Yog: The Science of Quantum Stillness & Inner Transformation
              </h1>

              <h2 className="font-serif text-2xl sm:text-3xl text-saffron-300 font-bold">
                सरल ध्यान योग: क्वांटम शून्यता और आंतरिक रूपांतरण का विज्ञान
              </h2>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs sm:text-sm text-gold-200/90 font-medium">
                <span className="flex items-center gap-1.5 bg-coffee-950/70 px-3.5 py-1.5 rounded-full border border-gold-500/20">
                  <Award size={14} className="text-saffron-400" />
                  महावतार बाबाजी दिव्य चेतना
                </span>
                <span className="flex items-center gap-1.5 bg-coffee-950/70 px-3.5 py-1.5 rounded-full border border-gold-500/20">
                  <Sparkles size={14} className="text-gold-400" />
                  श्री श्री १००८ अनंत विभूषित स्वामी डॉ. निर्मल जी महाराज
                </span>
              </div>
            </div>

            {/* Right Animated Slideshow Column */}
            <div className="lg:col-span-5 w-full flex flex-col items-center">
              <div className="w-full bg-coffee-950/80 p-4 rounded-2xl border border-gold-500/30 shadow-2xl relative">
                {/* Photo Frame Container - Aspect Ratio 4:3 ensures no distortion */}
                <div className="relative aspect-[4/3] w-full bg-black rounded-xl overflow-hidden flex items-center justify-center p-2.5 border border-gold-500/10 group">
                  <AnimatePresence mode="wait">
                    <motion.div key={`bg-${heroImgIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0">
                      <img src={HERO_SLIDES[heroImgIndex].src} className="w-full h-full object-cover blur-2xl opacity-50 scale-110" />
                    </motion.div>
                    <motion.img
                      key={heroImgIndex}
                      src={HERO_SLIDES[heroImgIndex].src}
                      alt={HERO_SLIDES[heroImgIndex].title}
                      referrerPolicy="no-referrer"
                      initial={{ opacity: 0, scale: 0.95, x: 10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: -10 }}
                      transition={{ duration: 0.4 }}
                      onClick={() => setSelectedGalleryImg(HERO_SLIDES[heroImgIndex])}
                      className="w-full h-full object-contain rounded-lg cursor-zoom-in relative z-10"
                    />
                  </AnimatePresence>

                  {/* Manual Navigation Arrows */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setHeroImgIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
                    }}
                    className="absolute left-2 p-2 rounded-full bg-coffee-900/95 border border-gold-500/40 text-gold-300 hover:text-white transition-all hover:scale-110 shadow-lg cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setHeroImgIndex((prev) => (prev + 1) % HERO_SLIDES.length);
                    }}
                    className="absolute right-2 p-2 rounded-full bg-coffee-900/95 border border-gold-500/40 text-gold-300 hover:text-white transition-all hover:scale-110 shadow-lg cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight size={16} />
                  </button>

                  {/* Top Right Zoom Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGalleryImg(HERO_SLIDES[heroImgIndex]);
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-coffee-900/90 border border-gold-500/30 text-gold-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-white shadow-md cursor-pointer"
                  >
                    <Maximize2 size={14} />
                  </button>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-1.5 mt-3">
                  {HERO_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setHeroImgIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        heroImgIndex === idx ? 'w-5 bg-saffron-500' : 'w-2 bg-gold-500/30 hover:bg-gold-500/60'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Slide Caption with English & Hindi translations */}
                <div className="mt-3 text-center border-t border-gold-500/10 pt-2.5">
                  <h4 className="text-sm font-bold text-saffron-400 font-serif leading-tight">
                    {HERO_SLIDES[heroImgIndex].title}
                  </h4>
                  <p className="text-[11px] text-gold-200/60 font-mono mt-0.5 uppercase tracking-wide">
                    {HERO_SLIDES[heroImgIndex].english}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* MAIN CONTENT DISPLAY */}
        <div className="space-y-12">
          {/* 1. INTRODUCTION SECTION */}
          {(language === 'both' || language === 'english') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-coffee-900/60 p-6 sm:p-8 rounded-3xl border border-gold-500/30 backdrop-blur-md shadow-lg"
            >
              <div className="flex items-center gap-2 text-saffron-400 text-xs font-bold uppercase tracking-wider mb-2">
                <span>🌌 {englishContent.subtitle}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gold-300 mb-6">
                {englishContent.introTitle}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4 text-gold-100/90 text-base sm:text-lg leading-relaxed font-sans">
                  <p className="bg-coffee-950/50 p-5 rounded-2xl border border-gold-500/20">
                    {englishContent.introPara1}
                  </p>
                  <p className="bg-coffee-950/50 p-5 rounded-2xl border border-gold-500/20">
                    {englishContent.introPara2}
                  </p>
                </div>
                <div className="lg:col-span-5 w-full">
                  <div
                    onClick={() => setSelectedGalleryImg(activeMoments[5 % activeMoments.length])}
                    className="group cursor-pointer bg-coffee-950/80 p-3.5 rounded-2xl border border-gold-500/20 hover:border-saffron-500/40 transition-all duration-300 shadow-xl"
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40 flex items-center justify-center p-2">
                      <div className="absolute inset-0 z-0 pointer-events-none">
                        <img src={activeMoments[5 % activeMoments.length].src} alt="" className="w-full h-full object-cover blur-2xl opacity-50 scale-125" />
                      </div>
                      <img
                        src={activeMoments[5 % activeMoments.length].src}
                        alt="Sadguru Discourse"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain rounded-lg transition-transform duration-500 group-hover:scale-105 relative z-10"
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <h4 className="text-xs sm:text-sm font-bold text-gold-100 font-serif">
                        {activeMoments[5 % activeMoments.length].title}
                      </h4>
                      <p className="text-[10px] text-gold-300/40 font-mono mt-0.5 uppercase tracking-wider">
                        {activeMoments[5 % activeMoments.length].english}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {(language === 'both' || language === 'hindi') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-coffee-900/60 p-6 sm:p-8 rounded-3xl border border-gold-500/30 backdrop-blur-md shadow-lg"
            >
              <div className="flex items-center gap-2 text-saffron-400 text-xs font-bold uppercase tracking-wider mb-2">
                <span>🌌 {hindiContent.subtitle}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gold-300 mb-6">
                {hindiContent.introTitle}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4 text-gold-100/90 text-base sm:text-lg leading-relaxed font-sans">
                  <p className="bg-coffee-950/50 p-5 rounded-2xl border border-gold-500/20">
                    {hindiContent.introPara1}
                  </p>
                  <p className="bg-coffee-950/50 p-5 rounded-2xl border border-gold-500/20">
                    {hindiContent.introPara2}
                  </p>
                </div>
                <div className="lg:col-span-5 w-full">
                  <div
                    onClick={() => setSelectedGalleryImg(activeMoments[5 % activeMoments.length])}
                    className="group cursor-pointer bg-coffee-950/80 p-3.5 rounded-2xl border border-gold-500/20 hover:border-saffron-500/40 transition-all duration-300 shadow-xl"
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40 flex items-center justify-center p-2">
                      <div className="absolute inset-0 z-0 pointer-events-none">
                        <img src={activeMoments[5 % activeMoments.length].src} alt="" className="w-full h-full object-cover blur-2xl opacity-50 scale-125" />
                      </div>
                      <img
                        src={activeMoments[5 % activeMoments.length].src}
                        alt="Sadguru Discourse"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain rounded-lg transition-transform duration-500 group-hover:scale-105 relative z-10"
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <h4 className="text-xs sm:text-sm font-bold text-gold-100 font-serif">
                        {activeMoments[5 % activeMoments.length].title}
                      </h4>
                      <p className="text-[10px] text-gold-300/40 font-mono mt-0.5 uppercase tracking-wider">
                        {activeMoments[5 % activeMoments.length].english}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* 2. FOUNDATIONS SECTION */}
          {(language === 'both' || language === 'english') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <Brain className="text-saffron-400" size={28} />
                <h2 className="font-serif text-2xl sm:text-3xl font-bold gold-gradient-text">
                  {englishContent.foundationsTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {englishContent.foundations.map((item, idx) => (
                    <div
                      key={idx}
                      className="glass-card-glow p-6 rounded-2xl border border-gold-500/30 flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-full bg-saffron-500/20 border border-saffron-500/40 flex items-center justify-center text-saffron-400 font-bold mb-4">
                          {idx + 1}
                        </div>
                        <h3 className="font-serif text-lg font-bold text-gold-300 mb-3">
                          * {item.title}
                        </h3>
                        <p className="text-gold-100/80 text-sm sm:text-base leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="lg:col-span-4 w-full flex">
                  <div
                    onClick={() => setSelectedGalleryImg(activeMoments[6 % activeMoments.length])}
                    className="group cursor-pointer bg-coffee-950/80 p-4 rounded-2xl border border-gold-500/20 hover:border-saffron-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between h-full w-full"
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40 flex items-center justify-center p-2 flex-grow">
                      <div className="absolute inset-0 z-0 pointer-events-none">
                        <img src={activeMoments[6 % activeMoments.length].src} alt="" className="w-full h-full object-cover blur-2xl opacity-50 scale-125" />
                      </div>
                      <img
                        src={activeMoments[6 % activeMoments.length].src}
                        alt="Divine Shaktipat"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain rounded-lg transition-transform duration-500 group-hover:scale-105 relative z-10"
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <h4 className="text-xs sm:text-sm font-bold text-gold-100 font-serif">
                        {activeMoments[6 % activeMoments.length].title}
                      </h4>
                      <p className="text-[10px] text-gold-300/40 font-mono mt-0.5 uppercase tracking-wider">
                        {activeMoments[6 % activeMoments.length].english}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {(language === 'both' || language === 'hindi') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <Flame className="text-saffron-400" size={28} />
                <h2 className="font-serif text-2xl sm:text-3xl font-bold gold-gradient-text">
                  {hindiContent.foundationsTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {hindiContent.foundations.map((item, idx) => (
                    <div
                      key={idx}
                      className="glass-card-glow p-6 rounded-2xl border border-gold-500/30 flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-full bg-saffron-500/20 border border-saffron-500/40 flex items-center justify-center text-saffron-400 font-bold mb-4">
                          {item.num}
                        </div>
                        <h3 className="font-serif text-lg font-bold text-gold-300 mb-3">
                          {item.num} {item.title}
                        </h3>
                        <p className="text-gold-100/80 text-sm sm:text-base leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="lg:col-span-4 w-full flex">
                  <div
                    onClick={() => setSelectedGalleryImg(activeMoments[6 % activeMoments.length])}
                    className="group cursor-pointer bg-coffee-950/80 p-4 rounded-2xl border border-gold-500/20 hover:border-saffron-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between h-full w-full"
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40 flex items-center justify-center p-2 flex-grow">
                      <div className="absolute inset-0 z-0 pointer-events-none">
                        <img src={activeMoments[6 % activeMoments.length].src} alt="" className="w-full h-full object-cover blur-2xl opacity-50 scale-125" />
                      </div>
                      <img
                        src={activeMoments[6 % activeMoments.length].src}
                        alt="Divine Shaktipat"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain rounded-lg transition-transform duration-500 group-hover:scale-105 relative z-10"
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <h4 className="text-xs sm:text-sm font-bold text-gold-100 font-serif">
                        {activeMoments[6 % activeMoments.length].title}
                      </h4>
                      <p className="text-[10px] text-gold-300/40 font-mono mt-0.5 uppercase tracking-wider">
                        {activeMoments[6 % activeMoments.length].english}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* 3. KEY BENEFITS SECTION */}
          {(language === 'both' || language === 'english') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <Shield className="text-saffron-400" size={28} />
                <h2 className="font-serif text-2xl sm:text-3xl font-bold gold-gradient-text">
                  {englishContent.benefitsTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {englishContent.benefits.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-coffee-900/80 p-6 rounded-2xl border border-gold-500/30 flex items-start gap-4 hover:border-gold-400 transition-colors"
                    >
                      <CheckCircle2
                        size={24}
                        className="text-saffron-400 shrink-0 mt-1"
                      />
                      <div>
                        <h3 className="font-serif text-lg font-bold text-gold-300 mb-2">
                          * {item.title}
                        </h3>
                        <p className="text-gold-100/80 text-sm sm:text-base leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="lg:col-span-4 w-full flex">
                  <div
                    onClick={() => setSelectedGalleryImg(activeMoments[7 % activeMoments.length])}
                    className="group cursor-pointer bg-coffee-950/80 p-4 rounded-2xl border border-gold-500/20 hover:border-saffron-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between h-full w-full"
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40 flex items-center justify-center p-2 flex-grow">
                      <div className="absolute inset-0 z-0 pointer-events-none">
                        <img src={activeMoments[7 % activeMoments.length].src} alt="" className="w-full h-full object-cover blur-2xl opacity-50 scale-125" />
                      </div>
                      <img
                        src={activeMoments[7 % activeMoments.length].src}
                        alt="Meditative Energy Field"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain rounded-lg transition-transform duration-500 group-hover:scale-105 relative z-10"
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <h4 className="text-xs sm:text-sm font-bold text-gold-100 font-serif">
                        {activeMoments[7 % activeMoments.length].title}
                      </h4>
                      <p className="text-[10px] text-gold-300/40 font-mono mt-0.5 uppercase tracking-wider">
                        {activeMoments[7 % activeMoments.length].english}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {(language === 'both' || language === 'hindi') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <Zap className="text-saffron-400" size={28} />
                <h2 className="font-serif text-2xl sm:text-3xl font-bold gold-gradient-text">
                  {hindiContent.benefitsTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hindiContent.benefits.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-coffee-900/80 p-6 rounded-2xl border border-gold-500/30 flex items-start gap-4 hover:border-gold-400 transition-colors"
                    >
                      <CheckCircle2
                        size={24}
                        className="text-saffron-400 shrink-0 mt-1"
                      />
                      <div>
                        <h3 className="font-serif text-lg font-bold text-gold-300 mb-2">
                          * {item.title}
                        </h3>
                        <p className="text-gold-100/80 text-sm sm:text-base leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="lg:col-span-4 w-full flex">
                  <div
                    onClick={() => setSelectedGalleryImg(activeMoments[7 % activeMoments.length])}
                    className="group cursor-pointer bg-coffee-950/80 p-4 rounded-2xl border border-gold-500/20 hover:border-saffron-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between h-full w-full"
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40 flex items-center justify-center p-2 flex-grow">
                      <div className="absolute inset-0 z-0 pointer-events-none">
                        <img src={activeMoments[7 % activeMoments.length].src} alt="" className="w-full h-full object-cover blur-2xl opacity-50 scale-125" />
                      </div>
                      <img
                        src={activeMoments[7 % activeMoments.length].src}
                        alt="Meditative Energy Field"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain rounded-lg transition-transform duration-500 group-hover:scale-105 relative z-10"
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <h4 className="text-xs sm:text-sm font-bold text-gold-100 font-serif">
                        {activeMoments[7 % activeMoments.length].title}
                      </h4>
                      <p className="text-[10px] text-gold-300/40 font-mono mt-0.5 uppercase tracking-wider">
                        {activeMoments[7 % activeMoments.length].english}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* 4. CORE STEPS SECTION */}
          {(language === 'both' || language === 'english') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <Compass className="text-saffron-400" size={28} />
                <h2 className="font-serif text-2xl sm:text-3xl font-bold gold-gradient-text">
                  {englishContent.stepsTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {englishContent.steps.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-coffee-900/90 to-coffee-950 p-6 rounded-2xl border border-gold-500/30 relative"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-8 h-8 rounded-full bg-saffron-500/20 text-saffron-400 font-bold flex items-center justify-center text-sm border border-saffron-500/30">
                          {idx + 1}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-gold-300">
                          * {item.title}
                        </h3>
                      </div>
                      <p className="text-gold-100/80 text-sm sm:text-base leading-relaxed pl-11">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="lg:col-span-4 w-full flex">
                  <div
                    onClick={() => setSelectedGalleryImg(activeMoments[8 % activeMoments.length])}
                    className="group cursor-pointer bg-coffee-950/80 p-4 rounded-2xl border border-gold-500/20 hover:border-saffron-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between h-full w-full"
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40 flex items-center justify-center p-2 flex-grow">
                      <div className="absolute inset-0 z-0 pointer-events-none">
                        <img src={activeMoments[8 % activeMoments.length].src} alt="" className="w-full h-full object-cover blur-2xl opacity-50 scale-125" />
                      </div>
                      <img
                        src={activeMoments[8 % activeMoments.length].src}
                        alt="Sadhana Celebration"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain rounded-lg transition-transform duration-500 group-hover:scale-105 relative z-10"
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <h4 className="text-xs sm:text-sm font-bold text-gold-100 font-serif">
                        {activeMoments[8 % activeMoments.length].title}
                      </h4>
                      <p className="text-[10px] text-gold-300/40 font-mono mt-0.5 uppercase tracking-wider">
                        {activeMoments[8 % activeMoments.length].english}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {(language === 'both' || language === 'hindi') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <Sun className="text-saffron-400" size={28} />
                <h2 className="font-serif text-2xl sm:text-3xl font-bold gold-gradient-text">
                  {hindiContent.stepsTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hindiContent.steps.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-coffee-900/90 to-coffee-950 p-6 rounded-2xl border border-gold-500/30 relative"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-8 h-8 rounded-full bg-saffron-500/20 text-saffron-400 font-bold flex items-center justify-center text-sm border border-saffron-500/30">
                          {item.num}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-gold-300">
                          {item.num} {item.title}
                        </h3>
                      </div>
                      <p className="text-gold-100/80 text-sm sm:text-base leading-relaxed pl-11">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="lg:col-span-4 w-full flex">
                  <div
                    onClick={() => setSelectedGalleryImg(activeMoments[9 % activeMoments.length])}
                    className="group cursor-pointer bg-coffee-950/80 p-4 rounded-2xl border border-gold-500/20 hover:border-saffron-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between h-full w-full"
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40 flex items-center justify-center p-2 flex-grow">
                      <div className="absolute inset-0 z-0 pointer-events-none">
                        <img src={activeMoments[9 % activeMoments.length].src} alt="" className="w-full h-full object-cover blur-2xl opacity-50 scale-125" />
                      </div>
                      <img
                        src={activeMoments[9 % activeMoments.length].src}
                        alt="Divine Satsang"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain rounded-lg transition-transform duration-500 group-hover:scale-105 relative z-10"
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <h4 className="text-xs sm:text-sm font-bold text-gold-100 font-serif">
                        {activeMoments[9 % activeMoments.length].title}
                      </h4>
                      <p className="text-[10px] text-gold-300/40 font-mono mt-0.5 uppercase tracking-wider">
                        {activeMoments[9 % activeMoments.length].english}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* 5. DIVINE SHIVIR GLIMPSES GALLERY */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 pt-6"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="text-saffron-400" size={28} />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold gold-gradient-text">
                {language === 'english' ? 'Divine Glimpses (Darshan & Shivir)' : 'दिव्य दर्शन एवं ध्यान शिविर की झलकियां'}
              </h2>
            </div>
            
            <p className="text-sm text-gold-200/80 font-sans max-w-3xl leading-relaxed">
              {language === 'english' 
                ? 'Glimpses of spiritual sessions, divine guidance, and energy alignment conducted under the divine light of His Holiness Swami Dr. Nirmal Ji Maharaj.'
                : 'सद्गुरु देव जी महाराज के दिव्य सानिध्य में आयोजित सरल ध्यान योग शिविर, आध्यात्मिक दीक्षा एवं प्राण संचार सत्रों की पावन झलकियां।'}
            </p>

            {/* Grid Layout preserving full image aspect ratios without any cutting */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeMoments.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedGalleryImg(img)}
                  className="group cursor-pointer bg-coffee-900/60 rounded-2xl border border-gold-500/20 p-3 hover:border-saffron-500/50 hover:bg-coffee-900/90 transition-all duration-300 shadow-xl flex flex-col justify-between"
                >
                  {/* Photo Frame containing the non-cropped image */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40 border border-gold-500/10 flex items-center justify-center p-2">
                    <div className="absolute inset-0 z-0 pointer-events-none">
                      <img src={img.src} alt="" className="w-full h-full object-cover blur-2xl opacity-50 scale-125" />
                    </div>
                    <img
                      src={img.src}
                      alt={img.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain rounded-lg transition-transform duration-500 group-hover:scale-105 relative z-10"
                    />
                    {/* Hover indicator */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl">
                      <div className="p-2.5 rounded-full bg-saffron-500 text-coffee-50 font-bold hover:scale-110 transition-transform shadow-lg">
                        <Maximize2 size={16} />
                      </div>
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="mt-3 text-center">
                    <h4 className="text-xs sm:text-sm font-bold text-gold-100 line-clamp-1 group-hover:text-saffron-400 transition-colors">
                      {language === 'english' ? img.english : img.title}
                    </h4>
                    <p className="text-[10px] text-gold-300/40 font-mono mt-0.5 truncate">
                      {language === 'english' ? img.title : img.english}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Lightbox Modal */}
        {selectedGalleryImg && (
          <div
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
            onClick={() => setSelectedGalleryImg(null)}
          >
            {/* Top Bar inside Lightbox */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-50">
              <div className="max-w-[75%]">
                <h4 className="font-serif text-gold-100 font-bold text-base sm:text-lg truncate">
                  {language === 'english' ? selectedGalleryImg.english : selectedGalleryImg.title}
                </h4>
                <p className="text-xs text-saffron-400 font-mono truncate">
                  {language === 'english' ? selectedGalleryImg.title : selectedGalleryImg.english}
                </p>
              </div>
              <button
                onClick={() => setSelectedGalleryImg(null)}
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
                src={selectedGalleryImg.src}
                alt={selectedGalleryImg.title}
                className="max-w-full max-h-[68vh] object-contain rounded-xl shadow-inner"
              />
            </motion.div>
            
            <p className="text-[10px] text-gold-300/40 mt-5 font-sans uppercase tracking-widest text-center select-none">
              SADGURU MAHAAVTAR BABAJI SARAL DHYAN YOG PITH • DIVINE MOMENTS
            </p>
          </div>
        )}


        {/* BOTTOM ACTION & BACK BUTTON */}
        <div className="mt-16 pt-8 border-t border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 bg-coffee-900/60 p-6 sm:p-8 rounded-3xl">
          <div className="flex flex-col text-center sm:text-left">
            <h3 className="font-serif text-xl font-bold text-gold-300 mb-1">
              साधना दीक्षा एवं मार्गदर्शन हेतु संपर्क करें
            </h3>
            <p className="text-xs sm:text-sm text-gold-100/70">
              For spiritual initiation & session registration, reach out to the Peeth.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenContact}
              className="px-5 py-3 rounded-full bg-gradient-to-r from-saffron-500 to-gold-400 text-coffee-50 font-bold text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall size={16} />
              <span>संपर्क करें (Register/Contact)</span>
            </button>

            <button
              onClick={onOpenDonate}
              className="px-5 py-3 rounded-full bg-transparent border border-gold-500 text-gold-300 hover:bg-gold-500/10 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Heart size={16} className="text-saffron-400" />
              <span>पावन दान (Donate)</span>
            </button>

            <button
              onClick={onBackToHome}
              className="px-5 py-3 rounded-full bg-coffee-950 border border-gold-500/40 text-gold-400 hover:text-gold-200 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>मुख्यपृष्ठ (Home)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
