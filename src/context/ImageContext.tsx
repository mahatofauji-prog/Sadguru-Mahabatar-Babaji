import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, onSnapshot, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { saveSupabaseImageDoc, fetchSupabaseImages } from '../supabase';

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  category: 'babaji' | 'dhyan' | 'seva' | 'baglamukhi';
  uploadedAt?: string;
}

export interface ImageState {
  // Navigation & Branding
  headerLogo: string;
  footerLogo: string;
  whatsappQr: string;
  donationQr: string;

  // Homepage / Hero Banner
  heroBg: string;
  heroPortrait: string;

  // Guru & About Section
  guruPortrait: string;
  aboutGuruji: string;
  aboutBabaji: string;
  aboutMain: string;

  // Seva & Global Vision
  visionSection: string;
  seva1Image: string;
  seva2Image: string;
  seva3Image: string;
  seva4Image: string;
  seva5Image: string;
  seva6Image: string;
  seva7Image: string;

  // Maa Baglamukhi Page
  baglamukhiHero: string;
  baglamukhiHavanMain: string;
  baglamukhiImg1: string;
  baglamukhiImg2: string;
  baglamukhiImg3: string;
  baglamukhiImg4: string;
  baglamukhiImg5: string;
  baglamukhiImg6: string;
  baglamukhiImg7: string;
  baglamukhiImg8: string;
  baglamukhiImg9: string;
  baglamukhiImg10: string;
  baglamukhiImg11: string;
  baglamukhiImg12: string;
  baglamukhiImg13: string;
  baglamukhiImg14: string;

  // Saral Dhyan Yog Page
  dhyanYogHero1: string;
  dhyanYogHero2: string;
  dhyanYogHero3: string;
  dhyanYogHero4: string;
  dhyanYogHero5: string;
  dhyanYogSection1: string;
  dhyanYogSection2: string;
  dhyanYogSection3: string;
  dhyanYogSection4: string;
  dhyanYogSection5: string;

  // Future Projects
  futureProject1: string;
  futureProject2: string;
  futureProject3: string;
  futureProject4: string;
  futureProject5: string;
  futureProject6: string;
  futureProject7: string;
  futureProject8: string;
  futureProject9: string;
  futureProject10: string;
  futureProject11: string;
  futureProject12: string;
  futureProject13: string;
  futureProject14: string;
  futureProject15: string;

  // Certificate & ID Card Seals
  certOfficialSeal: string;
  certAuthorizedSignature: string;
  certOrgLogo: string;

  // Testimonial Avatars
  testimonial1: string;
  testimonial2: string;
  testimonial3: string;

  // Dynamic Gallery
  galleryImages: GalleryItem[];
}

export const DEFAULT_OFFICIAL_SEAL = '/images/trust-seal.png';

export const DEFAULT_AUTHORIZED_SIGNATURE = '/images/trust-signature.jpg';

export const DEFAULT_IMAGES: ImageState = {
  headerLogo: '/logo.png',
  footerLogo: '/logo.png',
  whatsappQr: '/assets/whatsapp_qr.jpg',
  donationQr: '/assets/IMG_20260814_190611.jpg',

  heroBg: '/hero-bg.jpg',
  heroPortrait: '/assets/hero-portrait-new.png',

  guruPortrait: '/assets/IMG-20260804-WA0008.jpg',
  aboutGuruji: '/assets/IMG-20260811-WA0062.jpg',
  aboutBabaji: '/assets/IMG-20260804-WA0009.jpg',
  aboutMain: '/assets/IMG-20260806-WA0004.jpg',

  visionSection: '/IMG-20260811-WA0053.jpg',
  seva1Image: '/assets/IMG-20260811-WA0039.jpg',
  seva2Image: '/assets/IMG-20260811-WA0044.jpg',
  seva3Image: '/assets/IMG-20260811-WA0042.jpg',
  seva4Image: '/assets/IMG-20260811-WA0026.jpg',
  seva5Image: '/assets/IMG-20260811-WA0047.jpg',
  seva6Image: '/assets/IMG-20260811-WA0048.jpg',
  seva7Image: '/assets/IMG-20260811-WA0051.jpg',

  baglamukhiHero: '/assets/IMG-20260811-WA0023.jpg',
  baglamukhiHavanMain: '/assets/IMG-20260811-WA0024.jpg',
  baglamukhiImg1: '/assets/IMG-20260811-WA0027.jpg',
  baglamukhiImg2: '/assets/IMG-20260811-WA0023.jpg',
  baglamukhiImg3: '/assets/IMG-20260811-WA0026.jpg',
  baglamukhiImg4: '/assets/IMG-20260811-WA0028.jpg',
  baglamukhiImg5: '/assets/IMG-20260811-WA0030.jpg',
  baglamukhiImg6: '/assets/IMG-20260804-WA0037.jpg',
  baglamukhiImg7: '/assets/IMG-20260811-WA0024.jpg',
  baglamukhiImg8: '/assets/IMG-20260811-WA0027.jpg',
  baglamukhiImg9: '/assets/IMG-20260811-WA0023.jpg',
  baglamukhiImg10: '/assets/IMG-20260811-WA0026.jpg',
  baglamukhiImg11: '/assets/IMG-20260811-WA0028.jpg',
  baglamukhiImg12: '/assets/IMG-20260811-WA0030.jpg',
  baglamukhiImg13: '/assets/IMG-20260804-WA0037.jpg',
  baglamukhiImg14: '/assets/IMG-20260811-WA0024.jpg',

  dhyanYogHero1: '/assets/IMG-20260811-WA0053.jpg',
  dhyanYogHero2: '/assets/IMG-20260811-WA0054.jpg',
  dhyanYogHero3: '/assets/IMG-20260811-WA0056.jpg',
  dhyanYogHero4: '/assets/IMG-20260811-WA0057.jpg',
  dhyanYogHero5: '/assets/IMG-20260811-WA0058.jpg',
  dhyanYogSection1: '/assets/IMG-20260811-WA0055.jpg',
  dhyanYogSection2: '/assets/IMG-20260811-WA0060.jpg',
  dhyanYogSection3: '/assets/IMG-20260811-WA0061.jpg',
  dhyanYogSection4: '/assets/IMG-20260811-WA0062.jpg',
  dhyanYogSection5: '/assets/IMG-20260811-WA0062.jpg',

  futureProject1: '/images/future-projects/IMG-20260804-WA0010-1.jpg',
  futureProject2: '/images/future-projects/IMG-20260804-WA0011-1.jpg',
  futureProject3: '/images/future-projects/IMG-20260804-WA0012-1.jpg',
  futureProject4: '/images/future-projects/IMG-20260804-WA0013-1.jpg',
  futureProject5: '/images/future-projects/IMG-20260804-WA0014-1.jpg',
  futureProject6: '/images/future-projects/IMG-20260804-WA0015-1.jpg',
  futureProject7: '/images/future-projects/IMG-20260804-WA0016-1.jpg',
  futureProject8: '/images/future-projects/IMG-20260804-WA0017-1.jpg',
  futureProject9: '/images/future-projects/IMG-20260804-WA0018-1.jpg',
  futureProject10: '/images/future-projects/IMG-20260804-WA0019-1.jpg',
  futureProject11: '/images/future-projects/IMG-20260804-WA0020-1.jpg',
  futureProject12: '/images/future-projects/IMG-20260804-WA0021-1.jpg',
  futureProject13: '/images/future-projects/IMG-20260804-WA0022-1.jpg',
  futureProject14: '/images/future-projects/IMG-20260804-WA0023-1.jpg',
  futureProject15: '/images/future-projects/IMG-20260804-WA0024-1.jpg',

  certOfficialSeal: DEFAULT_OFFICIAL_SEAL,
  certAuthorizedSignature: DEFAULT_AUTHORIZED_SIGNATURE,
  certOrgLogo: '/logo.png',

  testimonial1: '/assets/indian_sadhak_new1.jpg',
  testimonial2: '/assets/indian_sadhika_new2.jpg',
  testimonial3: '/assets/indian_sadhak_new3.jpg',

  galleryImages: [
    {
      id: 'gallery_default_1',
      src: '/assets/IMG-20260806-WA0004.jpg',
      title: 'दिव्य दर्शन',
      category: 'babaji',
    }
  ]
};

