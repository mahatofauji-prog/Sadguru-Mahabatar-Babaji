import { MapPin, Phone, MessageCircle, Mail, Facebook, Youtube, Instagram } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export default function TopBar() {
  const { content } = useSiteContent();

  return (
    <div className="bg-divine-navy/90 backdrop-blur-md text-gold-200 py-2 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center text-xs tracking-wider border-b border-gold-500/20 relative z-50 gap-2">
      <div className="flex items-center gap-2 mb-1 sm:mb-0 text-center sm:text-left flex-wrap justify-center">
        <MapPin size={14} className="text-gold-400 shrink-0" />
        <span className="font-medium text-gold-100">{content.topBar.address}</span>
      </div>

      <div className="flex items-center gap-3 sm:gap-5 flex-wrap justify-center">
        <a href={`tel:${content.topBar.phone}`} className="flex items-center gap-1.5 hover:text-gold-400 transition-colors">
          <Phone size={13} className="text-gold-400" />
          <span>{content.topBar.phone}</span>
        </a>
        <a 
          href={`https://wa.me/91${content.topBar.whatsapp.replace(/\D/g,'')}`}
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1.5 hover:text-green-400 transition-colors text-green-300"
        >
          <MessageCircle size={13} className="text-green-400" />
          <span>{content.topBar.whatsapp}</span>
        </a>
        <a href={`mailto:${content.topBar.email}`} className="hidden lg:flex items-center gap-1.5 hover:text-gold-400 transition-colors">
          <Mail size={13} className="text-gold-400" />
          <span>{content.topBar.email}</span>
        </a>

        {/* Social Icons */}
        <div className="flex items-center gap-2 pl-2 border-l border-gold-500/30">
          <a
            href="https://www.facebook.com/share/19CFfqRdex/"
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook Page"
            className="w-6 h-6 rounded-full bg-coffee-900 border border-gold-500/30 flex items-center justify-center text-gold-300 hover:text-white hover:bg-blue-600 transition-all cursor-pointer"
          >
            <Facebook size={12} />
          </a>
          <a
            href="https://youtube.com/@dr.nirmalgirimaharaj?si=gWx7yYJGfZ42bGA0"
            target="_blank"
            rel="noopener noreferrer"
            title="YouTube Channel"
            className="w-6 h-6 rounded-full bg-coffee-900 border border-gold-500/30 flex items-center justify-center text-gold-300 hover:text-white hover:bg-red-600 transition-all cursor-pointer"
          >
            <Youtube size={12} />
          </a>
          <a
            href="https://www.instagram.com/mahamandaleshwar_drnnirmalgiri?igsh=MW5mcTBhNGsxZ2Jreg=="
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram Profile"
            className="w-6 h-6 rounded-full bg-coffee-900 border border-gold-500/30 flex items-center justify-center text-gold-300 hover:text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:to-pink-500 transition-all cursor-pointer"
          >
            <Instagram size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
