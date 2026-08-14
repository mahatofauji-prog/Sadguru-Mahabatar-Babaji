import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { DonationRecord, DonationFormData, numberToWords } from '../types/donation';

interface DonationContextType {
  donations: DonationRecord[];
  loading: boolean;
  addDonation: (
    formData: DonationFormData,
    paymentDetails?: { transactionId?: string; paymentId?: string; gatewayName?: string; paymentStatus?: 'SUCCESS' | 'FAILED' | 'PENDING'; utrNumber?: string; screenshotUrl?: string }
  ) => Promise<DonationRecord>;
  deleteDonation: (id: string) => Promise<void>;
  getDonationById: (id: string) => DonationRecord | undefined;
  getDonationByReceiptNo: (receiptNo: string) => DonationRecord | undefined;
  checkDuplicateUtr: (utrNumber: string) => boolean;
  approveDonation: (id: string, adminName?: string) => Promise<void>;
  rejectDonation: (id: string, reason?: string, adminName?: string) => Promise<void>;
  statistics: {
    totalCount: number;
    totalAmount: number;
    todayCount: number;
    todayAmount: number;
    monthlyCount: number;
    monthlyAmount: number;
    yearlyCount: number;
    yearlyAmount: number;
    successCount: number;
    failedCount: number;
    pendingCount: number;
    purposeBreakdown: Record<string, { count: number; amount: number }>;
    stateBreakdown: Record<string, { count: number; amount: number }>;
    districtBreakdown: Record<string, { count: number; amount: number }>;
  };
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'peeth_donations_records_v2';

// Seed Initial Mock Records for realistic demonstration if empty
const INITIAL_DEMO_DONATIONS: DonationRecord[] = [
  {
    id: 'demo-don-1',
    receiptNo: 'DON-2026-000001',
    transactionId: 'TXN9842107401',
    paymentId: 'PAY894210874',
    gatewayName: 'Peeth Secure UPI / Razorpay Gateway',
    fullName: 'रमेश कुमार शर्मा (Ramesh Sharma)',
    mobile: '9823014589',
    email: 'ramesh.sharma@gmail.com',
    gender: 'पुरुष (Male)',
    dob: '1982-05-14',
    maritalStatus: 'विवाहित (Married)',
    address: '104, गायत्री नगर, दुर्गा मंदिर रोड',
    state: 'उत्तर प्रदेश (Uttar Pradesh)',
    district: 'वाराणसी (Varanasi)',
    pincode: '221001',
    panNumber: 'ABCPS1234F',
    amount: 5100,
    purpose: 'Ashram Construction (आश्रम निर्माण)',
    paymentMethod: 'QR_CODE',
    paymentStatus: 'SUCCESS',
    createdTimestamp: Date.now() - 3600000 * 5,
    formattedDate: '07 Aug 2026, 08:30 AM',
    amountInWords: 'Five Thousand One Hundred Rupees Only',
    utrNumber: '9842107401',
    screenshotUrl: '/assets/IMG-20260804-WA0008.jpg'
  },
  {
    id: 'demo-don-2',
    receiptNo: 'DON-2026-000002',
    transactionId: 'TXN9842107402',
    paymentId: 'PAY894210875',
    gatewayName: 'Peeth Secure Bank Transfer',
    fullName: 'सुनीता पटेल (Sunita Patel)',
    mobile: '9422168901',
    email: 'sunita.patel@yahoo.com',
    gender: 'महिला (Female)',
    dob: '1978-09-20',
    maritalStatus: 'विवाहित (Married)',
    address: '42, आनन्द नगर, कॉलेज रोड',
    state: 'महाराष्ट्र (Maharashtra)',
    district: 'नाशिक (Nashik)',
    pincode: '422005',
    panNumber: 'XYPPD5678K',
    amount: 11000,
    purpose: 'Gaushala (गौशाला सेवा)',
    paymentMethod: 'BANK_TRANSFER',
    paymentStatus: 'SUCCESS',
    createdTimestamp: Date.now() - 3600000 * 24,
    formattedDate: '06 Aug 2026, 04:15 PM',
    amountInWords: 'Eleven Thousand Rupees Only',
    utrNumber: '9842107402',
    screenshotUrl: '/assets/IMG-20260804-WA0013.jpg'
  },
  {
    id: 'demo-don-3',
    receiptNo: 'DON-2026-000003',
    transactionId: 'TXN9842107403',
    paymentId: 'PAY894210876',
    gatewayName: 'Peeth Secure QR Scan',
    fullName: 'अजय प्रकाश वर्मा (Ajay Verma)',
    mobile: '9876543210',
    email: 'ajay.verma@hotmail.com',
    gender: 'पुरुष (Male)',
    dob: '1990-11-12',
    maritalStatus: 'विवाहित (Married)',
    address: '78, सिविल लाइंस',
    state: 'बिहार (Bihar)',
    district: 'पटना (Patna)',
    pincode: '800001',
    panNumber: '',
    amount: 2100,
    purpose: 'Annadanam (अन्नदानम)',
    paymentMethod: 'QR_CODE',
    paymentStatus: 'SUCCESS',
    createdTimestamp: Date.now() - 3600000 * 48,
    formattedDate: '05 Aug 2026, 11:00 AM',
    amountInWords: 'Two Thousand One Hundred Rupees Only',
    utrNumber: '9842107403',
    screenshotUrl: '/assets/IMG-20260804-WA0008.jpg'
  },
  {
    id: 'demo-don-4',
    receiptNo: 'DON-2026-000004',
    transactionId: 'TXN9842107404',
    paymentId: 'PAY894210877',
    gatewayName: 'Peeth Secure Bank Gateway',
    fullName: 'विक्रम सिंह राठौड़ (Vikram Rathore)',
    mobile: '9414012345',
    email: 'vikram.rathore@gmail.com',
    gender: 'पुरुष (Male)',
    dob: '1985-03-30',
    maritalStatus: 'विवाहित (Married)',
    address: '15, वैशाली नगर',
    state: 'राजस्थान (Rajasthan)',
    district: 'जयपुर (Jaipur)',
    pincode: '302021',
    panNumber: 'RTHPV9012M',
    amount: 21000,
    purpose: 'Temple Development (मंदिर विकास)',
    paymentMethod: 'BANK_TRANSFER',
    paymentStatus: 'SUCCESS',
    createdTimestamp: Date.now() - 3600000 * 72,
    formattedDate: '04 Aug 2026, 02:45 PM',
    amountInWords: 'Twenty One Thousand Rupees Only',
    utrNumber: '9842107404',
    screenshotUrl: '/assets/IMG-20260804-WA0013.jpg'
  } 
];

export const DonationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [donations, setDonations] = useState<DonationRecord[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return INITIAL_DEMO_DONATIONS;
  });

  const [loading, setLoading] = useState<boolean>(true);

  // Sync with Firestore
  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'donations'), orderBy('createdTimestamp', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: DonationRecord[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as any;
            list.push({
              id: docSnap.id,
              ...data,
            });
          });

          if (list.length > 0) {
            setDonations(list);
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
            } catch (_) {}
          }
          setLoading(false);
        },
        (error) => {
          console.log('Firestore donation sync warning, using local cache:', error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.log('Error subscribing to Firestore donations:', err);
      setLoading(false);
    }
  }, []);

  // Sync to local storage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(donations));
    } catch (_) {}
  }, [donations]);

  // Generate unique sequential receipt number e.g., DON-2026-000005
  const generateReceiptNo = (): string => {
    const currentYear = new Date().getFullYear();
    const prefix = `DON-${currentYear}-`;
    const existingNumbers = donations
      .map((d) => {
        if (d.receiptNo && d.receiptNo.startsWith(prefix)) {
          const numPart = parseInt(d.receiptNo.replace(prefix, ''), 10);
          return isNaN(numPart) ? 0 : numPart;
        }
        return 0;
      });
    const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    const nextNum = maxNum + 1;
    return `${prefix}${String(nextNum).padStart(6, '0')}`;
  };

  const addDonation = async (
    formData: DonationFormData,
    paymentDetails?: { transactionId?: string; paymentId?: string; gatewayName?: string; paymentStatus?: 'SUCCESS' | 'FAILED' | 'PENDING'; utrNumber?: string; screenshotUrl?: string }
  ): Promise<DonationRecord> => {
    const receiptNo = generateReceiptNo();
    const now = new Date();
    const timestamp = now.getTime();

    // Format date string
    const formattedDate = now.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const txnId = paymentDetails?.transactionId || `TXN${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const payId = paymentDetails?.paymentId || `PAY${Math.floor(100000000 + Math.random() * 900000000)}`;
    const gateway = paymentDetails?.gatewayName || `Peeth Secure ${formData.paymentMethod} Gateway`;
    const status = paymentDetails?.paymentStatus || 'PENDING';

    const newRecord: DonationRecord = {
      ...formData,
      id: `don_${timestamp}_${Math.random().toString(36).substring(2, 7)}`,
      receiptNo,
      transactionId: txnId,
      paymentId: payId,
      gatewayName: gateway,
      paymentStatus: status,
      createdTimestamp: timestamp,
      formattedDate,
      amountInWords: numberToWords(formData.amount)
    };

    // Update local state first for instantaneous response
    setDonations((prev) => [newRecord, ...prev]);

    // Push to Firestore if database is initialized
    if (db) {
      try {
        const docRef = await addDoc(collection(db, 'donations'), {
          ...newRecord,
          serverCreated: serverTimestamp()
        });
        // Update local id to docRef.id
        setDonations((prev) =>
          prev.map((item) => (item.receiptNo === receiptNo ? { ...item, id: docRef.id } : item))
        );
        return { ...newRecord, id: docRef.id };
      } catch (err) {
        console.error('Error saving donation to Firestore:', err);
      }
    }

    return newRecord;
  };

  const deleteDonation = async (id: string) => {
    setDonations((prev) => prev.filter((item) => item.id !== id));
    if (db) {
      try {
        await deleteDoc(doc(db, 'donations', id));
      } catch (err) {
        console.error('Error deleting donation from Firestore:', err);
      }
    }
  };

  const checkDuplicateUtr = (utrNumber: string): boolean => {
    if (!utrNumber) return false;
    const cleanUtr = utrNumber.trim().toLowerCase();
    if (cleanUtr.length === 0) return false;
    return donations.some((d) => (d.utrNumber ? d.utrNumber.trim().toLowerCase() === cleanUtr : false));
  };

  const approveDonation = async (id: string, adminName?: string) => {
    const verifiedAt = Date.now();
    const verifiedBy = adminName || 'Admin';

    setDonations((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              paymentStatus: 'SUCCESS',
              verifiedAt,
              verifiedBy
            }
          : item
      )
    );

    if (db) {
      try {
        await updateDoc(doc(db, 'donations', id), {
          paymentStatus: 'SUCCESS',
          verifiedAt,
          verifiedBy
        });
      } catch (err) {
        console.error('Error approving donation in Firestore:', err);
      }
    }
  };

  const rejectDonation = async (id: string, reason?: string, adminName?: string) => {
    const verifiedAt = Date.now();
    const verifiedBy = adminName || 'Admin';
    const rejectionReason = reason || 'जानकारी अथवा भुगतान विवरण में भिन्नता (Details mismatch)';

    setDonations((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              paymentStatus: 'FAILED',
              rejectionReason,
              verifiedAt,
              verifiedBy
            }
          : item
      )
    );

    if (db) {
      try {
        await updateDoc(doc(db, 'donations', id), {
          paymentStatus: 'FAILED',
          rejectionReason,
          verifiedAt,
          verifiedBy
        });
      } catch (err) {
        console.error('Error rejecting donation in Firestore:', err);
      }
    }
  };

  const getDonationById = (id: string) => {
    return donations.find((d) => d.id === id);
  };

  const getDonationByReceiptNo = (receiptNo: string) => {
    return donations.find((d) => d.receiptNo.toLowerCase() === receiptNo.toLowerCase());
  };

  // Aggregated Statistics
  const statistics = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();

    let totalAmount = 0;
    let todayCount = 0;
    let todayAmount = 0;
    let monthlyCount = 0;
    let monthlyAmount = 0;
    let yearlyCount = 0;
    let yearlyAmount = 0;
    let successCount = 0;
    let failedCount = 0;
    let pendingCount = 0;

    const purposeBreakdown: Record<string, { count: number; amount: number }> = {};
    const stateBreakdown: Record<string, { count: number; amount: number }> = {};
    const districtBreakdown: Record<string, { count: number; amount: number }> = {};

    donations.forEach((d) => {
      const amt = Number(d.amount) || 0;
      const status = d.paymentStatus || 'SUCCESS';

      if (status === 'SUCCESS') {
        successCount++;
        totalAmount += amt;

        if (d.createdTimestamp >= startOfToday) {
          todayCount++;
          todayAmount += amt;
        }
        if (d.createdTimestamp >= startOfMonth) {
          monthlyCount++;
          monthlyAmount += amt;
        }
        if (d.createdTimestamp >= startOfYear) {
          yearlyCount++;
          yearlyAmount += amt;
        }

        // Purpose breakdown
        const purp = d.purpose || 'General Donation (सामान्य दान)';
        if (!purposeBreakdown[purp]) purposeBreakdown[purp] = { count: 0, amount: 0 };
        purposeBreakdown[purp].count++;
        purposeBreakdown[purp].amount += amt;

        // State breakdown
        const st = d.state || 'अन्य (Other)';
        if (!stateBreakdown[st]) stateBreakdown[st] = { count: 0, amount: 0 };
        stateBreakdown[st].count++;
        stateBreakdown[st].amount += amt;

        // District breakdown
        const dist = d.district || 'अन्य (Other)';
        if (!districtBreakdown[dist]) districtBreakdown[dist] = { count: 0, amount: 0 };
        districtBreakdown[dist].count++;
        districtBreakdown[dist].amount += amt;
      } else if (status === 'FAILED') {
        failedCount++;
      } else {
        pendingCount++;
      }
    });

    return {
      totalCount: donations.length,
      totalAmount,
      todayCount,
      todayAmount,
      monthlyCount,
      monthlyAmount,
      yearlyCount,
      yearlyAmount,
      successCount,
      failedCount,
      pendingCount,
      purposeBreakdown,
      stateBreakdown,
      districtBreakdown
    };
  }, [donations]);

  return (
    <DonationContext.Provider
      value={{
        donations,
        loading,
        addDonation,
        deleteDonation,
        getDonationById,
        getDonationByReceiptNo,
        checkDuplicateUtr,
        approveDonation,
        rejectDonation,
        statistics
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};

export const useDonationContext = () => {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error('useDonationContext must be used within a DonationProvider');
  }
  return context;
};
