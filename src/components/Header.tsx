import { useState, useEffect } from 'react';
import { Menu, X, Heart, PhoneCall, Sparkles } from 'lucide-react';
import { useImageContext } from '../context/ImageContext';
import { useYouTubeContext } from '../context/YouTubeContext';
import { SingleImageUploader } from './ImageUploader';

interface HeaderProps {
  activePage: 'home' | 'saral-dhyan-page' | 'baglamukhi-havan' | 'certificates';
  onNavigateToPage: (
    page: 'home' | 'saral-dhyan-page' | 'baglamukhi-havan' | 'certificates',
    sectionId?: string
  ) => void;
  onOpenDonate: () => void;
  onOpenContact: () => void;
}

export default function Header({
  activePage,
  onNavigateToPage,
  onOpenDonate,
  onOpenContact,
}: HeaderProps) {
  const { images, getImageUrl } = useImageContext();
  const { showYouTubeSection } = useYouTubeContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // 1. Set up the Translate element initialization callback
    (window as any).googleTranslateElementInit = () => {
      const el = document.getElementById('google_translate_element');
      if (el && el.children.length === 0) {
        try {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'hi',
              includedLanguages: 'hi,en,mr,bn,gu,ta,te,kn,ml,pa,or,ur,es,fr,de,zh-CN,ja,ru',
              autoDisplay: false,
            },
            'google_translate_element'
          );
        } catch (e) {
          console.error('Google Translate init failed:', e);
        }
      }
    };

    // 2. Load the Google Translate script dynamically if not present
    const scriptId = 'google-translate-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else {
      // If script is already loaded, try to initialize it
      if ((window as any).google && (window as any).google.translate) {
        try {
          (window as any).googleTranslateElementInit();
        } catch (e) {
          console.error('Google Translate script already existed but failed to init:', e);
        }
      }
    }

    // 3. Keep checking if the widget is empty, and if so, re-initialize it.
    // This is crucial because React re-renders or page route updates can wipe out the element,
    // and Google Translate doesn't automatically re-populate it unless re-instantiated.
    const interval = setInterval(() => {
      const el = document.getElementById('google_translate_element');
      if (el && el.children.length === 0) {
        if ((window as any).google && (window as any).google.translate && (window as any).google.translate.TranslateElement) {
          try {
            new (window as any).google.translate.TranslateElement(
              {
                pageLanguage: 'hi',
                includedLanguages: 'hi,en,mr,bn,gu,ta,te,kn,ml,pa,or,ur,es,fr,de,zh-CN,ja,ru',
                autoDisplay: false,
              },
              'google_translate_element'
            );
          } catch (e) {
            // Quietly catch errors
          }
        }
      }
    }, 1200);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { name: 'मुखपृष्ठ', key: 'home', href: '#hero' },
    { name: 'हमारे विषय में', key: 'about', href: '#about' },
    { name: 'गुरु परिचय', key: 'guru', href: '#guru' },
    { name: 'सरल ध्यान योग', pageKey: 'saral-dhyan-page' as const, isDedicatedPage: true },
    { name: 'माँ बगलामुखी विशेष हवन', pageKey: 'baglamukhi-havan' as const, isDedicatedPage: true },
    { name: 'प्रमाणपत्र व पंजीकरण', pageKey: 'certificates' as const, isDedicatedPage: true },
    { name: 'वैश्विक कार्य (सेवा)', key: 'seva', href: '#seva' },
    { name: 'कार्यक्रम (शिविर)', key: 'programs', href: '#programs' },
    ...(showYouTubeSection ? [{ name: 'वीडियो (YouTube)', key: 'videos', href: '#videos' }] : []),
    { name: 'आगामी प्रोजेक्ट', key: 'future-projects', href: '#future-projects' },
    { name: 'डिजिटल कार्ड', key: 'id-card', href: '#id-card' },
    { name: 'साधक अनुभव', key: 'testimonials', href: '#testimonials' },
    { name: 'संपर्क', key: 'contact', href: '#contact' },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    setMobileMenuOpen(false);
    if (link.isDedicatedPage && link.pageKey) {
      onNavigateToPage(link.pageKey);
    } else if (link.href) {
      onNavigateToPage('home', link.href.replace('#', ''));
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 bg-coffee-950/90 backdrop-blur-xl border-b border-gold-500/30 ${
        isScrolled
          ? 'shadow-[0_8px_30px_rgba(0,0,0,0.9)] py-1.5'
          : 'shadow-[0_4px_20px_rgba(0,0,0,0.7)] py-2 sm:py-2.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-1 sm:gap-4">
          {/* Logo & Branding in Hindi */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <SingleImageUploader imageKey="headerLogo" label="लोगो बदलें" badgePosition="bottom-right">
              <div className="w-[34px] h-[34px] min-[360px]:w-[38px] min-[360px]:h-[38px] sm:w-[52px] sm:h-[52px] md:w-[58px] md:h-[58px] rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-saffron-400 p-0.5 shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform duration-300 shrink-0">
                <div className="w-full h-full rounded-full bg-coffee-950 overflow-hidden border-2 border-gold-500 flex items-center justify-center">
                  <img
                    src={getImageUrl('headerLogo')}
                    alt="Babaji Logo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </SingleImageUploader>

            <a href="#hero" className="flex flex-col justify-center shrink-0">
              <span className="font-serif whitespace-nowrap text-[10.5px] min-[360px]:text-[12px] min-[400px]:text-[13.5px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-bold text-gold-100 leading-tight tracking-tight sm:tracking-wide antialiased">
                सद्गुरु महावतार बाबाजी
              </span>
              <span className="font-serif whitespace-nowrap text-[8.5px] min-[360px]:text-[9.5px] min-[400px]:text-[10.5px] sm:text-[12px] md:text-[13px] font-medium text-saffron-300 tracking-normal sm:tracking-wider leading-none mt-0.5 antialiased">
                सरल ध्यान योग पीठ
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-5">
            {navLinks.map((link, idx) => {
              const isActive = link.isDedicatedPage && activePage === link.pageKey;
              return (
                <button
                  key={idx}
                  onClick={() => handleNavClick(link)}
                  className={`font-medium text-xs xl:text-sm tracking-wide transition-all duration-200 relative group py-1 cursor-pointer flex items-center gap-1 ${
                    isActive
                      ? 'text-saffron-400 font-bold'
                      : 'text-gold-100/90 hover:text-gold-400'
                  }`}
                >
                  {link.isDedicatedPage && (
                    <Sparkles size={12} className="text-saffron-400 animate-pulse" />
                  )}
                  <span>{link.name}</span>
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-gold-500 to-saffron-400 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons & Mobile Menu Toggle */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0 my-auto">
            {/* Custom Google Translate Widget Wrapper */}
            <div className="relative flex items-center bg-coffee-950/80 rounded-full border border-gold-500/30 px-1 py-0.5 shadow-md max-w-[75px] sm:max-w-none overflow-hidden shrink-1">
              <div id="google_translate_element" className="google-translate-dropdown" />
            </div>

            <button
              onClick={onOpenDonate}
              className="px-2 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-saffron-500 via-gold-500 to-gold-400 text-coffee-50 font-bold text-[10px] sm:text-sm shadow-[0_0_12px_rgba(255,153,51,0.4)] hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] hover:scale-105 transition-all flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Heart size={12} className="fill-coffee-950 shrink-0" />
              <span>दान</span>
            </button>

            <button
              onClick={onOpenContact}
              className="hidden sm:flex px-3.5 py-1.5 sm:py-2 rounded-full bg-transparent border border-gold-500 text-gold-400 hover:bg-gold-500/10 font-bold text-xs sm:text-sm transition-all items-center gap-1.5 cursor-pointer shrink-0"
            >
              <PhoneCall size={14} />
              <span>संपर्क</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 sm:p-2 text-gold-300 hover:text-white focus:outline-none lg:hidden shrink-0 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-coffee-950/98 border-b border-gold-500/30 px-4 pt-3 pb-5 mt-2 shadow-2xl backdrop-blur-2xl animate-fadeIn">
          <div className="flex flex-col gap-2.5">
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => handleNavClick(link)}
                className="text-gold-100 hover:text-gold-400 font-medium text-sm py-1.5 border-b border-gold-500/10 flex items-center justify-between text-left cursor-pointer"
              >
                <span className={link.isDedicatedPage ? 'text-saffron-300 font-bold' : ''}>
                  {link.name}
                </span>
                <Sparkles size={13} className="text-gold-500/50" />
              </button>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDonate();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-saffron-500 to-gold-400 text-coffee-50 font-bold text-xs text-center flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Heart size={16} className="fill-coffee-950" />
                <span>पावन दान (Donate)</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full py-2.5 rounded-xl bg-transparent border border-gold-500 text-gold-400 font-bold text-xs text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall size={16} />
                <span>संपर्क करें (Contact Us)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Translate CSS Overrides */}
      <style>{`
        /* Hide Google Translate top banner bar */
        iframe.skiptranslate, .skiptranslate iframe, .goog-te-banner-frame, #goog-gt-tt {
          display: none !important;
          visibility: hidden !important;
        }
        body {
          top: 0px !important;
        }
        /* Custom styles for google translate element inside header */
        .google-translate-dropdown {
          display: inline-flex !important;
          align-items: center !important;
        }
        .google-translate-dropdown .goog-te-gadget {
          font-family: inherit !important;
          font-size: 0 !important;
          color: transparent !important;
          line-height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
        }
        /* Hide the Google logo and extra labels */
        .google-translate-dropdown .goog-logo-link,
        .google-translate-dropdown .goog-logo-link:link,
        .google-translate-dropdown .goog-logo-link:visited,
        .google-translate-dropdown .goog-logo-link:hover,
        .google-translate-dropdown .goog-logo-link:active,
        .google-translate-dropdown .goog-te-gadget span {
          display: none !important;
          font-size: 0 !important;
          color: transparent !important;
        }
        /* Style the select dropdown combo box */
        .google-translate-dropdown select.goog-te-combo {
          background-color: #fdfaf7 !important; /* bg-coffee-950 */
          color: #291b10 !important; /* dark brown */
          border: 1px solid rgba(212, 175, 55, 0.4) !important;
          border-radius: 9999px !important;
          padding: 3px 24px 3px 8px !important; /* spacing for custom arrow */
          font-size: 11px !important;
          font-weight: 600 !important;
          outline: none !important;
          cursor: pointer !important;
          height: 26px !important;
          line-height: normal !important;
          transition: all 0.2s ease-in-out !important;
          font-family: inherit !important;
          appearance: none !important; /* hide default arrow */
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23ffd700' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>") !important;
          background-repeat: no-repeat !important;
          background-position: right 8px center !important;
        }
        .google-translate-dropdown select.goog-te-combo:hover {
          background-color: rgba(212, 175, 55, 0.15) !important;
          border-color: #ffd700 !important;
        }
        /* Style fallback for translation text inside widgets */
        font {
          background-color: transparent !important;
          box-shadow: none !important;
        }
      `}</style>
    </header>
  );
}