export type SingleImageKey = keyof Omit<ImageState, 'galleryImages'>;

export interface ImageRegistryMeta {
  key: SingleImageKey;
  page: string;
  section: string;
  title: string;
  description: string;
  defaultUrl: string;
}

export const IMAGE_REGISTRY: ImageRegistryMeta[] = [
  // Navigation & Branding
  { key: 'headerLogo', page: 'मुख्य नेविगेशन (Header)', section: 'Header', title: 'वेबसाइट मुख्य लोगो (Header Logo)', description: 'ऊपरी नेविगेशन बार में दिखाई देने वाला मुख्य लोगो', defaultUrl: '/logo.png' },
  { key: 'footerLogo', page: 'फुटर (Footer)', section: 'Footer', title: 'फुटर संस्था लोगो (Footer Logo)', description: 'नीचे फुटर में प्रदर्शित संस्था का प्रतीक चिन्ह', defaultUrl: '/logo.png' },
  { key: 'whatsappQr', page: 'संपर्क व सहायता (Contact)', section: 'WhatsApp QR', title: 'व्हाट्सएप चैनल क्यूआर (WhatsApp QR Code)', description: 'डायरेक्ट व्हाट्सएप ग्रुप व चैट के लिए स्कैन करने योग्य क्यूआर फोटो', defaultUrl: '/assets/whatsapp_qr.jpg' },
  { key: 'donationQr', page: 'दान व सहयोग (Donation)', section: 'UPI Payment QR', title: 'दान भुगतान क्यूआर कोड (Donation UPI QR)', description: 'दान हेतु UPI स्कैन व पे के लिए क्यूआर कोड', defaultUrl: '/assets/IMG_20260814_190611.jpg' },

  // Homepage / Hero Banner
  { key: 'heroBg', page: 'होमपेज (Homepage)', section: 'Hero Section', title: 'होमपेज पृष्ठभूमि फोटो (Hero Background)', description: 'वेबसाइट के मुख्य बैनर का बैकग्राउंड चित्र', defaultUrl: '/hero-bg.jpg' },
  { key: 'heroPortrait', page: 'होमपेज (Homepage)', section: 'Hero Section', title: 'मुख्य गोल दिव्य फोटो (Hero Round Portrait)', description: 'होमपेज बैनर में चमकीले गोल फ्रेम में दिखाई देने वाला मुख्य चित्र', defaultUrl: '/assets/hero-portrait-new.png' },

  // Guru & About Section
  { key: 'guruPortrait', page: 'गुरु परंपरा (Guru Section)', section: 'Guru Section', title: 'परमपूज्य गुरुदेव चित्र (Guru Portrait)', description: 'गुरु परंपरा परिचय सेक्शन का मुख्य गोल पावन चित्र', defaultUrl: '/assets/IMG-20260804-WA0008.jpg' },
  { key: 'aboutGuruji', page: 'हमारे विषय में (About Us)', section: 'About Section', title: 'सदगुरूदेव दर्शन चित्र (About Guruji)', description: 'हमारे विषय में सेक्शन में पूज्य गुरुदेव का पावन फोटो', defaultUrl: '/assets/IMG-20260811-WA0062.jpg' },
  { key: 'aboutBabaji', page: 'हमारे विषय में (About Us)', section: 'About Section', title: 'महावतार बाबाजी दिव्य चित्र (About Babaji)', description: 'हमारे विषय में सेक्शन में भगवान महावतार बाबाजी का चित्र', defaultUrl: '/assets/IMG-20260804-WA0009.jpg' },
  { key: 'aboutMain', page: 'हमारे विषय में (About Us)', section: 'About Page', title: 'आश्रम एवं संस्था मुख्य चित्र (About Main Image)', description: 'अबाउट पेज का विस्तृत मुख्य चित्र', defaultUrl: '/assets/IMG-20260806-WA0004.jpg' },

  // Seva & Global Vision
  { key: 'visionSection', page: 'ग्लोबल विज़न (Global Vision)', section: 'Vision Section', title: 'दिव्य संकल्प एवं लक्ष्य चित्र (Global Vision Image)', description: 'ग्लोबल विज़न एवं संस्था के संकल्पों को दर्शाने वाला चित्र', defaultUrl: '/IMG-20260811-WA0053.jpg' },
  { key: 'seva1Image', page: 'सेवा कार्य (Seva Initiatives)', section: 'Global Seva 1', title: 'सेवा I: आश्रम निर्माण (Guru Seva Dham)', description: 'नाशिक/त्र्यंबकेश्वर गुरु सेवा धाम परियोजना का चित्र', defaultUrl: '/assets/IMG-20260811-WA0039.jpg' },
  { key: 'seva2Image', page: 'सेवा कार्य (Seva Initiatives)', section: 'Global Seva 2', title: 'सेवा II: भारतीय गोवंश (Gaushala Seva)', description: 'गऊशाला एवं देशी गोवंश संरक्षण परियोजना चित्र', defaultUrl: '/assets/IMG-20260811-WA0044.jpg' },
  { key: 'seva3Image', page: 'सेवा कार्य (Seva Initiatives)', section: 'Global Seva 3', title: 'सेवा III: वृद्ध नागरिक सेवा (Elderly Sanctuary / Abhay Dham)', description: 'ज्येष्ठ नागरिक सेवा धाम परियोजना चित्र', defaultUrl: '/assets/IMG-20260811-WA0042.jpg' },
  { key: 'seva4Image', page: 'सेवा कार्य (Seva Initiatives)', section: 'Global Seva 4', title: 'सेवा IV: वैदिक अनुष्ठान (Abhedya Mantra Yajnas / Cosmic Sound Science)', description: 'वैदिक मंत्र यज्ञ व अनुष्ठान सेवा चित्र', defaultUrl: '/assets/IMG-20260811-WA0026.jpg' },
  { key: 'seva5Image', page: 'सेवा कार्य (Seva Initiatives)', section: 'Global Seva Gallery 1', title: 'सेवा गैलरी चित्र 1', description: 'सेवा प्रकल्प का अन्य चित्र 1', defaultUrl: '/assets/IMG-20260811-WA0047.jpg' },
  { key: 'seva6Image', page: 'सेवा कार्य (Seva Initiatives)', section: 'Global Seva Gallery 2', title: 'सेवा गैलरी चित्र 2', description: 'सेवा प्रकल्प का अन्य चित्र 2', defaultUrl: '/assets/IMG-20260811-WA0048.jpg' },
  { key: 'seva7Image', page: 'सेवा कार्य (Seva Initiatives)', section: 'Global Seva Gallery 3', title: 'सेवा गैलरी चित्र 3', description: 'सेवा प्रकल्प का अन्य चित्र 3', defaultUrl: '/assets/IMG-20260811-WA0051.jpg' },

  // Maa Baglamukhi Page
  { key: 'baglamukhiHero', page: 'मां बगलामुखी अनुष्ठान (Havan Page)', section: 'Baglamukhi Hero', title: 'शीर्ष मुख्य बैनर (Baglamukhi Hero)', description: 'मां बगलामुखी हवन पेज का मुख्य शीर्ष बैनर चित्र', defaultUrl: '/assets/IMG-20260811-WA0023.jpg' },
  { key: 'baglamukhiHavanMain', page: 'मां बगलामुखी अनुष्ठान (Havan Page)', section: 'Havan Gallery', title: 'यज्ञ कुण्ड एवं आहुति (Havan Kund)', description: 'विशेष महायज्ञ की मुख्य आहुति व वेदी चित्र', defaultUrl: '/assets/IMG-20260811-WA0024.jpg' },
  { key: 'baglamukhiImg1', page: 'मां बगलामुखी अनुष्ठान (Havan Page)', section: 'Havan Photo 1', title: '1. मुख्य दर्शन चित्र', description: 'अभेद्य माँ बगलामुखी विशेष हवन - मुख्य दर्शन', defaultUrl: '/assets/IMG-20260811-WA0027.jpg' },
  { key: 'baglamukhiImg2', page: 'मां बगलामुखी अनुष्ठान (Havan Page)', section: 'Havan Photo 2', title: '2. पावन यज्ञ कुण्ड एवं आहुति', description: 'पावन यज्ञ कुण्ड एवं आहुति अनुष्ठान चित्र', defaultUrl: '/assets/IMG-20260811-WA0023.jpg' },
  { key: 'baglamukhiImg3', page: 'मां बगलामुखी अनुष्ठान (Havan Page)', section: 'Havan Photo 3', title: '3. पूर्णाहुति एवं शक्तिपात', description: 'पूर्णाहुति एवं शक्तिपात आशीर्वाद चित्र', defaultUrl: '/assets/IMG-20260811-WA0026.jpg' },
  { key: 'baglamukhiImg4', page: 'मां बगलामुखी अनुष्ठान (Havan Page)', section: 'Havan Photo 4', title: '4. सामूहिक साधना एवं सानिध्य', description: 'सामूहिक साधना एवं दिव्य सानिध्य चित्र', defaultUrl: '/assets/IMG-20260811-WA0028.jpg' },
  { key: 'baglamukhiImg5', page: 'मां बगलामुखी अनुष्ठान (Havan Page)', section: 'Havan Photo 5', title: '5. दिव्य सानिध्य', description: 'सरल ध्यान योग पीठ में दिव्य हवन चित्र', defaultUrl: '/assets/IMG-20260811-WA0030.jpg' },
  { key: 'baglamukhiImg6', page: 'मां बगलामुखी अनुष्ठान (Havan Page)', section: 'Havan Photo 6', title: '6. विशेष हवन झलक', description: 'माँ बगलामुखी विशेष हवन की पावन झलक', defaultUrl: '/assets/IMG-20260804-WA0037.jpg' },
  { key: 'baglamukhiImg7', page: 'मां बगलामुखी अनुष्ठान (Havan Page)', section: 'Havan Photo 7', title: '7. दिव्य हवन दर्शन', description: 'माँ बगलामुखी विशेष हवन दिव्य दर्शन', defaultUrl: '/assets/IMG-20260811-WA0024.jpg' },
  { key: 'baglamukhiImg8', page: 'मां बगलामुखी अनुष्ठान (Havan Page)', section: 'Havan Photo 8', title: '8. मुख्य दर्शन चित्र', description: 'अभेद्य माँ बगलामुखी विशेष हवन - मुख्य दर्शन', defaultUrl: '/assets/IMG-20260811-WA0027.jpg' },
  { key: 'baglamukhiImg9', page: 'मां बगलामुखी अनुष्ठान (Havan Page)', section: 'Havan Photo 9', title: '9. पावन यज्ञ कुण्ड एवं आहुति', description: 'पावन यज्ञ कुण्ड एवं आहुति अनुष्ठान चित्र', defaultUrl: '/assets/IMG-20260811-WA0023.jpg' },
  { key: 'baglamukhiImg10', page: 'मां बगलामुखी अनुष्ठान (Havan Page)', section: 'Havan Photo 10', title: '10. सामूहिक साधना सहभागिता', description: 'साधकों की सामूहिक साधना सहभागिता चित्र', defaultUrl: '/assets/IMG-20260811-WA0026.jpg' },
  { key: 'baglamukhiImg11', page: 'मां बगलामुखी अनुष्ठान (Havan Page)', section: 'Havan Photo 11', title: '11. हवन आहुति समर्पण', description: 'हवन में पावन आहुति समर्पण चित्र', defaultUrl: '/assets/IMG-20260811-WA0028.jpg' },
  { key: 'baglamukhiImg12', page: 'मां बगलामुखी अनुष्ठान (Havan Page)', section: 'Havan Photo 12', title: '12. दिव्य सानिध्य', description: 'सरल ध्यान योग पीठ में दिव्य हवन चित्र', defaultUrl: '/assets/IMG-20260811-WA0030.jpg' },
  { key: 'baglamukhiImg13', page: 'मां बगलामुखी अनुष्ठान (Havan Page)', section: 'Havan Photo 13', title: '13. विशेष हवन झलक', description: 'माँ बगलामुखी विशेष हवन की पावन झलक', defaultUrl: '/assets/IMG-20260804-WA0037.jpg' },
  { key: 'baglamukhiImg14', page: 'मां बगलामुखी अनुष्ठान (Havan Page)', section: 'Havan Photo 14', title: '14. दिव्य हवन दर्शन', description: 'माँ बगलामुखी विशेष हवन दिव्य दर्शन', defaultUrl: '/assets/IMG-20260811-WA0024.jpg' },

  // Saral Dhyan Yog Page
  { key: 'dhyanYogHero1', page: 'सरल ध्यान योग (Dhyan Yog Page)', section: 'Hero Slider 1', title: '1. सद्गुरु देव ध्यान साधना दर्शन', description: 'ध्यान योग प्रथम मुख्य चित्र व स्लाइडर 1', defaultUrl: '/assets/IMG-20260811-WA0053.jpg' },
  { key: 'dhyanYogHero2', page: 'सरल ध्यान योग (Dhyan Yog Page)', section: 'Hero Slider 2', title: '2. ध्यान योग दीक्षा सत्र', description: 'ध्यान योग द्वितीय मुख्य चित्र व स्लाइडर 2', defaultUrl: '/assets/IMG-20260811-WA0054.jpg' },
  { key: 'dhyanYogHero3', page: 'सरल ध्यान योग (Dhyan Yog Page)', section: 'Hero Slider 3', title: '3. सामूहिक शून्यता ध्यान शिविर', description: 'ध्यान योग तृतीय मुख्य चित्र व स्लाइडर 3', defaultUrl: '/assets/IMG-20260811-WA0056.jpg' },
  { key: 'dhyanYogHero4', page: 'सरल ध्यान योग (Dhyan Yog Page)', section: 'Hero Slider 4', title: '4. दिव्य शक्तिपात एवं प्राण संचार', description: 'साधना एवं क्रिया योग चतुर्थ मुख्य चित्र', defaultUrl: '/assets/IMG-20260811-WA0057.jpg' },
  { key: 'dhyanYogHero5', page: 'सरल ध्यान योग (Dhyan Yog Page)', section: 'Hero Slider 5', title: '5. सद्गुरु प्रवचन एवं मार्गदर्शन', description: 'सद्गुरु देव का पावन प्रवचन एवं मार्गदर्शन', defaultUrl: '/assets/IMG-20260811-WA0058.jpg' },
  { key: 'dhyanYogSection1', page: 'सरल ध्यान योग (Dhyan Yog Page)', section: 'Section Photo 1', title: '6. प्रस्तावना: सरल ध्यान योग परिचय (Introduction Image)', description: 'प्रस्तावना सेक्शन का मुख्य पावन चित्र', defaultUrl: '/assets/IMG-20260811-WA0055.jpg' },
  { key: 'dhyanYogSection2', page: 'सरल ध्यान योग (Dhyan Yog Page)', section: 'Section Photo 2', title: '7. अखंड शांति ध्यान ऊर्जा क्षेत्र', description: 'अखंड शांति ध्यान ऊर्जा क्षेत्र दर्शन चित्र', defaultUrl: '/assets/IMG-20260811-WA0060.jpg' },
  { key: 'dhyanYogSection3', page: 'सरल ध्यान योग (Dhyan Yog Page)', section: 'Section Photo 3', title: '8. शून्यता ध्यान साधना', description: 'शून्यता ध्यान साधना दर्शन', defaultUrl: '/assets/IMG-20260811-WA0061.jpg' },
  { key: 'dhyanYogSection4', page: 'सरल ध्यान योग (Dhyan Yog Page)', section: 'Section Photo 4', title: '9. प्राण योग क्रिया', description: 'प्राण योग क्रिया दर्शन', defaultUrl: '/assets/IMG-20260811-WA0062.jpg' },
  { key: 'dhyanYogSection5', page: 'सरल ध्यान योग (Dhyan Yog Page)', section: 'Section Photo 5', title: '10. आत्म साक्षात्कार दर्शन', description: 'आत्म साक्षात्कार दर्शन चित्र', defaultUrl: '/assets/IMG-20260811-WA0062.jpg' },

  // Future Projects
  { key: 'futureProject1', page: 'आगामी परियोजनाएं (Future Projects)', section: 'Project 1', title: 'परियोजना 1: महाअवतार बाबाजी भव्य मंदिर', description: 'महाअवतार बाबाजी भव्य मंदिर मास्टर प्लान', defaultUrl: '/images/future-projects/IMG-20260804-WA0010-1.jpg' },
  { key: 'futureProject2', page: 'आगामी परियोजनाएं (Future Projects)', section: 'Project 2', title: 'परियोजना 2: नवीन ध्यान साधना कक्ष', description: 'नवीन ध्यान साधना हॉल निर्माण नक्शा', defaultUrl: '/images/future-projects/IMG-20260804-WA0011-1.jpg' },
  { key: 'futureProject3', page: 'आगामी परियोजनाएं (Future Projects)', section: 'Project 3', title: 'परियोजना 3: आश्रम परिसर मास्टर प्लान', description: 'संपूर्ण आश्रम परिसर का विकास प्रारूप', defaultUrl: '/images/future-projects/IMG-20260804-WA0012-1.jpg' },
  { key: 'futureProject4', page: 'आगामी परियोजनाएं (Future Projects)', section: 'Project 4', title: 'परियोजना 4: गौशाला विस्तार परियोजना', description: 'गौशाला विस्तार एवं गोवंश संरक्षण शेड', defaultUrl: '/images/future-projects/IMG-20260804-WA0013-1.jpg' },
  { key: 'futureProject5', page: 'आगामी परियोजनाएं (Future Projects)', section: 'Project 5', title: 'परियोजना 5: सद्गुरु कुटीर निर्माण', description: 'सद्गुरु कुटीर एवं साधना स्थल निर्माण', defaultUrl: '/images/future-projects/IMG-20260804-WA0014-1.jpg' },
  { key: 'futureProject6', page: 'आगामी परियोजनाएं (Future Projects)', section: 'Project 6', title: 'परियोजना 6: भव्य यज्ञशाला सौन्दर्यीकरण', description: 'भव्य यज्ञशाला निर्माण एवं सौन्दर्यीकरण', defaultUrl: '/images/future-projects/IMG-20260804-WA0015-1.jpg' },
  { key: 'futureProject7', page: 'आगामी परियोजनाएं (Future Projects)', section: 'Project 7', title: 'परियोजना 7: सत्संग एवं प्रवचन भवन', description: 'सत्संग एवं अध्यात्म प्रवचन केंद्र भवन', defaultUrl: '/images/future-projects/IMG-20260804-WA0016-1.jpg' },
  { key: 'futureProject8', page: 'आगामी परियोजनाएं (Future Projects)', section: 'Project 8', title: 'परियोजना 8: निःशुल्क आयुर्वेदिक चिकित्सा केंद्र', description: 'निःशुल्क आयुर्वेदिक चिकित्सा एवं औषधालय', defaultUrl: '/images/future-projects/IMG-20260804-WA0017-1.jpg' },
  { key: 'futureProject9', page: 'आगामी परियोजनाएं (Future Projects)', section: 'Project 9', title: 'परियोजना 9: साधक अतिथि गृह', description: 'दूर-दराज से आने वाले साधकों के लिए अतिथि गृह', defaultUrl: '/images/future-projects/IMG-20260804-WA0018-1.jpg' },
  { key: 'futureProject10', page: 'आगामी परियोजनाएं (Future Projects)', section: 'Project 10', title: 'परियोजना 10: सरल ध्यान योग अनुसंधान केंद्र', description: 'ध्यान योग अनुसंधान एवं प्रशिक्षण विंग', defaultUrl: '/images/future-projects/IMG-20260804-WA0019-1.jpg' },
  { key: 'futureProject11', page: 'आगामी परियोजनाएं (Future Projects)', section: 'Project 11', title: 'परियोजना 11: दिव्य भोजनालय व अन्नक्षेत्र', description: 'दिव्य भोजनालय एवं लंगर हॉल परिसर', defaultUrl: '/images/future-projects/IMG-20260804-WA0020-1.jpg' },
  { key: 'futureProject12', page: 'आगामी परियोजनाएं (Future Projects)', section: 'Project 12', title: 'परियोजना 12: प्राकृतिक चिकित्सा एवं योगशाला', description: 'नेचरोपैथी, योग एवं प्राकृतिक स्वास्थ्य केंद्र', defaultUrl: '/images/future-projects/IMG-20260804-WA0021-1.jpg' },
  { key: 'futureProject13', page: 'आगामी परियोजनाएं (Future Projects)', section: 'Project 13', title: 'परियोजना 13: गोशाला एवं पशु सेवा परिसर', description: 'देशी गोवंश एवं पशुपक्षी सेवा केंद्र', defaultUrl: '/images/future-projects/IMG-20260804-WA0022-1.jpg' },
  { key: 'futureProject14', page: 'आगामी परियोजनाएं (Future Projects)', section: 'Project 14', title: 'परियोजना 14: नूतन हवन कुंड संरचना', description: 'वैदिक महायज्ञ नूतन हवन कुण्ड संरचना', defaultUrl: '/images/future-projects/IMG-20260804-WA0023-1.jpg' },
  { key: 'futureProject15', page: 'आगामी परियोजनाएं (Future Projects)', section: 'Project 15', title: 'परियोजना 15: हरित ऊर्जा सौर विद्युत संयंत्र', description: 'पर्यावरण अनुकूल सोलर एनर्जी प्लांट प्रोजेक्ट', defaultUrl: '/images/future-projects/IMG-20260804-WA0024-1.jpg' },

  // Certificate & ID Card Seals
  { key: 'certOfficialSeal', page: 'प्रमाणपत्र व आईडी कार्ड (Certificates)', section: 'Official Seal', title: 'संस्था आधिकारिक सील (Official Seal)', description: 'प्रमाणपत्र एवं आईडी कार्ड पर लगने वाली आधिकारिक संस्था मुहर', defaultUrl: '/images/trust-seal.png' },
  { key: 'certAuthorizedSignature', page: 'प्रमाणपत्र व आईडी कार्ड (Certificates)', section: 'Authorized Signature', title: 'संस्थापक अधिकृत हस्ताक्षर (Signature)', description: 'सदस्यता व दान प्रमाणपत्र पर प्रिंट होने वाला डिजिटल हस्ताक्षर', defaultUrl: '/images/trust-signature.jpg' },
  { key: 'certOrgLogo', page: 'प्रमाणपत्र व आईडी कार्ड (Certificates)', section: 'Certificate Logo', title: 'प्रमाणपत्र संस्था लोगो (Org Logo)', description: 'रसीद व प्रमाणपत्रों के शीर्ष पर छपने वाला लोगो', defaultUrl: '/logo.png' },

  // Testimonial Avatars
  { key: 'testimonial1', page: 'साधक अनुभव (Testimonials)', section: 'Testimonial 1', title: 'साधक अनुभव चित्र 1 (Sadhak 1)', description: 'प्रथम साधक अनुभव कार्ड का चित्र', defaultUrl: '/assets/indian_sadhak_new1.jpg' },
  { key: 'testimonial2', page: 'साधक अनुभव (Testimonials)', section: 'Testimonial 2', title: 'साधक अनुभव चित्र 2 (Sadhak 2)', description: 'द्वितीय साधक अनुभव कार्ड का चित्र', defaultUrl: '/assets/indian_sadhika_new2.jpg' },
  { key: 'testimonial3', page: 'साधक अनुभव (Testimonials)', section: 'Testimonial 3', title: 'साधक अनुभव चित्र 3 (Sadhak 3)', description: 'तृतीय साधक अनुभव कार्ड का चित्र', defaultUrl: '/assets/indian_sadhak_new3.jpg' }
];

