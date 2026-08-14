import React from 'react';
import { Facebook, Youtube, Instagram, MapPin, Phone, MessageCircle, Mail, Heart, Sparkles, ShieldCheck, Lock } from 'lucide-react';
import { useImageContext } from '../context/ImageContext';
import { useSiteContent } from '../context/SiteContentContext';
import { SingleImageUploader } from './ImageUploader';

interface FooterProps {
  onOpenDonate: () => void;
  onOpenContact: () => void;
  onOpenAdminPortal?: () => void;
  onNavigateToPage?: (
    page: 'home' | 'saral-dhyan-page' | 'baglamukhi-havan' | 'certificates',
    sectionId?: string
  ) => void;
}

export default function Footer({ onOpenDonate, onOpenContact, onOpenAdminPortal, onNavigateToPage }: FooterProps) {
  const { images, getImageUrl } = useImageContext();
  const { content } = useSiteContent();

  const handleLinkClick = (e: React.MouseEvent, page: 'home' | 'saral-dhyan-page' | 'baglamukhi-havan' | 'certificates', sectionId?: string) => {
    if (onNavigateToPage) {
      e.preventDefault();
      onNavigateToPage(page, sectionId);
    }
  };

  return (
    <footer className="bg-divine-navy text-gold-100 pt-20 pb-8 border-t-2 border-gold-500/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-gold-500/20">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <SingleImageUploader imageKey="footerLogo" label="लोगो बदलें" badgePosition="bottom-right">
                <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-gold-500 to-saffron-400 p-0.5 shadow-lg">
                  <img
                    src={getImageUrl('footerLogo')}
                    alt="Logo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full border border-coffee-950"
                  />
                </div>
              </SingleImageUploader>
              <div>
                <h3 className="font-serif text-xl font-bold gold-gradient-text leading-tight">
                  SADGURU MAHAVATAR BABAJI
                </h3>
                <span className="text-xs text-saffron-400 font-semibold block mb-2">
                  SARAL DHYAN YOG PEETH
                </span>
                {/* Hindi Text Addition */}
                <h4 className="font-sans text-lg font-bold text-gold-700 leading-tight">
                  सद्गुरु महावतार बाबाजी
                </h4>
                <span className="text-xs text-saffron-300 font-semibold block">
                  सरल ध्यान योग पीठ
                </span>
              </div>
            </div>

            <p className="text-sm text-gold-800 leading-relaxed font-sans max-w-md">
              The Global Epicenter of Quantum Stillness, Bio-Energetic Shielding, and Kriya Yog under the divine grace of Sadguru Mahavatar Babaji.
            </p>

            <div className="p-4 rounded-xl bg-coffee-950/80 border border-gold-500/20 max-w-md">
              <p className="text-xs text-saffron-300 font-serif">
                "महावतार बाबाजी की कृपा से — सरल ध्यान • शांत जीवन • दिव्य साधना"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/share/19CFfqRdex/"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook Page"
                className="w-10 h-10 rounded-full bg-coffee-900 border border-gold-500/30 flex items-center justify-center text-gold-300 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all shadow-md cursor-pointer"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://youtube.com/@dr.nirmalgirimaharaj?si=gWx7yYJGfZ42bGA0"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube Channel"
                className="w-10 h-10 rounded-full bg-coffee-900 border border-gold-500/30 flex items-center justify-center text-gold-300 hover:text-white hover:bg-red-600 hover:border-red-500 transition-all shadow-md cursor-pointer"
              >
                <Youtube size={18} />
              </a>
              <a
                href="https://www.instagram.com/mahamandaleshwar_drnnirmalgiri?igsh=MW5mcTBhNGsxZ2Jreg=="
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram Profile"
                className="w-10 h-10 rounded-full bg-coffee-900 border border-gold-500/30 flex items-center justify-center text-gold-300 hover:text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:to-pink-500 hover:border-pink-500 transition-all shadow-md cursor-pointer"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-lg font-bold text-gold-500 border-b border-gold-500/30 pb-2 inline-block">
              त्वरित नेविगेशन (Quick Links)
            </h4>
            <ul className="space-y-2 text-sm text-gold-800 font-sans">
              <li><a href="#hero" onClick={(e) => handleLinkClick(e, 'home', 'hero')} className="hover:text-gold-500 transition-colors">• मुखपृष्ठ (Home)</a></li>
              <li><a href="#about" onClick={(e) => handleLinkClick(e, 'home', 'about')} className="hover:text-gold-500 transition-colors">• हमारे विषय में (About Us)</a></li>
              <li><a href="#vision" onClick={(e) => handleLinkClick(e, 'home', 'vision')} className="hover:text-gold-500 transition-colors">• वैश्विक दृष्टि (Global Vision)</a></li>
              <li><a href="/saral-dhyan-page" onClick={(e) => handleLinkClick(e, 'saral-dhyan-page')} className="hover:text-gold-500 transition-colors">• सरल ध्यान योग (Meditation)</a></li>
              <li><a href="#seva" onClick={(e) => handleLinkClick(e, 'home', 'seva')} className="hover:text-gold-500 transition-colors">• वैश्विक कार्य (Global Seva)</a></li>
              <li><a href="/baglamukhi-havan" onClick={(e) => handleLinkClick(e, 'baglamukhi-havan')} className="hover:text-gold-500 transition-colors font-semibold text-saffron-300 hover:text-saffron-200">• माँ बगलामुखी हवन (Baglamukhi Havan)</a></li>
              <li><a href="#certificates" onClick={(e) => handleLinkClick(e, 'certificates')} className="hover:text-gold-500 transition-colors font-semibold text-saffron-300 hover:text-saffron-200">• प्रमाणपत्र व पंजीकरण (Certificates)</a></li>
              <li><a href="#future-projects" onClick={(e) => handleLinkClick(e, 'home', 'future-projects')} className="hover:text-gold-500 transition-colors">• आगामी प्रोजेक्ट (Future Projects)</a></li>
              <li><a href="#testimonials" onClick={(e) => handleLinkClick(e, 'home', 'testimonials')} className="hover:text-gold-500 transition-colors">• साधक अनुभव (Testimonials)</a></li>
              <li><a href="#contact" onClick={(e) => handleLinkClick(e, 'home', 'contact')} className="hover:text-gold-500 transition-colors">• संपर्क (Connect)</a></li>
            </ul>
          </div>

          {/* Contact Details & Donate Action */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-serif text-lg font-bold text-gold-500 border-b border-gold-500/30 pb-2 inline-block">
              संपर्क जानकारी (Contact Info)
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-gold-800 font-sans">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gold-500 shrink-0 mt-0.5" />
                <span>{content.contact.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gold-500 shrink-0" />
                <a href={`tel:${content.contact.phone1}`} className="hover:text-gold-500 font-bold">{content.contact.phone1}</a>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle size={18} className="text-green-400 shrink-0" />
                <a href={`https://wa.me/91${content.contact.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="text-green-300 hover:text-green-200 font-bold">
                  {content.contact.whatsapp}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gold-500 shrink-0" />
                <a href={`mailto:${content.contact.email}`} className="hover:text-gold-500">{content.contact.email}</a>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={onOpenDonate}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-saffron-500 to-gold-400 text-coffee-50 font-bold text-sm tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart size={16} className="fill-coffee-950" />
                <span>पावन दान व सेवा सहयोग</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Admin Portal Password Lock Trigger */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gold-200/60 font-sans gap-4">
          <p>© {new Date().getFullYear()} Sadguru Mahavatar Babaji Saral Dhyan Yog Peeth. All Rights Reserved.</p>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1 text-saffron-400/80">
              <Sparkles size={14} />
              <span>Dedicated to Global Peace & Awakening</span>
            </div>

            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdminPortal}
              className="px-3 py-1.5 rounded-lg bg-coffee-900 border border-gold-500/30 text-gold-300 hover:text-white hover:border-gold-400 transition-all flex items-center gap-1.5 font-semibold text-xs shadow-md cursor-pointer"
              title="प्रशासनिक पोर्टल (Admin Login)"
            >
              <Lock size={13} className="text-gold-400" />
              <span>प्रशासनिक पोर्टल (Admin)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
