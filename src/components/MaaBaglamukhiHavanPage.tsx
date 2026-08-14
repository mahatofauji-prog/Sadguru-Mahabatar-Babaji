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
  Flame,
  Zap,
  Sun,
  Award,
  PhoneCall,
  Compass,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Camera,
  Maximize2
} from 'lucide-react';

interface MaaBaglamukhiHavanPageProps {
  onBackToHome: () => void;
  onOpenDonate: () => void;
  onOpenContact: () => void;
}

const HAVAN_IMAGES = [
  {
    id: '1',
    src: '/images/baglamukhi/IMG-20260811-WA0027.jpg',
    title: 'अभेद्य माँ बगलामुखी विशेष हवन - मुख्य दर्शन',
    titleEn: 'Maa Baglamukhi Vishesh Havan Yajna',
    caption: 'परम पूज्य श्री श्री १००८ अनंत विभूषित महामंडलेश्वर स्वामी डॉ. निर्मल जी महाराज द्वारा पीतांबरा बगलामुखी महायज्ञ',
    captionEn: 'His Holiness Sri Sri 1008 Mahamandaleshwar Swami Dr. Nirmal Ji Maharaj conducting the Pitambara Baglamukhi Mahayajna',
    tag: 'मुख्य दर्शन'
  },
  {
    id: '2',
    src: '/images/baglamukhi/IMG-20260811-WA0023.jpg',
    title: 'पावन यज्ञ कुण्ड एवं आहुति अनुष्ठान',
    titleEn: 'Sacred Fire Kund & Ahuti Ritual',
    caption: 'पीले द्रव्यों, पीली सरसों एवं दुर्लभ जड़ी-बूटियों से माँ बगलामुखी को समर्पित पवित्र आहुतियाँ',
    captionEn: 'Holy offerings of yellow herbs and rare substances dedicated to Goddess Baglamukhi',
    tag: 'यज्ञ कुण्ड'
  },
  {
    id: '3',
    src: '/images/baglamukhi/IMG-20260811-WA0026.jpg',
    title: 'पूर्णाहुति एवं शक्तिपात आशीर्वाद',
    titleEn: 'Purnahuti & Shaktipat Blessings',
    caption: 'स्वामी डॉ. निर्मल जी महाराज द्वारा साधक कल्याण हेतु विशेष शक्तिपात व भस्म दीक्षा',
    captionEn: 'Special Shaktipat and divine ash blessings by Swami Dr. Nirmal Ji Maharaj for spiritual progress',
    tag: 'शक्तिपात'
  },
  {
    id: '4',
    src: '/images/baglamukhi/IMG-20260811-WA0028.jpg',
    title: 'सामूहिक साधना एवं दिव्य सानिध्य',
    titleEn: 'Group Sadhana & Spiritual Presence',
    caption: 'सरल ध्यान योग पीठ में साधकों द्वारा दिव्य हवन में भक्तिमयी सहभागिता',
    captionEn: 'Devotees participating in the transformative group Yajna at the Peeth',
    tag: 'साधक सहभागिता'
  },
  {
    id: '5',
    src: '/images/baglamukhi/IMG-20260811-WA0029.jpg',
    title: 'हवन आहुति एवं जाप',
    titleEn: 'Havan Ahuti & Chanting',
    caption: 'माँ बगलामुखी के बीज मंत्रों के साथ हवन कुण्ड में आहुति',
    captionEn: 'Offering Ahutis in Havan Kund with Maa Baglamukhi Beej Mantras',
    tag: 'साधना'
  },
  {
    id: '6',
    src: '/images/baglamukhi/IMG-20260811-WA0030.jpg',
    title: 'दिव्य सानिध्य',
    titleEn: 'Spiritual Presence',
    caption: 'सरल ध्यान योग पीठ में दिव्य हवन की झलक',
    captionEn: 'Divine Havan glimpses at the Peeth',
    tag: 'सानिध्य'
  },
  {
    id: '7',
    src: '/images/baglamukhi/IMG-20260804-WA0066.jpg',
    title: 'माँ बगलामुखी विशेष हवन',
    titleEn: 'Maa Baglamukhi Vishesh Havan',
    caption: 'माँ बगलामुखी विशेष हवन की पावन झलक',
    captionEn: 'Glimpses of Maa Baglamukhi Vishesh Havan',
    tag: 'हवन'
  },
  {
    id: '8',
    src: '/images/baglamukhi/IMG-20260811-WA0024.jpg',
    title: 'दिव्य हवन दर्शन',
    titleEn: 'Divine Havan Darshan',
    caption: 'माँ बगलामुखी विशेष हवन की पावन झलक',
    captionEn: 'Glimpses of Maa Baglamukhi Vishesh Havan',
    tag: 'हवन'
  },
  {
    id: '9',
    src: '/images/baglamukhi/IMG-20260811-WA0031.jpg',
    title: 'विशेष अनुष्ठान',
    titleEn: 'Special Ritual',
    caption: 'माँ बगलामुखी विशेष अनुष्ठान एवं हवन',
    captionEn: 'Glimpses of Maa Baglamukhi Vishesh Havan',
    tag: 'अनुष्ठान'
  },
  {
    id: '10',
    src: '/images/baglamukhi/IMG-20260811-WA0033.jpg',
    title: 'सामूहिक अनुष्ठान',
    titleEn: 'Group Rituals',
    caption: 'माँ बगलामुखी विशेष हवन की पावन झलक',
    captionEn: 'Glimpses of Maa Baglamukhi Vishesh Havan',
    tag: 'साधना'
  },
  {
    id: '11',
    src: '/images/baglamukhi/IMG-20260811-WA0034.jpg',
    title: 'हवन पूर्णाहुति',
    titleEn: 'Havan Purnahuti',
    caption: 'हवन की पूर्णाहुति एवं महाआरती की पावन झलक',
    captionEn: 'Glimpses of Maa Baglamukhi Vishesh Havan Purnahuti',
    tag: 'आहुति'
  }
];

