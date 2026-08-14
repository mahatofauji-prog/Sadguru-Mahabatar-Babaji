import { saveSupabaseContentDoc, fetchSupabaseContent } from '../supabase';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface SiteContentState {
  topBar: {
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
  };
  hero: {
    badgeText: string;
    mainTitle: string;
    subtitle: string;
    quoteText: string;
    quoteAuthor: string;
  };
  about: {
    title: string;
    subtitle: string;
    description1: string;
    description2: string;
  };
  guru: {
    title: string;
    subtitle: string;
    guruName: string;
    guruTitle: string;
    bio: string;
  };
  seva: {
    title: string;
    subtitle: string;
    seva1Title: string;
    seva1Desc: string;
    seva2Title: string;
    seva2Desc: string;
    seva3Title: string;
    seva3Desc: string;
    seva4Title: string;
    seva4Desc: string;
  };
  contact: {
    title: string;
    subtitle: string;
    phone1: string;
    phone2: string;
    whatsapp: string;
    email: string;
    address: string;
  };
}

export const DEFAULT_SITE_CONTENT: SiteContentState = {
  topBar: {
    address: 'गुरु सेवा धाम, पंचवटी, नाशिक - 422003 | त्र्यंबकेश्वर',
    phone: '9270246955',
    whatsapp: '9270246955',
    email: 'saraldhyanyogpeeth@gmail.com',
  },
  hero: {
    badgeText: 'अनंत ज्ञान व सनातन चेतना का पावन तट',
    mainTitle: 'सरल ध्यान योग पीठ',
    subtitle: 'महावतार बाबाजी की प्रत्यक्ष दिव्य चेतना व अनंत कृपा पर आधारित',
    quoteText: 'जब मन अंतर्मुखी होकर स्वयं के प्रकाश में लीन होता है, वही सच्चा सरल ध्यान है।',
    quoteAuthor: '— श्री श्री १००८ अनंत विभूषित महामंडलेश्वर स्वामी डॉ. निर्मल जी महाराज',
  },
  about: {
    title: 'पीठ परिचय व पावन ध्येय',
    subtitle: 'सरल ध्यान योग पीठ का दिव्य संकल्प',
    description1: 'सरल ध्यान योग पीठ की स्थापना अनंत चेतना, आत्म-जागरण एवं मानव कल्याण के पावन उद्देश्य से की गई है। यहाँ निष्काम भाव से साधकों को ध्यान एवं साधना का मार्ग दिखाया जाता है।',
    description2: 'महावतार बाबाजी की सूक्ष्म चेतना एवं सद्गुरु के पावन सानिध्य में ध्यान, योग एवं मंत्र साधना के माध्यम से जीवन में परम शांति एवं आरोग्यता का संचार होता है।',
  },
  guru: {
    title: 'सद्गुरु परंपरा व पावन सानिध्य',
    subtitle: 'अनंत ज्ञान के दिव्य संवाहक',
    guruName: 'श्री श्री १००८ अनंत विभूषित महामंडलेश्वर स्वामी डॉ. निर्मल जी महाराज',
    guruTitle: 'अध्यक्ष - सरल ध्यान योग पीठ',
    bio: 'स्वामी जी के ओजस्वी मार्गदर्शन में हज़ारों साधक सरल ध्यान साधना सीखकर आध्यात्मिक उन्नति एवं आंतरिक शांति का अनुभव कर रहे हैं।',
  },
  seva: {
    title: 'वैश्विक सेवा प्रकल्प',
    subtitle: 'मानव मात्र की निष्काम सेवा ही ईश्वर की सच्ची पूजा है',
    seva1Title: 'गुरु सेवा धाम - त्र्यंबकेश्वर व नाशिक',
    seva1Desc: 'त्र्यंबकेश्वर एवं नाशिक की पवित्र भूमि पर स्थित गुरु सेवा धाम में प्रतिदिन निशुल्क महाप्रसाद (अन्नक्षेत्र), ध्यान शिविर एवं संतों व साधकों की सेवा की जाती है।',
    seva2Title: 'भारतीय देशी गोवंश संवर्धन व गऊशाला',
    seva2Desc: 'भारतीय देशी गौवंश की रक्षा, संवर्धन एवं निष्काम सेवा का पावन संकल्प। जैविक कृषि एवं पंचगव्य चिकित्सा का प्रचार।',
    seva3Title: 'अभय धाम - वरिष्ठ नागरिक सेवा आश्रम',
    seva3Desc: 'असहाय एवं वरिष्ठ नागरिकों के लिए ससम्मान नि:शुल्क आवास, भोजन, चिकित्सा एवं आध्यात्मिक शांति का अनुपम धाम।',
    seva4Title: 'अभेद्य मंत्र यज्ञ व वैदिक ध्वनि विज्ञान',
    seva4Desc: 'विश्व शांति, पर्यावरण शुद्धि एवं आध्यात्मिक ऊर्जा जागृति हेतु नियमित रूप से शक्तिशाली वैदिक मंत्रों व यज्ञों का अनुष्ठान।',
  },
  contact: {
    title: 'संपर्क करें एवं पावन धाम पधारें',
    subtitle: 'आध्यात्मिक मार्गदर्शन एवं सेवा सहयोग हेतु संपर्क करें',
    phone1: '9270246955',
    phone2: '9270246955',
    whatsapp: '9270246955',
    email: 'saraldhyanyogpeeth@gmail.com',
    address: 'गुरु सेवा धाम, पंचवटी, नाशिक - 422003 (महाराष्ट्र) एवं त्र्यंबकेश्वर आश्रम',
  },
};

