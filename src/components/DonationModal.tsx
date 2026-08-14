import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  QrCode,
  Smartphone,
  ExternalLink,
  CreditCard,
  Building2,
  Wallet,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Lock,
  Copy,
  Check,
  AlertCircle,
  Phone,
  Mail,
  User,
  MapPin,
  Calendar,
  Clock,
  Search,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { INDIA_STATES_AND_DISTRICTS, getDistrictsForState } from '../data/indiaLocations';
import {
  DonationFormData,
  DonationPurpose,
  DONATION_PURPOSES,
  PaymentMethod,
  DonationRecord
} from '../types/donation';
import { useDonationContext } from '../context/DonationContext';
import { DonationReceipt } from './DonationReceipt';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPurpose?: DonationPurpose;
}

export default function DonationModal({ isOpen, onClose, defaultPurpose }: DonationModalProps) {
  const { addDonation, checkDuplicateUtr, donations } = useDonationContext();

  const [step, setStep] = useState<'FORM' | 'CHECKOUT' | 'VERIFYING' | 'PENDING_SUBMITTED' | 'TRACK_STATUS'>('FORM');

  // Form State
  const [formData, setFormData] = useState<DonationFormData>({
    fullName: '',
    mobile: '',
    email: '',
    gender: 'पुरुष (Male)',
    dob: '',
    maritalStatus: 'विवाहित (Married)',
    address: '',
    state: INDIA_STATES_AND_DISTRICTS[0].state,
    district: INDIA_STATES_AND_DISTRICTS[0].districts[0],
    pincode: '',
    panNumber: '',
    amount: 2100,
    purpose: defaultPurpose || 'Ashram Construction (आश्रम निर्माण)',
    paymentMethod: 'UPI',
    utrNumber: '',
    screenshotUrl: ''
  });

  const [customAmount, setCustomAmount] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [upiNotice, setUpiNotice] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedRecord, setSubmittedRecord] = useState<DonationRecord | null>(null);

  // Status Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<DonationRecord | null | 'NOT_FOUND'>(null);

  // Custom District Handling
  const [isCustomDistrict, setIsCustomDistrict] = useState(false);
  const [customDistrictText, setCustomDistrictText] = useState('');

  // Selected State Districts
  const currentDistricts = getDistrictsForState(formData.state);

  useEffect(() => {
    if (defaultPurpose) {
      setFormData((prev) => ({ ...prev, purpose: defaultPurpose }));
    }
  }, [defaultPurpose]);

  if (!isOpen) return null;

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    const districtsList = getDistrictsForState(newState);
    const defaultDistrict = districtsList[0] || '';
    setIsCustomDistrict(false);
    setCustomDistrictText('');
    setFormData((prev) => ({
      ...prev,
      state: newState,
      district: defaultDistrict
    }));
  };

  const handleDistrictSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === 'OTHER_CUSTOM' || selected.includes('अन्य जिला')) {
      setIsCustomDistrict(true);
      setFormData((prev) => ({ ...prev, district: customDistrictText || 'अन्य जिला' }));
    } else {
      setIsCustomDistrict(false);
      setFormData((prev) => ({ ...prev, district: selected }));
    }
  };

  const handleAmountSelect = (amt: number) => {
    setFormData((prev) => ({ ...prev, amount: amt }));
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setFormData((prev) => ({ ...prev, amount: parsed }));
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim()) {
      setErrorMessage('कृपया अपना पूरा नाम लिखें।');
      return;
    }
    if (!formData.mobile.trim() || formData.mobile.length < 10) {
      setErrorMessage('कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }
    if (!formData.amount || formData.amount < 1) {
      setErrorMessage('कृपया न्यूनतम दान राशि ₹1 दर्ज करें।');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('कृपया अपना पूरा पता दर्ज करें।');
      return;
    }

    setStep('CHECKOUT');
  };

  const handleExecutePayment = async () => {
    setErrorMessage('');
    const cleanUtr = (formData.utrNumber || '').trim();

    if (!cleanUtr || cleanUtr.length < 6) {
      setErrorMessage('कृपया सही 12 अंकों का UTR / ट्रांजैक्शन नंबर दर्ज करें (न्यूनतम 6 अंक)।');
      return;
    }
    if (!formData.screenshotUrl) {
      setErrorMessage('कृपया भुगतान का स्क्रीनशॉट अपलोड करें (Please upload the payment screenshot).');
      return;
    }

    // Check duplicate UTR
    if (checkDuplicateUtr(cleanUtr)) {
      setErrorMessage('This UTR has already been submitted.');
      return;
    }

    setStep('VERIFYING');
    setIsProcessing(true);

    setTimeout(async () => {
      try {
        const txnId = cleanUtr;
        const payId = `PAY${Math.floor(100000000 + Math.random() * 900000000)}`;

        const newRecord = await addDonation({
          ...formData,
          upiId: '8308444455@kotak'
        }, {
          transactionId: txnId,
          paymentId: payId,
          gatewayName: `Peeth Secure ${formData.paymentMethod === 'BANK_TRANSFER' ? 'Bank Transfer' : 'UPI Manual'}`,
          paymentStatus: 'PENDING',
          utrNumber: cleanUtr,
          screenshotUrl: formData.screenshotUrl
        });

        setSubmittedRecord(newRecord);
        setIsProcessing(false);
        setStep('PENDING_SUBMITTED');
      } catch (err: any) {
        setIsProcessing(false);
        setStep('CHECKOUT');
        setErrorMessage(err.message || 'विवरण सबमिट करने में समस्या आई। कृपया पुनः प्रयास करें।');
      }
    }, 1500);
  };

  const handleSearchStatus = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const match = donations.find((d) => {
      const matchUtr = d.utrNumber && d.utrNumber.toLowerCase().includes(q);
      const matchReceipt = d.receiptNo && d.receiptNo.toLowerCase().includes(q);
      const matchMobile = d.mobile && d.mobile.includes(q);
      return matchUtr || matchReceipt || matchMobile;
    });

    if (match) {
      setSearchResult(match);
    } else {
      setSearchResult('NOT_FOUND');
    }
  };

  const resetAndClose = () => {
    setStep('FORM');
    setSubmittedRecord(null);
    setSearchResult(null);
    setSearchQuery('');
    setFormData({
      fullName: '',
      mobile: '',
      email: '',
      gender: 'पुरुष (Male)',
      dob: '',
      maritalStatus: 'विवाहित (Married)',
      address: '',
      state: INDIA_STATES_AND_DISTRICTS[0].state,
      district: INDIA_STATES_AND_DISTRICTS[0].districts[0],
      pincode: '',
      panNumber: '',
      amount: 2100,
      purpose: defaultPurpose || 'Ashram Construction (आश्रम निर्माण)',
      paymentMethod: 'UPI',
      utrNumber: '',
      screenshotUrl: ''
    });
    onClose();
  };

  const upiId = '9422163066@paytm';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-coffee-900 via-coffee-950 to-divine-navy rounded-3xl border-2 border-gold-500/50 shadow-[0_0_60px_rgba(212,175,55,0.4)] p-4 sm:p-7 max-h-[92vh] overflow-y-auto my-auto">
        {/* Close button */}
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-coffee-800/80 text-gold-300 hover:text-white hover:bg-gold-500/20 transition-all cursor-pointer z-20"
        >
          <X size={20} />
        </button>

        {/* STEP 1: DONATION FORM */}
        {step === 'FORM' && (
          <form onSubmit={handleProceedToPayment} className="space-y-5">
            {/* Header */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-saffron-500/20 border border-saffron-400 flex items-center justify-center mx-auto mb-2 shadow-lg">
                <Heart size={28} className="text-saffron-400 fill-saffron-400" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold gold-gradient-text">
                पावन दान एवं सेवा सहयोग (Online Donation)
              </h3>
              <p className="text-xs sm:text-sm text-gold-200/80 mt-1 max-w-xl mx-auto">
                श्री महावतार बाबाजी चैरिटेबल ट्रस्ट | ऑनलाइन दान करें एवं त्वरित डिजिटल रसीद (Auto Receipt) प्राप्त करें।
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-950/80 border border-red-500/50 text-red-200 p-3 rounded-xl text-xs sm:text-sm flex items-center gap-2">
                <AlertCircle size={18} className="text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Donation Purpose & Amount Selection */}
            <div className="bg-coffee-950/80 p-4 sm:p-5 rounded-2xl border border-gold-500/30 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-saffron-400 border-b border-gold-500/20 pb-2">
                <Sparkles size={18} />
                <span>1. दान का उद्देश्य एवं राशि का चयन (Purpose & Amount)</span>
              </div>

              {/* Purpose Dropdown */}
              <div>
                <label className="block text-xs text-gold-200/90 font-bold mb-1.5">
                  दान का पावन उद्देश्य (Donation Purpose) <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value as DonationPurpose })}
                  className="w-full px-3.5 py-2.5 bg-coffee-900 border border-gold-500/40 rounded-xl text-xs sm:text-sm text-gold-100 font-serif focus:outline-none focus:border-gold-400"
                >
                  {DONATION_PURPOSES.map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.icon} {item.labelHi} ({item.labelEn})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount Presets */}
              <div>
                <label className="block text-xs text-gold-200/90 font-bold mb-1.5">
                  दान राशि चुनें (Select Amount in ₹) <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                  {[210, 501, 1100, 2100, 5100, 11000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleAmountSelect(amt)}
                      className={`py-2 px-1 text-center rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer border ${
                        formData.amount === amt && !customAmount
                          ? 'bg-gradient-to-r from-saffron-500 to-gold-500 text-coffee-50 border-gold-300 shadow-md font-extrabold'
                          : 'bg-coffee-900 text-gold-200 border-gold-500/30 hover:border-gold-400'
                      }`}
                    >
                      ₹ {amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gold-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    placeholder="अन्य स्वेच्छा दान राशि लिखें (Enter Custom Amount)..."
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    min="1"
                    className="w-full pl-8 pr-3.5 py-2 bg-coffee-900 border border-gold-500/40 rounded-xl text-xs sm:text-sm text-gold-100 placeholder-gold-300/40 focus:outline-none focus:border-gold-400 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Donor Personal Information */}
            <div className="bg-coffee-950/80 p-4 sm:p-5 rounded-2xl border border-gold-500/30 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-saffron-400 border-b border-gold-500/20 pb-2">
                <User size={18} />
                <span>2. दानदाता का व्यक्तिगत विवरण (Donor Details)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                {/* Full Name */}
                <div>
                  <label className="block text-gold-200/90 font-bold mb-1">
                    पूरा नाम (Full Name) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="जैसे: रमेश शर्मा"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-coffee-900 border border-gold-500/40 rounded-xl text-gold-100 placeholder-gold-300/40 focus:outline-none focus:border-gold-400"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-gold-200/90 font-bold mb-1">
                    मोबाइल नंबर (Mobile Number) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10 अंकों का मोबाइल नंबर"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3.5 py-2.5 bg-coffee-900 border border-gold-500/40 rounded-xl text-gold-100 placeholder-gold-300/40 focus:outline-none focus:border-gold-400 font-mono"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gold-200/90 font-bold mb-1">
                    ईमेल पता (Email Address)
                  </label>
                  <input
                    type="email"
                    placeholder="रसीद प्राप्त करने हेतु ईमेल"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-coffee-900 border border-gold-500/40 rounded-xl text-gold-100 placeholder-gold-300/40 focus:outline-none focus:border-gold-400"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-gold-200/90 font-bold mb-1">लिंग (Gender)</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-coffee-900 border border-gold-500/40 rounded-xl text-gold-100 focus:outline-none focus:border-gold-400"
                  >
                    <option value="पुरुष (Male)">पुरुष (Male)</option>
                    <option value="महिला (Female)">महिला (Female)</option>
                    <option value="अन्य (Other)">अन्य (Other)</option>
                  </select>
                </div>

                {/* DOB */}
                <div>
                  <label className="block text-gold-200/90 font-bold mb-1">जन्म तिथि (Date of Birth)</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-coffee-900 border border-gold-500/40 rounded-xl text-gold-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-gold-200/90 font-bold mb-1">वैवाहिक स्थिति (Marital Status)</label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-coffee-900 border border-gold-500/40 rounded-xl text-gold-100 focus:outline-none focus:border-gold-400"
                  >
                    <option value="विवाहित (Married)">विवाहित (Married)</option>
                    <option value="अविवाहित (Unmarried)">अविवाहित (Unmarried)</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs text-gold-200/90 font-bold mb-1">
                  पूरा पता (Complete Address) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="मकान नं, गली/मोहल्ला, लैंडमार्क..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-coffee-900 border border-gold-500/40 rounded-xl text-xs sm:text-sm text-gold-100 placeholder-gold-300/40 focus:outline-none focus:border-gold-400"
                />
              </div>

              {/* State & District Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                {/* State */}
                <div>
                  <label className="block text-gold-200/90 font-bold mb-1">
                    राज्य (State) <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.state}
                    onChange={handleStateChange}
                    className="w-full px-3 py-2.5 bg-coffee-900 border border-gold-500/40 rounded-xl text-gold-100 focus:outline-none focus:border-gold-400"
                  >
                    {INDIA_STATES_AND_DISTRICTS.map((st) => (
                      <option key={st.state} value={st.state}>
                        {st.state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-gold-200/90 font-bold mb-1">
                    जिला (District) <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={isCustomDistrict ? 'OTHER_CUSTOM' : formData.district}
                    onChange={handleDistrictSelect}
                    className="w-full px-3 py-2.5 bg-coffee-900 border border-gold-500/40 rounded-xl text-gold-100 focus:outline-none focus:border-gold-400"
                  >
                    {currentDistricts.map((dst) => (
                      <option key={dst} value={dst}>
                        {dst}
                      </option>
                    ))}
                    {!currentDistricts.some((d) => d.includes('अन्य जिला')) && (
                      <option value="OTHER_CUSTOM">अन्य जिला (Custom)</option>
                    )}
                  </select>

                  {isCustomDistrict && (
                    <input
                      type="text"
                      placeholder="जिले का नाम लिखें..."
                      value={customDistrictText}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomDistrictText(val);
                        setFormData((prev) => ({ ...prev, district: val || 'अन्य जिला' }));
                      }}
                      className="w-full mt-2 px-3 py-1.5 bg-coffee-900 border border-saffron-500/60 rounded-xl text-xs text-gold-100 focus:outline-none"
                    />
                  )}
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-gold-200/90 font-bold mb-1">पिनकोड (Pincode)</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="6 अंकों का पिनकोड"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3.5 py-2.5 bg-coffee-900 border border-gold-500/40 rounded-xl text-gold-100 placeholder-gold-300/40 focus:outline-none focus:border-gold-400 font-mono"
                  />
                </div>
              </div>

              {/* PAN Number */}
              <div>
                <label className="block text-xs text-gold-200/90 font-bold mb-1">
                  PAN नंबर (PAN Card - 80G टैक्स छूट हेतु वैकल्पिक)
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="जैसे: ABCDE1234F"
                  value={formData.panNumber}
                  onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2 bg-coffee-900 border border-gold-500/40 rounded-xl text-xs sm:text-sm text-gold-100 placeholder-gold-300/40 focus:outline-none focus:border-gold-400 font-mono uppercase"
                />
              </div>
            </div>

            {/* Submit Button to Gateway */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-saffron-600 via-gold-500 to-saffron-600 hover:from-saffron-500 hover:to-saffron-400 text-coffee-50 font-black text-base sm:text-lg rounded-2xl shadow-2xl transition transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>भुगतान हेतु आगे बढ़ें (Donate ₹{formData.amount.toLocaleString('en-IN')})</span>
              <ArrowRight size={22} />
            </button>
          </form>
        )}

        {/* STEP 2: PAYMENT GATEWAY SELECTION & CHECKOUT */}
        {step === 'CHECKOUT' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gold-500/30 pb-3">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setStep('FORM');
                }}
                className="text-xs text-gold-300 hover:text-white flex items-center gap-1 cursor-pointer bg-coffee-800 px-3 py-1.5 rounded-xl"
              >
                <ArrowLeft size={16} />
                <span>वापस फॉर्म पर जाएं</span>
              </button>

              <div className="text-right">
                <span className="text-[10px] text-gold-300/60 block">दान राशि (Amount)</span>
                <span className="font-serif text-xl font-bold text-saffron-400">
                  ₹ {formData.amount.toLocaleString('en-IN')} /-
                </span>
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-gold-200">
                भुगतान माध्यम चुनें (Choose Payment Option)
              </h3>
              <p className="text-xs text-gold-300/70">
                कृपया नीचे दिए गए दो साधनों में से किसी एक से भुगतान करें और विवरण दर्ज करें।
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-950/80 border border-red-500/50 text-red-200 p-3 rounded-xl text-xs sm:text-sm flex items-center gap-2">
                <AlertCircle size={18} className="text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {[
                { id: 'UPI', label: 'Pay via UPI', icon: Smartphone },
                { id: 'BANK_TRANSFER', label: 'बैंक खाता ट्रांसफर', icon: Building2 }
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = formData.paymentMethod === m.id || (m.id === 'UPI' && (formData.paymentMethod as string) === 'QR_CODE');
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setFormData((prev) => ({ ...prev, paymentMethod: m.id as PaymentMethod }));
                    }}
                    className={`py-4 px-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-gradient-to-b from-saffron-600 to-saffron-500 text-white border-gold-300 shadow-lg font-bold'
                        : 'bg-coffee-950/80 text-gold-200 border-gold-500/30 hover:border-gold-400'
                    }`}
                  >
                    <Icon size={24} className={isSelected ? 'text-white animate-pulse' : 'text-gold-300'} />
                    <span className="text-xs sm:text-sm font-bold">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* PAYMENT METHOD DETAILED CONTENT */}

            {/* METHOD 1: UPI PAYMENT */}
            {(formData.paymentMethod === 'UPI' || (formData.paymentMethod as string) === 'QR_CODE') && (
              <div className="bg-coffee-950/90 p-5 rounded-2xl border border-gold-500/30 space-y-4">
                {/* Header Badge */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-gold-500/20 pb-3">
                  <div className="flex items-center gap-2 text-saffron-400 font-bold text-xs sm:text-sm uppercase tracking-wide">
                    <Smartphone size={18} />
                    <span>UPI PAYMENT</span>
                  </div>
                  <span className="text-[10px] sm:text-xs bg-saffron-500/15 text-saffron-300 border border-saffron-500/30 px-3 py-0.5 rounded-full font-bold">
                    Manual Payment
                  </span>
                </div>

                {/* Receiver UPI ID, QR Code & Copy Card */}
                <div className="bg-gradient-to-r from-coffee-900 via-coffee-800 to-coffee-900 p-5 rounded-xl border border-gold-500/30 text-center space-y-4 shadow-lg flex flex-col items-center">
                  
                  <div className="text-xs text-gold-300 font-sans font-bold uppercase tracking-wider">
                    SCAN TO PAY (UPI QR)
                  </div>
                  
                  {/* QR Code Image */}
                  <div className="w-56 h-56 sm:w-64 sm:h-64 p-3 bg-white rounded-2xl shadow-[0_0_25px_rgba(212,175,55,0.3)] border-2 border-saffron-500 mx-auto overflow-hidden flex flex-col items-center justify-center">
                    <img 
                      src="/assets/qr-code.jpg" 
                      alt="Donation UPI QR Code" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/assets/donation_qr.jpg";
                      }}
                    />
                  </div>

                  <p className="text-xs text-saffron-300 font-medium">
                    Google Pay, PhonePe, Paytm, BHIM या किसी भी UPI ऐप से स्कैन करें
                  </p>

                  <div className="text-xs text-gold-300 font-sans font-bold uppercase tracking-wider pt-2">
                    OR PAY TO UPI ID:
                  </div>
                  
                  <div className="text-xl sm:text-2xl font-mono font-black text-saffron-400 tracking-wider bg-coffee-950 px-4 py-2 rounded-xl border border-gold-500/30 inline-block w-full sm:w-auto break-all">
                    8308444455@kotak
                  </div>

                  <div className="w-full">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('8308444455@kotak');
                        setCopiedUpi(true);
                        setTimeout(() => setCopiedUpi(false), 3000);
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-saffron-500 via-gold-500 to-saffron-500 hover:from-saffron-400 hover:to-gold-400 text-coffee-50 font-black text-sm rounded-xl shadow-xl transition transform active:scale-95 cursor-pointer"
                    >
                      {copiedUpi ? (
                        <>
                          <Check size={18} className="text-coffee-50" />
                          <span>UPI ID copied successfully.</span>
                        </>
                      ) : (
                        <>
                          <Copy size={18} />
                          <span>Copy UPI ID</span>
                        </>
                      )}
                    </button>
                  </div>

                  {copiedUpi && (
                    <div className="text-xs font-bold text-emerald-400 animate-fadeIn w-full">
                      UPI ID copied successfully.
                    </div>
                  )}

                  <div className="text-[11px] text-gold-300/80 pt-1 font-sans w-full border-t border-gold-500/20 mt-3 pt-3">
                    Selected Donation Amount: <strong className="text-saffron-400 font-mono font-bold text-sm">₹{formData.amount.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                {/* Steps Instruction Box */}
                <div className="bg-coffee-900/60 p-4 rounded-xl border border-gold-500/20 text-xs text-gold-200/90 font-sans space-y-2">
                  <div className="font-bold text-saffron-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck size={15} />
                    <span>भुगतान के निर्देश (Payment Instructions):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-gold-200/90 leading-relaxed">
                    <li>Scan the QR code above or Copy the UPI ID (<code className="font-mono text-saffron-400 font-bold">8308444455@kotak</code>).</li>
                    <li>Open your preferred UPI app (PhonePe, Google Pay, Paytm, BHIM, etc.).</li>
                    <li>Pay the selected donation amount.</li>
                    <li>Complete the payment.</li>
                    <li>Return to this website.</li>
                    <li>Submit your UTR / Transaction ID and payment screenshot below.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* METHOD 2: BANK TRANSFER */}
            {formData.paymentMethod === 'BANK_TRANSFER' && (
              <div className="bg-coffee-950/90 p-5 rounded-2xl border border-gold-500/30 space-y-4">
                <div className="text-xs text-saffron-400 font-semibold uppercase flex items-center gap-1.5 border-b border-gold-500/10 pb-2">
                  <Building2 size={16} />
                  <span>Kotak Bank Account Details</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  {/* Account Holder Name */}
                  <div className="bg-coffee-900/80 p-3 rounded-xl border border-gold-500/15 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-gold-300/60 block uppercase">Account Holder Name</span>
                      <span className="font-serif font-bold text-gold-100">SADGURU MAHAAVTAR BABAJI SARAL DHYAN YOG</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('SADGURU MAHAAVTAR BABAJI SARAL DHYAN YOG');
                        alert('Account name copied!');
                      }}
                      className="p-1.5 bg-coffee-800 hover:bg-coffee-700 text-gold-200 rounded-lg cursor-pointer shrink-0 ml-2"
                    >
                      <Copy size={14} />
                    </button>
                  </div>

                  {/* Account Number */}
                  <div className="bg-coffee-900/80 p-3 rounded-xl border border-gold-500/15 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-gold-300/60 block uppercase">Account Number</span>
                      <span className="font-mono font-bold text-saffron-400 text-base">9249316255</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('9249316255');
                        alert('Account number copied!');
                      }}
                      className="p-1.5 bg-coffee-800 hover:bg-coffee-700 text-gold-200 rounded-lg cursor-pointer shrink-0 ml-2"
                    >
                      <Copy size={14} />
                    </button>
                  </div>

                  {/* IFSC Code */}
                  <div className="bg-coffee-900/80 p-3 rounded-xl border border-gold-500/15 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-gold-300/60 block uppercase">IFSC Code</span>
                      <span className="font-mono font-bold text-saffron-400 text-base">KKBK0002062</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('KKBK0002062');
                        alert('IFSC code copied!');
                      }}
                      className="p-1.5 bg-coffee-800 hover:bg-coffee-700 text-gold-200 rounded-lg cursor-pointer shrink-0 ml-2"
                    >
                      <Copy size={14} />
                    </button>
                  </div>

                  {/* Bank Name & Branch */}
                  <div className="bg-coffee-900/80 p-3 rounded-xl border border-gold-500/15 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-gold-300/60 block uppercase">Bank Name</span>
                      <span className="font-bold text-gold-100">Kotak Mahindra Bank Ltd</span>
                    </div>
                    <div className="text-right text-[11px] text-gold-300/80">
                      <span>Mumbai Branch</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gold-200/85 bg-coffee-900/40 p-3 rounded-xl border border-gold-500/10">
                  ऊपर दिए गए बैंक खाते में नेट बैंकिंग, IMPS, NEFT, या RTGS के माध्यम से दान राशि <span className="font-bold text-saffron-400">₹{formData.amount.toLocaleString('en-IN')}</span> ट्रांसफर करें।
                </div>
              </div>
            )}

            {/* REQUIRED PROOF COLLECTION SECTION */}
            <div className="bg-coffee-950/80 p-5 rounded-2xl border-2 border-saffron-500/40 space-y-4">
              <div className="text-xs text-saffron-400 font-black uppercase flex items-center gap-1.5 border-b border-gold-500/20 pb-2">
                <ShieldCheck size={16} className="text-saffron-400" />
                <span>3. भुगतान का विवरण एवं प्रमाण (Payment Proof) *</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. UTR Number Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs text-gold-200 font-bold">
                    UTR / ट्रांजैक्शन नंबर (12-Digit UTR No.) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={22}
                    placeholder="उदा: 9842107404 या UPI Ref ID..."
                    value={formData.utrNumber || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        utrNumber: e.target.value.replace(/[^a-zA-Z0-9]/g, '').trim()
                      }))
                    }
                    className="w-full px-3.5 py-3 bg-coffee-900 border border-gold-500/40 rounded-xl text-xs sm:text-sm text-gold-100 font-mono focus:outline-none focus:border-gold-400"
                  />
                  <span className="text-[10px] text-gold-300/50 block">
                    भुगतान के बाद प्राप्त 12 अंकों का UTR / रिफरेंस नंबर दर्ज करें।
                  </span>
                </div>

                {/* 2. Screenshot Upload */}
                <div className="space-y-1.5">
                  <label className="block text-xs text-gold-200 font-bold">
                    भुगतान का स्क्रीनशॉट (Payment Screenshot) <span className="text-red-400">*</span>
                  </label>

                  <div className="relative">
                    {!formData.screenshotUrl ? (
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gold-500/30 hover:border-gold-400 rounded-xl p-4 bg-coffee-900 cursor-pointer transition">
                        <QrCode size={24} className="text-gold-300 mb-1" />
                        <span className="text-xs text-gold-200 font-semibold">फाइल चुनें (Choose Screenshot)</span>
                        <span className="text-[10px] text-gold-300/50 mt-1">PNG, JPG or JPEG up to 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData((prev) => ({ ...prev, screenshotUrl: reader.result as string }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="relative bg-coffee-900 border border-gold-500/30 rounded-xl p-2.5 flex items-center gap-3">
                        <img
                          src={formData.screenshotUrl}
                          alt="Screenshot Preview"
                          className="w-12 h-12 rounded object-cover border border-gold-500/20 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-green-400 font-bold block">✓ स्क्रीनशॉट अपलोड हुआ</span>
                          <span className="text-[10px] text-gold-300/60 block truncate">Screenshot Selected</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, screenshotUrl: '' }))}
                          className="p-1 text-red-400 hover:text-red-300 bg-coffee-850 hover:bg-red-950/40 rounded-lg cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* CONFIRM PAYMENT TRIGGER BUTTON */}
            <button
              type="button"
              onClick={handleExecutePayment}
              className="w-full py-4 bg-gradient-to-r from-saffron-600 via-gold-500 to-saffron-600 hover:from-saffron-500 hover:to-saffron-400 text-coffee-50 font-black text-base sm:text-lg rounded-2xl shadow-2xl transition transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck size={20} />
              <span>दान विवरण एवं प्रमाण सबमिट करें (Submit Donation for Verification)</span>
            </button>

            <div className="text-center text-[11px] text-gold-300/80 flex items-center justify-center gap-1.5 font-sans">
              <Clock size={15} className="text-saffron-400 shrink-0" />
              <span>संस्थान द्वारा UTR सत्यापन (Manual Verification) के उपरांत आधिकारिक 80G रसीद जनरेट होगी।</span>
            </div>
          </div>
        )}

        {/* STEP 3: SUBMITTING / VERIFYING STATE */}
        {step === 'VERIFYING' && (
          <div className="py-12 text-center space-y-5">
            <div className="w-20 h-20 rounded-full bg-saffron-500/20 border-2 border-saffron-400 flex items-center justify-center mx-auto animate-spin">
              <RefreshCw size={36} className="text-saffron-400" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-gold-200">
              दान विवरण दर्ज किया जा रहा है (Submitting Details...)
            </h3>

            <p className="text-xs sm:text-sm text-gold-300/80 max-w-md mx-auto">
              कृपया प्रतीक्षा करें, आपका UTR एवं दान प्रमाण सहेजा जा रहा है...
            </p>

            <div className="w-48 h-1.5 bg-coffee-950 rounded-full mx-auto overflow-hidden border border-gold-500/30">
              <div className="w-full h-full bg-gradient-to-r from-saffron-500 to-gold-400 animate-pulse" />
            </div>
          </div>
        )}

        {/* STEP 4: PENDING_SUBMITTED ACKNOWLEDGEMENT */}
        {step === 'PENDING_SUBMITTED' && submittedRecord && (
          <div className="space-y-6 animate-fadeIn text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto shadow-xl">
              <Clock size={36} className="text-amber-400 animate-pulse" />
            </div>

            <div className="space-y-1">
              <span className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-full uppercase tracking-wider">
                Status: Pending Verification (सत्यापन लंबित)
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl font-black text-gold-200 pt-2">
                दान प्रविष्टि एवं UTR प्रमाण सबमिट हुआ!
              </h3>

              <p className="text-xs sm:text-sm text-gold-200/90 max-w-lg mx-auto">
                आपका दान विवरण संस्थान के रिकॉर्ड में दर्ज कर लिया गया है।
              </p>
            </div>

            {/* Submitted Summary Details Card */}
            <div className="bg-coffee-950/90 p-5 rounded-2xl border border-gold-500/30 text-left space-y-3 max-w-lg mx-auto text-xs sm:text-sm">
              <div className="flex justify-between border-b border-gold-500/15 pb-2">
                <span className="text-gold-300/70">दानदाता नाम:</span>
                <span className="font-bold text-gold-100">{submittedRecord.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-gold-500/15 pb-2">
                <span className="text-gold-300/70">दान राशि:</span>
                <span className="font-serif font-black text-saffron-400 text-base">
                  ₹ {Number(submittedRecord.amount).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between border-b border-gold-500/15 pb-2">
                <span className="text-gold-300/70">दान का उद्देश्य:</span>
                <span className="font-serif font-semibold text-gold-200">{submittedRecord.purpose}</span>
              </div>
              <div className="flex justify-between border-b border-gold-500/15 pb-2">
                <span className="text-gold-300/70">दर्ज UTR / Ref No:</span>
                <span className="font-mono font-bold text-saffron-400 bg-coffee-900 px-2 py-0.5 rounded border border-gold-500/20">
                  {submittedRecord.utrNumber}
                </span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-gold-300/70">सबमिशन दिनांक:</span>
                <span className="text-gold-300">{submittedRecord.formattedDate}</span>
              </div>
            </div>

            {/* Explanation Note */}
            <div className="bg-coffee-900/80 p-4 rounded-xl border border-gold-500/20 text-xs text-gold-200/90 leading-relaxed max-w-lg mx-auto text-left space-y-2">
              <div className="font-bold text-saffron-400 flex items-center gap-1.5">
                <ShieldCheck size={16} />
                <span>मैन्युअल सत्यापन प्रक्रिया (Manual Verification Notice):</span>
              </div>
              <p>
                संस्थान की प्रशासनिक टीम (Admin Team) द्वारा आपके यूटीआर (UTR) तथा बैंक स्क्रीनशॉट का भौतिक मिलान किया जाएगा। सत्यापन स्वीकृत (Approved) होते ही आपकी आधिकारिक 80G दान रसीद तुरंत जनरेट होगी।
              </p>
              <p className="text-[11px] text-gold-300/70 pt-1">
                आप किसी भी समय अपना UTR नंबर या मोबाइल नंबर दर्ज करके अपनी रसीद एवं स्थिति (Status) चेक कर सकते हैं।
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery(submittedRecord.utrNumber || '');
                  setStep('TRACK_STATUS');
                }}
                className="px-5 py-2.5 bg-saffron-500 hover:bg-saffron-400 text-coffee-50 font-bold rounded-xl text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Search size={16} />
                <span>स्थिति चेक करें (Track Status)</span>
              </button>

              <button
                type="button"
                onClick={resetAndClose}
                className="px-5 py-2.5 bg-coffee-800 hover:bg-coffee-700 text-gold-200 border border-gold-500/40 rounded-xl text-xs sm:text-sm font-bold cursor-pointer"
              >
                विंडो बंद करें (Close Window)
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: TRACK STATUS & DOWNLOAD RECEIPT IF APPROVED */}
        {step === 'TRACK_STATUS' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gold-500/30 pb-3">
              <button
                type="button"
                onClick={() => setStep('FORM')}
                className="text-xs text-gold-300 hover:text-white flex items-center gap-1 cursor-pointer bg-coffee-800 px-3 py-1.5 rounded-xl"
              >
                <ArrowLeft size={16} />
                <span>नया दान करें (New Donation)</span>
              </button>

              <h3 className="font-serif text-lg sm:text-xl font-bold text-gold-200">
                दान स्थिति एवं रसीद खोजें (Track Donation Status)
              </h3>
            </div>

            {/* Search Input Box */}
            <form onSubmit={handleSearchStatus} className="bg-coffee-950 p-4 rounded-2xl border border-gold-500/30 space-y-3">
              <label className="block text-xs font-bold text-gold-200">
                अपना UTR नंबर, मोबाइल नंबर या रसीद संख्या दर्ज करें:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="उदा: 9842107404 या 9823014589..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-coffee-900 border border-gold-500/40 rounded-xl text-xs sm:text-sm text-gold-100 font-mono focus:outline-none focus:border-gold-400"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-saffron-500 hover:bg-saffron-400 text-coffee-50 font-bold rounded-xl text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Search size={16} />
                  <span>खोजें</span>
                </button>
              </div>
            </form>

            {/* Search Result Output */}
            {searchResult === 'NOT_FOUND' && (
              <div className="bg-red-950/60 border border-red-500/40 p-4 rounded-2xl text-center space-y-1 text-xs sm:text-sm text-red-200">
                <AlertTriangle size={24} className="mx-auto text-red-400 mb-1" />
                <p className="font-bold">कोई प्रविष्टि नहीं मिली (No Record Found)</p>
                <p className="text-gold-300/70 text-xs">
                  कृपया अपना सही UTR नंबर या मोबाइल नंबर जांचकर पुनः प्रयास करें।
                </p>
              </div>
            )}

            {searchResult && searchResult !== 'NOT_FOUND' && (
              <div className="space-y-4">
                {/* Pending Status Badge */}
                {searchResult.paymentStatus === 'PENDING' && (
                  <div className="bg-amber-950/80 border-2 border-amber-500/60 p-5 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center mx-auto">
                      <Clock size={24} className="text-amber-400 animate-pulse" />
                    </div>
                    <div className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-full">
                      स्थिति: सत्यापन लंबित (Pending Verification)
                    </div>
                    <h4 className="font-serif font-bold text-lg text-gold-100">
                      दानदाता: {searchResult.fullName} (₹{Number(searchResult.amount).toLocaleString('en-IN')})
                    </h4>
                    <p className="text-xs text-gold-200/80 max-w-md mx-auto">
                      आपका UTR (<strong>{searchResult.utrNumber}</strong>) प्राप्त हो गया है। संस्थान व्यवस्थापक द्वारा बैंक खाते से सत्यापन के उपरांत रसीद स्वीकृत (Approved) होगी।
                    </p>
                  </div>
                )}

                {/* Rejected Status Badge */}
                {searchResult.paymentStatus === 'FAILED' && (
                  <div className="bg-red-950/80 border-2 border-red-500/60 p-5 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-400 flex items-center justify-center mx-auto">
                      <AlertCircle size={24} className="text-red-400" />
                    </div>
                    <div className="inline-block px-3 py-1 bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-xs rounded-full">
                      स्थिति: अस्वीकृत (Verification Rejected)
                    </div>
                    <h4 className="font-serif font-bold text-lg text-gold-100">
                      दानदाता: {searchResult.fullName} (₹{Number(searchResult.amount).toLocaleString('en-IN')})
                    </h4>
                    <p className="text-xs text-red-200 font-semibold bg-red-900/40 p-2.5 rounded-xl max-w-md mx-auto border border-red-500/30">
                      कारण: {searchResult.rejectionReason || 'UTR / बैंक खाते में ट्रांजैक्शन रिकॉर्ड उपलब्ध नहीं है।'}
                    </p>
                  </div>
                )}

                {/* Approved Status & Downloadable Official Receipt */}
                {searchResult.paymentStatus === 'SUCCESS' && (
                  <div className="space-y-4">
                    <div className="bg-emerald-950/80 border border-emerald-500/60 p-4 rounded-2xl text-center space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold text-xs rounded-full border border-emerald-500/40">
                        <CheckCircle2 size={14} />
                        <span>सत्यापन स्वीकृत (Payment Approved & Verified)</span>
                      </div>
                      <h4 className="font-serif font-bold text-lg text-emerald-400">
                        आपकी आधिकारिक 80G रसीद तैयार है!
                      </h4>
                    </div>

                    <DonationReceipt receipt={searchResult} />
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-6 py-2.5 bg-coffee-800 hover:bg-coffee-700 text-gold-200 border border-gold-500/40 rounded-xl text-xs sm:text-sm font-bold cursor-pointer"
              >
                विंडो बंद करें (Close Window)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