const LOCAL_STORAGE_KEY = 'saral_dhyan_images_v61';

interface ImageContextType {
  images: ImageState;
  timestamps: Record<string, string>;
  updateSingleImage: (key: SingleImageKey, file: File, onProgress?: (percent: number) => void) => Promise<string>;
  clearSingleImage: (key: SingleImageKey) => Promise<void>;
  addGalleryImages: (files: FileList | File[], category?: 'babaji' | 'dhyan' | 'seva' | 'baglamukhi') => Promise<void>;
  removeGalleryImage: (id: string) => Promise<void>;
  clearDefaultGalleryImages: () => Promise<void>;
  clearAllGalleryImages: () => Promise<void>;
  resetAllImages: () => Promise<void>;
  showOverlayControls: boolean;
  setShowOverlayControls: (v: boolean) => void;
  isSyncing: boolean;
  getImageUrl: (key: SingleImageKey) => string;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const compressImageFile = (
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.75,
  maxChars = 280000
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      reject(new Error('अमान्य फ़ाइल प्रारूप! केवल JPG, JPEG, PNG, या WEBP ही समर्थित हैं।'));
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      reject(new Error('फ़ाइल का आकार बहुत बड़ा है! अधिकतम 15MB तक की फ़ोटो चुनें।'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let curWidth = img.width;
        let curHeight = img.height;
        let curMaxWidth = maxWidth;
        let curMaxHeight = maxHeight;
        let curQuality = quality;

        const compress = (): string => {
          let w = curWidth;
          let h = curHeight;
          if (w > curMaxWidth || h > curMaxHeight) {
            if (w / h > curMaxWidth / curMaxHeight) {
              h = Math.round((h * curMaxWidth) / w);
              w = curMaxWidth;
            } else {
              w = Math.round((w * curMaxHeight) / h);
              h = curMaxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, w);
          canvas.height = Math.max(1, h);
          const ctx = canvas.getContext('2d');
          if (!ctx) return event.target?.result as string;
          ctx.drawImage(img, 0, 0, w, h);
          return canvas.toDataURL('image/jpeg', curQuality);
        };

        let result = compress();
        let attempts = 0;
        while (result.length > maxChars && attempts < 8 && curMaxWidth > 200 && curMaxHeight > 200) {
          attempts++;
          curMaxWidth = Math.round(curMaxWidth * 0.85);
          curMaxHeight = Math.round(curMaxHeight * 0.85);
          curQuality = Math.max(0.4, curQuality - 0.08);
          result = compress();
        }

        resolve(result);
      };
      img.onerror = () => reject(new Error('फ़ोटो लोड करने में असमर्थ।'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('फ़ाइल पढ़ने में विफलता।'));
    reader.readAsDataURL(file);
  });
};

const sanitizeImageState = (state: ImageState): ImageState => {
  const sanitized = { ...state };
  Object.keys(DEFAULT_IMAGES).forEach((k) => {
    const key = k as keyof ImageState;
    if (key !== 'galleryImages') {
      const val = sanitized[key];
      if (
        !val ||
        typeof val !== 'string' ||
        val.trim() === '' ||
        val === 'null' ||
        val === 'undefined' ||
        key === 'aboutGuruji' ||
        key === 'aboutBabaji' ||
        key === 'guruPortrait' ||
        key === 'donationQr' ||
        key === 'seva3Image' ||
        key === 'seva4Image' ||
        key === 'dhyanYogSection1' ||
        val.includes('/assets/IMG-20260811-WA0045.jpg') ||
        val.includes('/assets/IMG-20260811-WA0046.jpg') ||
        val.includes('/assets/official_seal.png') ||
        val.includes('/assets/signature.png') ||
        val.includes('/assets/IMG-20260804-WA0008.jpg') ||
        val.includes('/assets/IMG-20260804-WA0009.jpg') ||
        val.includes('/assets/IMG-20260804-WA0010.jpg') ||
        val.includes('/assets/IMG-20260804-WA0011.jpg') ||
        val.includes('/assets/IMG-20260806-WA0004-3.jpg') ||
        (key === 'certOfficialSeal' && (val.startsWith('data:image/svg+xml') || val.includes('APPROVED'))) ||
        (key === 'certAuthorizedSignature' && (val.startsWith('data:image/svg+xml') || val.includes('Swami Yoganand'))) ||
        (typeof val === 'string' && val.includes('/images/saral-dhyan-yog/'))
      ) {
        (sanitized as any)[key] = DEFAULT_IMAGES[key as keyof typeof DEFAULT_IMAGES];
      }
    }
  });
  if (Array.isArray(sanitized.galleryImages)) {
    sanitized.galleryImages = sanitized.galleryImages.map((g) => {
      if (
        !g ||
        !g.src ||
        typeof g.src !== 'string' ||
        g.src.includes('IMG-20260806-WA0004-1') ||
        g.src.includes('IMG-20260806-WA0004-2') ||
        g.src.includes('IMG-20260806-WA0004-3')
      ) {
        return { ...g, src: '/assets/IMG-20260806-WA0004.jpg' };
      }
      return g;
    });
  } else {
    sanitized.galleryImages = DEFAULT_IMAGES.galleryImages;
  }
  return sanitized;
};

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<ImageState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return sanitizeImageState({ ...DEFAULT_IMAGES, ...parsed });
      }
    } catch (e) {}
    return DEFAULT_IMAGES;
  });

  const [timestamps, setTimestamps] = useState<Record<string, string>>({});
  const [showOverlayControls, setShowOverlayControls] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(true);

  const safeSaveLocalStorage = (state: ImageState) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  };

  useEffect(() => {
    let unsubscribeSingle: (() => void) | undefined;
    let unsubscribeGallery: (() => void) | undefined;

    const syncWithSupabaseFallback = async () => {
      try {
        const supabaseData = await fetchSupabaseImages();
        if (supabaseData) {
          const updates = {};
          const timeMap = {};
          
          Object.values(supabaseData).forEach((data) => {
            const id = data.id;
            if (id && id in DEFAULT_IMAGES && typeof data.url === 'string' && data.url) {
              updates[id] = data.url;
              if (data.updated_at || data.updatedAt) {
                timeMap[id] = new Date(data.updated_at || data.updatedAt).getTime().toString();
              }
            }
          });

          if (Object.keys(updates).length > 0) {
            setTimestamps((prev) => ({ ...prev, ...timeMap }));
            setImages((prev) => {
              const updated = { ...prev, ...updates };
              const sanitized = sanitizeImageState(updated);
              safeSaveLocalStorage(sanitized);
              return sanitized;
            });
          }
        }
      } catch (err) {
        console.warn('Supabase fallback error:', err);
      } finally {
        setIsSyncing(false);
      }
    };

    try {
      const imagesDoc = doc(db, 'site_settings', 'image_registry');

      unsubscribeSingle = onSnapshot(imagesDoc, (docSnap) => {
        const data = docSnap.data();
        if (data && data.images) {
          const updates = {};
          const timeMap = {};
          
          Object.keys(data.images).forEach((id) => {
            const imgData = data.images[id];
            if (id in DEFAULT_IMAGES && typeof imgData.url === 'string' && imgData.url) {
              updates[id] = imgData.url;
              if (imgData.updatedAt) {
                timeMap[id] = new Date(imgData.updatedAt).getTime().toString();
              }
            }
          });

          if (Object.keys(updates).length > 0) {
            setTimestamps((prev) => ({ ...prev, ...timeMap }));
            setImages((prev) => {
              const updated = { ...prev, ...updates };
              const sanitized = sanitizeImageState(updated);
              safeSaveLocalStorage(sanitized);
              return sanitized;
            });
          }
        }
        setIsSyncing(false);
      }, (err) => {
        console.warn('Firestore snapshot error for image_registry:', err);
        syncWithSupabaseFallback();
      });

      const galleryDoc = doc(db, 'site_settings', 'gallery_registry');
      unsubscribeGallery = onSnapshot(galleryDoc, (docSnap) => {
        const data = docSnap.data();
        if (data && Array.isArray(data.items)) {
          const validItems = [];
          data.items.forEach((d) => {
            if (d && d.id && d.src) {
              validItems.push({
                id: d.id,
                src: d.src,
                title: d.title || 'पावन दर्शन',
                category: d.category || 'dhyan',
                uploadedAt: d.uploadedAt || new Date().toISOString()
              });
            }
          });
          
          setImages((prev) => {
            validItems.sort((a, b) => b.id.localeCompare(a.id));
            const updated = { ...prev, galleryImages: validItems };
            const sanitized = sanitizeImageState(updated);
            safeSaveLocalStorage(sanitized);
            return sanitized;
          });
        }
      }, (err) => {
        console.warn('Firestore snapshot error for gallery_registry:', err);
      });

    } catch (e) {
      console.error(e);
      syncWithSupabaseFallback();
    }

    return () => {
      if (unsubscribeSingle) unsubscribeSingle();
      if (unsubscribeGallery) unsubscribeGallery();
    };
  }, []);

  const updateSingleImage = async (
    key: SingleImageKey,
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<string> => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      throw new Error('केवल JPG, JPEG, PNG, और WEBP फाइलें स्वीकार्य हैं। (Only JPG, PNG, WEBP allowed)');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('फ़ाइल का आकार 10MB से कम होना चाहिए। (File size must be less than 10MB)');
    }

    onProgress?.(10);
    const meta = IMAGE_REGISTRY.find((m) => m.key === key);
    const nowTs = new Date().getTime().toString();
    const nowIso = new Date().toISOString();

    let finalUrl = '';

    // Step 1: Pre-compress / optimize image in browser first
    onProgress?.(25);
    let uploadPayload: Blob | File = file;
    try {
      const compressedBase64 = await compressImageFile(file, 1400, 1400, 0.82, 400000);
      const res = await fetch(compressedBase64);
      uploadPayload = await res.blob();
    } catch {
      uploadPayload = file;
    }

    // Step 2: Try Firebase Storage upload with a realistic 20-second timeout
    try {
      if (storage) {
        onProgress?.(35);
        const storageRef = ref(storage, `site_images_storage/${key}_${Date.now()}.jpg`);
        const uploadTask = uploadBytesResumable(storageRef, uploadPayload);

        const uploadPromise = new Promise<string>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = Math.round((snapshot.bytesTransferred / (snapshot.totalBytes || 1)) * 35) + 35; // 35% to 70%
              onProgress?.(Math.min(70, progress));
            },
            (err) => reject(err),
            async () => {
              try {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(url);
              } catch (err) {
                reject(err);
              }
            }
          );
        });

        const timeoutPromise = new Promise<string>((_, reject) => {
          setTimeout(() => {
            try {
              uploadTask.cancel();
            } catch (_) {}
            reject(new Error('Storage upload timeout'));
          }, 20000);
        });

        finalUrl = await Promise.race([uploadPromise, timeoutPromise]);
      }
    } catch (storageErr) {
      console.warn('Firebase storage upload fallback:', storageErr);
    }

    // Step 3: Fast adaptive compressed Base64 fallback (<200KB) if Storage did not complete
    if (!finalUrl) {
      onProgress?.(70);
      finalUrl = await compressImageFile(file, 1000, 1000, 0.75, 200000);
    }

    onProgress?.(80);

    // Step 4: Write to Firestore Database (MANDATORY BLOCKING STEP)
    try {
      onProgress?.(88);
      const fsPromise = setDoc(doc(db, 'site_settings', 'image_registry'), {
        images: {
          [key]: {
            url: finalUrl,
            updatedAt: nowIso
          }
        }
      }, { merge: true });

      const fsTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('डेटाबेस सहेजने में टाइमआउट (Database Timeout)')), 15000)
      );

      await Promise.race([fsPromise, fsTimeout]);
    } catch (err: any) {
      console.error('Firestore save failed for site_images:', err);
      throw new Error('डेटाबेस में फ़ोटो सहेजने में विफल: ' + (err?.message || 'कनेक्शन त्रुटि'));
    }

    // Step 5: ONLY update local state and localStorage AFTER database confirms write success
    setTimestamps((prev) => ({ ...prev, [key]: nowTs }));
    setImages((prev) => {
      const updated = { ...prev, [key]: finalUrl };
      const sanitized = sanitizeImageState(updated);
      safeSaveLocalStorage(sanitized);
      return sanitized;
    });

    // Step 6: Write to Supabase Backup Database
    saveSupabaseImageDoc(key, { url: finalUrl }).catch((err) => console.warn('Supabase sync info:', err));

    onProgress?.(100);
    return finalUrl;
  };

  const clearSingleImage = async (key: SingleImageKey) => {
    const meta = IMAGE_REGISTRY.find((m) => m.key === key);
    const defaultUrl = meta?.defaultUrl || DEFAULT_IMAGES[key] || '';
    const nowIso = new Date().toISOString();

    setTimestamps((prev) => ({ ...prev, [key]: new Date().getTime().toString() }));
    setImages((prev) => {
      const updated = { ...prev, [key]: defaultUrl };
      const sanitized = sanitizeImageState(updated);
      safeSaveLocalStorage(sanitized);
      return sanitized;
    });

    try {
      await setDoc(doc(db, 'site_settings', 'image_registry'), {
        images: {
          [key]: {
            url: defaultUrl,
            updatedAt: new Date().toISOString()
          }
        }
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore delete/reset failed:', err);
    }

    try {
      await saveSupabaseImageDoc(key, { url: defaultUrl });
    } catch (err) {}
  };

  const addGalleryImages = async (files: FileList | File[], category: 'babaji' | 'dhyan' | 'seva' | 'baglamukhi' = 'dhyan') => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    for (const file of fileArray) {
      if (!validTypes.includes(file.type)) {
        throw new Error('केवल JPG, JPEG, PNG, और WEBP फाइलें स्वीकार्य हैं। (Only JPG, PNG, WEBP allowed)');
      }
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('फ़ाइल का आकार 10MB से कम होना चाहिए। (File size must be less than 10MB)');
      }
    }

    const newItems: GalleryItem[] = [];
    const nowIso = new Date().toISOString();

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const dataUrl = await compressImageFile(file, 1000, 1000, 0.70);
      newItems.push({
        id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        src: dataUrl,
        title: file.name.replace(/\.[^/.]+$/, '') || 'अपलोड किया गया पावन चित्र',
        category,
        uploadedAt: nowIso
      });
    }

    let updatedGallery: GalleryItem[] = [];
    setImages((prev) => {
      updatedGallery = [...newItems, ...prev.galleryImages];
      const updatedState = { ...prev, galleryImages: updatedGallery };
      safeSaveLocalStorage(updatedState);
      return updatedState;
    });

    try {
      await setDoc(doc(db, 'site_settings', 'gallery_registry'), { items: updatedGallery }, { merge: true });
    } catch (err) {}
  };

  const removeGalleryImage = async (id: string) => {
    let updatedGallery: GalleryItem[] = [];
    setImages((prev) => {
      updatedGallery = prev.galleryImages.filter((item) => item.id !== id);
      const updatedState = { ...prev, galleryImages: updatedGallery };
      safeSaveLocalStorage(updatedState);
      return updatedState;
    });

    try {
      await setDoc(doc(db, 'site_settings', 'gallery_registry'), { items: updatedGallery }, { merge: true });
    } catch (err) {}
  };

  const clearDefaultGalleryImages = async () => {
    let defaultIds: string[] = [];
    let updatedGallery: GalleryItem[] = [];
    setImages((prev) => {
      defaultIds = prev.galleryImages.filter((item) => !item.id.startsWith('user_')).map((i) => i.id);
      updatedGallery = prev.galleryImages.filter((item) => item.id.startsWith('user_'));
      const updatedState = { ...prev, galleryImages: updatedGallery };
      safeSaveLocalStorage(updatedState);
      return updatedState;
    });

    try {
      await setDoc(doc(db, 'site_settings', 'gallery_registry'), { items: updatedGallery }, { merge: true });
    } catch (e) {}
  };

  const clearAllGalleryImages = async () => {
    let allIds: string[] = [];
    setImages((prev) => {
      allIds = prev.galleryImages.map((i) => i.id);
      const updatedState = { ...prev, galleryImages: [] };
      safeSaveLocalStorage(updatedState);
      return updatedState;
    });

    for (const id of allIds) {
      try {
        await deleteDoc(doc(db, 'site_gallery', id));
      } catch (e) {}
    }
  };

  const resetAllImages = async () => {
    setImages(DEFAULT_IMAGES);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      const imagesUpdate: any = {};
      const singleKeys = Object.keys(DEFAULT_IMAGES).filter((k) => k !== 'galleryImages') as SingleImageKey[];
      for (const k of singleKeys) {
        imagesUpdate[k] = {
          url: DEFAULT_IMAGES[k],
          updatedAt: new Date().toISOString()
        };
      }
      await setDoc(doc(db, 'site_settings', 'image_registry'), { images: imagesUpdate }, { merge: true });
      await setDoc(doc(db, 'site_settings', 'gallery_registry'), { items: DEFAULT_IMAGES.galleryImages }, { merge: true });
    } catch (e) {}
  };

  const getImageUrl = (key: SingleImageKey): string => {
    const raw = images[key] || DEFAULT_IMAGES[key] || '';
    if (!raw) return '';
    if (raw.startsWith('data:')) return raw;
    const ts = timestamps[key];
    if (ts && !raw.includes('v=')) {
      return raw.includes('?') ? `${raw}&v=${ts}` : `${raw}?v=${ts}`;
    }
    return raw;
  };

  return (
    <ImageContext.Provider
      value={{
        images,
        timestamps,
        updateSingleImage,
        clearSingleImage,
        addGalleryImages,
        removeGalleryImage,
        clearDefaultGalleryImages,
        clearAllGalleryImages,
        resetAllImages,
        showOverlayControls,
        setShowOverlayControls,
        isSyncing,
        getImageUrl
      }}
    >
      {isSyncing ? (
        <div className="fixed inset-0 bg-coffee-950 flex flex-col items-center justify-center z-[99999]">
          <div className="w-16 h-16 border-4 border-gold-500/20 border-t-saffron-500 rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
          <div className="text-saffron-400 font-serif animate-pulse tracking-widest text-sm uppercase drop-shadow-md">
            Connecting to Server...
          </div>
        </div>
      ) : (
        children
      )}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImageContext must be used within an ImageProvider');
  }
  return context;
};
