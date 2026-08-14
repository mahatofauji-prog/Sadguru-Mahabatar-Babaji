export interface MemberRecord {
  id: string; // The Firestore document ID (can be the applicationNo)
  applicationNo: string; // e.g. APP-2026-000001
  membershipNo?: string; // e.g. MEM-2026-000001
  seqNo: number; // For application number generation
  memSeqNo?: number; // For membership number generation
  
  fullName: string;
  fatherHusbandName: string;
  mobile: string;
  whatsapp: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other' | 'पुरुष' | 'महिला' | 'अन्य';
  dob: string;
  maritalStatus: 'Married' | 'Unmarried' | 'विवाहित' | 'अविवाहित';
  
  bloodGroup?: string;
  occupation?: string;
  aadhaarNo?: string;
  panNo?: string;
  
  address: string;
  state: string;
  district: string;
  pincode: string;
  
  photoUrl: string; // Base64 or Image URL
  aadhaarUrl?: string; // Optional document
  signatureUrl: string; // Signature image
  
  registrationDate: string; // Formatted date string or ISO
  approvalDate?: string;
  
  status: 'Approved' | 'Pending' | 'Rejected';
  rejectionReason?: string;
  internalNotes?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface MemberFormData {
  fullName: string;
  fatherHusbandName: string;
  mobile: string;
  whatsapp: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other' | 'पुरुष' | 'महिला' | 'अन्य';
  dob: string;
  maritalStatus: 'Married' | 'Unmarried' | 'विवाहित' | 'अविवाहित';
  
  bloodGroup?: string;
  occupation?: string;
  aadhaarNo?: string;
  panNo?: string;
  
  address: string;
  state: string;
  district: string;
  pincode: string;
  
  photoDataUrl: string;
  aadhaarDataUrl?: string;
  signatureDataUrl: string;
}