const CONTENT_LOCAL_STORAGE_KEY = 'peeth_website_content_v3';

const OFFICIAL_GURU_NAME = 'श्री श्री १००८ अनंत विभूषित महामंडलेश्वर स्वामी डॉ. निर्मल जी महाराज';

function normalizeOfficialGuruName(state: SiteContentState): SiteContentState {
  const newState = { ...state };
  if (!newState.guru || !newState.guru.guruName || newState.guru.guruName.includes('रामनिर्मल') || newState.guru.guruName.includes('निर्मल गिरि')) {
    newState.guru = { ...newState.guru, guruName: OFFICIAL_GURU_NAME };
  }
  if (!newState.hero || !newState.hero.quoteAuthor || newState.hero.quoteAuthor.includes('रामनिर्मल') || newState.hero.quoteAuthor.includes('निर्मल गिरि')) {
    newState.hero = { ...newState.hero, quoteAuthor: `— ${OFFICIAL_GURU_NAME}` };
  }
  return newState;
}

interface SiteContentContextType {
  content: SiteContentState;
  updateContent: (newContent: SiteContentState) => void;
  updateSectionContent: <K extends keyof SiteContentState>(section: K, sectionData: SiteContentState[K]) => void;
  resetAllContent: () => void;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContentState>(() => {
    try {
      const saved = localStorage.getItem(CONTENT_LOCAL_STORAGE_KEY);
      if (saved) {
        return normalizeOfficialGuruName({ ...DEFAULT_SITE_CONTENT, ...JSON.parse(saved) });
      }
    } catch (e) {
      console.error('Failed to parse saved site content:', e);
    }
    return DEFAULT_SITE_CONTENT;
  });

  useEffect(() => {
    // 1. Fetch from Supabase on mount
    fetchSupabaseContent('main').then((supaContent) => {
      if (supaContent && typeof supaContent === 'object') {
        const updated = normalizeOfficialGuruName({
          topBar: { ...DEFAULT_SITE_CONTENT.topBar, ...(supaContent.topBar || {}) },
          hero: { ...DEFAULT_SITE_CONTENT.hero, ...(supaContent.hero || {}) },
          about: { ...DEFAULT_SITE_CONTENT.about, ...(supaContent.about || {}) },
          guru: { ...DEFAULT_SITE_CONTENT.guru, ...(supaContent.guru || {}) },
          seva: { ...DEFAULT_SITE_CONTENT.seva, ...(supaContent.seva || {}) },
          contact: { ...DEFAULT_SITE_CONTENT.contact, ...(supaContent.contact || {}) },
        });
        setContent(updated);
        try {
          localStorage.setItem(CONTENT_LOCAL_STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {}
      }
    }).catch(() => {});

    // 2. Realtime Firestore sync
    try {
      const contentDocRef = doc(db, 'site_content', 'main');
      const unsubscribe = onSnapshot(
        contentDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data && typeof data === 'object') {
              const updated = normalizeOfficialGuruName({
                topBar: { ...DEFAULT_SITE_CONTENT.topBar, ...(data.topBar || {}) },
                hero: { ...DEFAULT_SITE_CONTENT.hero, ...(data.hero || {}) },
                about: { ...DEFAULT_SITE_CONTENT.about, ...(data.about || {}) },
                guru: { ...DEFAULT_SITE_CONTENT.guru, ...(data.guru || {}) },
                seva: { ...DEFAULT_SITE_CONTENT.seva, ...(data.seva || {}) },
                contact: { ...DEFAULT_SITE_CONTENT.contact, ...(data.contact || {}) },
              });
              setContent(updated);
              try {
                localStorage.setItem(CONTENT_LOCAL_STORAGE_KEY, JSON.stringify(updated));
              } catch (e) {
                console.log(e);
              }
            }
          }
        },
        (err) => {
          console.log('Firestore snapshot error for site_content:', err);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.error('Failed to attach site_content Firestore listener:', e);
    }
  }, []);

  const saveContentToCloud = async (newContent: SiteContentState) => {
    // 1. Save to Firestore
    try {
      await setDoc(doc(db, 'site_content', 'main'), {
        ...newContent,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to save site_content to Firestore:', err);
    }
    // 2. Save to Supabase
    try {
      await saveSupabaseContentDoc('main', newContent);
    } catch (err) {
      console.error('Failed to save site_content to Supabase:', err);
    }
  };

  const updateContent = (newContent: SiteContentState) => {
    setContent(newContent);
    try {
      localStorage.setItem(CONTENT_LOCAL_STORAGE_KEY, JSON.stringify(newContent));
    } catch (e) {
      console.log(e);
    }
    saveContentToCloud(newContent);
  };

  const updateSectionContent = <K extends keyof SiteContentState>(
    section: K,
    sectionData: SiteContentState[K]
  ) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        [section]: { ...prev[section], ...sectionData },
      };
      try {
        localStorage.setItem(CONTENT_LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.log(e);
      }
      saveContentToCloud(updated);
      return updated;
    });
  };

  const resetAllContent = async () => {
    setContent(DEFAULT_SITE_CONTENT);
    try {
      localStorage.removeItem(CONTENT_LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    await saveContentToCloud(DEFAULT_SITE_CONTENT);
  };

  return (
    <SiteContentContext.Provider
      value={{
        content,
        updateContent,
        updateSectionContent,
        resetAllContent,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};
