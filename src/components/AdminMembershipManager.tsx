import React, { useState, useMemo, useEffect } from 'react';
import { useMembershipContext } from '../context/MembershipContext';
import { MemberRecord } from '../types/membership';
import { DigitalIdCard } from './DigitalIdCard';
import { MembershipCertificate } from './MembershipCertificate';
import { AcknowledgementReceipt } from './AcknowledgementReceipt';
import { 
  Users, Search, Filter, Trash2, Edit, Eye, CheckCircle2, 
  XCircle, Clock, X, Phone, Mail, MapPin, Calendar, 
  ShieldCheck, FileText, Download, Fingerprint, Info, Check, Image as ImageIcon,
  Award, Upload, Save, FileCheck, RefreshCw
} from 'lucide-react';
import {
  CertificateSettings,
  getStoredCertificateSettings,
  saveCertificateSettings,
  fetchRemoteCertificateSettings,
  DEFAULT_CERTIFICATE_SETTINGS
} from '../utils/certificateConfig';

export const AdminMembershipManager: React.FC = () => {
  const { members, updateMemberStatus, approveMember, deleteMember, updateMember } = useMembershipContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Approved' | 'Pending' | 'Rejected'>('ALL');
  
  const [viewingMember, setViewingMember] = useState<MemberRecord | null>(null);
  
  const [rejectionModal, setRejectionModal] = useState<{isOpen: boolean, memberId: string}>({ isOpen: false, memberId: '' });
  const [rejectionReason, setRejectionReason] = useState('');
  
  const [notesModal, setNotesModal] = useState<{isOpen: boolean, memberId: string, notes: string}>({ isOpen: false, memberId: '', notes: '' });

  // Certificate Settings State
  const [certSettingsModalOpen, setCertSettingsModalOpen] = useState(false);
  const [certSettings, setCertSettings] = useState<CertificateSettings>(getStoredCertificateSettings());
  const [certSearchId, setCertSearchId] = useState('');
  const [isSavingCertSettings, setIsSavingCertSettings] = useState(false);
  const [certSaveSuccess, setCertSaveSuccess] = useState(false);

  useEffect(() => {
    fetchRemoteCertificateSettings().then(setCertSettings);
  }, []);

  // Image Upload Handler for Certificate Settings
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof CertificateSettings) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCertSettings(prev => ({ ...prev, [field]: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCertSettings = async () => {
    setIsSavingCertSettings(true);
    await saveCertificateSettings(certSettings);
    setIsSavingCertSettings(false);
    setCertSaveSuccess(true);
    setTimeout(() => setCertSaveSuccess(false), 3000);
  };

  const verifiedMember = useMemo(() => {
    if (!certSearchId.trim()) return null;
    const q = certSearchId.toLowerCase().trim();
    return members.find(m => 
      m.id.toLowerCase() === q ||
      m.applicationNo.toLowerCase() === q ||
      (m.membershipNo && m.membershipNo.toLowerCase() === q) ||
      m.fullName.toLowerCase().includes(q)
    ) || null;
  }, [certSearchId, members]);
  // Dashboard Stats
  const stats = useMemo(() => {
    const total = members.length;
    const pending = members.filter(m => m.status === 'Pending').length;
    const approved = members.filter(m => m.status === 'Approved').length;
    const rejected = members.filter(m => m.status === 'Rejected').length;
    
    const today = new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const todaysApps = members.filter(m => m.registrationDate === today).length;
    
    return { total, pending, approved, rejected, todaysApps };
  }, [members]);

  // Filtered List
  const filteredList = useMemo(() => {
    let list = members;
    if (filterStatus !== 'ALL') {
      list = list.filter(m => m.status === filterStatus);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(m => 
        m.fullName.toLowerCase().includes(q) ||
        m.mobile.includes(q) ||
        m.applicationNo.toLowerCase().includes(q) ||
        (m.membershipNo && m.membershipNo.toLowerCase().includes(q))
      );
    }
    return list;
  }, [members, filterStatus, searchQuery]);

  const [approvingId, setApprovingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    try {
      setApprovingId(id);
      const updated = await approveMember(id);
      if (updated) {
        setViewingMember({ ...updated });
      } else {
        setViewingMember(prev => prev && (prev.id === id || prev.applicationNo === id) ? { ...prev, status: 'Approved' } : prev);
      }
    } catch (err) {
      console.error('Approval failed:', err);
      alert('स्वीकृति में समस्या आई, कृपया पुनः प्रयास करें।');
    } finally {
      setApprovingId(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (rejectionModal.memberId && rejectionReason.trim()) {
      await updateMemberStatus(rejectionModal.memberId, 'Rejected', rejectionReason.trim());
      setRejectionModal({ isOpen: false, memberId: '' });
      setRejectionReason('');
      setViewingMember(prev => prev && prev.id === rejectionModal.memberId ? { ...prev, status: 'Rejected' } : prev);
    }
  };

  const handleSaveNotes = async () => {
    if (notesModal.memberId) {
      await updateMember(notesModal.memberId, { internalNotes: notesModal.notes.trim() });
      setNotesModal({ isOpen: false, memberId: '', notes: '' });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('क्या आप वास्तव में इस रिकॉर्ड को हटाना चाहते हैं? यह क्रिया वापस नहीं ली जा सकती।')) {
      await deleteMember(id);
      setViewingMember(null);
    }
  };

  const renderDashboardCards = () => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <div className="bg-coffee-800/80 p-4 rounded-xl border border-coffee-700">
        <div className="flex items-center gap-3 mb-2 text-coffee-300">
          <Users size={20} /> <span className="font-bold text-sm">Total</span>
        </div>
        <p className="text-2xl font-bold text-white">{stats.total}</p>
      </div>
      <div className="bg-amber-900/30 p-4 rounded-xl border border-amber-700/50">
        <div className="flex items-center gap-3 mb-2 text-amber-400">
          <Clock size={20} /> <span className="font-bold text-sm">Pending</span>
        </div>
        <p className="text-2xl font-bold text-amber-300">{stats.pending}</p>
      </div>
      <div className="bg-green-900/30 p-4 rounded-xl border border-green-700/50">
        <div className="flex items-center gap-3 mb-2 text-green-400">
          <CheckCircle2 size={20} /> <span className="font-bold text-sm">Approved</span>
        </div>
        <p className="text-2xl font-bold text-green-300">{stats.approved}</p>
      </div>
      <div className="bg-red-900/30 p-4 rounded-xl border border-red-700/50">
        <div className="flex items-center gap-3 mb-2 text-red-400">
          <XCircle size={20} /> <span className="font-bold text-sm">Rejected</span>
        </div>
        <p className="text-2xl font-bold text-red-300">{stats.rejected}</p>
      </div>
      <div className="bg-blue-900/30 p-4 rounded-xl border border-blue-700/50 col-span-2 md:col-span-1">
        <div className="flex items-center gap-3 mb-2 text-blue-400">
          <Calendar size={20} /> <span className="font-bold text-sm">Today</span>
        </div>
        <p className="text-2xl font-bold text-blue-300">{stats.todaysApps}</p>
      </div>
    </div>
  );

  const renderMemberModal = () => {
    if (!viewingMember) return null;
    const m = viewingMember;
    
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <div className="bg-coffee-950 border border-gold-500/30 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
          
          {/* Header */}
          <div className="flex justify-between items-center bg-coffee-900 p-4 border-b border-gold-500/20">
            <div>
              <h3 className="text-xl font-bold text-gold-200 font-serif">Application Details</h3>
              <p className="text-sm text-gold-400">App No: {m.applicationNo}</p>
            </div>
            <button onClick={() => setViewingMember(null)} className="p-2 bg-coffee-800 hover:bg-coffee-700 text-gold-300 rounded-full">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 custom-scrollbar">
            
            {/* Left Col - Actions & Status */}
            <div className="md:col-span-1 space-y-4">
              <div className={`p-4 rounded-xl border ${m.status === 'Approved' ? 'bg-green-900/20 border-green-500/50' : m.status === 'Rejected' ? 'bg-red-900/20 border-red-500/50' : 'bg-amber-900/20 border-amber-500/50'}`}>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Status</p>
                <div className="flex items-center gap-2">
                   {m.status === 'Approved' ? <CheckCircle2 className="text-green-400" size={20} /> : m.status === 'Rejected' ? <XCircle className="text-red-400" size={20} /> : <Clock className="text-amber-400" size={20} />}
                   <span className={`font-bold text-lg ${m.status === 'Approved' ? 'text-green-400' : m.status === 'Rejected' ? 'text-red-400' : 'text-amber-400'}`}>{m.status}</span>
                </div>
                {m.membershipNo && <p className="text-sm font-mono mt-2 text-green-300">Mem No: {m.membershipNo}</p>}
                {m.rejectionReason && <p className="text-xs mt-2 text-red-300">Reason: {m.rejectionReason}</p>}
              </div>

              {m.status === 'Pending' && (
                <div className="space-y-2">
                  <button 
                    onClick={() => handleApprove(m.id)} 
                    disabled={approvingId === m.id}
                    className="w-full py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
                  >
                    <CheckCircle2 size={18} /> {approvingId === m.id ? 'Approving Application...' : 'Approve & Generate ID'}
                  </button>
                  <button 
                    onClick={() => setRejectionModal({ isOpen: true, memberId: m.id })} 
                    disabled={approvingId === m.id}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition"
                  >
                    <XCircle size={18} /> Reject Application
                  </button>
                </div>
              )}

              <div className="bg-coffee-900 p-4 rounded-xl border border-gold-500/20">
                <p className="text-xs uppercase text-gold-400 font-bold mb-2">Documents</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1">Photo</p>
                    <img src={m.photoUrl} alt="Photo" className="w-24 h-24 object-cover rounded border border-gold-500/30" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1">Signature</p>
                    <img src={m.signatureUrl} alt="Signature" className="w-32 h-12 object-contain bg-white rounded border border-gold-500/30" />
                  </div>
                  {m.aadhaarUrl && (
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1">Aadhaar</p>
                      <img src={m.aadhaarUrl} alt="Aadhaar" className="w-32 h-20 object-cover rounded border border-gold-500/30" />
                    </div>
                  )}
                </div>
              </div>

              <button onClick={() => setNotesModal({ isOpen: true, memberId: m.id, notes: m.internalNotes || '' })} className="w-full py-2 bg-coffee-800 hover:bg-coffee-700 text-gold-200 text-sm font-bold rounded-lg flex items-center justify-center gap-2">
                <Edit size={16} /> Internal Notes
              </button>
              
              <button onClick={() => handleDelete(m.id)} className="w-full py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-bold rounded-lg flex items-center justify-center gap-2">
                <Trash2 size={16} /> Delete Record
              </button>
            </div>

            {/* Right Col - Details */}
            <div className="md:col-span-2 space-y-6">
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-400 text-xs block">Full Name</span><span className="text-gold-100 font-medium">{m.fullName}</span></div>
                <div><span className="text-gray-400 text-xs block">Father/Husband</span><span className="text-gold-100 font-medium">{m.fatherHusbandName}</span></div>
                <div><span className="text-gray-400 text-xs block">Gender</span><span className="text-gold-100 font-medium">{m.gender}</span></div>
                <div><span className="text-gray-400 text-xs block">DOB</span><span className="text-gold-100 font-medium">{m.dob}</span></div>
                <div><span className="text-gray-400 text-xs block">Marital Status</span><span className="text-gold-100 font-medium">{m.maritalStatus}</span></div>
                <div><span className="text-gray-400 text-xs block">Blood Group</span><span className="text-gold-100 font-medium">{m.bloodGroup || 'N/A'}</span></div>
                <div><span className="text-gray-400 text-xs block">Mobile</span><span className="text-gold-100 font-medium">{m.mobile}</span></div>
                <div><span className="text-gray-400 text-xs block">WhatsApp</span><span className="text-gold-100 font-medium">{m.whatsapp}</span></div>
                <div><span className="text-gray-400 text-xs block">Email</span><span className="text-gold-100 font-medium">{m.email || 'N/A'}</span></div>
                <div><span className="text-gray-400 text-xs block">Occupation</span><span className="text-gold-100 font-medium">{m.occupation || 'N/A'}</span></div>
                <div><span className="text-gray-400 text-xs block">Aadhaar No</span><span className="text-gold-100 font-medium">{m.aadhaarNo || 'N/A'}</span></div>
                <div><span className="text-gray-400 text-xs block">PAN No</span><span className="text-gold-100 font-medium">{m.panNo || 'N/A'}</span></div>
                <div className="col-span-2"><span className="text-gray-400 text-xs block">Address</span><span className="text-gold-100 font-medium">{m.address}, {m.district}, {m.state} - {m.pincode}</span></div>
              </div>

              {m.internalNotes && (
                <div className="bg-blue-900/10 border border-blue-500/20 p-3 rounded-lg">
                  <p className="text-xs text-blue-400 font-bold mb-1">Internal Notes</p>
                  <p className="text-sm text-blue-200/80 whitespace-pre-wrap">{m.internalNotes}</p>
                </div>
              )}

              {/* Document Previews */}
              <div className="border-t border-gold-500/20 pt-6">
                <h4 className="text-gold-300 font-bold mb-4 font-serif">Generated Documents</h4>
                <div className="space-y-6">
                  {m.status === 'Pending' && (
                    <div className="bg-white p-2 rounded-xl">
                      <AcknowledgementReceipt member={m} />
                    </div>
                  )}
                  {m.status === 'Approved' && (
                    <>
                      <div>
                        <p className="text-xs text-gold-400 mb-2 font-bold">Digital ID Card</p>
                        <DigitalIdCard member={m} onDownload={() => {}} compact={false} />
                      </div>
                      <div className="bg-white p-2 rounded-xl overflow-x-auto">
                        <p className="text-xs text-gray-800 mb-2 font-bold pl-2 pt-2">Membership Certificate</p>
                        <MembershipCertificate member={m} />
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <ShieldCheck size={28} className="text-saffron-400" />
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-gold-200">
          Membership Applications
        </h2>
      </div>

      {renderDashboardCards()}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-coffee-900/50 p-4 rounded-xl border border-gold-500/20">
        <div className="relative w-full sm:w-96">
          <Search size={18} className="absolute left-3 top-3 text-gold-500/60" />
          <input
            type="text"
            placeholder="Search by Name, Mobile, App No..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-coffee-950 border border-gold-500/30 rounded-xl text-sm text-gold-100 placeholder-gold-500/50"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
           <button
             onClick={() => setCertSettingsModalOpen(true)}
             className="flex items-center gap-2 px-4 py-2.5 bg-saffron-600 hover:bg-saffron-700 text-white font-bold rounded-xl text-sm transition shadow-sm"
           >
             <Award size={18} />
             Certificate Settings & Verification
           </button>
           <select 
             value={filterStatus}
             onChange={e => setFilterStatus(e.target.value as any)}
             className="px-4 py-2.5 bg-coffee-950 border border-gold-500/30 rounded-xl text-sm text-gold-100"
           >
             <option value="ALL">All Status</option>
             <option value="Pending">Pending</option>
             <option value="Approved">Approved</option>
             <option value="Rejected">Rejected</option>
           </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-coffee-950/50 border border-gold-500/30 rounded-xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-coffee-900/80 border-b border-gold-500/30">
              <th className="p-4 text-sm font-bold text-gold-300">Application No</th>
              <th className="p-4 text-sm font-bold text-gold-300">Name</th>
              <th className="p-4 text-sm font-bold text-gold-300">Contact</th>
              <th className="p-4 text-sm font-bold text-gold-300">Location</th>
              <th className="p-4 text-sm font-bold text-gold-300">Date</th>
              <th className="p-4 text-sm font-bold text-gold-300">Status</th>
              <th className="p-4 text-sm font-bold text-gold-300 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map(m => (
              <tr key={m.id} className="border-b border-gold-500/10 hover:bg-coffee-900/40 transition">
                <td className="p-4">
                  <div className="font-mono text-sm text-gold-100">{m.applicationNo}</div>
                  {m.membershipNo && <div className="font-mono text-xs text-green-400 mt-1">{m.membershipNo}</div>}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={m.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-gold-500/30" />
                    <div>
                      <p className="text-sm font-bold text-gold-100">{m.fullName}</p>
                      <p className="text-xs text-gold-400">{m.fatherHusbandName}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm text-gold-200">{m.mobile}</p>
                  <p className="text-xs text-gold-400">{m.district}</p>
                </td>
                <td className="p-4">
                  <p className="text-sm text-gold-200">{m.state}</p>
                </td>
                <td className="p-4 text-sm text-gold-200">{m.registrationDate}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    m.status === 'Approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    m.status === 'Rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {m.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setViewingMember(m)} className="p-2 bg-coffee-800 hover:bg-coffee-700 text-gold-300 rounded-lg transition" title="View Application Details">
                      <Eye size={18} />
                    </button>
                    {m.status === 'Pending' && (
                      <button 
                        onClick={() => handleApprove(m.id)} 
                        disabled={approvingId === m.id}
                        className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
                        title="Quick Approve Application"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredList.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gold-400/50 font-medium">
                  No applications found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {renderMemberModal()}

      {/* Rejection Modal */}
      {rejectionModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-coffee-950 border border-red-500/30 p-6 rounded-2xl shadow-2xl max-w-md w-full">
            <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
              <XCircle size={20} /> Reject Application
            </h3>
            <p className="text-sm text-gold-200 mb-2">Please provide a reason for rejection:</p>
            <textarea 
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              className="w-full h-24 p-3 bg-coffee-900 border border-gold-500/30 rounded-xl text-gold-100 text-sm mb-4"
              placeholder="E.g., Invalid photo, documents unclear..."
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setRejectionModal({ isOpen: false, memberId: '' })} className="px-4 py-2 text-gold-400 hover:text-gold-300 text-sm font-bold">Cancel</button>
              <button onClick={handleRejectSubmit} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold">Confirm Reject</button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {notesModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-coffee-950 border border-blue-500/30 p-6 rounded-2xl shadow-2xl max-w-md w-full">
            <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
              <Edit size={20} /> Internal Notes
            </h3>
            <textarea 
              value={notesModal.notes}
              onChange={e => setNotesModal({ ...notesModal, notes: e.target.value })}
              className="w-full h-32 p-3 bg-coffee-900 border border-gold-500/30 rounded-xl text-gold-100 text-sm mb-4"
              placeholder="Add private notes for admins..."
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setNotesModal({ isOpen: false, memberId: '', notes: '' })} className="px-4 py-2 text-gold-400 hover:text-gold-300 text-sm font-bold">Cancel</button>
              <button onClick={handleSaveNotes} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold">Save Notes</button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Settings & Verification Modal */}
      {certSettingsModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-coffee-950 border border-gold-500/40 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-coffee-900 p-4 border-b border-gold-500/20">
              <div className="flex items-center gap-3">
                <Award className="text-gold-400" size={24} />
                <div>
                  <h3 className="text-lg font-bold text-gold-100 font-serif">Certificate Management & Verification System</h3>
                  <p className="text-xs text-gold-400">Manage official signature, stamp/seal, and verify member certificates</p>
                </div>
              </div>
              <button onClick={() => setCertSettingsModalOpen(false)} className="p-2 bg-coffee-800 hover:bg-coffee-700 text-gold-300 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* Section 1: Certificate Verification Tool */}
              <div className="bg-coffee-900/60 p-5 rounded-2xl border border-gold-500/30">
                <h4 className="text-md font-bold text-gold-200 font-serif mb-3 flex items-center gap-2">
                  <FileCheck className="text-saffron-400" size={20} />
                  Certificate Search & Instant Verification
                </h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={certSearchId}
                    onChange={(e) => setCertSearchId(e.target.value)}
                    placeholder="Enter Membership No., Application ID, or Name..."
                    className="flex-1 px-4 py-2.5 bg-coffee-950 border border-gold-500/40 rounded-xl text-gold-100 text-sm placeholder-gold-500/40"
                  />
                  {certSearchId && (
                    <button
                      onClick={() => setCertSearchId('')}
                      className="px-4 py-2.5 bg-coffee-800 text-gold-300 hover:text-white rounded-xl text-sm font-bold"
                    >
                      Clear Search
                    </button>
                  )}
                </div>

                {/* Search Result Certificate Preview */}
                {certSearchId.trim() && (
                  <div className="mt-4 pt-4 border-t border-gold-500/20">
                    {verifiedMember ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-green-950/40 border border-green-500/40 p-3 rounded-xl">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-green-400" size={20} />
                            <div>
                              <p className="text-sm font-bold text-green-300">Verified Certificate Record Found!</p>
                              <p className="text-xs text-gold-300">{verifiedMember.fullName} ({verifiedMember.membershipNo || verifiedMember.applicationNo})</p>
                            </div>
                          </div>
                          <span className="text-xs bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full font-bold">
                            {verifiedMember.status}
                          </span>
                        </div>
                        
                        {verifiedMember.status === 'Approved' ? (
                          <div className="bg-white p-2 rounded-xl overflow-x-auto shadow-lg">
                            <MembershipCertificate member={verifiedMember} customSettings={certSettings} />
                          </div>
                        ) : (
                          <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-xl text-amber-300 text-sm">
                            Member application status is <strong>{verifiedMember.status}</strong>. Approved status is required for official certificate generation.
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-xl text-red-300 text-sm">
                        No certificate record found for ID or Name matching "<strong>{certSearchId}</strong>".
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Section 2: Template Controls & Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Signature Upload */}
                <div className="bg-coffee-900/50 p-5 rounded-2xl border border-gold-500/20 space-y-3">
                  <h5 className="text-sm font-bold text-gold-200 uppercase tracking-wider flex items-center justify-between">
                    <span>Authorized Signature</span>
                    <span className="text-[10px] font-normal text-gold-400">PNG / JPG / SVG</span>
                  </h5>
                  <div className="h-20 bg-white/90 p-2 rounded-xl flex items-center justify-center border border-gold-500/40">
                    <img
                      src={certSettings.authorizedSignatureUrl}
                      alt="Signature Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <label className="flex items-center justify-center gap-2 w-full py-2 bg-coffee-800 hover:bg-coffee-700 text-gold-200 rounded-xl cursor-pointer text-xs font-bold border border-gold-500/30 transition">
                    <Upload size={14} /> Upload Custom Signature Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'authorizedSignatureUrl')}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => setCertSettings(prev => ({ ...prev, authorizedSignatureUrl: DEFAULT_CERTIFICATE_SETTINGS.authorizedSignatureUrl }))}
                    className="text-[11px] text-gold-400 hover:text-gold-200 underline block text-center w-full"
                  >
                    Reset to Default Signature
                  </button>
                </div>

                {/* Seal / Stamp Upload */}
                <div className="bg-coffee-900/50 p-5 rounded-2xl border border-gold-500/20 space-y-3">
                  <h5 className="text-sm font-bold text-gold-200 uppercase tracking-wider flex items-center justify-between">
                    <span>Official Seal / Stamp</span>
                    <span className="text-[10px] font-normal text-gold-400">Circular Stamp</span>
                  </h5>
                  <div className="h-20 bg-white/90 p-2 rounded-xl flex items-center justify-center border border-gold-500/40">
                    <img
                      src={certSettings.officialSealUrl}
                      alt="Official Seal Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <label className="flex items-center justify-center gap-2 w-full py-2 bg-coffee-800 hover:bg-coffee-700 text-gold-200 rounded-xl cursor-pointer text-xs font-bold border border-gold-500/30 transition">
                    <Upload size={14} /> Upload Official Seal Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'officialSealUrl')}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => setCertSettings(prev => ({ ...prev, officialSealUrl: DEFAULT_CERTIFICATE_SETTINGS.officialSealUrl }))}
                    className="text-[11px] text-gold-400 hover:text-gold-200 underline block text-center w-full"
                  >
                    Reset to Default Stamp
                  </button>
                </div>

                {/* Signatory Name */}
                <div className="bg-coffee-900/50 p-4 rounded-2xl border border-gold-500/20 space-y-2">
                  <label className="text-xs font-bold text-gold-300 block">Signatory Name</label>
                  <input
                    type="text"
                    value={certSettings.signatoryName}
                    onChange={(e) => setCertSettings({ ...certSettings, signatoryName: e.target.value })}
                    className="w-full px-3 py-2 bg-coffee-950 border border-gold-500/30 rounded-xl text-gold-100 text-sm"
                  />
                </div>

                {/* Signatory Title */}
                <div className="bg-coffee-900/50 p-4 rounded-2xl border border-gold-500/20 space-y-2">
                  <label className="text-xs font-bold text-gold-300 block">Signatory Official Title</label>
                  <input
                    type="text"
                    value={certSettings.signatoryTitle}
                    onChange={(e) => setCertSettings({ ...certSettings, signatoryTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-coffee-950 border border-gold-500/30 rounded-xl text-gold-100 text-sm"
                  />
                </div>

              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gold-500/20">
                {certSaveSuccess ? (
                  <span className="text-sm font-bold text-green-400 flex items-center gap-2">
                    <CheckCircle2 size={18} /> Certificate settings saved successfully!
                  </span>
                ) : (
                  <span className="text-xs text-gold-400">
                    Changes apply immediately to all generated membership certificates.
                  </span>
                )}
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setCertSettings(DEFAULT_CERTIFICATE_SETTINGS)}
                    className="px-4 py-2.5 bg-coffee-900 hover:bg-coffee-800 text-gold-300 rounded-xl text-sm font-bold flex items-center gap-2"
                  >
                    <RefreshCw size={16} /> Reset All Defaults
                  </button>
                  <button
                    onClick={handleSaveCertSettings}
                    disabled={isSavingCertSettings}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-saffron-600 hover:bg-saffron-700 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  >
                    <Save size={18} />
                    {isSavingCertSettings ? 'Saving...' : 'Save Certificate Settings'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
