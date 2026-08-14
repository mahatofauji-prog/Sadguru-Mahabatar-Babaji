import { motion } from 'motion/react';
import { Sparkles, Award } from 'lucide-react';
import { useImageContext } from '../context/ImageContext';
import { useSiteContent } from '../context/SiteContentContext';
import { SingleImageUploader } from './ImageUploader';

export default function GuruSection() {
  const { images, getImageUrl } = useImageContext();
  const { content } = useSiteContent();

  return (
    <section id="guru" className="py-24 bg-gradient-to-b from-coffee-950 via-coffee-900 to-coffee-950 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-saffron-500/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-saffron-500/40 bg-coffee-900/60 text-saffron-400 text-xs font-semibold tracking-widest uppercase mb-4">
            <Sparkles size={14} className="text-gold-400" />
            <span>{content.guru.title}</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold gold-gradient-text leading-snug mb-4">
            {content.guru.guruName}
          </h2>

          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-saffron-500 to-transparent mx-auto mt-4"></div>
        </div>

        {/* Top Portrait & Intro Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          {/* Portrait Image Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-xs sm:max-w-sm aspect-[4/5] mx-auto rounded-3xl p-2.5 bg-gradient-to-tr from-gold-500 via-saffron-500 to-gold-300 shadow-[0_0_50px_rgba(255,153,51,0.3)] flex items-center justify-center"
            >
              <SingleImageUploader imageKey="guruPortrait" label="गुरुजी फोटो बदलें" badgePosition="top-right">
                <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-coffee-950 bg-coffee-900 relative">
                  <img
                    src={getImageUrl('guruPortrait') || '/assets/IMG-20260804-WA0008.jpg'}
                    alt="Sri Sri 1008 Anant Vibhushit Mahamandaleshwar Swami Dr. Nirmal Ji Maharaj"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-coffee-950/80 via-transparent to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-center pointer-events-none">
                    <span className="text-xs text-gold-300 font-bold bg-coffee-950/90 px-3 py-1.5 rounded-full border border-gold-500/40 inline-flex items-center gap-1.5 shadow-lg">
                      <Award size={14} className="text-saffron-400" />
                      <span>{content.guru.guruTitle}</span>
                    </span>
                  </div>
                </div>
              </SingleImageUploader>
            </motion.div>
          </div>

          {/* Intro Text Box */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 glass-panel p-8 sm:p-10 rounded-3xl border-2 border-gold-500/40 shadow-2xl relative"
          >
            <p className="font-serif text-lg sm:text-xl text-gold-100 leading-relaxed font-normal">
              <strong className="text-gold-300 font-bold block text-2xl mb-3">
                {content.guru.guruName}
              </strong>
              {content.guru.bio}
            </p>
          </motion.div>
        </div>

        {/* 4 Core Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card-glow p-8 rounded-3xl border-2 border-gold-500/30 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🔱</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-gold-300">
                  १. आध्यात्मिक परंपरा और पवित्र संप्रदाय
                </h3>
              </div>
              <ul className="space-y-4 text-gold-100/90 text-sm sm:text-base font-sans leading-relaxed">
                <li className="flex items-start gap-2 bg-coffee-950/60 p-3.5 rounded-xl border border-gold-500/20">
                  <span>•</span>
                  <div>
                    <strong className="text-saffron-300 font-bold">दशनामी एवं नाथ परंपरा:</strong> श्री श्री १००८ अनंत विभूषित महामंडलेश्वर स्वामी डॉ. निर्मल जी महाराज सर्वोच्च संन्यासी परंपराओं में से एक दशनामी (गिरि) संप्रदाय और संप्रभु नाथ परंपरा से जुड़े एक सिद्ध साधक हैं।
                  </div>
                </li>
                <li className="flex items-start gap-2 bg-coffee-950/60 p-3.5 rounded-xl border border-gold-500/20">
                  <span>•</span>
                  <div>
                    <strong className="text-saffron-300 font-bold">महामंडलेश्वर पद की गरिमा:</strong> 'महामंडलेश्वर' का पद सनातन संन्यासी परंपरा में सबसे सम्मानित और उच्च आध्यात्मिक पदों में से एक है। इस पवित्र पद के माध्यम से, वे वैश्विक साधकों का प्रशासनिक और आध्यात्मिक मार्गदर्शन करते हैं।
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="glass-card-glow p-8 rounded-3xl border-2 border-gold-500/30 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🧘</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-gold-300">
                  २. महावतार बाबाजी से दिव्य संबंध एवं 'सरल ध्यान योग'
                </h3>
              </div>
              <ul className="space-y-4 text-gold-100/90 text-sm sm:text-base font-sans leading-relaxed">
                <li className="flex items-start gap-2 bg-coffee-950/60 p-3.5 rounded-xl border border-gold-500/20">
                  <span>•</span>
                  <div>
                    <strong className="text-saffron-300 font-bold">महावतार बाबाजी के साथ आध्यात्मिक जुड़ाव:</strong> वे अपने आध्यात्मिक कार्य को अमर हिमालयी योगी महावतार बाबाजी की शाश्वत चेतना और पवित्र क्रिया योग परंपरा के संरक्षण के लिए समर्पित करते हैं।
                  </div>
                </li>
                <li className="flex items-start gap-2 bg-coffee-950/60 p-3.5 rounded-xl border border-gold-500/20">
                  <span>•</span>
                  <div>
                    <strong className="text-saffron-300 font-bold">सरल ध्यान योग के प्रणेता:</strong> आधुनिक जीवन के तनाव, चिंता और भागदौड़ से मुक्ति दिलाने के लिए, उन्होंने सरल ध्यान योग की रचना की—यह एक सहज, सरल लेकिन अत्यंत प्रभावशाली ध्यान विज्ञान है जो साधक को आंतरिक शून्यता (परम शांति / द क्वांटम वॉइड) से जोड़ता है।
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card-glow p-8 rounded-3xl border-2 border-gold-500/30 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🛡️</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-gold-300">
                  ३. मुख्य शिक्षाएँ एवं दिव्य निर्देश
                </h3>
              </div>
              <ul className="space-y-4 text-gold-100/90 text-sm sm:text-base font-sans leading-relaxed">
                <li className="flex items-start gap-2 bg-coffee-950/60 p-3.5 rounded-xl border border-gold-500/20">
                  <span>•</span>
                  <div>
                    <strong className="text-saffron-300 font-bold">जैव-ऊर्जात्मक सुरक्षा कवच (दिव्य कवच):</strong> वे साधकों को उनके विद्युत चुंबकीय आभामंडल (Aura) को मजबूत करने का मार्गदर्शन देते हैं, जिससे एक सुरक्षित 'दिव्य कवच' बनता है जो नकारात्मक ऊर्जाओं, मानसिक तनाव और कर्मा के बोझ से रक्षा करता है।
                  </div>
                </li>
                <li className="flex items-start gap-2 bg-coffee-950/60 p-3.5 rounded-xl border border-gold-500/20">
                  <span>•</span>
                  <div>
                    <strong className="text-saffron-300 font-bold">शक्तिपात और कर्म मुक्ति:</strong> उनके आध्यात्मिक प्रभाव और शक्तिपात दीक्षा के माध्यम से, साधक अपने अतीत के नकारात्मक कर्म बंधनों को काटकर मानसिक स्पष्टता और भावनात्मक संतुलन प्राप्त करते हैं।
                  </div>
                </li>
                <li className="flex items-start gap-2 bg-coffee-950/60 p-3.5 rounded-xl border border-gold-500/20">
                  <span>•</span>
                  <div>
                    <strong className="text-saffron-300 font-bold">वैदिक एवं तांत्रिक विद्याओं का संरक्षण:</strong> माँ बगलामुखी और माँ दक्षिणा काली की दिव्य शक्तियों का आह्वान करते हुए, वे ध्वनि तरंगों के विज्ञान का उपयोग करके व्यक्तिगत और वैश्विक नकारात्मकता को दूर करने के लिए 'अभेद्य मंत्र यज्ञ' (शास्त्रोक्त हवन एवं यज्ञ) आयोजित करते हैं।
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Card 4 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="glass-card-glow p-8 rounded-3xl border-2 border-gold-500/30 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🤝</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-gold-300">
                  ४. वैश्विक मानवीय पहल (वैश्विक सेवा)
                </h3>
              </div>
              <p className="text-xs text-saffron-300 font-semibold mb-3">
                महाराज जी के दिव्य मार्गदर्शन में, पीठ कई बड़े सामाजिक और मानवीय सेवा कार्यों का संचालन करता है:
              </p>
              <ul className="space-y-3 text-gold-100/90 text-sm sm:text-base font-sans leading-relaxed">
                <li className="flex items-start gap-2 bg-coffee-950/60 p-3 rounded-xl border border-gold-500/20">
                  <span>•</span>
                  <div>
                    <strong className="text-saffron-300 font-bold">गुरु सेवा धाम (त्र्यंबकेश्वर एवं नासिक):</strong> गोदावरी नदी के तट पर स्थित एक पवित्र आश्रम, जो साधु-संतों और साधकों को मुफ्त आवास, सात्विक भोजन और ध्यान के लिए स्थान प्रदान करता है।
                  </div>
                </li>
                <li className="flex items-start gap-2 bg-coffee-950/60 p-3 rounded-xl border border-gold-500/20">
                  <span>•</span>
                  <div>
                    <strong className="text-saffron-300 font-bold">देशी गौशाला (गौ संवर्धन):</strong> भारतीय नस्ल की देशी गायों (गौमाता) का संरक्षण और संवर्धन करना, साथ ही जैविक कृषि के साथ वैदिक ज्ञान का समन्वय करना।
                  </div>
                </li>
                <li className="flex items-start gap-2 bg-coffee-950/60 p-3 rounded-xl border border-gold-500/20">
                  <span>•</span>
                  <div>
                    <strong className="text-saffron-300 font-bold">अभय धाम (वृद्ध आश्रम):</strong> बेसहारा और वरिष्ठ नागरिकों को भावनात्मक सहारा, स्वास्थ्य सेवाएं और आध्यात्मिक आश्रय प्रदान करने वाला एक करुणामयी घर।
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Conclusion / Summary Quote Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-saffron-500/20 via-gold-500/15 to-saffron-500/20 border-2 border-saffron-500/50 text-center max-w-4xl mx-auto backdrop-blur-md shadow-2xl"
        >
          <p className="font-serif text-lg sm:text-xl md:text-2xl font-medium text-saffron-200 leading-relaxed">
            "सार रूप में: श्री श्री १००८ अनंत विभूषित महामंडलेश्वर स्वामी डॉ. निर्मल जी महाराज एक ऐसे दूरदर्शी मार्गदर्शक हैं जो सनातन धर्म के प्राचीन ज्ञान को आधुनिक विज्ञान और सरल ध्यान की भाषा में प्रस्तुत करते हैं, जिससे साधकों को शारीरिक, मानसिक और आध्यात्मिक रूप से सशक्त बनाया जा सके।"
          </p>
        </motion.div>
      </div>
    </section>
  );
}
