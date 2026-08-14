import React, { useState, useRef } from 'react';
import { 
  X, User, Phone, Mail, MapPin, Calendar, Heart, ShieldCheck, Sparkles, 
  Upload, ArrowRight, ArrowLeft, Search, CheckCircle2, AlertCircle, RefreshCw, 
  ImageIcon, FileText, Download, Fingerprint
} from 'lucide-react';
import { INDIA_STATES_AND_DISTRICTS, getDistrictsForState } from '../data/indiaLocations';
import { MemberFormData, MemberRecord } from '../types/membership';
import { useMembershipContext } from '../context/MembershipContext';
import { compressImageFile } from '../utils/imageCompressor';
import { AcknowledgementReceipt } from './AcknowledgementReceipt';
import { MembershipCertificate } from './MembershipCertificate';
import { DigitalIdCard } from './DigitalIdCard';
import { motion, AnimatePresence } from 'motion/react';

interface MembershipRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'register' | 'search';
}

export const MembershipRegistrationModal: React.FC<MembershipRegistrationModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'register',
}) => {
  const { addMember, getMemberByApplicationNumber } = useMembershipContext();
  const [activeTab, setActiveTab] = useState<'register' | 'search'>(initialMode);
  
  // Registration Form State
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<MemberFormData>({
    fullName: '',
    fatherHusbandName: '',
    mobile: '',
    whatsapp: '',
    email: '',
    gender: 'पुरुष',
    dob: '',
    maritalStatus: 'विवाहित',
    bloodGroup: '',
    occupation: '',
    aadhaarNo: '',
    panNo: '',
    address: '',
    state: INDIA_STATES_AND_DISTRICTS[0].state,
    district: INDIA_STATES_AND_DISTRICTS[0].districts[0],
    pincode: '',
    photoDataUrl: '',
    aadhaarDataUrl: '',
    signatureDataUrl: '',
  });

  const [photoPreview, setPhotoPreview] = useState('');
  const [aadhaarPreview, setAadhaarPreview] = useState('');
  const [signaturePreview, setSignaturePreview] = useState('');
  
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);
  const [isCompressingAadhaar, setIsCompressingAadhaar] = useState(false);
  const [isCompressingSignature, setIsCompressingSignature] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [generatedMember, setGeneratedMember] = useState<MemberRecord | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [foundMember, setFoundMember] = useState<MemberRecord | null>(null);
  const [searchError, setSearchError] = useState('');
  const [searchVerified, setSearchVerified] = useState(true);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const aadhaarInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    const districtsList = getDistrictsForState(newState);
    setFormData((prev) => ({ ...prev, state: newState, district: districtsList[0] || '' }));
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'photo' | 'aadhaar' | 'signature'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'photo') setIsCompressingPhoto(true);
    if (type === 'aadhaar') setIsCompressingAadhaar(true);
    if (type === 'signature') setIsCompressingSignature(true);

    try {
      const compressedDataUrl = await compressImageFile(file, 600, 600, 0.8);
      
      if (type === 'photo') {
        setPhotoPreview(compressedDataUrl);
        setFormData(prev => ({ ...prev, photoDataUrl: compressedDataUrl }));
      }
      if (type === 'aadhaar') {
        setAadhaarPreview(compressedDataUrl);
        setFormData(prev => ({ ...prev, aadhaarDataUrl: compressedDataUrl }));
      }
      if (type === 'signature') {
        setSignaturePreview(compressedDataUrl);
        setFormData(prev => ({ ...prev, signatureDataUrl: compressedDataUrl }));
      }
    } catch (err: any) {
      setErrorMessage('फ़ाइल अपलोड करने में समस्या आई।');
    } finally {
      if (type === 'photo') setIsCompressingPhoto(false);
      if (type === 'aadhaar') setIsCompressingAadhaar(false);
      if (type === 'signature') setIsCompressingSignature(false);
      if (e.target) e.target.value = '';
    }
  };

  const nextStep = () => {
    setErrorMessage('');
    if (step === 1) {
      if (!formData.fullName.trim() || !formData.fatherHusbandName.trim() || !formData.dob) {
        setErrorMessage('कृपया सभी अनिवार्य विवरण भरें (नाम, पिता/पति का नाम, जन्म तिथि)।');
        return;
      }
    }
    if (step === 2) {
      const mobile = formData.mobile.replace(/\D/g, '');
      if (mobile.length < 10) {
        setErrorMessage('सही मोबाइल नंबर दर्ज करें।');
        return;
      }
      if (!formData.address.trim() || !formData.pincode.trim()) {
        setErrorMessage('कृपया पूरा पता और पिनकोड दर्ज करें।');
        return;
      }
    }
    if (step === 3) {
      if (!formData.photoDataUrl) {
        setErrorMessage('कृपया अपना पासपोर्ट साइज फोटो अपलोड करें।');
        return;
      }
      if (!formData.signatureDataUrl) {
        setErrorMessage('कृपया अपने हस्ताक्षर (Signature) की फोटो अपलोड करें।');
        return;
      }
    }
    setStep(s => s + 1);
  };

  const prevStep = () => {
    setErrorMessage('');
    setStep(s => s - 1);
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    setIsSubmitting(true);
    
    try {
      const res = await addMember(formData);
      if (res.success && res.member) {
        setGeneratedMember(res.member);
        setStep(5);
      } else {
        setErrorMessage(res.error || 'आवेदन दर्ज करने में समस्या आई।');
      }
    } catch (err) {
      setErrorMessage('सर्वर त्रुटि। कृपया बाद में प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setFoundMember(null);

    if (!searchQuery.trim()) {
      setSearchError('कृपया आवेदन संख्या (Application Number) दर्ज करें।');
      return;
    }

    const member = getMemberByApplicationNumber(searchQuery);
    if (member) {
      setFoundMember(member);
      setSearchVerified(true);
    } else {
      setSearchError(`Application not found. Please check your Application Number ("${searchQuery}").`);
    }
  };

  const renderRegisterSteps = () => {
    return (
      <div className="space-y-6">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-md font-bold text-gold-300 font-serif border-b border-gold-500/20 pb-2 flex items-center gap-2">
              <User size={18} /> व्यक्तिगत विवरण (Personal Details)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gold-200/80 mb-1">पूरा नाम (Full Name) *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="उदा. राहुल कुमार चौधरी"
                  className="w-full px-3 py-2 bg-coffee-950 border border-gold-500/30 rounded-xl text-gold-100 text-sm focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gold-200/80 mb-1">पिता / पति का नाम *</label>
                <input
                  type="text"
                  required
                  value={formData.fatherHusbandName}
                  onChange={e => setFormData({ ...formData, fatherHusbandName: e.target.value })}
                  placeholder="उदा. श्री रामेश्वर चौधरी"
                  className="w-full px-3 py-2 bg-coffee-950 border border-gold-500/30 rounded-xl text-gold-100 text-sm focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gold-200/80 mb-1">जन्म तिथि (DOB) *</label>
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3 py-2 bg-coffee-950 border border-gold-500/30 rounded-xl text-gold-100 text-sm focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gold-200/80 mb-1">लिंग (Gender) *</label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-2 bg-coffee-950 border border-gold-500/30 rounded-xl text-gold-100 text-sm focus:outline-none focus:border-gold-400"
                >
                  <option value="पुरुष">पुरुष (Male)</option>
                  <option value="महिला">महिला (Female)</option>
                  <option value="अन्य">अन्य (Other)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gold-200/80 mb-1">वैवाहिक स्थिति (Marital Status)</label>
                <select
                  value={formData.maritalStatus}
                  onChange={e => setFormData({ ...formData, maritalStatus: e.target.value as any })}
                  className="w-full px-3 py-2 bg-coffee-950 border border-gold-500/30 rounded-xl text-gold-100 text-sm focus:outline-none focus:border-gold-400"
                >
                  <option value="विवाहित">विवाहित (Married)</option>
                  <option value="अविवाहित">अविवाहित (Unmarried)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gold-200/80 mb-1">रक्त समूह (Blood Group)</label>
                <select
                  value={formData.bloodGroup}
                  onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 bg-coffee-950 border border-gold-500/30 rounded-xl text-gold-100 text-sm focus:outline-none focus:border-gold-400"
                >
                  <option value="">चुनें (Select)</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-md font-bold text-gold-300 font-serif border-b border-gold-500/20 pb-2 flex items-center gap-2">
              <Phone size={18} /> संपर्क व पता (Contact & Address)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gold-200/80 mb-1">मोबाइल नंबर (Mobile) *</label>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={formData.mobile}
                  onChange={e => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                  placeholder="10 अंकों का मोबाइल नंबर"
                  className="w-full px-3 py-2 bg-coffee-950 border border-gold-500/30 rounded-xl text-gold-100 text-sm focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gold-200/80 mb-1">व्हाट्सएप नंबर (WhatsApp)</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.whatsapp}
                  onChange={e => setFormData({ ...formData, whatsapp: e.target.value.replace(/\D/g, '') })}
                  placeholder="व्हाट्सएप नंबर"
                  className="w-full px-3 py-2 bg-coffee-950 border border-gold-500/30 rounded-xl text-gold-100 text-sm focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gold-200/80 mb-1">ईमेल आईडी (Email Address)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="उदा. example@mail.com"
                  className="w-full px-3 py-2 bg-coffee-950 border border-gold-500/30 rounded-xl text-gold-100 text-sm focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gold-200/80 mb-1">राज्य (State) *</label>
                <select
                  value={formData.state}
                  onChange={handleStateChange}
                  className="w-full px-3 py-2 bg-coffee-950 border border-gold-500/30 rounded-xl text-gold-100 text-sm focus:outline-none focus:border-gold-400"
                >
                  {INDIA_STATES_AND_DISTRICTS.map(st => (
                    <option key={st.state} value={st.state}>{st.state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gold-200/80 mb-1">जिला (District) *</label>
                <select
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 bg-coffee-950 border border-gold-500/30 rounded-xl text-gold-100 text-sm focus:outline-none focus:border-gold-400"
                >
                  {getDistrictsForState(formData.state).map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gold-200/80 mb-1">पूरा पता (Full Address) *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="मकान नंबर, गली, लैंडमार्क..."
                  className="w-full px-3 py-2 bg-coffee-950 border border-gold-500/30 rounded-xl text-gold-100 text-sm focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gold-200/80 mb-1">पिन कोड (Pincode) *</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={formData.pincode}
                  onChange={e => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                  placeholder="6 अंकों का पिनकोड"
                  className="w-full px-3 py-2 bg-coffee-950 border border-gold-500/30 rounded-xl text-gold-100 text-sm focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gold-200/80 mb-1">व्यवसाय / पेशा (Occupation)</label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="व्यापार / सेवा / छात्र..."
                  className="w-full px-3 py-2 bg-coffee-950 border border-gold-500/30 rounded-xl text-gold-100 text-sm focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-md font-bold text-gold-300 font-serif border-b border-gold-500/20 pb-2 flex items-center gap-2">
              <Upload size={18} /> दस्तावेज़ अपलोड (Photo & Signature Upload)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Photo Upload */}
              <div className="bg-coffee-950/60 p-4 rounded-xl border border-gold-500/30 text-center space-y-3">
                <p className="text-xs font-bold text-gold-200 uppercase">पासपोर्ट फोटो (Photo) *</p>
                <div className="w-24 h-28 mx-auto border-2 border-dashed border-gold-500/40 rounded-xl overflow-hidden flex items-center justify-center bg-coffee-900/50">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Photo" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={32} className="text-gold-500/40" />
                  )}
                </div>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleFileUpload(e, 'photo')}
                />
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={isCompressingPhoto}
                  className="px-4 py-2 bg-coffee-800 hover:bg-coffee-700 text-gold-200 rounded-lg text-xs font-bold w-full transition"
                >
                  {isCompressingPhoto ? 'प्रोसेसिंग...' : photoPreview ? 'फोटो बदलें' : 'फोटो अपलोड करें'}
                </button>
              </div>

              {/* Signature Upload */}
              <div className="bg-coffee-950/60 p-4 rounded-xl border border-gold-500/30 text-center space-y-3">
                <p className="text-xs font-bold text-gold-200 uppercase">हस्ताक्षर (Signature) *</p>
                <div className="w-36 h-20 mx-auto border-2 border-dashed border-gold-500/40 rounded-xl overflow-hidden flex items-center justify-center bg-white/90">
                  {signaturePreview ? (
                    <img src={signaturePreview} alt="Signature" className="w-full h-full object-contain" />
                  ) : (
                    <FileText size={32} className="text-coffee-400" />
                  )}
                </div>
                <input
                  ref={signatureInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleFileUpload(e, 'signature')}
                />
                <button
                  type="button"
                  onClick={() => signatureInputRef.current?.click()}
                  disabled={isCompressingSignature}
                  className="px-4 py-2 bg-coffee-800 hover:bg-coffee-700 text-gold-200 rounded-lg text-xs font-bold w-full transition"
                >
                  {isCompressingSignature ? 'प्रोसेसिंग...' : signaturePreview ? 'हस्ताक्षर बदलें' : 'हस्ताक्षर अपलोड करें'}
                </button>
              </div>

              {/* Optional Aadhaar */}
              <div className="sm:col-span-2 bg-coffee-950/40 p-4 rounded-xl border border-gold-500/20 text-center space-y-2">
                <p className="text-xs font-bold text-gold-300">आधार कार्ड (ऐच्छिक - Optional)</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={12}
                    value={formData.aadhaarNo}
                    onChange={e => setFormData({ ...formData, aadhaarNo: e.target.value.replace(/\D/g, '') })}
                    placeholder="12 अंकों का आधार नंबर"
                    className="flex-1 px-3 py-2 bg-coffee-950 border border-gold-500/30 rounded-xl text-gold-100 text-sm"
                  />
                  <input
                    ref={aadhaarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => handleFileUpload(e, 'aadhaar')}
                  />
                  <button
                    type="button"
                    onClick={() => aadhaarInputRef.current?.click()}
                    disabled={isCompressingAadhaar}
                    className="px-3 py-2 bg-coffee-800 text-gold-200 rounded-xl text-xs font-bold"
                  >
                    {aadhaarPreview ? 'अपलोड हुआ' : 'फोटो संलग्न'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-md font-bold text-gold-300 font-serif border-b border-gold-500/20 pb-2">
              विवरण की पुष्टि करें (Review Details)
            </h3>

            <div className="bg-coffee-950 p-4 rounded-xl border border-gold-500/30 space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-gold-400/80 block">नाम:</span><strong className="text-gold-100">{formData.fullName}</strong></div>
                <div><span className="text-gold-400/80 block">पिता/पति:</span><strong className="text-gold-100">{formData.fatherHusbandName}</strong></div>
                <div><span className="text-gold-400/80 block">मोबाइल:</span><strong className="text-gold-100">{formData.mobile}</strong></div>
                <div><span className="text-gold-400/80 block">जन्म तिथि:</span><strong className="text-gold-100">{formData.dob}</strong></div>
                <div className="col-span-2"><span className="text-gold-400/80 block">पता:</span><strong className="text-gold-100">{formData.address}, {formData.district}, {formData.state} - {formData.pincode}</strong></div>
              </div>
              <div className="flex items-center gap-4 pt-2 border-t border-gold-500/20">
                <img src={photoPreview} alt="Photo" className="w-16 h-16 object-cover rounded border border-gold-500/30" />
                <img src={signaturePreview} alt="Signature" className="w-24 h-10 object-contain bg-white rounded border border-gold-500/30" />
              </div>
            </div>
          </motion.div>
        )}

        {step === 5 && generatedMember && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div className="bg-green-500/10 border border-green-500/50 p-4 rounded-xl text-center space-y-2">
              <CheckCircle2 size={40} className="text-green-400 mx-auto" />
              <h3 className="text-green-300 font-bold text-xl">आवेदन सफलतापूर्वक जमा हो गया!</h3>
              <p className="text-green-100/70 text-sm">Your application has been submitted and is pending verification.</p>
            </div>
            
            {/* Show Acknowledgement Receipt */}
            <div className="mt-4 bg-white rounded-xl overflow-hidden p-2">
               <AcknowledgementReceipt member={generatedMember} />
            </div>

            <button onClick={onClose} className="w-full mt-4 py-3 bg-coffee-800 hover:bg-coffee-700 text-gold-200 font-bold rounded-xl transition">
              Close & Return to Home
            </button>
          </motion.div>
        )}

        {/* Navigation Buttons for Registration */}
        {step < 5 && (
          <div className="flex justify-between items-center pt-4 border-t border-gold-500/20">
            {step > 1 ? (
              <button onClick={prevStep} className="flex items-center gap-1.5 px-4 py-2 bg-coffee-800 hover:bg-coffee-700 text-gold-200 rounded-xl text-xs font-bold transition">
                <ArrowLeft size={16} /> पीछे (Back)
              </button>
            ) : <div />}

            {step < 4 ? (
              <button onClick={nextStep} className="flex items-center gap-1.5 px-5 py-2.5 bg-saffron-600 hover:bg-saffron-500 text-white rounded-xl text-xs font-extrabold transition shadow-md">
                आगे बढ़ें (Next) <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-extrabold transition shadow-md disabled:opacity-50">
                {isSubmitting ? 'जमा हो रहा है...' : 'आवेदन जमा करें (Submit Application)'}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSearchTab = () => {
    return (
      <div className="space-y-6">
        {!foundMember ? (
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <p className="text-sm text-gold-200/80 mb-4">
              अपनी आवेदन स्थिति, डिजिटल प्रमाणपत्र, या ID कार्ड प्राप्त करने के लिए आवेदन संख्या दर्ज करें।
            </p>
            
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3.5 text-gold-500/60" />
              <input
                type="text"
                placeholder="उदा. APP-2026-000003"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-coffee-950 border border-gold-500/40 rounded-xl text-gold-100 placeholder-gold-300/40 focus:outline-none focus:border-gold-400"
              />
            </div>

            {searchError && (
              <div className="text-red-400 text-xs bg-red-900/30 p-2.5 rounded-xl border border-red-500/30 flex items-center gap-1.5">
                <AlertCircle size={16} className="shrink-0" /> {searchError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-saffron-600 hover:bg-saffron-500 text-white font-extrabold rounded-xl transition shadow-lg cursor-pointer"
            >
              ट्रैक करें (Track Application)
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gold-500/30 pb-3">
              <div>
                <h4 className="font-serif text-lg font-bold text-gold-200">
                  Application Record: {foundMember.fullName}
                </h4>
                <p className="text-xs text-gold-400 font-mono">
                  App No: {foundMember.applicationNo} | Date: {foundMember.registrationDate}
                </p>
              </div>
              <button 
                onClick={() => { setFoundMember(null); setSearchQuery(''); setSearchError(''); }} 
                className="text-xs text-saffron-400 hover:text-saffron-300 font-bold px-3 py-1.5 bg-coffee-800 hover:bg-coffee-700 rounded-xl border border-gold-500/30 transition"
              >
                New Search
              </button>
            </div>

            <div className="space-y-6">
              {/* Status Banner */}
              <div className={`p-4 rounded-xl border ${foundMember.status === 'Approved' ? 'bg-green-900/20 border-green-500/50' : foundMember.status === 'Rejected' ? 'bg-red-900/20 border-red-500/50' : 'bg-amber-900/20 border-amber-500/50'}`}>
                <div className="flex items-center gap-3">
                  {foundMember.status === 'Approved' ? <CheckCircle2 className="text-green-400 shrink-0" size={26} /> : 
                   foundMember.status === 'Rejected' ? <AlertCircle className="text-red-400 shrink-0" size={26} /> : 
                   <RefreshCw className="text-amber-400 animate-spin shrink-0" size={26} />}
                  <div>
                    <p className="text-xs text-gold-200/70 font-bold uppercase tracking-wider">Current Application Status</p>
                    <p className={`font-bold text-lg ${foundMember.status === 'Approved' ? 'text-green-400' : foundMember.status === 'Rejected' ? 'text-red-400' : 'text-amber-400'}`}>
                      {foundMember.status === 'Pending' ? 'Submitted / Pending Verification' : foundMember.status}
                    </p>
                  </div>
                </div>

                {foundMember.status === 'Pending' && (
                  <p className="mt-2.5 text-xs text-amber-200/90 bg-amber-950/60 p-2.5 rounded-lg border border-amber-500/30">
                    Your application is currently under verification.
                  </p>
                )}

                {foundMember.status === 'Approved' && (
                  <p className="mt-2.5 text-xs text-green-200/90 bg-green-950/60 p-2.5 rounded-lg border border-green-500/30 font-semibold">
                    Your membership has been approved! Membership ID: <strong className="font-mono text-green-300 text-sm">{foundMember.membershipNo}</strong>
                  </p>
                )}

                {foundMember.status === 'Rejected' && (
                  <p className="mt-2.5 text-xs text-red-200/90 bg-red-950/60 p-2.5 rounded-lg border border-red-500/30">
                    Application Rejected. Reason: <strong>{foundMember.rejectionReason || 'Documents or details required further verification.'}</strong>
                  </p>
                )}
              </div>

              {/* Status Documents Display */}
              <div className="grid grid-cols-1 gap-6">
                {foundMember.status === 'Pending' && (
                  <div>
                    <p className="text-sm font-bold text-gold-200 mb-2">Application Acknowledgement Receipt</p>
                    <AcknowledgementReceipt member={foundMember} />
                  </div>
                )}

                {foundMember.status === 'Approved' && (
                  <>
                    <div className="overflow-x-auto">
                      <p className="text-sm font-bold text-gold-200 mb-2">Official Digital ID Card</p>
                      <DigitalIdCard member={foundMember} onDownload={() => {}} compact={false} />
                    </div>
                    
                    <div className="bg-white p-3 rounded-2xl overflow-x-auto shadow-xl">
                      <p className="text-sm text-gray-900 font-bold mb-2 px-2 pt-1">Official Membership Certificate</p>
                      <MembershipCertificate member={foundMember} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-coffee-950 border border-gold-500/40 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-coffee-900 via-coffee-800 to-coffee-900 p-4 sm:p-5 border-b border-gold-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-saffron-500/20 border border-saffron-500/40 flex items-center justify-center">
              <Sparkles className="text-saffron-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-gold-100">
                सदस्यता पोर्टल (Membership Portal)
              </h2>
              <p className="text-xs text-gold-400">सद्गुरु महावतार बाबाजी सरल ध्यान योग पीठ</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-coffee-800 hover:bg-coffee-700 text-gold-300 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Tabs Switcher */}
        <div className="flex border-b border-gold-500/20 bg-coffee-900/50">
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'register' ? 'border-saffron-500 text-saffron-400 bg-coffee-900' : 'border-transparent text-gold-300/60 hover:text-gold-200'
            }`}
          >
            <User size={16} /> नया आवेदन (New Application)
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'search' ? 'border-saffron-500 text-saffron-400 bg-coffee-900' : 'border-transparent text-gold-300/60 hover:text-gold-200'
            }`}
          >
            <Search size={16} /> आवेदन ट्रैक करें (Track Application)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
          {errorMessage && (
            <div className="mb-4 text-xs bg-red-900/40 border border-red-500/40 text-red-200 p-3 rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" /> {errorMessage}
            </div>
          )}

          {activeTab === 'register' ? renderRegisterSteps() : renderSearchTab()}
        </div>

      </div>
    </div>
  );
};
