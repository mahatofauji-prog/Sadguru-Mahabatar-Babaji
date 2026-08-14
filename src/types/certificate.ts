export interface Certificate {
  id: string;
  name: string;
  englishName: string;
  number: string;
  description: string;
  imageUrl?: string;
  updatedAt?: string;
}

export const CERTIFICATE_DEFINITIONS: Omit<Certificate, 'imageUrl' | 'updatedAt'>[] = [
  {
    id: 'pan',
    name: 'स्थायी खाता संख्या (PAN)',
    englishName: 'PAN No.',
    number: 'ABITS96708',
    description: 'आयकर विभाग, भारत सरकार द्वारा जारी किया गया स्थायी खाता प्रमाणपत्र।'
  },
  {
    id: '80g',
    name: '८०जी पंजीकरण प्रमाणपत्र (80G)',
    englishName: '80G Certificate',
    number: 'ABITS9670BF20241',
    description: 'आयकर अधिनियम की धारा 80G के अंतर्गत दानकर्ताओं को आयकर में छूट प्रदान करने वाला प्रमाणपत्र।'
  },
  {
    id: '12a',
    name: '१२ए पंजीकरण प्रमाणपत्र (12A)',
    englishName: '12A Certificate',
    number: 'ABITS9670BE20241',
    description: 'आयकर अधिनियम की धारा 12A के अंतर्गत संस्था को प्राप्त कर-मुक्त दर्जा प्रदान करने वाला प्रमाणपत्र।'
  },
  {
    id: 'niti_aayog',
    name: 'नीति आयोग एनजीओ दर्पण पंजीकरण',
    englishName: 'NITI AAYOG NGO Darpan',
    number: 'MH/2024/0413297',
    description: 'नीति आयोग, भारत सरकार के NGO दर्पण पोर्टल के अंतर्गत अद्वितीय (Unique) आईडी पंजीकरण।'
  },
  {
    id: 'trust_reg',
    name: 'न्यास पंजीकरण प्रमाणपत्र (Trust Registration)',
    englishName: 'Trust Registration No.',
    number: 'E0001698 (NSK)',
    description: 'सहायक धर्मदाय आयुक्त कार्यालय, नाशिक संभाग (महाराष्ट्र शासन) द्वारा जारी न्यास पंजीकरण प्रमाणपत्र।'
  },
  {
    id: 'e_anuddan',
    name: 'ई-अनुदान कोड (E-ANUDDAN)',
    englishName: 'E-ANUDDAN Code',
    number: 'MH/00036058',
    description: 'केंद्रीय सामाजिक न्याय और अधिकारिता मंत्रालय, भारत सरकार के ई-अनुदान पोर्टल पर आधिकारिक पंजीकरण कोड।'
  }
];
