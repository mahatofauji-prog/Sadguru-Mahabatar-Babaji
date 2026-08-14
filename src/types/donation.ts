export type DonationPurpose =
  | 'Ashram Construction (आश्रम निर्माण)'
  | 'Gaushala (गौशाला सेवा)'
  | 'Annadanam (अन्नदानम)'
  | 'Guru Seva (गुरु सेवा)'
  | 'Temple Development (मंदिर विकास)'
  | 'Old Age Home (वृद्धाश्रम सेवा)'
  | 'General Donation (सामान्य दान)'
  | 'Membership Fee (सदस्यता शुल्क)'
  | 'Lifetime Membership Fee (आजीवन सदस्यता शुल्क)'
  | 'Other (अन्य)';

export type PaymentMethod = 'UPI' | 'BANK_TRANSFER' | 'QR_CODE';

export interface DonationFormData {
  fullName: string;
  mobile: string;
  email: string;
  gender: 'पुरुष (Male)' | 'महिला (Female)' | 'अन्य (Other)';
  dob: string;
  maritalStatus: 'विवाहित (Married)' | 'अविवाहित (Unmarried)';
  address: string;
  state: string;
  district: string;
  pincode: string;
  panNumber?: string;
  amount: number;
  purpose: DonationPurpose;
  paymentMethod: PaymentMethod;
  upiId?: string;
  utrNumber?: string;
  screenshotUrl?: string;
}

export interface DonationRecord extends DonationFormData {
  id: string; // Firestore document ID or unique ID
  receiptNo: string; // Auto-generated e.g. DON-2026-000001
  transactionId: string; // e.g. TXN982147019
  paymentId: string; // e.g. PAY891274091
  gatewayName: string; // e.g. "Peeth Secure Gateway / Kotak Bank"
  paymentStatus: 'SUCCESS' | 'FAILED' | 'PENDING';
  createdTimestamp: number; // Date.now()
  formattedDate: string; // e.g. 07 Aug 2026, 10:30 AM
  amountInWords: string; // e.g. "Five Thousand One Hundred Rupees Only"
  rejectionReason?: string;
  verifiedAt?: number;
  verifiedBy?: string;
}

export const DONATION_PURPOSES: { key: DonationPurpose; labelHi: string; labelEn: string; icon: string }[] = [
  { key: 'Ashram Construction (आश्रम निर्माण)', labelHi: 'आश्रम निर्माण सेवा', labelEn: 'Ashram Construction', icon: '🏛️' },
  { key: 'Gaushala (गौशाला सेवा)', labelHi: 'गौशाला सेवा', labelEn: 'Gaushala & Cow Protection', icon: '🐄' },
  { key: 'Annadanam (अन्नदानम)', labelHi: 'अन्नदानम (भंडारा सेवा)', labelEn: 'Annadanam Food Seva', icon: '🍲' },
  { key: 'Guru Seva (गुरु सेवा)', labelHi: 'सद्गुरु सेवा एवं प्रचार', labelEn: 'Guru Seva & Prachar', icon: '🪔' },
  { key: 'Temple Development (मंदिर विकास)', labelHi: 'मंदिर विकास एवं जीर्णोद्धार', labelEn: 'Temple Development', icon: '🛕' },
  { key: 'Old Age Home (वृद्धाश्रम सेवा)', labelHi: 'अभय धाम वृद्धाश्रम सेवा', labelEn: 'Elderly Care & Old Age Home', icon: '👵' },
  { key: 'General Donation (सामान्य दान)', labelHi: 'सामान्य पीठाधीश कोष', labelEn: 'General Peeth Fund', icon: '🌸' },
  { key: 'Membership Fee (सदस्यता शुल्क)', labelHi: 'सदस्यता शुल्क', labelEn: 'Membership Fee', icon: '💳' },
  { key: 'Lifetime Membership Fee (आजीवन सदस्यता शुल्क)', labelHi: 'आजीवन सदस्यता शुल्क', labelEn: 'Lifetime Membership Fee', icon: '🏆' },
  { key: 'Other (अन्य)', labelHi: 'अन्य पावन उद्देश्य', labelEn: 'Other Sacred Purpose', icon: '✨' },
];

/**
 * Converts a numeric amount to English words for official receipts
 */
export const numberToWords = (num: number): string => {
  if (!num || num <= 0) return 'Zero Rupees Only';

  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
    'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
  ];
  const b = ['', '', 'Twenty ', 'Thirty ', 'Forty ', 'Fifty ', 'Sixty ', 'Seventy ', 'Eighty ', 'Ninety '];

  const inWords = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + a[n % 10];
    if (n < 1000) return a[Math.floor(n / 100)] + 'Hundred ' + inWords(n % 100);
    if (n < 100000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + inWords(n % 1000);
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + 'Lakh ' + inWords(n % 100000);
    return inWords(Math.floor(n / 10000000)) + 'Crore ' + inWords(n % 10000000);
  };

  return (inWords(Math.floor(num)) + 'Rupees Only').trim();
};
