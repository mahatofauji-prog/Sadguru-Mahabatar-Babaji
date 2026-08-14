import { saveSupabaseImageDoc, fetchSupabaseImages } from '../supabase';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { MemberRecord, MemberFormData } from '../types/membership';

interface MembershipContextType {
  members: MemberRecord[];
  isLoading: boolean;
  addMember: (data: MemberFormData) => Promise<{ success: boolean; member?: MemberRecord; error?: string }>;
  updateMember: (id: string, data: Partial<MemberRecord>) => Promise<void>;
  updateMemberStatus: (id: string, status: 'Approved' | 'Pending' | 'Rejected', reason?: string) => Promise<void>;
  approveMember: (id: string) => Promise<MemberRecord | undefined>;
  deleteMember: (id: string) => Promise<void>;
  searchMembers: (query: string) => MemberRecord[];
  getMemberByApplicationNumber: (applicationNo: string) => MemberRecord | undefined;
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'peeth_memberships_v2';

const DEFAULT_MEMBERS: MemberRecord[] = [
  {
    id: 'APP-2026-000001',
    applicationNo: 'APP-2026-000001',
    membershipNo: 'MEM-2026-000001',
    seqNo: 1,
    memSeqNo: 1,
    fullName: 'स्वामी योगानंद महाराज',
    fatherHusbandName: 'श्री परमानंद',
    mobile: '9876543210',
    whatsapp: '9876543210',
    email: 'yoganand@babajipeeth.org',
    gender: 'पुरुष',
    dob: '1985-06-15',
    maritalStatus: 'अविवाहित',
    address: 'सरल ध्यान योग पीठ आश्रम, निकट गंगा तट',
    state: 'उत्तराखंड (Uttarakhand)',
    district: 'ऋषिकेश / पौड़ी गढ़वाल (Pauri Garhwal)',
    pincode: '249201',
    bloodGroup: 'O+',
    occupation: 'योग साधक व शिक्षक',
    photoUrl: '/assets/indian_sadhak1.jpg',
    signatureUrl: '',
    registrationDate: '15/06/2026',
    approvalDate: '16/06/2026',
    status: 'Approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'APP-2026-000003',
    applicationNo: 'APP-2026-000003',
    seqNo: 3,
    fullName: 'राहुल कुमार चौधरी',
    fatherHusbandName: 'श्री रामेश्वर चौधरी',
    mobile: '9876543212',
    whatsapp: '9876543212',
    email: 'rahul.chaudhury@example.com',
    gender: 'पुरुष',
    dob: '1990-08-20',
    maritalStatus: 'विवाहित',
    address: '302, शांति निवास, एमजी रोड, पंचवटी',
    state: 'महाराष्ट्र (Maharashtra)',
    district: 'नाशिक (Nashik)',
    pincode: '422003',
    bloodGroup: 'B+',
    occupation: 'व्यापार / सामाजिक कार्यकर्ता',
    photoUrl: '/assets/indian_sadhak3.jpg',
    signatureUrl: '',
    registrationDate: '11/08/2026',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const MembershipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<MemberRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return DEFAULT_MEMBERS;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const saveToLocalStorage = (data: MemberRecord[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.log('LocalStorage save notice:', e);
    }
  };

  useEffect(() => {
    try {
      const colRef = collection(db, 'memberships');
      const unsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
          const list: MemberRecord[] = [];
          if (!snapshot.empty) {
            snapshot.forEach((docSnap) => {
              const d = docSnap.data() as MemberRecord;
              if (d && d.id) {
                list.push(d);
              }
            });
            list.sort((a, b) => (b.seqNo || 0) - (a.seqNo || 0));
          }
          // Merge default members if empty or missing APP-2026-000003
          const merged = list.length > 0 ? list : DEFAULT_MEMBERS;
          setMembers(merged);
          saveToLocalStorage(merged);
          setIsLoading(false);
        },
        (err) => {
          console.log('Firestore memberships listener error:', err);
          setIsLoading(false);
        }
      );
      return () => {
        unsubscribe();
      };
    } catch (e) {
      console.error('Failed to attach Firestore memberships listener:', e);
      setIsLoading(false);
    }
  }, []);