export default function MaaBaglamukhiHavanPage({
  onBackToHome,
  onOpenDonate,
  onOpenContact
}: MaaBaglamukhiHavanPageProps) {
  const [language, setLanguage] = useState<'english' | 'hindi' | 'both'>('both');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const { images, getImageUrl } = useImageContext();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);




  const baglamukhiImageKeys: SingleImageKey[] = [
    'baglamukhiImg1',
    'baglamukhiImg2',
    'baglamukhiImg3',
    'baglamukhiImg4',
    'baglamukhiImg5',
    'baglamukhiImg6',
    'baglamukhiImg7',
    'baglamukhiImg8',
    'baglamukhiImg9',
    'baglamukhiImg10',
    'baglamukhiImg11',
    'baglamukhiImg12',
    'baglamukhiImg13',
    'baglamukhiImg14'
  ];

  const baseHavanImages = HAVAN_IMAGES.map((img, idx) => {
    const key = baglamukhiImageKeys[idx];
    const customSrc = key ? getImageUrl(key) : '';
    if (customSrc) return { ...img, src: customSrc };
    return img;
  });

  const userUploadedBaglamukhi = images.galleryImages.filter(
    (img) => img.category === 'baglamukhi' || img.category === 'babaji'
  );

  const dynamicHavanImages = userUploadedBaglamukhi.length > 0
    ? [
        ...userUploadedBaglamukhi.map((img) => ({
          id: img.id,
          src: img.src,
          title: img.title || 'पावन हवन दर्शन',
          titleEn: img.title || 'Divine Havan Darshan',
          caption: 'माँ बगलामुखी विशेष हवन एवं दिव्य अनुष्ठान',
          captionEn: 'Glimpses of Maa Baglamukhi Vishesh Havan',
          tag: 'पावन दर्शन'
        })),
        ...baseHavanImages
      ]
    : baseHavanImages;

  useEffect(() => {
    const maxHero = Math.min(5, dynamicHavanImages.length);
    if (maxHero <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % maxHero);
    }, 4000);
    return () => clearInterval(interval);
  }, [dynamicHavanImages.length]);

  const handleNextLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % dynamicHavanImages.length);
    }
  };

  const handlePrevLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + dynamicHavanImages.length) % dynamicHavanImages.length);
    }
  };

  const englishContent = {
    pageTitle: 'Maa Baglamukhi Vishesh Havan',
    subtitle: '🌺 SPECIAL PAGE CONTENT (ENGLISH)',
    tagline:
      'Maa Baglamukhi Vishesh Havan: Cosmic Protection, Karmic Shielding & Triumph Over Negativity',
    introTitle: 'Introduction: The Cosmic Energy of Maa Baglamukhi',
    introPara1:
      'Maa Baglamukhi, the 8th manifestation among the ten sacred Mahavidyas, represents the cosmic power of Stambhana (the power to paralyze negative forces, silence hostile intentions, and neutralize planetary afflictions).',
    introPara2:
      'Under the divine spiritual guidance of His Holiness Sri Sri 1008 Anant Vibhushit Mahamandaleshwar Swami Dr. Nirmal Ji Maharaj, the Sadguru Mahavatar Babaji Saral Dhyan Yog Peeth conducts the Abhedya Maa Baglamukhi Vishesh Havan. This sacred Yajna uses ancient Tantric sound frequencies and precise Vedic rituals to construct an impenetrable energetic shield (Divya Kavach) around the practitioner.',
    principlesTitle: 'Spiritual & Scientific Principles of the Havan',
    principles: [
      {
        title: 'Science of Cosmic Sound Frequencies (Mantra Vibrations):',
        text: 'Sacred Beej Mantras recited during the Yajna generate powerful sound vibrations that penetrate the subtle energy field (Aura), shattering persistent karmic blocks and clearing toxic energetic environments.'
      },
      {
        title: 'Bio-Energetic Shielding (Divya Kavach):',
        text: 'The consecrated oblations (Aahutis) offered with rare herbal ingredients create a protective bio-magnetic field, deflecting external psychic intrusions, negative intentions, and malicious influences.'
      },
      {
        title: 'Neutralization of Planetary Afflictions (Grah Dosh Nivaran):',
        text: 'Aligns distorted planetary energies, particularly mitigating severe afflictions caused by Rahu, Ketu, and Saturn (Shani), restoring balance and peace.'
      }
    ],
    benefitsTitle: 'Core Spiritual & Practical Benefits',
    benefits: [
      {
        title: 'Protection from Legal & Personal Conflicts:',
        text: 'Silences hostile arguments, dissolves malicious litigation, and grants victory over hidden adversaries.'
      },
      {
        title: 'Removal of Financial & Business Stagnation:',
        text: 'Clears stagnant energy in the Root (Muladhara) and Solar Plexus (Manipura) chakras, unlocking steady prosperity and business success.'
      },
      {
        title: 'Dissolution of Chronic Anxiety & Fear:',
        text: 'Eliminates unexplained fears, deep-seated psychological burdens, and emotional disturbances.'
      },
      {
        title: 'Purification of Domestic Spaces:',
        text: 'Cleanses the home or workplace environment of heavy, stagnant, or harmful energies.'
      }
    ],
    procedureTitle: 'Procedure & Participation Guidelines',
    procedure: [
      {
        title: 'Sankalp (Sacred Intent):',
        text: "The Yajna begins with a formal Sankalp, aligning the participant's name, lineage (Gotra), and specific prayer with the cosmic ritual."
      },
      {
        title: 'Shatkarma & Purificatory Rites:',
        text: 'Ritual purifications are performed to cleanse the subtle channels before invoking the Goddess.'
      },
      {
        title: 'Mukhya Ahuti (Primary Offerings):',
        text: 'Consecrated yellow ingredients (including turmeric, yellow mustard, and rare herbs) are offered into the holy fire.'
      },
      {
        title: 'Purnahuti & Shaktipat Blessing:',
        text: 'The ritual concludes with the final offering (Purnahuti), followed by divine energetic blessings from Sri Sri 1008 Anant Vibhushit Mahamandaleshwar Swami Dr. Nirmal Ji Maharaj.'
      }
    ]
  };

  const hindiContent = {
    pageTitle: 'माँ बगलामुखी विशेष हवन',
    subtitle: '🌺 SPECIAL PAGE CONTENT (HINDI / हिंदी)',
    tagline: 'माँ बगलामुखी विशेष हवन: दिव्य सुरक्षा कवच, शत्रु शमन और नकारात्मकता का निवारण',
    introTitle: 'प्रस्तावना: माँ बगलामुखी की ब्रह्मांडीय शक्ति',
    introPara1:
      'दस महाविद्याओं में आठवीं महाविद्या माँ बगलामुखी स्तंभन (नकारात्मक शक्तियों को निष्क्रिय करने, प्रतिकूल इरादों को शांत करने और ग्रहीय बाधाओं को दूर करने) की सर्वोपरि शक्ति हैं।',
    introPara2:
      'परम पूज्य श्री श्री १००८ अनंत विभूषित महामंडलेश्वर स्वामी डॉ. निर्मल जी महाराज के दिव्य सानिध्य में, सद्गुरु महावतार बाबाजी सरल ध्यान योग पीठ द्वारा अभेद्य माँ बगलामुखी विशेष हवन का आयोजन किया जाता है। यह पवित्र यज्ञ प्राचीन तांत्रिक ध्वनि तरंगों और शास्त्रोक्त वैदिक अनुष्ठानों का उपयोग करके साधक के चारों ओर एक अभेद्य \'दिव्य कवच\' का निर्माण करता है।',
    principlesTitle: 'हवन का आध्यात्मिक एवं वैज्ञानिक आधार',
    principles: [
      {
        num: '१.',
        title: 'ब्रह्मांडीय ध्वनि विज्ञान (मंत्र स्पंदन):',
        text: 'यज्ञ के दौरान उच्चारण किए जाने वाले दिव्य बीज मंत्र शक्तिशाली ध्वनि तरंगें उत्पन्न करते हैं जो साधक के आभामंडल (Aura) को शुद्ध कर पुराने कर्मा के बंधनों और नकारात्मकता को नष्ट करती हैं।'
      },
      {
        num: '२.',
        title: 'जैव-ऊर्जात्मक सुरक्षा कवच (दिव्य कवच):',
        text: 'दुर्लभ जड़ी-बूटियों से दी जाने वाली आहुतियाँ एक सुरक्षात्मक विद्युत-चुंबकीय क्षेत्र बनाती हैं, जो बाहरी मानसिक आघातों, नकारात्मक इरादों और अभिचार (काला जादू) से रक्षा करती हैं।'
      },
      {
        num: '३.',
        title: 'ग्रह दोष निवारण:',
        text: 'यह अनुष्ठान विशेष रूप से राहु, केतु और शनि के गंभीर दुष्प्रभावों को शांत कर जीवन में संतुलन और शांति स्थापित करता है।'
      }
    ],
    benefitsTitle: 'साधना एवं यज्ञ के मुख्य लाभ',
    benefits: [
      {
        title: 'कानूनी विवादों और विरोधियों पर विजय:',
        text: 'प्रतिकूल परिस्थितियों, कोर्ट-कचहरी के विवादों और अज्ञात शत्रुओं के दुष्प्रभावों को शांत करता है।'
      },
      {
        title: 'व्यापारिक एवं वित्तीय रुकावटों का निवारण:',
        text: 'मूलाधार और मणिपुर चक्र में ऊर्जा रुकावटों को दूर कर व्यवसाय में स्थिरता और लक्ष्मी कृपा लाता है।'
      },
      {
        title: 'अज्ञात भय और मानसिक तनाव से मुक्ति:',
        text: 'मन से गहरे भय, अवसाद और अज्ञात चिंताओं को समूल समाप्त करता है।'
      },
      {
        title: 'वास्तु एवं पर्यावरण शुद्धि:',
        text: 'घर या कार्यस्थल की नकारात्मक ऊर्जा को दूर कर वातावरण को सकारात्मक और ऊर्जावान बनाता है।'
      }
    ],
    procedureTitle: 'हवन की प्रक्रिया एवं भाग लेने की विधि',
    procedure: [
      {
        num: '१.',
        title: 'संकल्प:',
        text: 'अनुष्ठान की शुरुआत साधक के नाम, गोत्र और विशिष्ट मनोकामना के साथ शास्त्रोक्त संकल्प से होती है।'
      },
      {
        num: '२.',
        title: 'षट्कर्म एवं शुद्धि:',
        text: 'देवी का आह्वान करने से पूर्व सूक्ष्म ऊर्जा वाहिकाओं को शुद्ध करने के लिए विशेष मंत्रोचार किया जाता है।'
      },
      {
        num: '३.',
        title: 'मुख्य आहुति:',
        text: 'पीले द्रव्यों (जैसे पीली सरसों, हल्दी, और विशेष हवन सामग्री) से माँ बगलामुखी को समर्पित आहुतियाँ दी जाती हैं।'
      },
      {
        num: '४.',
        title: 'पूर्णाहुति एवं आशीर्वाद:',
        text: 'अंतिम आहुति (पूर्णाहुति) के पश्चात श्री श्री १००८ अनंत विभूषित महामंडलेश्वर स्वामी डॉ. निर्मल जी महाराज द्वारा साधकों को दिव्य शक्तिपात और आशीर्वाद प्रदान किया जाता है।'
      }
    ]
  };

  return (
    <div className="pt-28 pb-20 bg-coffee-950 text-gold-100 min-h-screen relative overflow-hidden">
      {/* Background Divine Golden Aura Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[850px] bg-gradient-to-b from-saffron-500/20 via-gold-500/15 to-transparent rounded-full blur-[190px] pointer-events-none" />

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

        {/* TOP FEATURED HERO BANNER IMAGE (ANIMATED SLIDER) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          onClick={() => setActiveLightboxIndex(currentHeroIndex)}
          className="relative mb-8 rounded-3xl overflow-hidden border-2 border-gold-500/50 bg-coffee-950 shadow-[0_0_50px_rgba(255,215,0,0.25)] group cursor-pointer"
        >
          <div className="w-full relative overflow-hidden aspect-[4/3] sm:aspect-[21/9]">
            <AnimatePresence mode="popLayout">
              <motion.img
                key={currentHeroIndex}
                src={dynamicHavanImages[currentHeroIndex]?.src}
                alt={dynamicHavanImages[currentHeroIndex]?.title}
                referrerPolicy="no-referrer"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full object-cover object-top sm:object-center absolute inset-0 group-hover:scale-105 transition-transform duration-700"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-coffee-950 via-coffee-950/40 to-transparent" />

            {/* Floating badges */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
              <span className="bg-saffron-500 text-coffee-50 font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-lg border border-gold-300 flex items-center gap-1.5">
                <Flame size={14} />
                पावन दर्शन
              </span>
              <span className="bg-coffee-950/80 backdrop-blur-md text-gold-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-gold-500/30 hidden sm:inline-block">
                अभय पीठ बगलामुखी महायज्ञ
              </span>
            </div>

            <div className="absolute top-4 right-4 w-10 h-10 z-10 rounded-full bg-coffee-950/80 backdrop-blur-md border border-gold-500/50 flex items-center justify-center text-gold-300 group-hover:scale-110 transition-transform">
              <Maximize2 size={18} />
            </div>

            {/* Caption Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-left z-10">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentHeroIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-[10px] sm:text-xs text-saffron-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Award size={14} />
                    {dynamicHavanImages[currentHeroIndex]?.tag || 'पावन दर्शन'}
                  </p>
                  <h3 className="font-serif text-xl sm:text-3xl font-extrabold text-gold-100 mb-2 drop-shadow-md">
                    {dynamicHavanImages[currentHeroIndex]?.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gold-200/90 max-w-3xl line-clamp-2 drop-shadow-sm">
                    {dynamicHavanImages[currentHeroIndex]?.caption}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Dots indicator */}
              <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                {Array.from({ length: Math.min(5, dynamicHavanImages.length) }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentHeroIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentHeroIndex ? 'w-6 bg-saffron-400' : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hero Section Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 bg-gradient-to-b from-coffee-900/95 via-coffee-900/70 to-coffee-950 p-8 sm:p-12 rounded-3xl border-2 border-gold-500/40 shadow-[0_0_50px_rgba(255,215,0,0.18)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-saffron-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/40 bg-saffron-500/15 text-saffron-400 text-xs font-bold tracking-widest uppercase mb-6">
            <Flame size={16} className="text-saffron-400" />
            <span>विशेष हवन अनुष्ठान (DIVYE HAWAN SERVICES)</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold gold-gradient-text leading-tight mb-4">
            Maa Baglamukhi Vishesh Havan
          </h1>

          <h2 className="font-serif text-2xl sm:text-3xl text-saffron-300 font-bold mb-6">
            माँ बगलामुखी विशेष हवन
          </h2>

          <p className="text-base sm:text-lg text-gold-200/90 max-w-3xl mx-auto font-medium mb-6">
            Cosmic Protection, Karmic Shielding & Triumph Over Negativity
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-gold-200/90 font-medium pt-2">
            <span className="flex items-center gap-1.5 bg-coffee-950/70 px-3.5 py-1.5 rounded-full border border-gold-500/20">
              <Award size={14} className="text-saffron-400" />
              श्री श्री १००८ अनंत विभूषित महामंडलेश्वर स्वामी डॉ. निर्मल जी महाराज मार्गदर्शन
            </span>
            <span className="flex items-center gap-1.5 bg-coffee-950/70 px-3.5 py-1.5 rounded-full border border-gold-500/20">
              <Sparkles size={14} className="text-gold-400" />
              दिव्य पीतांबरा बगलामुखी शक्तिपात अनुष्ठान
            </span>
          </div>
        </motion.div>

        {/* FEATURED HAVAN PHOTO SHOWCASE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Camera className="text-saffron-400" size={24} />
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-gold-300">
                पावन अनुष्ठान मुख्य झांकी (Featured Yajna Gallery)
              </h3>
            </div>
            <span className="text-xs text-gold-300/80 bg-coffee-900 px-3 py-1.5 rounded-full border border-gold-500/30 flex items-center gap-1">
              <Eye size={14} className="text-saffron-400" />
              चित्र पर क्लिक करके बड़ा देखें
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dynamicHavanImages.slice(5, 7).map((img, idx) => (
              <div
                key={img.id}
                onClick={() => setActiveLightboxIndex(idx)}
                className="group relative rounded-3xl overflow-hidden border-2 border-gold-500/40 bg-coffee-900 shadow-2xl cursor-pointer transition-all duration-500 hover:border-saffron-400 hover:shadow-[0_0_35px_rgba(255,183,3,0.3)]"
              >
                <div className="aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden relative">
                  <img
                    src={img.src}
                    alt={img.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-coffee-950 via-coffee-950/30 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />

                  {/* Badge & Zoom Icon */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="bg-saffron-500/90 text-coffee-50 font-extrabold text-xs px-3 py-1 rounded-full shadow-lg border border-gold-300">
                      {img.tag}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-coffee-950/80 backdrop-blur-md border border-gold-500/50 flex items-center justify-center text-gold-300 group-hover:scale-110 transition-transform">
                    <Maximize2 size={16} />
                  </div>

                  {/* Caption Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-left">
                    <h4 className="font-serif text-lg sm:text-xl font-bold text-gold-200 group-hover:text-gold-100 transition-colors mb-1">
                      {img.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gold-100/80 line-clamp-2">
                      {img.caption}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* MAIN CONTENT SECTIONS */}
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
                <span>🌺 {englishContent.subtitle}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gold-300 mb-4">
                {englishContent.pageTitle}
              </h2>
              <p className="text-lg font-semibold text-saffron-300 mb-6">
                {englishContent.tagline}
              </p>
              <h3 className="font-serif text-xl font-bold text-gold-300 mb-4">
                {englishContent.introTitle}
              </h3>
              <div className="space-y-4 text-gold-100/90 text-base sm:text-lg leading-relaxed font-sans">
                <p className="bg-coffee-950/50 p-5 rounded-2xl border border-gold-500/20">
                  {englishContent.introPara1}
                </p>
                <p className="bg-coffee-950/50 p-5 rounded-2xl border border-gold-500/20">
                  {englishContent.introPara2}
                </p>
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
                <span>🌺 {hindiContent.subtitle}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gold-300 mb-4">
                {hindiContent.pageTitle}
              </h2>
              <p className="text-lg font-semibold text-saffron-300 mb-6">
                {hindiContent.tagline}
              </p>
              <h3 className="font-serif text-xl font-bold text-gold-300 mb-4">
                {hindiContent.introTitle}
              </h3>
              <div className="space-y-4 text-gold-100/90 text-base sm:text-lg leading-relaxed font-sans">
                <p className="bg-coffee-950/50 p-5 rounded-2xl border border-gold-500/20">
                  {hindiContent.introPara1}
                </p>
                <p className="bg-coffee-950/50 p-5 rounded-2xl border border-gold-500/20">
                  {hindiContent.introPara2}
                </p>
              </div>
            </motion.section>
          )}

          {/* 2. PRINCIPLES SECTION */}
          {(language === 'both' || language === 'english') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <Flame className="text-saffron-400" size={28} />
                <h2 className="font-serif text-2xl sm:text-3xl font-bold gold-gradient-text">
                  {englishContent.principlesTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {englishContent.principles.map((item, idx) => (
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
                  {hindiContent.principlesTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {hindiContent.principles.map((item, idx) => (
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
            </motion.section>
          )}

          {/* 3. CORE BENEFITS SECTION */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </motion.section>
          )}

          {/* 4. PROCEDURE SECTION */}
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
                  {englishContent.procedureTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {englishContent.procedure.map((item, idx) => (
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
                  {hindiContent.procedureTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hindiContent.procedure.map((item, idx) => (
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
            </motion.section>
          )}

          {/* DEDICATED FULL HAVAN PHOTO GALLERY */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 pt-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-500/30 pb-4">
              <div className="flex items-center gap-3">
                <Camera className="text-saffron-400 shrink-0" size={28} />
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold gold-gradient-text">
                    पावन हवन दर्शन एवं दिव्य अनुष्ठान फोटो गैलरी
                  </h2>
                  <p className="text-xs sm:text-sm text-gold-200/80 mt-1">
                    Divine Gallery of Maa Baglamukhi Vishesh Havan Rituals & Blessings
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-300 bg-saffron-500/15 border border-saffron-500/30 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
                <Sparkles size={14} />
                कुल {dynamicHavanImages.slice(7).length} अन्य पावन चित्र ({dynamicHavanImages.slice(7).length} Other Sacred Photos)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {dynamicHavanImages.slice(7).map((img, index) => {
                const idx = index + 7;
                return (
                <motion.div
                  key={img.id}
                  whileHover={{ y: -5 }}
                  onClick={() => setActiveLightboxIndex(idx)}
                  className="group relative bg-coffee-900/80 rounded-2xl overflow-hidden border border-gold-500/30 shadow-lg cursor-pointer hover:border-gold-400 hover:shadow-[0_0_25px_rgba(255,215,0,0.25)] transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden relative bg-coffee-950">
                    <img
                      src={img.src}
                      alt={img.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-coffee-950 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

                    <span className="absolute top-3 left-3 bg-coffee-950/80 backdrop-blur-md text-saffron-300 font-bold text-[10px] px-2.5 py-0.5 rounded-md border border-gold-500/30">
                      {img.tag}
                    </span>

                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-coffee-950/80 backdrop-blur-md border border-gold-500/40 flex items-center justify-center text-gold-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all">
                      <Maximize2 size={14} />
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-gold-200 group-hover:text-gold-100 line-clamp-1 mb-1">
                        {img.title}
                      </h4>
                      <p className="text-[11px] text-gold-100/70 line-clamp-2 leading-relaxed">
                        {img.caption}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gold-500/10 flex items-center justify-between text-[10px] text-saffron-400 font-semibold">
                      <span>बड़ा करके देखें</span>
                      <Eye size={12} />
                    </div>
                  </div>
                </motion.div>
              ); })}
            </div>
          </motion.section>
        </div>

        {/* BOTTOM CALL TO ACTION */}
        <div className="mt-16 pt-8 border-t border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 bg-coffee-900/60 p-6 sm:p-8 rounded-3xl">
          <div className="flex flex-col text-center sm:text-left">
            <h3 className="font-serif text-xl font-bold text-gold-300 mb-1">
              विशेष हवन संकल्प एवं पंजीयन हेतु संपर्क करें
            </h3>
            <p className="text-xs sm:text-sm text-gold-100/70">
              For Yajna Sankalp registration & personal guidance, contact the Peeth.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenContact}
              className="px-5 py-3 rounded-full bg-gradient-to-r from-saffron-500 to-gold-400 text-coffee-50 font-bold text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall size={16} />
              <span>हवन संकल्प पंजीयन (Register)</span>
            </button>

            <button
              onClick={onOpenDonate}
              className="px-5 py-3 rounded-full bg-transparent border border-gold-500 text-gold-300 hover:bg-gold-500/10 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Heart size={16} className="text-saffron-400" />
              <span>यज्ञ सेवा दान (Donate)</span>
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

      {/* INTERACTIVE LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeLightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-6"
            onClick={() => setActiveLightboxIndex(null)}
          >
            {/* Top Bar Controls */}
            <div
              className="w-full max-w-6xl flex items-center justify-between text-gold-200 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="bg-saffron-500/20 text-saffron-400 font-bold text-xs px-3 py-1 rounded-full border border-saffron-500/40">
                  {dynamicHavanImages[activeLightboxIndex].tag}
                </span>
                <span className="text-xs text-gold-300 font-medium">
                  {activeLightboxIndex + 1} / {dynamicHavanImages.length}
                </span>
              </div>

              <button
                onClick={() => setActiveLightboxIndex(null)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/20"
                aria-label="Close modal"
              >
                <X size={22} />
              </button>
            </div>

            {/* Main Lightbox Image Display */}
            <div
              className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-2 sm:my-4 select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Button */}
              <button
                onClick={handlePrevLightbox}
                className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-saffron-500 hover:text-black text-gold-300 border border-gold-500/30 transition-all cursor-pointer shadow-2xl"
                aria-label="Previous image"
              >
                <ChevronLeft size={28} />
              </button>

              <motion.div
                key={activeLightboxIndex}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="max-h-[75vh] max-w-full flex items-center justify-center rounded-2xl overflow-hidden border-2 border-gold-500/40 shadow-[0_0_50px_rgba(255,215,0,0.2)] bg-coffee-950"
              >
                <img
                  src={dynamicHavanImages[activeLightboxIndex].src}
                  alt={dynamicHavanImages[activeLightboxIndex].title}
                  referrerPolicy="no-referrer"
                  className="max-h-[75vh] max-w-full object-contain rounded-xl"
                />
              </motion.div>

              {/* Next Button */}
              <button
                onClick={handleNextLightbox}
                className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-saffron-500 hover:text-black text-gold-300 border border-gold-500/30 transition-all cursor-pointer shadow-2xl"
                aria-label="Next image"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {/* Caption & Description Bar */}
            <div
              className="w-full max-w-3xl text-center bg-coffee-900/90 border border-gold-500/40 p-4 rounded-2xl backdrop-blur-md shadow-2xl z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif text-lg sm:text-xl font-bold text-gold-300 mb-1">
                {dynamicHavanImages[activeLightboxIndex].title}
              </h3>
              <p className="text-xs sm:text-sm text-gold-100/90 font-medium">
                {dynamicHavanImages[activeLightboxIndex].caption}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
