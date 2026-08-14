import React, { useRef, useState } from 'react';
import { MemberRecord } from '../types/membership';
import { QRCodeCanvas } from 'qrcode.react';
import { downloadElementAsPNG, downloadElementAsPDF } from '../utils/exportHelper';
import { Download, Printer, Share2, CheckCircle2, XCircle, Sparkles, Copy, Check, ShieldCheck, Phone, MapPin, Calendar, Heart, Award } from 'lucide-react';
import { useImageContext } from '../context/ImageContext';

interface DigitalIdCardProps {
  member: MemberRecord;
  onClose?: () => void;
  onDownload?: () => void;
  compact?: boolean;
}

// Responsive Full Name sizing algorithm to prevent ANY text overlapping
const getNameStyleClasses = (fullName: string) => {
  const name = (fullName || '').trim();
  const len = name.length;

  if (len <= 16) {
    return 'text-base sm:text-lg leading-snug tracking-wide font-bold';
  } else if (len <= 26) {
    return 'text-sm sm:text-base leading-snug tracking-normal font-bold';
  } else if (len <= 35) {
    return 'text-xs sm:text-sm leading-snug tracking-tight font-bold';
  } else if (len <= 45) {
    return 'text-[11px] sm:text-xs leading-tight tracking-tighter font-bold';
  } else {
    return 'text-[10px] sm:text-[11px] leading-tight tracking-tighter font-bold';
  }
};

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({ member, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { getImageUrl } = useImageContext();
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [downloadReady, setDownloadReady] = useState<{
    url: string;
    filename: string;
    type: 'PNG' | 'PDF';
  } | null>(null);

  const logoUrl = getImageUrl('headerLogo') || '/logo.png';

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    setDownloadReady(null);
    try {
      const filename = `Digital_ID_Card_${member.membershipNo || member.applicationNo || member.id}.png`;
      const res = await downloadElementAsPNG(
        cardRef.current,
        filename,
        null
      );
      setDownloadReady({
        url: res.blobUrl || res.dataUrl,
        filename,
        type: 'PNG',
      });
    } catch (err) {
      console.error('Error generating PNG card:', err);
      alert('कार्ड डाउनलोड करने में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    setDownloadReady(null);
    try {
      const filename = `Digital_ID_Card_${member.membershipNo || member.applicationNo || member.id}.pdf`;
      const res = await downloadElementAsPDF(
        cardRef.current,
        filename,
        { orientation: 'p', format: [85.6, 125], backgroundColor: null }
      );
      setDownloadReady({
        url: res.blobUrl || res.dataUrl,
        filename,
        type: 'PDF',
      });
    } catch (err) {
      console.error('Error generating PDF card:', err);
      alert('PDF कार्ड डाउनलोड करने में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !cardRef.current) {
      window.print();
      return;
    }
    const cardHtml = cardRef.current.outerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>सदस्यता पहचान पत्र - ${member.fullName} (${member.membershipNo || member.applicationNo || member.id})</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body {
                background: white;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                padding: 0;
              }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body class="bg-gray-100 flex justify-center items-center p-6">
          <div>${cardHtml}</div>
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

  const handleCopyId = () => {
    navigator.clipboard.writeText(member.membershipNo || member.applicationNo || member.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `जय गुरुदेव! 🙏\nमेरा सद्गुरु महावतार बाबाजी - सरल ध्यान योग पीठ का डिजिटल सदस्यता पहचान पत्र बन गया है!\n\nनाम: ${member.fullName}\nसदस्यता ID: ${member.membershipNo || member.applicationNo || member.id}\nराज्य: ${member.state}\n\nआप भी अपना डिजिटल आईडी कार्ड प्राप्त करें:`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Verification Payload for QR
  const qrVerificationData = JSON.stringify({
    org: 'Sadguru Mahavatar Babaji Saral Dhyan Yog Peeth',
    id: member.membershipNo || member.applicationNo || member.id,
    appNo: member.applicationNo,
    name: member.fullName,
    mobile: member.mobile,
    state: member.state,
    status: member.status,
    verified: true,
  });

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md mx-auto p-2 sm:p-4">
      {/* 1. Print / Download / Share Toolbar */}
      <div className="w-full flex flex-wrap items-center justify-center gap-2 bg-coffee-900/90 border border-gold-500/40 p-3 rounded-2xl shadow-xl backdrop-blur-md print:hidden">
        <button
          onClick={handleDownloadPng}
          disabled={isDownloading}
          className="flex-1 min-w-[120px] px-3 py-2 bg-gradient-to-r from-gold-600 via-gold-500 to-saffron-500 hover:brightness-110 text-coffee-50 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          {isDownloading ? (
            <span className="flex items-center gap-1.5 animate-pulse">
              <span className="w-3 h-3 border-2 border-coffee-950 border-t-transparent rounded-full animate-spin"></span>
              तैयार हो रहा है...
            </span>
          ) : (
            <>
              <Download size={15} />
              <span>PNG कार्ड</span>
            </>
          )}
        </button>

        <button
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="flex-1 min-w-[120px] px-3 py-2 bg-saffron-600 hover:bg-saffron-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          {isDownloading ? (
            <span className="flex items-center gap-1.5 animate-pulse">
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              तैयार हो रहा है...
            </span>
          ) : (
            <>
              <Download size={15} />
              <span>PDF कार्ड</span>
            </>
          )}
        </button>

        <button
          onClick={handlePrint}
          className="px-3 py-2 bg-coffee-800 hover:bg-coffee-700 text-gold-200 border border-gold-500/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          <Printer size={15} />
          <span>प्रिंट</span>
        </button>

        <button
          onClick={handleShareWhatsApp}
          className="px-3 py-2 bg-green-700 hover:bg-green-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          <Share2 size={15} />
          <span>शेयर</span>
        </button>

        {downloadReady && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn print:hidden">
            <div className="bg-gradient-to-b from-emerald-900 to-emerald-950 border-2 border-emerald-500/50 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center space-y-4 relative">
              <button 
                onClick={() => setDownloadReady(null)}
                className="absolute top-3 right-3 text-emerald-400 hover:text-white"
              >
                <XCircle size={24} />
              </button>
              <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 size={32} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {downloadReady.type} कार्ड तैयार है!
              </h3>
              <p className="text-sm text-emerald-200/80">
                यदि कार्ड अपने आप डाउनलोड नहीं हुआ है, तो कृपया नीचे दिए गए बटन पर क्लिक करें।
              </p>
              <div className="pt-2">
                <a
                  href={downloadReady.url}
                  download={downloadReady.filename}
                  onClick={() => setTimeout(() => setDownloadReady(null), 1000)}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-900/50 transition-all cursor-pointer transform hover:scale-105"
                >
                  <Download size={18} />
                  <span>कार्ड सुरक्षित करें (Download)</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Actual Physical Digital ID Card Container */}
      <div
        ref={cardRef}
        id="digital-id-card"
        className="w-[340px] sm:w-[360px] min-h-[580px] h-auto rounded-3xl bg-gradient-to-b from-coffee-950 via-coffee-900 to-coffee-950 border-[3px] border-gold-500 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative overflow-hidden flex flex-col justify-between gap-2 text-gold-100 select-none font-serif"
        style={{
          boxShadow: '0 12px 35px rgba(212,175,55,0.25), inset 0 0 20px rgba(212,175,55,0.15)',
        }}
      >
        {/* Subtle Watermark Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <div className="w-80 h-80 rounded-full border-[10px] border-gold-400 border-dashed animate-spin-slow"></div>
        </div>

        {/* Top Decorative Gold Header Frame */}
        <div className="relative z-10 text-center pb-2.5 border-b border-gold-500/40">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-[10px] font-sans font-semibold text-saffron-400 tracking-widest uppercase flex items-center gap-1">
              <Sparkles size={11} className="text-gold-400" /> आधिकारिक पहचान पत्र
            </span>
            <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-green-950 text-green-400 border border-green-500/40 flex items-center gap-1 font-bold">
              <ShieldCheck size={11} /> प्रमाणित
            </span>
          </div>

          <div className="flex items-center justify-center gap-2.5 my-1.5">
            <img
              crossOrigin="anonymous" referrerPolicy="no-referrer"
              src={logoUrl}
              alt="Logo"
              className="w-12 h-12 rounded-full border-2 border-gold-400 object-cover shadow-[0_0_12px_rgba(212,175,55,0.5)] shrink-0"
              onError={(e) => { e.currentTarget.src = '/logo.png'; }}
            />
            <div className="text-left">
              <h3 className="text-base sm:text-lg font-extrabold text-gold-100 leading-tight drop-shadow">
                सद्गुरु महावतार बाबाजी
              </h3>
              <p className="text-xs font-semibold text-saffron-300 leading-tight">
                सरल ध्यान योग पीठ
              </p>
            </div>
          </div>
          <div className="text-[10px] text-gold-300/80 tracking-wide font-sans">
            डिजिटल सदस्यता पहचान पत्र (Digital Membership Card)
          </div>
        </div>

        {/* Card Body - Photo & Core Details */}
        <div className="relative z-10 my-2 flex flex-col items-center">
          {/* Member Photo Frame */}
          <div className="relative mb-2">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-tr from-gold-600 via-gold-400 to-saffron-400 p-1 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              <div className="w-full h-full rounded-xl overflow-hidden bg-coffee-950 border-2 border-gold-500">
                <img
                  crossOrigin="anonymous" referrerPolicy="no-referrer"
                  src={member.photoUrl}
                  alt={member.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = '/assets/indian_sadhak1.jpg'; }}
                />
              </div>
            </div>
            {/* Verified Badge Icon */}
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-gold-500 to-saffron-500 text-coffee-50 p-1.5 rounded-full shadow-lg border border-gold-200">
              <Award size={18} strokeWidth={2.5} />
            </div>
          </div>

          {/* Member Full Name - Guaranteed No Overlap */}
          <div className="w-full px-2 my-1 flex items-center justify-center text-center min-h-[44px]">
            <h2
              className={`w-full font-bold text-gold-200 drop-shadow-md text-center break-words max-w-full py-0.5 px-1 ${getNameStyleClasses(
                member.fullName
              )}`}
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'anywhere',
                hyphens: 'auto'
              }}
            >
              {member.fullName}
            </h2>
          </div>

          {/* Membership ID & Application Number Badge */}
          <div className="mt-1 mb-2.5 flex flex-wrap items-center justify-center gap-1.5 px-3 py-1 bg-coffee-800/90 border border-gold-500/50 rounded-xl shadow-inner font-sans text-center">
            {member.membershipNo ? (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-gold-300/80 font-bold">MEM ID:</span>
                <span className="font-mono font-extrabold text-saffron-300 tracking-wider">
                  {member.membershipNo}
                </span>
                <button
                  onClick={handleCopyId}
                  className="text-gold-400 hover:text-gold-200 transition ml-0.5"
                  title="कॉपी करें"
                >
                  {copiedId ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                </button>
              </div>
            ) : null}
            <div className="text-[10px] text-gold-400 font-mono">
              (App No: {member.applicationNo})
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="w-full bg-coffee-950/80 border border-gold-500/30 rounded-2xl p-3 text-xs space-y-1.5 font-sans">
            <div className="flex justify-between items-center border-b border-gold-500/20 pb-1">
              <span className="text-gold-300/70 flex items-center gap-1">
                <Phone size={12} className="text-gold-400" /> मोबाइल नंबर:
              </span>
              <span className="font-semibold text-gold-100">{member.mobile}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gold-500/20 pb-1">
              <span className="text-gold-300/70 flex items-center gap-1">
                <MapPin size={12} className="text-gold-400" /> राज्य / जिला:
              </span>
              <span className="font-semibold text-gold-100 text-right truncate max-w-[180px]">
                {member.district.split('(')[0]}, {member.state.split('(')[0]}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-gold-500/20 pb-1">
              <span className="text-gold-300/70 flex items-center gap-1">
                <Calendar size={12} className="text-gold-400" /> जन्म तिथि / लिंग:
              </span>
              <span className="font-semibold text-gold-100">
                {member.dob || 'N/A'} ({member.gender})
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gold-300/70 flex items-center gap-1">
                <Heart size={12} className="text-gold-400" /> सदस्य तिथि:
              </span>
              <span className="font-semibold text-saffron-300">{member.approvalDate || member.registrationDate}</span>
            </div>
          </div>
        </div>

        {/* Footer Area - QR Code & Authorized Official Stamp / Signature */}
        <div className="relative z-10 pt-2 border-t border-gold-500/40 flex items-center justify-between gap-2">
          {/* QR Code */}
          <div className="bg-white p-1 rounded-xl border border-gold-400/80 shadow-md shrink-0">
            <QRCodeCanvas value={qrVerificationData} size={54} level="M" />
          </div>

          {/* Official Seal Image */}
          <div className="w-14 h-14 flex items-center justify-center shrink-0">
            <img
              src={getImageUrl('certOfficialSeal') || '/images/trust-seal.png'}
              alt="Official Seal"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-sm"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/trust-seal.png';
              }}
            />
          </div>

          {/* Official Signature Area */}
          <div className="flex flex-col items-end text-right">
            <div className="h-8 w-24 flex items-end justify-end mb-0.5">
              <img
                src={getImageUrl('certAuthorizedSignature') || '/images/trust-signature.jpg'}
                alt="Authorized Signature"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain brightness-110"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/trust-signature.jpg';
                }}
              />
            </div>
            <div className="border-t border-gold-400/60 pt-0.5 text-right w-28">
              <div className="text-[9px] font-serif text-gold-200 font-bold leading-none">
                स्वामी डॉ. निर्मल जी
              </div>
              <div className="text-[7.5px] text-gold-300/80 font-sans">
                अध्यक्ष, सरल ध्यान योग पीठ
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
