import { useState, useEffect } from 'react';
import ParticleBackground from './components/ParticleBackground';
import TopBar from './components/TopBar';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import GuruSection from './components/GuruSection';
import GlobalVision from './components/GlobalVision';
import SaralDhyanYog from './components/SaralDhyanYog';
import SaralDhyanYogPage from './components/SaralDhyanYogPage';
import MaaBaglamukhiHavanPage from './components/MaaBaglamukhiHavanPage';
import GlobalSeva from './components/GlobalSeva';
import { DonationSection } from './components/DonationSection';
import Programs from './components/Programs';
import FutureProjects from './components/FutureProjects';
import Testimonials from './components/Testimonials';
import ConnectSection from './components/ConnectSection';
import Footer from './components/Footer';
import DonationModal from './components/DonationModal';
import ContactModal from './components/ContactModal';
import AdminPortalModal from './components/AdminPortalModal';
import { ImageProvider } from './context/ImageContext';
import { SiteContentProvider } from './context/SiteContentContext';
import { YouTubeProvider } from './context/YouTubeContext';
import { MembershipProvider } from './context/MembershipContext';
import { DonationProvider } from './context/DonationContext';
import { YouTubeSection } from './components/YouTubeSection';
import { MembershipSection } from './components/MembershipSection';
import { FloatingImageManager } from './components/ImageUploader';
import { DonationPurpose } from './types/donation';
import { MembershipRegistrationModal } from './components/MembershipRegistrationModal';
import CertificatesRegistrationsPage from './components/CertificatesRegistrationsPage';

