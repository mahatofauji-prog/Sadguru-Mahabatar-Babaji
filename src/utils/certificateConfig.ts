import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface CertificateSettings {
  authorizedSignatureUrl: string;
  officialSealUrl: string;
  signatoryTitle: string;
  signatoryName: string;
  organizationLogoUrl: string;
}

export const DEFAULT_OFFICIAL_SEAL_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <path id="circlePath" d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23d4af37" />
      <stop offset="50%" stop-color="%23fff2a3" />
      <stop offset="100%" stop-color="%23aa7c11" />
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="96" fill="url(%23goldGrad)" />
  <circle cx="100" cy="100" r="90" fill="%23064e3b" stroke="%23d4af37" stroke-width="3" />
  <circle cx="100" cy="100" r="70" fill="none" stroke="%23d4af37" stroke-width="1.5" stroke-dasharray="4 2" />
  <circle cx="100" cy="100" r="62" fill="%23022c22" stroke="%23d4af37" stroke-width="2" />
  <text font-size="9" font-family="serif" font-weight="bold" fill="%23fef08a" letter-spacing="0.8">
    <textPath href="%23circlePath" startOffset="50%" text-anchor="middle">
      ★ SARAL DHYAN YOG PEETH ★ OFFICIAL SEAL
    </textPath>
  </text>
  <g transform="translate(100, 95) scale(0.85)">
    <polygon points="0,-35 8,-12 32,-12 13,3 20,26 0,12 -20,26 -13,3 -32,-12 -8,-12" fill="url(%23goldGrad)" />
    <circle cx="0" cy="0" r="10" fill="%23064e3b" stroke="%23fef08a" stroke-width="1.5"/>
    <text x="0" y="3" font-size="8" font-family="sans-serif" font-weight="bold" fill="%23ffffff" text-anchor="middle">NGO</text>
  </g>
  <text x="100" y="142" font-size="7.5" font-family="sans-serif" font-weight="bold" fill="%23fef08a" text-anchor="middle" letter-spacing="0.5">REGISTERED TRUST</text>
</svg>`;

export const DEFAULT_SIGNATURE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80">
  <path d="M 15 50 C 35 20, 50 65, 65 30 C 75 15, 85 55, 100 35 C 115 25, 125 45, 140 32 C 150 22, 165 38, 185 28 C 195 22, 210 32, 230 24 M 30 58 C 75 62, 145 58, 220 50 M 85 22 Q 115 8, 105 45" 
        fill="none" stroke="%230f2942" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

export const DEFAULT_CERTIFICATE_SETTINGS: CertificateSettings = {
  authorizedSignatureUrl: DEFAULT_SIGNATURE_SVG,
  officialSealUrl: DEFAULT_OFFICIAL_SEAL_SVG,
  signatoryTitle: 'President / Chairman',
  signatoryName: 'Swami Dr. Nirmal Ji Maharaj',
  organizationLogoUrl: '/logo.png'
};

const LOCAL_KEY = 'saral_certificate_settings_v1';

export const getStoredCertificateSettings = (): CertificateSettings => {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.officialSealUrl === '/assets/official_seal.png' || !parsed.officialSealUrl) {
        parsed.officialSealUrl = DEFAULT_OFFICIAL_SEAL_SVG;
      }
      if (parsed.authorizedSignatureUrl === '/assets/signature.png' || !parsed.authorizedSignatureUrl) {
        parsed.authorizedSignatureUrl = DEFAULT_SIGNATURE_SVG;
      }
      return { ...DEFAULT_CERTIFICATE_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Failed to parse certificate settings:', e);
  }
  return DEFAULT_CERTIFICATE_SETTINGS;
};

export const saveCertificateSettings = async (settings: CertificateSettings): Promise<void> => {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(settings));
    await setDoc(doc(db, 'site_settings', 'certificate_settings'), settings, { merge: true });
  } catch (e) {
    console.warn('Failed to save certificate settings to firestore:', e);
  }
};

export const fetchRemoteCertificateSettings = async (): Promise<CertificateSettings> => {
  try {
    const docRef = doc(db, 'site_settings', 'certificate_settings');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as CertificateSettings;
      const merged = { ...DEFAULT_CERTIFICATE_SETTINGS, ...data };
      localStorage.setItem(LOCAL_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (e) {
    console.warn('Failed to fetch remote certificate settings:', e);
  }
  return getStoredCertificateSettings();
};
