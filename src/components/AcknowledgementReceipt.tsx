import React, { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { MemberRecord } from '../types/membership';
import { useImageContext } from '../context/ImageContext';
import { Download, Printer, CheckCircle2, Clock, XCircle, ShieldCheck, FileText } from 'lucide-react';
import { downloadElementAsPNG, downloadElementAsPDF } from '../utils/exportHelper';

interface AcknowledgementReceiptProps {
  member: MemberRecord;
}

export const AcknowledgementReceipt: React.FC<AcknowledgementReceiptProps> = ({ member }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const { getImageUrl } = useImageContext();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);
  const [downloadResult, setDownloadResult] = useState<{
    url: string;
    filename: string;
    type: 'PNG' | 'PDF';
  } | null>(null);

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
          <title>Application Acknowledgement - ${member.applicationNo}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body {
                background: white;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                padding: 10px;
                margin: 0;
              }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body class="bg-gray-100 p-4 flex justify-center">
          <div class="w-full max-w-2xl">${contentHtml}</div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 700);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadPNG = async () => {
    if (!receiptRef.current) return;
    setIsGeneratingPng(true);
    setDownloadResult(null);
    try {
      const filename = `Application_Acknowledgement_${member.applicationNo}.png`;
      const res = await downloadElementAsPNG(
        receiptRef.current,
        filename,
        '#ffffff'
      );
      setDownloadResult({
        url: res.blobUrl || res.dataUrl,
        filename,
        type: 'PNG',
      });
    } catch (e) {
      console.error('Failed to download PNG:', e);
      alert('PNG डाउनलोड करने में समस्या आई।');
    } finally {
      setIsGeneratingPng(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    setIsGeneratingPdf(true);
    setDownloadResult(null);
    try {
      const filename = `Application_Acknowledgement_${member.applicationNo}.pdf`;
      const res = await downloadElementAsPDF(
        receiptRef.current,
        filename,
        { orientation: 'p', format: 'a4', backgroundColor: '#ffffff' }
      );
      setDownloadResult({
        url: res.blobUrl || res.dataUrl,
        filename,
        type: 'PDF',
      });
    } catch (e) {
      console.error('Failed to download PDF:', e);
      alert('PDF डाउनलोड करने में समस्या आई।');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const statusLabel = member.status === 'Approved' ? 'Approved' : member.status === 'Rejected' ? 'Rejected' : 'Pending Verification';

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full">
      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3 print:hidden">
        <button 
          onClick={handleDownloadPDF} 
          disabled={isGeneratingPdf}
          className="flex items-center gap-2 bg-saffron-600 hover:bg-saffron-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          <Download size={18} />
          {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
        </button>
        <button 
          onClick={handleDownloadPNG} 
          disabled={isGeneratingPng}
          className="flex items-center gap-2 bg-coffee-800 hover:bg-coffee-900 text-gold-200 px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          <Download size={18} />
          {isGeneratingPng ? 'Generating PNG...' : 'Download PNG'}
        </button>
        <button 
          onClick={handlePrint} 
          className="flex items-center gap-2 bg-white text-coffee-100 border border-coffee-300 hover:bg-coffee-50 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer"
        >
          <Printer size={18} /> Print
        </button>
      </div>

      {downloadResult && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn print:hidden">
          <div className="bg-gradient-to-b from-coffee-900 to-coffee-950 border-2 border-gold-500/50 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center space-y-4 relative">
            <button 
              onClick={() => setDownloadResult(null)}
              className="absolute top-3 right-3 text-gold-400 hover:text-white"
            >
              <XCircle size={24} />
            </button>
            <div className="mx-auto w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 size={32} className="text-gold-400" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {downloadResult.type.toUpperCase()} रसीद तैयार है!
            </h3>
            <p className="text-sm text-gold-200/80">
              यदि रसीद अपने आप डाउनलोड नहीं हुई है, तो कृपया नीचे दिए गए बटन पर क्लिक करें।
            </p>
            <p className="text-[11px] text-gold-400/80 font-mono truncate px-4 pb-2">
              {downloadResult.filename}
            </p>
            <div className="pt-2">
              <a
                href={downloadResult.url}
                download={downloadResult.filename}
                onClick={() => setTimeout(() => setDownloadResult(null), 1000)}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-saffron-600 hover:from-gold-400 hover:to-saffron-500 text-coffee-50 font-black text-sm rounded-xl shadow-lg shadow-gold-900/50 transition-all cursor-pointer transform hover:scale-105"
              >
                <Download size={18} />
                <span>रसीद सुरक्षित करें (Download)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Acknowledgement Document */}
      <div 
        ref={receiptRef}
        className="w-full max-w-2xl bg-white text-gray-900 rounded-2xl overflow-hidden shadow-2xl relative border-4 border-double border-saffron-600 print:shadow-none print:border-none font-serif"
        style={{ margin: '0 auto' }}
      >
        <div className="p-0">
          {/* Top Banner Header */}
          <div className="bg-gradient-to-r from-saffron-700 via-saffron-600 to-saffron-700 p-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full p-1 flex items-center justify-center shrink-0 shadow-md border-2 border-gold-300">
                <img 
                  crossOrigin="anonymous" referrerPolicy="no-referrer"
                  src={getImageUrl('certOrgLogo') || "/logo.png"} 
                  alt="Logo" 
                  className="w-12 h-12 object-contain" 
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=100&h=100&q=80'; }} 
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-serif leading-tight">सरल ध्यान योग पीठ</h1>
                <p className="text-saffron-100 text-xs sm:text-sm font-sans font-medium">SADGURU MAHAVATAR BABAJI SARAL DHYAN YOG PEETH</p>
                <div className="flex flex-wrap gap-x-2 text-[10px] text-saffron-200 font-sans mt-0.5 font-mono">
                  <span>PAN: ABITS9670B</span>
                  <span>•</span>
                  <span>80G: ABITS9670BF20241</span>
                  <span>•</span>
                  <span>12A: ABITS9670BE20241</span>
                  <span>•</span>
                  <span>Reg: E0001698 (NSK)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center p-3 border-b border-gray-200 bg-amber-50/50">
            <h2 className="text-lg sm:text-xl font-bold text-saffron-800 uppercase tracking-widest font-serif">
              APPLICATION ACKNOWLEDGEMENT RECEIPT
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-gray-600 mt-1 font-sans">
              <span>Application No: <strong className="font-mono text-saffron-700 font-bold text-sm">{member.applicationNo}</strong></span>
              <span>•</span>
              <span>Date: <strong className="text-gray-900">{member.registrationDate}</strong></span>
            </div>
          </div>

          {/* Member Details */}
          <div className="p-6 sm:p-8 space-y-6">
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              
              {/* Photo Frame */}
              <div className="w-28 h-36 shrink-0 border-2 border-saffron-500 rounded-xl overflow-hidden p-1 bg-white shadow-md mx-auto md:mx-0">
                <img 
                  crossOrigin="anonymous" referrerPolicy="no-referrer"
                  src={member.photoUrl} 
                  alt={member.fullName} 
                  className="w-full h-full object-cover rounded-lg" 
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'; }}
                />
              </div>

              {/* Status Banner */}
              <div className="flex-1 w-full space-y-4">
                <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  member.status === 'Approved' ? 'bg-green-50 border-green-300 text-green-900' :
                  member.status === 'Rejected' ? 'bg-red-50 border-red-300 text-red-900' :
                  'bg-amber-50 border-amber-300 text-amber-900'
                }`}>
                  <div className="flex items-center gap-3">
                    {member.status === 'Approved' ? <CheckCircle2 className="text-green-600" size={24} /> :
                     member.status === 'Rejected' ? <XCircle className="text-red-600" size={24} /> :
                     <Clock className="text-amber-600" size={24} />}
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider opacity-80 font-sans">Application Status</p>
                      <p className="font-bold text-base font-serif">{statusLabel}</p>
                    </div>
                  </div>
                  {member.membershipNo && (
                    <div className="text-right font-sans">
                      <p className="text-[10px] uppercase font-bold text-green-700">Membership No.</p>
                      <p className="font-mono font-extrabold text-sm text-green-900">{member.membershipNo}</p>
                    </div>
                  )}
                </div>

                {/* QR Code */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="font-sans text-xs space-y-1">
                    <p className="font-bold text-gray-800">Verification QR Code</p>
                    <p className="text-gray-500 text-[11px]">Scan to verify application authenticity</p>
                  </div>
                  <div className="p-1.5 bg-white border border-gray-300 rounded-lg shadow-sm">
                    <QRCodeCanvas 
                      value={`PEETH_APPLICATION|APP:${member.applicationNo}|NAME:${member.fullName}|MOBILE:${member.mobile}`} 
                      size={64}
                      level="M"
                      fgColor="#1f2937"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Applicant Profile Grid */}
            <div className="border border-gray-200 rounded-xl overflow-hidden font-sans text-xs sm:text-sm">
              <div className="bg-gray-100 px-4 py-2 font-bold font-serif text-saffron-800 border-b border-gray-200 uppercase tracking-wider text-xs">
                Applicant Personal & Contact Information
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 bg-white">
                
                <div className="p-4 space-y-2.5">
                  <div>
                    <span className="text-[11px] font-semibold text-gray-500 block uppercase">Full Name</span>
                    <span className="font-bold text-gray-900 text-base">{member.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-gray-500 block uppercase">Father / Husband Name</span>
                    <span className="font-bold text-gray-800">{member.fatherHusbandName}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500 block uppercase">Gender</span>
                      <span className="font-bold text-gray-800">{member.gender}</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500 block uppercase">Date of Birth</span>
                      <span className="font-bold text-gray-800">{member.dob || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500 block uppercase">Marital Status</span>
                      <span className="font-bold text-gray-800">{member.maritalStatus}</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500 block uppercase">Blood Group</span>
                      <span className="font-bold text-gray-800">{member.bloodGroup || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500 block uppercase">Mobile Number</span>
                      <span className="font-bold text-gray-900">{member.mobile}</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500 block uppercase">WhatsApp</span>
                      <span className="font-bold text-gray-800">{member.whatsapp || member.mobile}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-gray-500 block uppercase">Email Address</span>
                    <span className="font-bold text-gray-800">{member.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-gray-500 block uppercase">Occupation</span>
                    <span className="font-bold text-gray-800">{member.occupation || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-gray-500 block uppercase">Full Address</span>
                    <span className="font-bold text-gray-800 leading-snug block">
                      {member.address}, {member.district}, {member.state} - {member.pincode}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer Signatures */}
            <div className="mt-8 flex justify-between items-end border-t border-gray-200 pt-6 font-sans">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-500/60 bg-amber-50 flex items-center justify-center mx-auto mb-1">
                  <span className="text-[9px] text-amber-800 font-bold rotate-12 uppercase leading-tight">OFFICIAL<br/>PEETH SEAL</span>
                </div>
                <p className="text-[11px] font-bold text-gray-500">Authorized Stamp</p>
              </div>

              <div className="text-center max-w-[240px]">
                <p className="text-xs font-bold text-saffron-800 mb-1 font-serif">धन्यवाद (Thank You)</p>
                <p className="text-[10px] text-gray-500 leading-tight">
                  Your membership application has been received into the Peeth records. Please preserve this receipt and Application Number for tracking.
                </p>
              </div>

              <div className="text-center">
                <div className="w-28 h-12 border-b border-gray-300 mb-1 flex items-end justify-center pb-1">
                  <span className="text-xs font-serif font-bold text-gray-700">Swami Nirmal Ji</span>
                </div>
                <p className="text-[11px] font-bold text-gray-500">Authorized Signatory</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
