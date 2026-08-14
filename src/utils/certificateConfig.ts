import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface CertificateSettings {
  authorizedSignatureUrl: string;
  officialSealUrl: string;
  signatoryTitle: string;
  signatoryName: string;
  organizationLogoUrl: string;
}

export const DEFAULT_OFFICIAL_SEAL_SVG = '/images/trust-seal.png';

export const DEFAULT_SIGNATURE_SVG = '/images/trust-signature.jpg';

export const DEFAULT_CERTIFICATE_SETTINGS: CertificateSettings = {
  authorizedSignatureUrl: '/images/trust-signature.jpg',
  officialSealUrl: '/images/trust-seal.png',
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
      if (
        parsed.officialSealUrl === '/assets/official_seal.png' ||
        !parsed.officialSealUrl ||
        parsed.officialSealUrl.startsWith('data:image/svg+xml')
      ) {
        parsed.officialSealUrl = DEFAULT_OFFICIAL_SEAL_SVG;
      }
      if (
        parsed.authorizedSignatureUrl === '/assets/signature.png' ||
        !parsed.authorizedSignatureUrl ||
        parsed.authorizedSignatureUrl.startsWith('data:image/svg+xml')
      ) {
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
