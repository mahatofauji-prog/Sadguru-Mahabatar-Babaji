import React, { useState } from 'react';
import { Award, ShieldCheck, Sparkles, Download, CheckCircle2, QrCode, UserCheck, ArrowRight, Search } from 'lucide-react';
import { MembershipRegistrationModal } from './MembershipRegistrationModal';

interface MembershipSectionProps {
  onOpenRegister?: () => void;
  onOpenSearch?: () => void;
}

export const MembershipSection: React.FC<MembershipSectionProps> = ({ onOpenRegister, onOpenSearch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialMode, setInitialMode] = useState<'register' | 'search'>('register');

  const openRegister = () => {
    if (onOpenRegister) {
      onOpenRegister();
    } else {
      setInitialMode('register');
      setIsModalOpen(true);
    }
  };

  const openSearch = () => {
    if (onOpenSearch) {
      onOpenSearch();
    } else {
      setInitialMode('search');
      setIsModalOpen(true);
    }
  };

  return (
    <section id="id-card" className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-coffee-950 via-coffee-900 to-coffee-950 border-y border-gold-500/30">
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500 via-transparent to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-coffee-900 via-coffee-950 to-coffee-900 border-2 border-gold-500/50 rounded-3xl p-6 sm:p-10 shadow-[0_15px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/40 text-saffron-300 text-xs font-bold font-serif shadow-sm">
                <Sparkles size={14} className="text-gold-400" />
                <span>NGO Membership Management System</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-300 to-saffron-200 font-serif leading-tight">
                Become a Member
              </h2>
              
              <p className="text-sm sm:text-base text-gold-200/80 leading-relaxed font-sans">
                Join our spiritual and social welfare mission officially. Register to become a verified member of Saral Dhyan Yog Peeth and receive your Official Membership Certificate and Digital ID Card.
              </p>

              {/* Feature Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-sans text-xs sm:text-sm">
                <div className="flex items-center gap-2.5 bg-coffee-950/70 border border-gold-500/30 p-2.5 rounded-xl">
                  <CheckCircle2 size={18} className="text-saffron-400 shrink-0" />
                  <span className="text-gold-100 font-medium">Official Membership Certificate</span>
                </div>
                <div className="flex items-center gap-2.5 bg-coffee-950/70 border border-gold-500/30 p-2.5 rounded-xl">
                  <ShieldCheck size={18} className="text-saffron-400 shrink-0" />
                  <span className="text-gold-100 font-medium">Digital Identity Card</span>
                </div>
                <div className="flex items-center gap-2.5 bg-coffee-950/70 border border-gold-500/30 p-2.5 rounded-xl">
                  <Download size={18} className="text-saffron-400 shrink-0" />
                  <span className="text-gold-100 font-medium">Download PDF & PNG Formats</span>
                </div>
                <div className="flex items-center gap-2.5 bg-coffee-950/70 border border-gold-500/30 p-2.5 rounded-xl">
                  <QrCode size={18} className="text-saffron-400 shrink-0" />
                  <span className="text-gold-100 font-medium">QR Code Verification</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={openRegister}
                  className="px-6 py-3.5 bg-gradient-to-r from-gold-600 via-gold-500 to-saffron-500 hover:brightness-110 text-coffee-50 font-extrabold rounded-2xl text-sm sm:text-base shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center gap-2 transition cursor-pointer"
                >
                  <Sparkles size={18} />
                  <span>Apply for Membership</span>
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={openSearch}
                  className="px-5 py-3.5 bg-coffee-950 hover:bg-coffee-900 text-gold-200 border border-gold-500/40 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer shadow-md"
                >
                  <Search size={16} className="text-gold-400" />
                  <span>Check Application Status</span>
                </button>
              </div>
            </div>

            {/* Right Card Graphic Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group cursor-pointer w-full" onClick={openRegister}>
                <div className="w-[300px] h-[212px] mx-auto rounded-xl bg-[#fffdf5] border-[6px] border-double border-saffron-600/60 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col items-center justify-between relative overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-300">
                  
                  {/* Outer ornaments */}
                  <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-saffron-500"></div>
                  <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-saffron-500"></div>
                  <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-saffron-500"></div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-saffron-500"></div>

                  <div className="text-center w-full">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      Official Membership Certificate
                    </h4>
                    <h3 className="text-lg font-serif font-extrabold text-saffron-700 uppercase mt-1">
                      सरल ध्यान योग पीठ
                    </h3>
                  </div>

                  <div className="flex gap-4 w-full px-2 items-center">
                    <div className="w-16 h-20 bg-gray-200 border-2 border-white shadow-md overflow-hidden">
                       <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-500">This certifies that</p>
                      <p className="text-sm font-serif font-bold text-gray-900 border-b border-gray-300 pb-1 w-full truncate">
                        SWAMI YOGANAND
                      </p>
                      <p className="text-[8px] mt-1 text-gray-500 font-mono">ID: MEM-2026-000001</p>
                    </div>
                  </div>

                  <div className="w-full flex justify-between px-2 items-end">
                    <div className="bg-white p-1 border border-gray-200">
                       <QrCode size={24} className="text-black" />
                    </div>
                    <div className="w-10 h-10 border-2 border-dashed border-saffron-300 rounded-full flex items-center justify-center opacity-60">
                      <span className="text-[6px] font-bold text-saffron-600 uppercase">Seal</span>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-coffee-950/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                    <span className="px-4 py-2 bg-gradient-to-r from-gold-500 to-saffron-500 text-coffee-50 font-bold rounded-xl text-xs shadow-lg">
                      Apply Now
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {!onOpenRegister && (
        <MembershipRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialMode={initialMode}
        />
      )}
    </section>
  );
};
