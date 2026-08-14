import React, { useRef, useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { MemberRecord } from '../types/membership';
import { useImageContext } from '../context/ImageContext';
import { Download, Printer, ShieldCheck, CheckCircle, Award, XCircle } from 'lucide-react';
import { downloadElementAsPNG, downloadElementAsPDF } from '../utils/exportHelper';
import {
  CertificateSettings,
  getStoredCertificateSettings,
  fetchRemoteCertificateSettings,
  DEFAULT_CERTIFICATE_SETTINGS
} from '../utils/certificateConfig';

interface MembershipCertificateProps {
  member: MemberRecord;
  customSettings?: CertificateSettings;
}

const getCertificateNameClasses = (fullName: string) => {
  const name = (fullName || '').trim();
  const len = name.length;

  if (len <= 18) {
    return 'text-3xl sm:text-4xl md:text-5xl tracking-wide leading-normal';
  } else if (len <= 30) {
    return 'text-2xl sm:text-3xl md:text-4xl tracking-normal leading-normal';
  } else if (len <= 45) {
    return 'text-xl sm:text-2xl md:text-3xl tracking-tight leading-normal';
  } else {
    return 'text-lg sm:text-xl md:text-2xl tracking-tighter leading-normal';
  }
};

export const MembershipCertificate: React.FC<MembershipCertificateProps> = ({ member, customSettings }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const { getImageUrl } = useImageContext();
  const [settings, setSettings] = useState<CertificateSettings>(customSettings || getStoredCertificateSettings());
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadResult, setDownloadResult] = useState<{
    filename: string;
    url: string;
    type: 'pdf' | 'png';
  } | null>(null);

  useEffect(() => {
    if (customSettings) {
      setSettings(customSettings);
    } else {
      fetchRemoteCertificateSettings().then(setSettings);
    }
  }, [customSettings]);

  const handlePrint = () => {
    window.print();
  };

  const certId = member.membershipNo || member.applicationNo || member.id;

  const handleDownloadPNG = async () => {
    if (!certificateRef.current) return;
    setIsGenerating(true);
    setDownloadResult(null);
    try {
      const filename = `Membership_Certificate_${certId}.png`;
      const res = await downloadElementAsPNG(
        certificateRef.current,
        filename,
        '#fffdf5'
      );
      setDownloadResult({
        filename,
        url: res.dataUrl || res.blobUrl,
        type: 'png',
      });
    } catch (e) {
      console.error('Failed to download PNG:', e);
      alert('सर्टिफिकेट जनरेट करने में त्रुटि आई।');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    setIsGenerating(true);
    setDownloadResult(null);
    try {
      const filename = `Membership_Certificate_${certId}.pdf`;
      const res = await downloadElementAsPDF(
        certificateRef.current,
        filename,
        { orientation: 'l', format: 'a4', backgroundColor: '#fffdf5' }
      );
      setDownloadResult({
        filename,
        url: res.dataUrl || res.blobUrl,
        type: 'pdf',
      });
    } catch (e) {
      console.error('Failed to download PDF:', e);
      alert('सर्टिफिकेट जनरेट करने में त्रुटि आई।');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!member.membershipNo && member.status !== 'Approved') {
    return (
      <div className="p-8 text-center text-amber-800 font-bold bg-amber-50 rounded-xl border border-amber-300 shadow-sm max-w-xl mx-auto">
        <ShieldCheck className="mx-auto mb-3 text-amber-600" size={36} />
        <p className="text-lg font-serif">प्रमाणपत्र केवल स्वीकृत सदस्यों के लिए उपलब्ध है।</p>
        <p className="text-sm text-amber-700 mt-1 font-sans">
          Membership Certificate will be generated automatically upon application approval.
        </p>
      </div>
    );
  }

  const issueDate = member.approvalDate || member.registrationDate || new Date().toLocaleDateString('en-IN');
  const validityText = (member as any).validity || 'Life Membership';

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full">
      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3 print:hidden">
        <button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 text-amber-100 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all border border-amber-500/40 disabled:opacity-50 cursor-pointer"
        >
          <Download size={18} className="text-amber-300" />
          {isGenerating ? 'Generating...' : 'Download PDF Certificate'}
        </button>
        <button
          onClick={handleDownloadPNG}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-saffron-700 hover:from-amber-500 hover:to-saffron-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all border border-amber-300/40 disabled:opacity-50 cursor-pointer"
        >
          <Download size={18} />
          {isGenerating ? 'Generating...' : 'Download High-Res PNG'}
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-white text-emerald-900 border border-emerald-300 hover:bg-emerald-50 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer"
        >
          <Printer size={18} /> Print Certificate
        </button>
      </div>

      {/* Direct Download Link Banner */}
      {downloadResult && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in print:hidden">
          <div className="bg-gradient-to-b from-emerald-900 to-emerald-950 border-2 border-amber-500/50 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center space-y-4 relative">
            <button 
              onClick={() => setDownloadResult(null)}
              className="absolute top-3 right-3 text-amber-400 hover:text-white"
            >
              <XCircle size={24} />
            </button>
            <div className="mx-auto w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-2">
              <CheckCircle size={32} className="text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white">
              सर्टिफिकेट तैयार है!
            </h3>
            <p className="text-sm text-emerald-200/80">
              यदि सर्टिफिकेट अपने आप डाउनलोड नहीं हुआ है, तो कृपया नीचे दिए गए बटन पर क्लिक करें।
            </p>
            <p className="text-[11px] text-amber-400/80 font-mono truncate px-4 pb-2">
              {downloadResult.filename}
            </p>
            <div className="pt-2">
              <a
                href={downloadResult.url}
                download={downloadResult.filename}
                onClick={() => setTimeout(() => setDownloadResult(null), 1000)}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-black text-sm rounded-xl shadow-lg shadow-amber-900/50 transition-all cursor-pointer transform hover:scale-105"
              >
                <Download size={18} />
                <span>सर्टिफिकेट सुरक्षित करें (Download)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Frame Container */}
      <div className="w-full overflow-x-auto py-2 flex justify-start xl:justify-center items-center px-2">
        <div 
          ref={certificateRef}
          id="printable-certificate"
          className="w-[1000px] min-w-[1000px] h-[710px] min-h-[710px] bg-[#fffdf5] relative shadow-2xl overflow-hidden text-emerald-950 font-serif border border-amber-300/60 box-border mx-auto shrink-0 my-1"
        >
          <style>
            {`
              @media print {
                body * { visibility: hidden !important; }
                #printable-certificate, #printable-certificate * { visibility: visible !important; }
                #printable-certificate {
                  position: fixed !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100vw !important;
                  height: 100vh !important;
                  max-width: none !important;
                  max-height: none !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  background: #fffdf5 !important;
                  box-shadow: none !important;
                  border: none !important;
                  z-index: 999999 !important;
                }
                @page { size: landscape; margin: 0; }
              }
            `}
          </style>

          <div className="print-certificate-container relative w-full h-full p-5 flex flex-col justify-between box-border">
            
            {/* Outer Decorative Gold + Emerald Border */}
            <div className="absolute inset-3 border-[5px] border-double border-amber-600/90 rounded-xl pointer-events-none" />
            <div className="absolute inset-5 border border-emerald-800/40 rounded-lg pointer-events-none" />
            <div className="absolute inset-6 border border-amber-500/30 rounded-md pointer-events-none" />

            {/* Corner Ornaments */}
            <div className="absolute top-4 left-4 w-10 h-10 border-t-4 border-l-4 border-amber-600 rounded-tl-lg pointer-events-none" />
            <div className="absolute top-4 right-4 w-10 h-10 border-t-4 border-r-4 border-amber-600 rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b-4 border-l-4 border-amber-600 rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b-4 border-r-4 border-amber-600 rounded-br-lg pointer-events-none" />

            {/* Subtle Circular Mandala Watermark in Center */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
              <svg width="450" height="450" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#064e3b" strokeWidth="2" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="#d4af37" strokeWidth="1.5" />
                <polygon points="100,10 125,75 190,100 125,125 100,190 75,125 10,100 75,75" fill="#064e3b" />
              </svg>
            </div>

            {/* TOP HEADER SECTION */}
            <div className="relative z-10 w-full flex flex-col items-center">
              
              {/* Header Content Row */}
              <div className="w-full flex items-center justify-between px-4 pt-1">
                {/* Organization Logo */}
                <div className="w-20 h-20 flex items-center justify-center p-1 bg-white/90 rounded-full border-2 border-amber-400 shadow-sm shrink-0">
                  <img 
                    crossOrigin="anonymous" referrerPolicy="no-referrer"
                    src={getImageUrl('certOrgLogo') || settings.organizationLogoUrl || '/logo.png'} 
                    alt="Peeth Logo" 
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => { e.currentTarget.src = '/logo.png'; }}
                  />
                </div>

                {/* Organization Name & Heading */}
                <div className="flex-1 text-center px-3">
                  <p className="text-[10px] font-sans font-extrabold tracking-[0.22em] text-amber-700 uppercase mb-0.5">
                    NGO & CHARITABLE TRUST REGISTERED
                  </p>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-emerald-950 font-serif tracking-wide leading-tight uppercase drop-shadow-sm">
                    SADGURU MAHAVATAR BABAJI SARAL DHYAN YOG PEETH
                  </h1>
                  <p className="text-[11px] font-sans text-emerald-800 font-semibold tracking-wider mt-0.5">
                    पंचवटी, नाशिक - 422003 | त्र्यंबकेश्वर, महाराष्ट्र (भारत)
                  </p>
                </div>

                {/* Badge Emblem / Guarantee */}
                <div className="w-20 h-20 flex flex-col items-center justify-center p-1.5 rounded-full border-2 border-amber-500 bg-amber-50/90 text-center shadow-sm shrink-0">
                  <Award className="text-amber-600 mb-0.5" size={22} />
                  <span className="text-[7.5px] font-sans font-bold text-emerald-950 uppercase leading-tight">OFFICIAL</span>
                  <span className="text-[7.5px] font-sans font-bold text-amber-700 uppercase leading-tight">MEMBERSHIP</span>
                </div>
              </div>

              {/* Title Ribbon */}
              <div className="mt-2 w-full flex items-center justify-center">
                <div className="relative bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-amber-200 px-10 py-1 rounded-full border-2 border-amber-400 shadow-md flex flex-col items-center">
                  <span className="text-[10px] tracking-[0.25em] font-sans font-extrabold uppercase text-amber-300">
                    MEMBERSHIP REGISTRATION
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-black tracking-[0.15em] uppercase text-white drop-shadow">
                    CERTIFICATE OF MEMBERSHIP
                  </h2>
                </div>
              </div>

            </div>

            {/* MIDDLE CERTIFICATE STATEMENT & MEMBER NAME */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center my-auto text-center px-6">
              
              <p className="text-xs sm:text-sm font-sans font-bold tracking-widest text-emerald-900 uppercase my-1">
                THIS CERTIFICATE IS PROUDLY PRESENTED FOR MEMBERSHIP TO:
              </p>

              {/* FULL NAME DISPLAY (RESPONSIVE, NO TRUNCATION, WRAPS NATURALLY) */}
              <div className="w-full max-w-3xl min-h-[56px] flex items-center justify-center my-1 px-2">
                <h3 
                  className={`w-full font-serif font-extrabold text-amber-700 text-center leading-normal break-words max-w-full drop-shadow-sm ${getCertificateNameClasses(
                    member.fullName
                  )}`}
                  style={{
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {member.fullName}
                </h3>
              </div>

              {/* Golden Underline Accent */}
              <div className="w-56 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent my-1" />

              {/* Description Paragraph */}
              <p className="text-xs sm:text-sm font-serif text-emerald-900 leading-relaxed max-w-2xl mt-1">
                Is officially enrolled as a recognized <strong className="text-amber-800">{validityText}</strong> member of 
                <strong> Sadguru Mahavatar Babaji Saral Dhyan Yog Peeth</strong>, entitled to all official privileges and dedicated to spiritual, social, and humanitarian welfare services.
              </p>

            </div>

            {/* BOTTOM DETAILS ROW + NGO FOOTER */}
            <div className="relative z-10 w-full flex flex-col space-y-2 pt-1">
              
              {/* Details & Signatures Row */}
              <div className="w-full flex items-end justify-between px-4">
                
                {/* Left Column: Member Photo & ID Details */}
                <div className="flex items-center gap-3">
                  <div className="w-18 h-22 border-2 border-amber-500 bg-white shadow-md rounded-md overflow-hidden shrink-0">
                    <img 
                      crossOrigin="anonymous" referrerPolicy="no-referrer"
                      src={member.photoUrl} 
                      alt={member.fullName} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = '/assets/indian_sadhak1.jpg'; }}
                    />
                  </div>
                  <div className="flex flex-col text-left space-y-0.5 font-sans">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-emerald-800 block">MEMBERSHIP NO.</span>
                      <span className="text-sm font-mono font-extrabold text-amber-800 tracking-wider">{certId}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-emerald-800 block">ISSUE DATE</span>
                      <span className="text-xs font-semibold text-emerald-950">{issueDate}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-emerald-800 block">VALIDITY</span>
                      <span className="text-xs font-semibold text-emerald-950">{validityText}</span>
                    </div>
                  </div>
                </div>

                {/* Center Column: Verification QR Code & Official Seal Stamp */}
                <div className="flex items-center gap-4">
                  {/* QR Code */}
                  <div className="flex flex-col items-center">
                    <div className="p-1 bg-white border border-amber-400 rounded-lg shadow-sm">
                      <QRCodeCanvas 
                        value={`PEETH_MEMBERSHIP_CERTIFICATE|ID:${certId}|NAME:${member.fullName}|ISSUED:${issueDate}`} 
                        size={58}
                        level="M"
                        fgColor="#064e3b"
                      />
                    </div>
                    <span className="text-[8px] font-sans font-bold text-emerald-800 mt-0.5 uppercase tracking-tighter">
                      SCAN TO VERIFY
                    </span>
                  </div>

                  {/* Official Seal / Stamp Image */}
                  <div className="w-18 h-18 flex items-center justify-center">
                    <img 
                      crossOrigin="anonymous" referrerPolicy="no-referrer"
                      src={getImageUrl('certOfficialSeal') || settings.officialSealUrl || DEFAULT_CERTIFICATE_SETTINGS.officialSealUrl} 
                      alt="Official Seal" 
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                    />
                  </div>
                </div>

                {/* Right Column: Authorized Signature Area */}
                <div className="flex flex-col items-center text-center font-sans">
                  <div className="h-10 w-32 flex items-end justify-center mb-1">
                    <img 
                      crossOrigin="anonymous" referrerPolicy="no-referrer"
                      src={getImageUrl('certAuthorizedSignature') || settings.authorizedSignatureUrl || DEFAULT_CERTIFICATE_SETTINGS.authorizedSignatureUrl} 
                      alt="Authorized Signature" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="w-36 border-t border-amber-600/80 pt-0.5">
                    <p className="text-[10.5px] font-bold text-emerald-950 leading-none">
                      {settings.signatoryName || 'Swami Dr. Nirmal Ji Maharaj'}
                    </p>
                    <p className="text-[8.5px] font-semibold text-amber-800 uppercase tracking-wider mt-0.5">
                      {settings.signatoryTitle || 'President / Chairman'}
                    </p>
                  </div>
                </div>

              </div>

              {/* MANDATORY NGO & TRUST REGISTRATION DETAILS FOOTER BAR */}
              <div className="w-full pt-1 border-t border-amber-500/40 bg-amber-50/90 rounded-b-lg px-3 py-1 flex items-center justify-between text-[9.5px] font-sans text-emerald-950 font-semibold shadow-inner">
                <div className="flex flex-wrap items-center justify-between w-full gap-x-2 gap-y-0.5">
                  <span><strong>PAN No.:</strong> ABITS9670B</span>
                  <span className="text-amber-500">|</span>
                  <span><strong>80G:</strong> ABITS9670BF20241</span>
                  <span className="text-amber-500">|</span>
                  <span><strong>12A:</strong> ABITS9670BE20241</span>
                  <span className="text-amber-500">|</span>
                  <span><strong>NITI AAYOG:</strong> MH/2024/0413297</span>
                  <span className="text-amber-500">|</span>
                  <span><strong>Trust Reg No.:</strong> E0001698 (NSK)</span>
                  <span className="text-amber-500">|</span>
                  <span><strong>E-ANUDDAN:</strong> MH/00036058</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