  const addMember = async (
    data: MemberFormData
  ): Promise<{ success: boolean; member?: MemberRecord; error?: string }> => {
    const cleanMobile = data.mobile.trim().replace(/\D/g, '');
    const cleanEmail = data.email.trim().toLowerCase();

    const duplicate = members.find(
      (m) =>
        m.mobile.replace(/\D/g, '') === cleanMobile ||
        (cleanEmail && m.email.toLowerCase() === cleanEmail)
    );

    if (duplicate) {
      return {
        success: false,
        member: duplicate,
        error: `इस मोबाइल नंबर (${cleanMobile}) या ईमेल आईडी से पहले ही आवेदन (ID: ${duplicate.applicationNo}) दर्ज किया जा चुका है!`,
      };
    }

    const maxSeq = members.reduce((max, m) => {
      if (m.seqNo) return Math.max(max, m.seqNo);
      const match = m.applicationNo?.match(/APP-\d+-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num)) return Math.max(max, num);
      }
      return max;
    }, 0);
    const nextSeq = maxSeq + 1;
    const year = new Date().getFullYear();
    const applicationNo = `APP-${year}-${String(nextSeq).padStart(6, '0')}`;
    
    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString('hi-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const newMember: MemberRecord = {
      id: applicationNo,
      applicationNo,
      seqNo: nextSeq,
      fullName: data.fullName.trim(),
      fatherHusbandName: data.fatherHusbandName.trim(),
      mobile: cleanMobile,
      whatsapp: data.whatsapp.trim().replace(/\D/g, ''),
      email: cleanEmail,
      gender: data.gender,
      dob: data.dob,
      maritalStatus: data.maritalStatus,
      address: data.address.trim(),
      state: data.state,
      district: data.district,
      pincode: data.pincode.trim(),
      bloodGroup: data.bloodGroup || '',
      occupation: data.occupation || '',
      aadhaarNo: data.aadhaarNo || '',
      panNo: data.panNo || '',
      photoUrl: data.photoDataUrl,
      aadhaarUrl: data.aadhaarDataUrl,
      signatureUrl: data.signatureDataUrl,
      registrationDate: formattedDate,
      status: 'Pending',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const updatedMembers = [newMember, ...members];
    setMembers(updatedMembers);
    saveToLocalStorage(updatedMembers);

    try {
      await setDoc(doc(db, 'memberships', newMember.id), newMember);
      saveSupabaseImageDoc('memberships', { items: updatedMembers });
    } catch (e) {
      console.error('Failed to save member to Firestore:', e);
    }
    
    return { success: true, member: newMember };
  };

  const updateMember = async (id: string, data: Partial<MemberRecord>) => {
    const updatedMembers = members.map((m) =>
      m.id === id || m.applicationNo === id ? { ...m, ...data, updatedAt: new Date().toISOString() } : m
    );
    setMembers(updatedMembers);
    saveToLocalStorage(updatedMembers);

    const target = updatedMembers.find((m) => m.id === id || m.applicationNo === id);
    if (target) {
      try {
        await setDoc(doc(db, 'memberships', target.id), target, { merge: true });
      } catch (e) {
        console.error('Failed to update member in Firestore:', e);
      }
    }
  };

  const updateMemberStatus = async (id: string, status: 'Approved' | 'Pending' | 'Rejected', reason?: string) => {
    await updateMember(id, { status, rejectionReason: reason || '' });
  };
  
  const approveMember = async (id: string): Promise<MemberRecord | undefined> => {
    const target = members.find(m => m.id === id || m.applicationNo === id);
    if (!target) return undefined;
    
    if (target.membershipNo) {
      const updated = { ...target, status: 'Approved' as const };
      await updateMember(target.id, { status: 'Approved' });
      return updated;
    }
    
    const maxMemSeq = members.reduce((max, m) => {
      if (m.memSeqNo) return Math.max(max, m.memSeqNo);
      const match = m.membershipNo?.match(/MEM-\d+-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num)) return Math.max(max, num);
      }
      return max;
    }, 0);

    const nextMemSeq = maxMemSeq + 1;
    const year = new Date().getFullYear();
    const membershipNo = `MEM-${year}-${String(nextMemSeq).padStart(6, '0')}`;
    
    const formattedDate = new Date().toLocaleDateString('hi-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    
    const updates: Partial<MemberRecord> = {
      status: 'Approved',
      membershipNo,
      memSeqNo: nextMemSeq,
      approvalDate: formattedDate,
      updatedAt: new Date().toISOString()
    };

    await updateMember(target.id, updates);
    return { ...target, ...updates };
  };

  const deleteMember = async (id: string) => {
    const updatedMembers = members.filter((m) => m.id !== id && m.applicationNo !== id);
    setMembers(updatedMembers);
    saveToLocalStorage(updatedMembers);

    try {
      await deleteDoc(doc(db, 'memberships', id));
    } catch (e) {
      console.error('Failed to delete member from Firestore:', e);
    }
  };

  const searchMembers = (query: string): MemberRecord[] => {
    if (!query || !query.trim()) return members;
    const q = query.toLowerCase().trim();
    return members.filter(
      (m) =>
        m.fullName.toLowerCase().includes(q) ||
        m.mobile.includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.applicationNo.toLowerCase().includes(q) ||
        (m.membershipNo && m.membershipNo.toLowerCase().includes(q)) ||
        m.state.toLowerCase().includes(q) ||
        m.district.toLowerCase().includes(q)
    );
  };

  const getMemberByApplicationNumber = (applicationNo: string): MemberRecord | undefined => {
    if (!applicationNo) return undefined;
    const clean = applicationNo.trim().toLowerCase();
    return members.find(
      (m) =>
        m.applicationNo.toLowerCase() === clean ||
        m.id.toLowerCase() === clean
    );
  };

  return (
    <MembershipContext.Provider
      value={{
        members,
        isLoading,
        addMember,
        updateMember,
        updateMemberStatus,
        approveMember,
        deleteMember,
        searchMembers,
        getMemberByApplicationNumber,
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
};

export const useMembershipContext = () => {
  const context = useContext(MembershipContext);
  if (!context) {
    throw new Error('useMembershipContext must be used within a MembershipProvider');
  }
  return context;
};