export default function App() {
  const [activePage, setActivePage] = useState<
    'home' | 'saral-dhyan-page' | 'baglamukhi-havan' | 'certificates'
  >('home');
  const [donateOpen, setDonateOpen] = useState(false);
  const [selectedDonationPurpose, setSelectedDonationPurpose] = useState<DonationPurpose | undefined>(undefined);
  const [contactOpen, setContactOpen] = useState(false);
  const [adminPortalOpen, setAdminPortalOpen] = useState(false);
  const [membershipOpen, setMembershipOpen] = useState(false);
  const [membershipMode, setMembershipMode] = useState<'register' | 'search'>('register');

  const handleOpenDonate = (purpose?: DonationPurpose) => {
    setSelectedDonationPurpose(purpose);
    setDonateOpen(true);
  };

  const handleOpenMembership = (mode: 'register' | 'search' = 'register') => {
    setMembershipMode(mode);
    setMembershipOpen(true);
  };

  const handleNavigateToPage = (
    page: 'home' | 'saral-dhyan-page' | 'baglamukhi-havan' | 'certificates',
    sectionId?: string
  ) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const newPath = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }

    if (page === 'home' && sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      
      if (path === '/saral-dhyan-page' || hash === '#saral-dhyan-page') {
        setActivePage('saral-dhyan-page');
      } else if (path === '/baglamukhi-havan' || hash === '#baglamukhi-havan') {
        setActivePage('baglamukhi-havan');
      } else if (path === '/certificates' || hash === '#certificates') {
        setActivePage('certificates');
      } else {
        setActivePage('home');
      }
    };
    
    handleLocationChange();

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  return (
    <ImageProvider>
      <SiteContentProvider>
        <YouTubeProvider>
          <MembershipProvider>
            <DonationProvider>
              <div className="min-h-screen font-serif bg-coffee-950 text-gold-100 selection:bg-saffron-500 selection:text-coffee-50 overflow-x-hidden w-full relative">
                {/* Background Divine Particles */}
                <ParticleBackground />

                {/* Sticky Navigation Header */}
                <Header
                  activePage={activePage}
                  onNavigateToPage={handleNavigateToPage}
                  onOpenDonate={() => handleOpenDonate()}
                  onOpenContact={() => setContactOpen(true)}
                />

                {/* Main Content View Switch */}
                {activePage === 'saral-dhyan-page' ? (
                  <SaralDhyanYogPage
                    onBackToHome={() => handleNavigateToPage('home')}
                    onOpenDonate={() => handleOpenDonate()}
                    onOpenContact={() => setContactOpen(true)}
                  />
                ) : activePage === 'baglamukhi-havan' ? (
                  <MaaBaglamukhiHavanPage
                    onBackToHome={() => handleNavigateToPage('home')}
                    onOpenDonate={() => handleOpenDonate()}
                    onOpenContact={() => setContactOpen(true)}
                  />
                ) : activePage === 'certificates' ? (
                  <CertificatesRegistrationsPage
                    onBackToHome={() => handleNavigateToPage('home')}
                    onOpenDonate={() => handleOpenDonate()}
                    onOpenContact={() => setContactOpen(true)}
                  />
                ) : (
                  <main className="relative z-10">
                    {/* Section 1: Hero */}
                    <Hero
                      onOpenDonate={() => handleOpenDonate()}
                      onOpenContact={() => setContactOpen(true)}
                      onOpenMembership={() => handleOpenMembership('register')}
                    />

                    {/* Section 2: About Peeth */}
                    <AboutSection />

                    {/* Section 2.5: Guru Parichay */}
                    <GuruSection />

                    {/* Section 3: Global Vision */}
                    <GlobalVision />

                    {/* Section 4: Saral Dhyan Yog Overview & Benefit Cards */}
                    <SaralDhyanYog
                      onOpenDedicatedPage={() => handleNavigateToPage('saral-dhyan-page')}
                    />

                    {/* Section 5: Global Seva & 4 Initiatives */}
                    <GlobalSeva onOpenDonate={() => handleOpenDonate()} />

                    {/* Section 5.5: Prominent Online Donation Section */}
                    <DonationSection onOpenDonateWithPurpose={handleOpenDonate} />

                    {/* Programs / Events / साधना शिविर */}
                    <Programs />

                    {/* Digital Membership ID Card Section */}
                    <MembershipSection 
                      onOpenRegister={() => handleOpenMembership('register')}
                      onOpenSearch={() => handleOpenMembership('search')}
                    />

                    {/* YouTube Videos Section */}
                    <YouTubeSection />

                    {/* Our Future Projects Marquee Section */}
                    <FutureProjects />

                    {/* Testimonials */}
                    <Testimonials />

                    {/* Section 6: Connect with the Source */}
                    <ConnectSection
                      onOpenDonate={() => handleOpenDonate()}
                      onOpenContact={() => setContactOpen(true)}
                    />
                  </main>
                )}

                {/* Footer */}
                <Footer
                  onOpenDonate={() => handleOpenDonate()}
                  onOpenContact={() => setContactOpen(true)}
                  onOpenAdminPortal={() => setAdminPortalOpen(true)}
                  onNavigateToPage={handleNavigateToPage}
                />

                {/* Interactive Modals */}
                <DonationModal
                  isOpen={donateOpen}
                  onClose={() => setDonateOpen(false)}
                  defaultPurpose={selectedDonationPurpose}
                />

                <ContactModal
                  isOpen={contactOpen}
                  onClose={() => setContactOpen(false)}
                />

                {/* Admin Portal Single Password Locked Modal */}
                <AdminPortalModal
                  isOpen={adminPortalOpen}
                  onClose={() => setAdminPortalOpen(false)}
                />

                {/* Global Membership Registration Modal */}
                <MembershipRegistrationModal
                  isOpen={membershipOpen}
                  onClose={() => setMembershipOpen(false)}
                  initialMode={membershipMode}
                />

                {/* Floating Easy Image Upload Toolbar */}
                <FloatingImageManager />
              </div>
            </DonationProvider>
          </MembershipProvider>
        </YouTubeProvider>
      </SiteContentProvider>
    </ImageProvider>
  );
}
