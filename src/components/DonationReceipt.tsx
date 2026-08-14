import React, { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Download,
  Printer,
  Mail,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  Calendar,
  User,
  Phone,
  MapPin,
  Heart,
  Share2,
  FileText,
  Sparkles,
  Award,
  CreditCard,
  XCircle
} from 'lucide-react';
import { DonationRecord } from '../types/donation';
import { downloadElementAsPNG, downloadElementAsPDF } from '../utils/exportHelper';

interface DonationReceiptProps {
  receipt: DonationRecord;
  onClose?: () => void;
  showActions?: boolean;
}

export const DonationReceipt: React.FC<DonationReceiptProps> = ({
  receipt,
  onClose,
  showActions = true
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDownloadingPng, setIsDownloadingPng] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatusMessage, setEmailStatusMessage] = useState<string | null>(null);
  const [downloadSuccessModal, setDownloadSuccessModal] = useState<{
    type: 'PDF' | 'PNG';
    filename: string;
    url: string;
  } | null>(null);

  // Download Receipt as PDF (High Quality A4 300-DPI equivalent)
  const handleDownloadPdf = async () => {
    if (!receiptRef.current) return;
    setIsDownloadingPdf(true);
    try {
      const filename = `Babaji_Peeth_Donation_Receipt_${receipt.receiptNo}.pdf`;
      const res = await downloadElementAsPDF(receiptRef.current, filename, {
        orientation: 'p',
        format: 'a4',
        backgroundColor: '#fffdf9',
        scale: 3
      });
      setDownloadSuccessModal({
        type: 'PDF',
        filename,
        url: res.blobUrl || res.dataUrl
      });
    } catch (err) {
      console.error('Download PDF receipt failed:', err);
      alert('PDF रसीद डाउनलोड करने में समस्या आई। कृपया "प्रिंट / PDF सेव करें" बटन का उपयोग करें।');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Download Receipt as PNG (Ultra-Sharp 3x Scale)
  const handleDownloadPng = async () => {
    if (!receiptRef.current) return;
    setIsDownloadingPng(true);
    try {
      const filename = `Babaji_Peeth_Donation_Receipt_${receipt.receiptNo}.png`;
      const res = await downloadElementAsPNG(
        receiptRef.current,
        filename,
        '#fffdf9',
        3
      );
      setDownloadSuccessModal({
        type: 'PNG',
        filename,
        url: res.blobUrl || res.dataUrl
      });
    } catch (err) {
      console.error('Download PNG receipt failed:', err);
      alert('PNG रसीद डाउनलोड करने में समस्या आई। कृपया "प्रिंट / PDF सेव करें" बटन का उपयोग करें।');
    } finally {
      setIsDownloadingPng(false);
    }
  };

  // Print Receipt
  const handlePrint = () => {
    if (!receiptRef.current) {
      window.print();
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    const contentHtml = receiptRef.current.outerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Donation Receipt - ${receipt.receiptNo}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;500;600;700;800&family=Tiro+Devanagari+Hindi:ital@0;1&family=Cinzel:wght@600;700;800;900&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Mukta', 'Tiro Devanagari Hindi', sans-serif;
              background-color: #fff;
              margin: 0;
              padding: 10px;
              color: #2b1408;
            }
            .font-serif {
              font-family: 'Tiro Devanagari Hindi', 'Cinzel', serif;
            }
            @media print {
              body {
                background: white !important;
                padding: 0 !important;
                margin: 0 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .no-print { display: none !important; }
              #printable-donation-receipt {
                box-shadow: none !important;
                border-width: 2px !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 auto !important;
              }
            }
          </style>
        </head>
        <body class="bg-gray-100 p-4 flex justify-center">
          <div class="w-full max-w-3xl">${contentHtml}</div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 800);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Simulate Emailing Receipt
  const handleSendEmail = () => {
    if (!receipt.email) {
      alert('दानदाता का ईमेल पता उपलब्ध नहीं है!');
      return;
    }
    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      setEmailStatusMessage(`आधिकारिक रसीद (${receipt.receiptNo}) सफलतापूर्व ${receipt.email} पर भेज दी गई है!`);
      setTimeout(() => setEmailStatusMessage(null), 5000);
    }, 1200);
  };

  const isApproved = receipt.paymentStatus === 'SUCCESS';
  const isPending = receipt.paymentStatus === 'PENDING';

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto space-y-4">
      {/* Top Bar Status Notification Message */}
      {emailStatusMessage && (
        <div className="w-full bg-emerald-100 border-2 border-emerald-500 text-emerald-950 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 animate-fadeIn shadow-md">
          <CheckCircle2 size={20} className="text-emerald-700 shrink-0" />
          <span>{emailStatusMessage}</span>
        </div>
      )}

      {/* ACTION BUTTONS: Download PDF, Download PNG, Print, Email */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full print:hidden bg-[#f7ede0] p-3.5 rounded-2xl border-2 border-[#d4af37]/60 shadow-sm">
          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="px-4 py-2.5 bg-gradient-to-r from-saffron-600 to-saffron-500 hover:from-saffron-500 hover:to-saffron-400 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition transform active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Download size={16} />
            <span>{isDownloadingPdf ? 'PDF बन रही है...' : 'PDF रसीद डाउनलोड'}</span>
          </button>

          {/* Download PNG Button */}
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isDownloadingPng}
            className="px-4 py-2.5 bg-[#4a260b] hover:bg-[#381a04] text-[#faebd2] border border-[#d4af37]/50 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition transform active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Download size={16} />
            <span>{isDownloadingPng ? 'PNG बन रही है...' : 'PNG रसीद डाउनलोड'}</span>
          </button>

          {/* Print / Save PDF Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-white hover:bg-[#fbf4eb] text-[#3d1d0a] border-2 border-[#c59b27] rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition transform active:scale-95 cursor-pointer"
          >
            <Printer size={16} className="text-[#b45309]" />
            <span>प्रिंट करें (Print Receipt)</span>
          </button>

          {/* Email Receipt Button */}
          {receipt.email && (
            <button
              type="button"
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className="px-4 py-2.5 bg-[#fdf5eb] hover:bg-[#faebd2] text-[#693b16] border border-[#c48b5c] rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Mail size={16} className="text-saffron-600" />
              <span>{isSendingEmail ? 'भेजा जा रहा है...' : 'ईमेल पर भेजें'}</span>
            </button>
          )}
        </div>
      )}

      {/* DOWNLOAD SUCCESS MODAL */}
      {downloadSuccessModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn print:hidden">
          <div className="bg-[#fffdf9] border-2 border-[#d4af37] p-6 sm:p-7 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-4 relative text-[#2b1408]">
            <button
              onClick={() => setDownloadSuccessModal(null)}
              className="absolute top-3 right-3 text-[#7a5432] hover:text-[#2b1408] p-1 cursor-pointer"
            >
              <XCircle size={22} />
            </button>
            <div className="mx-auto w-14 h-14 bg-emerald-100 border-2 border-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} className="text-emerald-700" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#3b1e0d]">
              {downloadSuccessModal.type} रसीद तैयार है!
            </h3>
            <p className="text-xs text-[#5c3316]">
              यदि फाइल अपने आप डाउनलोड नहीं हुई है, तो कृपया नीचे दिए गए बटन पर क्लिक करें:
            </p>
            <p className="text-[11px] text-[#7a5432] font-mono bg-[#f6ede2] p-2 rounded-lg border border-[#e0c270] truncate">
              {downloadSuccessModal.filename}
            </p>
            <div>
              <a
                href={downloadSuccessModal.url}
                download={downloadSuccessModal.filename}
                onClick={() => setTimeout(() => setDownloadSuccessModal(null), 1000)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-saffron-600 to-gold-500 hover:from-saffron-500 hover:to-gold-400 text-white font-bold text-sm rounded-xl shadow-lg transition cursor-pointer"
              >
                <Download size={18} />
                <span>डाउनलोड सुरक्षित करें (Save {downloadSuccessModal.type})</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PRINTABLE OFFICIAL RECEIPT - LIGHT-BROWN / IVORY PREMIUM */}
      {/* ======================================================== */}
      <div
        ref={receiptRef}
        id="printable-donation-receipt"
        className="w-full bg-[#fffdf9] text-[#2b1408] p-6 sm:p-8 md:p-9 rounded-3xl border-[3px] border-[#c59b27] shadow-[0_10px_35px_rgba(100,50,15,0.08)] relative overflow-hidden font-serif select-text"
        style={{
          boxSizing: 'border-box',
          backgroundColor: '#fffdf9',
          color: '#2b1408'
        }}
      >
        {/* Inner Gold Inset Frame */}
        <div className="absolute inset-2 border border-[#d4af37]/40 rounded-[22px] pointer-events-none" />

        {/* Ornate Gold Corner Borders */}
        <div className="absolute top-3.5 left-3.5 w-7 h-7 border-t-[3px] border-l-[3px] border-[#c59b27] rounded-tl-md pointer-events-none" />
        <div className="absolute top-3.5 right-3.5 w-7 h-7 border-t-[3px] border-r-[3px] border-[#c59b27] rounded-tr-md pointer-events-none" />
        <div className="absolute bottom-3.5 left-3.5 w-7 h-7 border-b-[3px] border-l-[3px] border-[#c59b27] rounded-bl-md pointer-events-none" />
        <div className="absolute bottom-3.5 right-3.5 w-7 h-7 border-b-[3px] border-r-[3px] border-[#c59b27] rounded-br-md pointer-events-none" />

        {/* Watermark Sacred Symbol (Ultra Light Warm Gold) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
          <div className="w-80 h-80 rounded-full border-[14px] border-[#b45309] flex items-center justify-center">
            <span className="font-serif text-9xl font-bold text-[#b45309]">ॐ</span>
          </div>
        </div>

        {/* PENDING VERIFICATION NOTICE (If not yet approved by Admin) */}
        {isPending && (
          <div className="mb-5 bg-amber-50 border-2 border-amber-500 text-amber-950 p-3 rounded-2xl text-center text-xs font-sans font-bold flex items-center justify-center gap-2 shadow-sm">
            <Clock size={16} className="text-amber-700 shrink-0" />
            <span>प्रोविज़नल पावती रसीद — बैंक खाता सत्यापन लंबित (Provisional Receipt - Pending Verification)</span>
          </div>
        )}

        {/* 1. RECEIPT HEADER */}
        <div className="text-center border-b-2 border-[#d4af37]/60 pb-5 mb-5 relative">
          <div className="flex items-center justify-between gap-3 sm:gap-4 mb-2.5">
            {/* Peeth Logo / Sacred Crest */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#d4af37] via-[#f39c12] to-[#b45309] p-0.5 shadow-md shrink-0 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#fffdf9] flex items-center justify-center border border-[#d4af37]">
                <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#b45309]">ॐ</span>
              </div>
            </div>

            {/* Title & Trust Info */}
            <div className="flex-1 text-center">
              <span className="text-[10px] sm:text-xs tracking-widest text-[#c2410c] font-black uppercase block mb-0.5">
                ॥ श्री 1008 महावतार बाबाजी विजयतेतराम् ॥
              </span>
              <h1 className="font-serif text-lg sm:text-2xl md:text-3xl font-extrabold text-[#3b1e0d] leading-tight tracking-tight">
                सदगुरू महावतार बाबाजी सरल ध्यान योग पीठ
              </h1>
              <p className="text-xs sm:text-sm font-bold text-[#5c3316] mt-0.5">
                श्री महावतार बाबाजी चैरिटेबल ट्रस्ट (Shri Mahavatar Babaji Charitable Trust)
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-2 text-[10px] sm:text-[11px] font-sans font-semibold text-[#6e411b] mt-1">
                <span>Regd. Public Charitable Trust: E-4092/2026</span>
                <span>•</span>
                <span className="text-[#b45309] font-bold">80G Tax Exemption Certified</span>
                <span>•</span>
                <span>NITI Aayog Darpan Registered</span>
              </div>
              <p className="text-[10px] text-[#7a5432] font-sans mt-0.5">
                पंचवटी आश्रम, नासिक, महाराष्ट्र - 422005 | Email: donations@mahavatarbabaji.org | Helplines: +91 83084 44455, +91 94221 63066
              </p>
            </div>

            {/* Official Certified Badge */}
            <div className="hidden sm:flex flex-col items-center shrink-0">
              <div className="w-14 h-14 rounded-full bg-[#faeedb] border-2 border-[#d4af37] flex flex-col items-center justify-center text-[#9a3412] shadow-sm">
                <ShieldCheck size={24} className="text-[#c2410c]" />
                <span className="text-[8px] font-bold uppercase tracking-tight text-[#6e411b]">80G Valid</span>
              </div>
              <span className="text-[9px] text-[#5c3316] mt-1 font-bold">आधिकारिक रसीद</span>
            </div>
          </div>

          {/* Golden Ribbon Banner for Title */}
          <div className="inline-block px-6 sm:px-8 py-1.5 bg-gradient-to-r from-[#faeedb] via-[#f7e0bc] to-[#faeedb] border-2 border-[#c59b27] rounded-full shadow-sm mt-1">
            <h2 className="font-serif text-xs sm:text-sm md:text-base font-extrabold text-[#3d1d0a] tracking-wide uppercase">
              दान एवं सेवा सहयोग पावन रसीद (OFFICIAL 80G DONATION RECEIPT)
            </h2>
          </div>
        </div>

        {/* 2. RECEIPT METADATA BAR (4 Columns) */}
        <div className="bg-[#fcf5eb] p-3.5 sm:p-4 rounded-2xl border-2 border-[#dfc699] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-5 shadow-sm">
          <div>
            <span className="text-[#7a5432] block text-[10px] font-sans font-bold uppercase tracking-wider">
              रसीद संख्या (Receipt No)
            </span>
            <span className="font-mono font-extrabold text-[#c2410c] text-sm sm:text-base block mt-0.5">
              {receipt.receiptNo}
            </span>
          </div>

          <div>
            <span className="text-[#7a5432] block text-[10px] font-sans font-bold uppercase tracking-wider">
              दिनांक एवं समय (Date & Time)
            </span>
            <span className="font-sans font-bold text-[#2b1408] text-xs sm:text-sm block mt-0.5">
              {receipt.formattedDate}
            </span>
          </div>

          <div>
            <span className="text-[#7a5432] block text-[10px] font-sans font-bold uppercase tracking-wider">
              ट्रांजैक्शन आईडी (Txn ID)
            </span>
            <span className="font-mono font-bold text-[#4a260b] text-xs truncate block mt-0.5">
              {receipt.transactionId}
            </span>
          </div>

          <div>
            <span className="text-[#7a5432] block text-[10px] font-sans font-bold uppercase tracking-wider">
              सत्यापन स्थिति (Status)
            </span>
            <div className="mt-0.5">
              {isApproved && (
                <span className="inline-flex items-center gap-1 font-sans font-extrabold text-emerald-900 text-xs bg-emerald-100 px-2.5 py-1 rounded-lg border-2 border-emerald-500 shadow-sm">
                  <CheckCircle2 size={13} className="text-emerald-700" />
                  <span>स्वीकृत (VERIFIED)</span>
                </span>
              )}
              {isPending && (
                <span className="inline-flex items-center gap-1 font-sans font-extrabold text-amber-900 text-xs bg-amber-100 px-2.5 py-1 rounded-lg border-2 border-amber-500 shadow-sm">
                  <Clock size={13} className="text-amber-700" />
                  <span>लंबित (PENDING)</span>
                </span>
              )}
              {receipt.paymentStatus === 'FAILED' && (
                <span className="inline-flex items-center gap-1 font-sans font-extrabold text-red-900 text-xs bg-red-100 px-2.5 py-1 rounded-lg border-2 border-red-500">
                  <XCircle size={13} className="text-red-700" />
                  <span>अस्वीकृत (REJECTED)</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3. DONOR INFORMATION CARD */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-[#e6ce9e] mb-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#eedbc5] pb-2">
            <h3 className="text-xs sm:text-sm font-bold font-serif text-[#3b1e0d] flex items-center gap-2 uppercase tracking-wider">
              <User size={16} className="text-[#c2410c]" />
              <span>दानदाता का पावन विवरण (Donor Information)</span>
            </h3>
            <span className="text-[10px] font-sans font-bold text-[#b45309] bg-[#fbf3e8] px-2 py-0.5 rounded-md border border-[#e6ce9e]">
              80G Tax Exemption Eligible
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 text-xs sm:text-sm font-sans">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between sm:justify-start gap-1 sm:gap-2">
              <span className="text-[#7a5432] font-semibold text-xs shrink-0">पूरा नाम (Full Name):</span>
              <span className="font-serif font-extrabold text-[#2b1408] text-sm sm:text-base">
                {receipt.fullName}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between sm:justify-start gap-1 sm:gap-2">
              <span className="text-[#7a5432] font-semibold text-xs shrink-0">मोबाइल नंबर (Mobile):</span>
              <span className="font-mono font-bold text-[#3d1d0a]">{receipt.mobile}</span>
            </div>

            {receipt.email && (
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between sm:justify-start gap-1 sm:gap-2">
                <span className="text-[#7a5432] font-semibold text-xs shrink-0">ईमेल (Email Address):</span>
                <span className="font-mono font-medium text-[#3d1d0a] truncate">{receipt.email}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between sm:justify-start gap-1 sm:gap-2">
              <span className="text-[#7a5432] font-semibold text-xs shrink-0">लिंग / वैवाहिक स्थिति:</span>
              <span className="font-semibold text-[#2b1408]">
                {receipt.gender} | {receipt.maritalStatus}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between sm:justify-start gap-1 sm:gap-2">
              <span className="text-[#7a5432] font-semibold text-xs shrink-0">PAN नंबर (Tax Benefit):</span>
              <span className="font-mono font-extrabold text-[#c2410c] text-sm uppercase">
                {receipt.panNumber ? receipt.panNumber : 'उपलब्ध नहीं (General Donor)'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between sm:justify-start gap-1 sm:gap-2">
              <span className="text-[#7a5432] font-semibold text-xs shrink-0">प्राप्तकर्ता UPI ID:</span>
              <span className="font-mono font-bold text-[#5c3316]">
                {receipt.upiId || '8308444455@kotak'}
              </span>
            </div>

            <div className="col-span-1 sm:col-span-2 pt-2 border-t border-[#f5ede2] flex flex-col sm:flex-row items-start gap-1 sm:gap-2">
              <span className="text-[#7a5432] font-semibold text-xs shrink-0 flex items-center gap-1">
                <MapPin size={13} className="text-[#b45309]" />
                <span>पूरा पता (Address):</span>
              </span>
              <span className="text-[#2b1408] font-medium leading-relaxed">
                {receipt.address}, जिला: {receipt.district}, राज्य: {receipt.state} - {receipt.pincode}
              </span>
            </div>
          </div>
        </div>

        {/* 4. DONATION PARTICULARS & PROMINENT AMOUNT CARD */}
        <div className="bg-gradient-to-br from-[#faf4ec] via-[#f7ebdc] to-[#faf4ec] p-4 sm:p-5 rounded-2xl border-2 border-[#c59b27] mb-5 space-y-4 shadow-sm">
          <div className="flex flex-wrap justify-between items-center border-b border-[#e0c270] pb-2.5 gap-2">
            <div className="text-xs sm:text-sm font-bold font-serif text-[#3b1e0d] flex items-center gap-2 uppercase">
              <Heart size={16} className="text-[#c2410c] fill-[#c2410c]" />
              <span>दान विवरण एवं राशि (Donation Particulars)</span>
            </div>
            <div className="text-xs font-sans text-[#6e411b]">
              भुगतान माध्यम:{' '}
              <span className="font-bold text-[#2b1408]">
                {receipt.paymentMethod === 'BANK_TRANSFER'
                  ? 'बैंक ट्रांसफर (NEFT/RTGS)'
                  : 'UPI / QR Code Scan'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Purpose */}
            <div className="md:col-span-6 space-y-1">
              <span className="text-[11px] text-[#7a5432] font-sans font-bold uppercase tracking-wider block">
                दान का पावन उद्देश्य (Donation Purpose)
              </span>
              <h4 className="font-serif text-base sm:text-lg font-extrabold text-[#3b1e0d] leading-snug">
                {receipt.purpose}
              </h4>
              <p className="text-[11px] font-sans text-[#6e411b]">
                Shri Mahavatar Babaji Saral Dhyan Yog Peeth Seva Fund
              </p>
            </div>

            {/* PROMINENT TOTAL AMOUNT DISPLAY */}
            <div className="md:col-span-6 bg-[#fffdf9] p-4 sm:p-5 rounded-2xl border-2 border-[#c59b27] text-center shadow-md">
              <span className="text-[10px] sm:text-xs text-[#8a5327] uppercase tracking-widest font-sans font-black block mb-0.5">
                कुल प्राप्त दान राशि (TOTAL DONATION)
              </span>
              <div className="font-serif text-3xl sm:text-4xl font-black text-[#9a3412] tracking-tight">
                ₹ {Number(receipt.amount).toLocaleString('en-IN')} /-
              </div>
            </div>
          </div>

          {/* Amount in Words (Crystal Clear) */}
          <div className="bg-[#fffdf9] px-4 py-2.5 rounded-xl border border-[#dfc699] text-xs sm:text-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 shadow-inner">
            <span className="text-[#7a5432] font-sans font-bold shrink-0">
              राशि शब्दों में (Amount in Words):
            </span>
            <span className="font-serif font-extrabold text-[#3b1e0d] italic">
              "{receipt.amountInWords}"
            </span>
          </div>

          {/* UTR & Transaction Reference Proof */}
          {receipt.utrNumber && (
            <div className="bg-[#fffdf9] px-4 py-2 rounded-xl border border-[#dfc699] text-xs flex flex-wrap justify-between items-center gap-2">
              <span className="text-[#7a5432] font-sans font-bold">
                बैंक यूटीआर / रेफरेंस नंबर (Bank UTR / Ref No):
              </span>
              <span className="font-mono font-extrabold text-[#c2410c] text-sm">
                {receipt.utrNumber}
              </span>
            </div>
          )}
        </div>

        {/* 5. SPIRITUAL BLESSINGS MESSAGE */}
        <div className="text-center my-5 bg-[#faf2e4] p-3.5 rounded-2xl border border-[#d4af37]/60">
          <p className="text-xs sm:text-sm font-serif font-bold text-[#4a260b] leading-relaxed">
            "सद्गुरु महावतार बाबाजी की असीम अनुकम्पा, दिव्य सुरक्षा एवं कृपा दृष्टि आप एवं आपके समस्त परिवार पर सदैव बनी रहे। आपके इस पावन दान एवं सेवा सहयोग हेतु सरल ध्यान योग पीठ परिवार आपका हृदय से साधुवाद एवं आभार व्यक्त करता है।"
          </p>
        </div>

        {/* 6. VERIFICATION QR CODE & AUTHORIZED SIGNATORY */}
        <div className="border-t-2 border-[#d4af37]/60 pt-4 flex flex-col sm:flex-row items-center justify-between gap-5">
          {/* QR Verification Area */}
          <div className="flex items-center gap-3.5 bg-[#fcf5eb] p-3 rounded-2xl border-2 border-[#dfc699] shadow-sm">
            <div className="p-1 bg-white border border-[#c59b27] rounded-xl shrink-0 shadow-sm">
              <QRCodeCanvas
                value={`https://mahavatarbabaji.org/verify-receipt?id=${receipt.receiptNo}&txn=${receipt.transactionId}&amt=${receipt.amount}`}
                size={70}
                bgColor="#ffffff"
                fgColor="#2b1408"
                level="H"
              />
            </div>
            <div className="text-[10px] sm:text-[11px] font-sans">
              <span className="font-bold text-[#3b1e0d] block uppercase tracking-wide">
                डिजिटल सत्यापन QR कोड
              </span>
              <span className="text-[#7a5432] block">
                Scan QR to verify authentic receipt
              </span>
              <span className="text-[10px] text-[#c2410c] font-mono font-bold block mt-0.5">
                Pay ID: {receipt.paymentId}
              </span>
            </div>
          </div>

          {/* Official Trust Seal & Authorized Signatory */}
          <div className="flex items-center gap-6 text-center">
            {/* Digital Peeth Trust Seal */}
            <div className="w-20 h-20 rounded-full border-2 border-[#b45309] bg-[#faeedb] flex flex-col items-center justify-center p-1 text-[8px] text-[#5c3316] font-serif leading-tight shadow-sm shrink-0">
              <Award size={14} className="text-[#c2410c] mb-0.5" />
              <span className="font-bold text-[8.5px] text-[#3b1e0d]">★ बाबाजी पीठ ★</span>
              <span className="text-[7.5px] font-bold">महावतार बाबाजी</span>
              <span className="font-bold text-[7px] text-[#9a3412]">चैरिटेबल ट्रस्ट</span>
              <span className="text-[6.5px] text-[#7a5432] uppercase">Official Seal</span>
            </div>

            {/* Signature Area */}
            <div className="flex flex-col items-center">
              <div className="h-9 flex items-end justify-center font-serif text-sm font-bold text-[#3b1e0d] border-b-2 border-[#c59b27] px-6 mb-1">
                Swami Dr. Nirmal Ji
              </div>
              <span className="text-[10px] text-[#3d1d0a] font-bold block">
                अधिकृत हस्ताक्षरकर्ता (Authorized Signatory)
              </span>
              <span className="text-[9px] text-[#7a5432] font-semibold block">
                Shri Mahavatar Babaji Charitable Trust
              </span>
            </div>
          </div>
        </div>

        {/* 7. FOOTER DISCLAIMER */}
        <div className="mt-4 pt-3 border-t border-[#eedbc5] text-center text-[9px] sm:text-[10px] text-[#7a5432] font-sans leading-relaxed">
          यह रसीद आयकर अधिनियम 1961 की धारा 80G के अंतर्गत कर छूट (Tax Exemption) हेतु पूर्णतः मान्य है। This is an authentic digital donation receipt issued under the authority of Shri Mahavatar Babaji Charitable Trust. Website: www.mahavatarbabaji.org
        </div>
      </div>
    </div>
  );
};

