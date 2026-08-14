import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Lock, KeyRound, Image as ImageIcon, Edit3, X, Save, RotateCcw, Check, Upload, Trash2, LogOut, Eye, EyeOff, Layers, FileText, Youtube, Award, Heart } from 'lucide-react';
import { useImageContext, IMAGE_REGISTRY, ImageRegistryMeta, SingleImageKey } from '../context/ImageContext';
import { useSiteContent, SiteContentState } from '../context/SiteContentContext';
import AdminYouTubeManager from './AdminYouTubeManager';
import { AdminMembershipManager } from './AdminMembershipManager';
import { AdminDonationManager } from './AdminDonationManager';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PASSWORD_KEY = 'peeth_admin_password_v1';
const DEFAULT_PASSWORD = 'admin123';

export default function AdminPortalModal({ isOpen, onClose }: AdminPortalModalProps) {
  const {
    images,
    updateSingleImage,
    clearSingleImage,
    addGalleryImages,
    removeGalleryImage,
    clearAllGalleryImages,
    clearDefaultGalleryImages,
    resetAllImages,
    showOverlayControls,
    setShowOverlayControls,
    getImageUrl
  } = useImageContext();

  const { content, updateContent, resetAllContent } = useSiteContent();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);

  // Active Tab inside Admin Portal
  const [activeTab, setActiveTab] = useState<'donations' | 'content' | 'images' | 'videos' | 'cards' | 'security'>('donations');

  // Form State for Editable Content
  const [formData, setFormData] = useState<SiteContentState>(content);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Security Tab state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMessage, setSecurityMessage] = useState({ type: '', text: '' });

  // Gallery Upload state in Admin Modal
  const [galleryCategory, setGalleryCategory] = useState<'babaji' | 'dhyan' | 'seva'>('dhyan');
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Single Image File Inputs
  const singleInputsRef = useRef<Record<string, HTMLInputElement | null>>({});

  // Image Management System State
  const [selectedImageCategory, setSelectedImageCategory] = useState<string>('all');
  const [imageSearchQuery, setImageSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [visibleImageCount, setVisibleImageCount] = useState<number>(12);
  const [deleteConfirmKey, setDeleteConfirmKey] = useState<any | null>(null);
  const [deleteGalleryConfirmId, setDeleteGalleryConfirmId] = useState<string | null>(null);
  const [uploadingKeys, setUploadingKeys] = useState<Record<string, boolean>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [imageToastMsg, setImageToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(imageSearchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [imageSearchQuery]);

  React.useEffect(() => {
    setVisibleImageCount(12);
  }, [selectedImageCategory, debouncedSearchQuery]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setImageToastMsg({ type, text });
    setTimeout(() => setImageToastMsg(null), 3500);
  };

  const getStoredPassword = (): string => {
    try {
      const saved = localStorage.getItem(PASSWORD_KEY);
      return saved || DEFAULT_PASSWORD;
    } catch {
      return DEFAULT_PASSWORD;
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPass = getStoredPassword();
    if (passwordInput === currentPass) {
      setIsAuthenticated(true);
      setAuthError('');
      setFormData(content); // load latest content
    } else {
      setAuthError('गलत पासवर्ड! कृपया पुनः प्रयास करें। (डिफ़ॉल्ट पासवर्ड: admin123)');
    }
  };

  const handleSaveContent = () => {
    updateContent(formData);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleResetContent = () => {
    if (window.confirm('क्या आप वेबसाइट की सभी सामग्री को डिफ़ॉल्ट पर रीसेट करना चाहते हैं?')) {
      resetAllContent();
      resetAllImages();
      setTimeout(() => {
        setFormData(content);
        alert('वेबसाइट सामग्री डिफ़ॉल्ट स्थिति में रीसेट हो गई है!');
      }, 100);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      setSecurityMessage({ type: 'error', text: 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए!' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecurityMessage({ type: 'error', text: 'दोनों पासवर्ड मेल नहीं खाते!' });
      return;
    }

    try {
      localStorage.setItem(PASSWORD_KEY, newPassword);
      setSecurityMessage({ type: 'success', text: 'पासवर्ड सफलता पूर्वक बदल दिया गया है!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      console.error(e);
      setSecurityMessage({ type: 'error', text: 'पासवर्ड सेव नहीं हो सका।' });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    setAuthError('');
    onClose();
  };

  const handleSingleImageChange = async (key: any, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type.toLowerCase())) {
        showToast('अमान्य फ़ाइल प्रारूप! केवल JPG, PNG या WEBP ही समर्थित हैं।', 'error');
        if (e.target) e.target.value = '';
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        showToast('फ़ाइल का आकार बहुत बड़ा है! अधिकतम 15MB तक की फ़ोटो चुनें।', 'error');
        if (e.target) e.target.value = '';
        return;
      }

      setUploadingKeys((prev) => ({ ...prev, [key]: true }));
      setUploadProgress((prev) => ({ ...prev, [key]: 10 }));

      try {
        await updateSingleImage(key, file, (pct) => {
          setUploadProgress((prev) => ({ ...prev, [key]: pct }));
        });
        showToast('✓ फोटो सफलतापूर्वक अपलोड एवं अपडेट हो गई!', 'success');
      } catch (err: any) {
        console.error('Image upload failed:', err);
        showToast(err.message || 'फोटो अपलोड करने में विफलता आई।', 'error');
      } finally {
        setUploadingKeys((prev) => ({ ...prev, [key]: false }));
        setUploadProgress((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        if (e.target) e.target.value = '';
      }
    }
  };

  const handleSingleImageDelete = async (key: any) => {
    try {
      await clearSingleImage(key);
      showToast('फोटो सफलतापूर्वक हटाई गई एवं डिफ़ॉल्ट पर रीसेट हो गई!', 'success');
      setDeleteConfirmKey(null);
    } catch (err: any) {
      console.error('Delete image failed:', err);
      showToast('फोटो हटाने में समस्या आई।', 'error');
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploadingGallery(true);
      try {
        await addGalleryImages(files, galleryCategory);
        alert(`सफलतापूर्वक ${files.length} नई तस्वीरें गैलरी में अपलोड होकर सुरक्षित (Save) हो गईं!`);
      } catch (err) {
        console.error('Gallery upload error:', err);
        alert('तस्वीर अपलोड करने में त्रुटि आई। कृपया पुनः प्रयास करें।');
      } finally {
        setIsUploadingGallery(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-coffee-950 border-2 border-gold-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] md:max-h-[90vh] flex flex-col"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-coffee-900 via-divine-navy to-coffee-900 px-6 py-4 border-b border-gold-500/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-400 flex items-center justify-center text-gold-300">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gold-100 font-serif">प्रशासनिक पोर्टल (Admin Control Panel)</h3>
                <p className="text-xs text-gold-300/80">सरल ध्यान योग पीठ - वेबसाइट प्रबंधन</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-gold-300 hover:text-white hover:bg-coffee-900 border border-gold-500/20 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {!isAuthenticated ? (
            /* Login Lock Form */
            <div className="p-8 sm:p-12 text-center max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-coffee-900/90 border-2 border-gold-400 flex items-center justify-center text-gold-400 mx-auto mb-6 shadow-lg shadow-gold-500/10">
                <Lock size={36} />
              </div>

              <h4 className="text-xl font-bold text-gold-100 font-serif mb-2">सुरक्षित लॉगिन (Password Lock)</h4>
              <p className="text-xs text-gold-300/80 mb-6">
                वेबसाइट की तस्वीरें व टेक्स्ट सामग्री बदलने के लिए कृपया एडमिन पासवर्ड दर्ज करें।
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <input
                    type={showPasswordText ? 'text' : 'password'}
                    placeholder="एडमिन पासवर्ड दर्ज करें..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-3.5 pr-12 rounded-xl bg-coffee-900/90 border border-gold-500/40 text-gold-100 placeholder-gold-300/50 focus:outline-none focus:border-gold-400 text-sm"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="absolute right-3 top-3.5 text-gold-400 hover:text-gold-200"
                  >
                    {showPasswordText ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {authError && (
                  <p className="text-xs text-red-400 bg-red-950/60 p-2.5 rounded-lg border border-red-500/30">
                    {authError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-saffron-600 via-saffron-500 to-gold-600 text-coffee-50 font-bold text-sm shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <KeyRound size={18} />
                  <span>प्रवेश करें (Login)</span>
                </button>

                <p className="text-[11px] text-gold-300/50 pt-2">
                  (डिफ़ॉल्ट पासवर्ड: <span className="text-gold-300 font-mono font-bold">admin123</span>)
                </p>
              </form>
            </div>
          ) : (
            /* Authenticated Admin Dashboard */
            <div className="p-4 sm:p-6 flex flex-col flex-grow overflow-hidden min-h-0">
              {/* Navigation Tabs */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-gold-500/20 pb-4 mb-6 shrink-0">
                <div className="flex items-center gap-2 bg-coffee-900/80 p-1.5 rounded-xl border border-gold-500/30 overflow-x-auto w-full lg:w-auto scrollbar-thin">
                  <button
                    onClick={() => setActiveTab('donations')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                      activeTab === 'donations'
                        ? 'bg-gradient-to-r from-saffron-500 to-gold-500 text-coffee-50 shadow-md font-extrabold'
                        : 'text-gold-300 hover:text-gold-100'
                    }`}
                  >
                    <Heart size={15} className="fill-current" />
                    <span>दान प्रबंधन (Donations)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('content')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                      activeTab === 'content'
                        ? 'bg-gradient-to-r from-saffron-500 to-gold-500 text-coffee-50 shadow-md'
                        : 'text-gold-300 hover:text-gold-100'
                    }`}
                  >
                    <FileText size={15} />
                    <span>टेक्स्ट सामग्री (Text Editing)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('images')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                      activeTab === 'images'
                        ? 'bg-gradient-to-r from-saffron-500 to-gold-500 text-coffee-50 shadow-md'
                        : 'text-gold-300 hover:text-gold-100'
                    }`}
                  >
                    <ImageIcon size={15} />
                    <span>फोटो प्रबंधन (Images)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('videos')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                      activeTab === 'videos'
                        ? 'bg-gradient-to-r from-saffron-500 to-gold-500 text-coffee-50 shadow-md'
                        : 'text-gold-300 hover:text-gold-100'
                    }`}
                  >
                    <Youtube size={15} />
                    <span>YouTube वीडियो (Videos)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('cards')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                      activeTab === 'cards'
                        ? 'bg-gradient-to-r from-saffron-500 to-gold-500 text-coffee-50 shadow-md'
                        : 'text-gold-300 hover:text-gold-100'
                    }`}
                  >
                    <Award size={15} />
                    <span>सदस्यता कार्ड (ID Cards)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('security')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                      activeTab === 'security'
                        ? 'bg-gradient-to-r from-saffron-500 to-gold-500 text-coffee-50 shadow-md'
                        : 'text-gold-300 hover:text-gold-100'
                    }`}
                  >
                    <Lock size={15} />
                    <span>पासवर्ड (Security)</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end lg:self-auto">
                  <button
                    onClick={handleLogout}
                    className="px-3.5 py-2 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-600 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <LogOut size={14} />
                    <span>लॉगआउट</span>
                  </button>
                </div>
              </div>

              {/* Scrollable Tab Content Container */}
              <div className="flex-grow overflow-y-auto pr-1 min-h-0 space-y-6 scrollbar-thin scrollbar-thumb-gold-500/20">
                {/* TAB 1: TEXT CONTENT EDITING */}
                {activeTab === 'content' && (
                  <div className="space-y-6">
                  <div className="flex items-center justify-between bg-coffee-900/60 p-4 rounded-2xl border border-gold-500/30">
                    <div>
                      <h4 className="font-bold text-gold-200 text-sm">वेबसाइट सामग्री संपादक</h4>
                      <p className="text-xs text-gold-300/70">
                        नीचे किसी भी सेक्शन का टेक्स्ट बदलें और 'बदलाव सुरक्षित करें' बटन दबाएं।
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleResetContent}
                        className="px-3 py-2 rounded-xl bg-coffee-900 border border-gold-500/30 text-gold-300 hover:text-white text-xs font-semibold flex items-center gap-1"
                      >
                        <RotateCcw size={13} />
                        <span>रीसेट (Reset All)</span>
                      </button>

                      <button
                        onClick={handleSaveContent}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-saffron-500 to-gold-500 text-coffee-50 font-bold text-xs shadow-lg hover:brightness-110 flex items-center gap-1.5"
                      >
                        <Save size={15} />
                        <span>बदलाव सुरक्षित करें</span>
                      </button>
                    </div>
                  </div>

                  {isSavedNotice && (
                    <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                      <Check size={16} />
                      <span>वेबसाइट की सामग्री सफलता पूर्वक सुरक्षित हो गई है! पूरे होमपेज पर तुरंत अपडेट दिख रहा है।</span>
                    </div>
                  )}

                  {/* Section 1: TopBar & Contact Info */}
                  <div className="p-5 rounded-2xl bg-coffee-900/40 border border-gold-500/20 space-y-3">
                    <h5 className="text-sm font-bold text-gold-300 border-b border-gold-500/20 pb-2">
                      📞 संपर्क एवं टॉप बार (Contact & TopBar)
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-gold-200/80 mb-1">फ़ोन नंबर (Phone 1)</label>
                        <input
                          type="text"
                          value={formData.contact.phone1}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contact: { ...formData.contact, phone1: e.target.value },
                              topBar: { ...formData.topBar, phone: e.target.value }
                            })
                          }
                          className="w-full p-2.5 rounded-lg bg-coffee-950 border border-gold-500/30 text-gold-100"
                        />
                      </div>

                      <div>
                        <label className="block text-gold-200/80 mb-1">व्हाट्सएप नंबर (WhatsApp)</label>
                        <input
                          type="text"
                          value={formData.contact.whatsapp}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contact: { ...formData.contact, whatsapp: e.target.value },
                              topBar: { ...formData.topBar, whatsapp: e.target.value }
                            })
                          }
                          className="w-full p-2.5 rounded-lg bg-coffee-950 border border-gold-500/30 text-gold-100"
                        />
                      </div>

                      <div>
                        <label className="block text-gold-200/80 mb-1">ईमेल (Email)</label>
                        <input
                          type="text"
                          value={formData.contact.email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contact: { ...formData.contact, email: e.target.value },
                              topBar: { ...formData.topBar, email: e.target.value }
                            })
                          }
                          className="w-full p-2.5 rounded-lg bg-coffee-950 border border-gold-500/30 text-gold-100"
                        />
                      </div>

                      <div>
                        <label className="block text-gold-200/80 mb-1">धाम का पता (Address)</label>
                        <input
                          type="text"
                          value={formData.topBar.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              topBar: { ...formData.topBar, address: e.target.value },
                              contact: { ...formData.contact, address: e.target.value }
                            })
                          }
                          className="w-full p-2.5 rounded-lg bg-coffee-950 border border-gold-500/30 text-gold-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Hero Section */}
                  <div className="p-5 rounded-2xl bg-coffee-900/40 border border-gold-500/20 space-y-3">
                    <h5 className="text-sm font-bold text-gold-300 border-b border-gold-500/20 pb-2">
                      🪷 मुख्य होमपेज संदेश (Hero Header Section)
                    </h5>
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-gold-200/80 mb-1">ऊपरी बैज संदेश (Top Badge Text)</label>
                        <input
                          type="text"
                          value={formData.hero.badgeText}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hero: { ...formData.hero, badgeText: e.target.value }
                            })
                          }
                          className="w-full p-2.5 rounded-lg bg-coffee-950 border border-gold-500/30 text-gold-100"
                        />
                      </div>

                      <div>
                        <label className="block text-gold-200/80 mb-1">मुख्य शीर्षक (Main Title)</label>
                        <input
                          type="text"
                          value={formData.hero.mainTitle}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hero: { ...formData.hero, mainTitle: e.target.value }
                            })
                          }
                          className="w-full p-2.5 rounded-lg bg-coffee-950 border border-gold-500/30 text-gold-100 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-gold-200/80 mb-1">उप-शीर्षक (Subtitle)</label>
                        <textarea
                          rows={2}
                          value={formData.hero.subtitle}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hero: { ...formData.hero, subtitle: e.target.value }
                            })
                          }
                          className="w-full p-2.5 rounded-lg bg-coffee-950 border border-gold-500/30 text-gold-100"
                        />
                      </div>

                      <div>
                        <label className="block text-gold-200/80 mb-1">सद्गुरु अमृतवाणी विचार (Quote)</label>
                        <textarea
                          rows={2}
                          value={formData.hero.quoteText}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hero: { ...formData.hero, quoteText: e.target.value }
                            })
                          }
                          className="w-full p-2.5 rounded-lg bg-coffee-950 border border-gold-500/30 text-gold-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Guru Section */}
                  <div className="p-5 rounded-2xl bg-coffee-900/40 border border-gold-500/20 space-y-3">
                    <h5 className="text-sm font-bold text-gold-300 border-b border-gold-500/20 pb-2">
                      👑 गुरु परंपरा परिचय (Guru Parichay)
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-gold-200/80 mb-1">गुरुदेव का नाम (Guru Name)</label>
                        <input
                          type="text"
                          value={formData.guru.guruName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              guru: { ...formData.guru, guruName: e.target.value }
                            })
                          }
                          className="w-full p-2.5 rounded-lg bg-coffee-950 border border-gold-500/30 text-gold-100 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-gold-200/80 mb-1">पद / उपाधि (Guru Designation)</label>
                        <input
                          type="text"
                          value={formData.guru.guruTitle}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              guru: { ...formData.guru, guruTitle: e.target.value }
                            })
                          }
                          className="w-full p-2.5 rounded-lg bg-coffee-950 border border-gold-500/30 text-gold-100"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-gold-200/80 mb-1">गुरु परिचय एवं पावन संदेश (Bio/Description)</label>
                        <textarea
                          rows={3}
                          value={formData.guru.bio}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              guru: { ...formData.guru, bio: e.target.value }
                            })
                          }
                          className="w-full p-2.5 rounded-lg bg-coffee-950 border border-gold-500/30 text-gold-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Global Seva Details */}
                  <div className="p-5 rounded-2xl bg-coffee-900/40 border border-gold-500/20 space-y-4">
                    <h5 className="text-sm font-bold text-gold-300 border-b border-gold-500/20 pb-2">
                      🤝 सेवा कार्य प्रोजेक्ट्स (Seva Initiatives)
                    </h5>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-coffee-950 rounded-xl border border-gold-500/20">
                        <span className="text-gold-400 font-bold block mb-1">सेवा I: त्र्यंबकेश्वर व नाशिक गुरु सेवा धाम</span>
                        <input
                          type="text"
                          value={formData.seva.seva1Title}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              seva: { ...formData.seva, seva1Title: e.target.value }
                            })
                          }
                          className="w-full p-2 rounded bg-coffee-900 border border-gold-500/20 text-gold-100 mb-2"
                        />
                        <textarea
                          rows={2}
                          value={formData.seva.seva1Desc}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              seva: { ...formData.seva, seva1Desc: e.target.value }
                            })
                          }
                          className="w-full p-2 rounded bg-coffee-900 border border-gold-500/20 text-gold-100"
                        />
                      </div>

                      <div className="p-3 bg-coffee-950 rounded-xl border border-gold-500/20">
                        <span className="text-gold-400 font-bold block mb-1">सेवा II: भारतीय देशी गोवंश गऊशाला</span>
                        <input
                          type="text"
                          value={formData.seva.seva2Title}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              seva: { ...formData.seva, seva2Title: e.target.value }
                            })
                          }
                          className="w-full p-2 rounded bg-coffee-900 border border-gold-500/20 text-gold-100 mb-2"
                        />
                        <textarea
                          rows={2}
                          value={formData.seva.seva2Desc}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              seva: { ...formData.seva, seva2Desc: e.target.value }
                            })
                          }
                          className="w-full p-2 rounded bg-coffee-900 border border-gold-500/20 text-gold-100"
                        />
                      </div>

                      <div className="p-3 bg-coffee-950 rounded-xl border border-gold-500/20">
                        <span className="text-gold-400 font-bold block mb-1">सेवा III: वरिष्ठ नागरिक सेवा (अभय धाम)</span>
                        <input
                          type="text"
                          value={formData.seva.seva3Title}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              seva: { ...formData.seva, seva3Title: e.target.value }
                            })
                          }
                          className="w-full p-2 rounded bg-coffee-900 border border-gold-500/20 text-gold-100 mb-2"
                        />
                        <textarea
                          rows={2}
                          value={formData.seva.seva3Desc}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              seva: { ...formData.seva, seva3Desc: e.target.value }
                            })
                          }
                          className="w-full p-2 rounded bg-coffee-900 border border-gold-500/20 text-gold-100"
                        />
                      </div>

                      <div className="p-3 bg-coffee-950 rounded-xl border border-gold-500/20">
                        <span className="text-gold-400 font-bold block mb-1">सेवा IV: अभेद्य मंत्र यज्ञ व वैदिक ध्वनि विज्ञान</span>
                        <input
                          type="text"
                          value={formData.seva.seva4Title}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              seva: { ...formData.seva, seva4Title: e.target.value }
                            })
                          }
                          className="w-full p-2 rounded bg-coffee-900 border border-gold-500/20 text-gold-100 mb-2"
                        />
                        <textarea
                          rows={2}
                          value={formData.seva.seva4Desc}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              seva: { ...formData.seva, seva4Desc: e.target.value }
                            })
                          }
                          className="w-full p-2 rounded bg-coffee-900 border border-gold-500/20 text-gold-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: IMAGE MANAGEMENT */}
              {activeTab === 'images' && (
                <div className="space-y-6">
                  {/* Toast Notification Alert */}
                  {imageToastMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`p-3.5 rounded-xl border font-semibold text-xs flex items-center justify-between ${
                        imageToastMsg.type === 'success'
                          ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                          : 'bg-red-950/80 border-red-500/50 text-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {imageToastMsg.type === 'success' ? <Check size={16} /> : <X size={16} />}
                        <span>{imageToastMsg.text}</span>
                      </div>
                      <button onClick={() => setImageToastMsg(null)} className="opacity-70 hover:opacity-100">
                        <X size={14} />
                      </button>
                    </motion.div>
                  )}

                  {/* Floating Overlay Controls Toggle */}
                  <div className="p-4 rounded-2xl bg-coffee-900/60 border border-gold-500/30 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gold-200 text-sm">डायरेक्ट ऑन-स्क्रीन फोटो अपलोड बटन (On-Screen Overlay Controls)</h4>
                      <p className="text-xs text-gold-300/70">
                        इसे चालू करने पर वेबसाइट के प्रत्येक सेक्शन पर सीधे 'फोटो बदलें' का फ्लोटिंग बटन दिखाई देगा।
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowOverlayControls(!showOverlayControls)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        showOverlayControls
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-coffee-950 text-gold-300 border-gold-500/30'
                      }`}
                    >
                      {showOverlayControls ? 'ऑप्शन ऑन है (ON)' : 'ऑप्शन ऑफ है (OFF)'}
                    </button>
                  </div>

                  {/* MASTER IMAGE MANAGEMENT SECTION */}
                  <div className="p-5 rounded-2xl bg-coffee-900/40 border border-gold-500/20 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gold-500/20 pb-3">
                      <div>
                        <h5 className="text-sm font-bold text-gold-300 flex items-center gap-2">
                          <ImageIcon size={18} className="text-saffron-400" />
                          <span>संपूर्ण वेबसाइट फ़ोटो प्रबंधन (Master Image Directory)</span>
                        </h5>
                        <p className="text-[11px] text-gold-300/70">
                          वेबसाइट के सभी पेजों और सेक्शन की तस्वीरें देखें, फ़िल्टर करें, बदलें या हटाएं।
                        </p>
                      </div>

                      {/* Search Box */}
                      <div className="relative w-full md:w-64">
                        <input
                          type="text"
                          placeholder="फोटो नाम या पेज से खोजें..."
                          value={imageSearchQuery}
                          onChange={(e) => setImageSearchQuery(e.target.value)}
                          className="w-full px-3 py-1.5 pl-8 rounded-xl bg-coffee-950 border border-gold-500/30 text-gold-100 text-xs focus:outline-none focus:border-gold-400"
                        />
                        <Eye size={13} className="absolute left-2.5 top-2 text-gold-400/60" />
                        {imageSearchQuery && (
                          <button
                            onClick={() => setImageSearchQuery('')}
                            className="absolute right-2.5 top-2 text-gold-400/60 hover:text-gold-200"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Filter Category Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                      {[
                        { id: 'all', label: 'सभी तस्वीरें (All)' },
                        { id: 'nav', label: 'नेविगेशन व ब्रांडिंग' },
                        { id: 'hero', label: 'मुख्य होमपेज' },
                        { id: 'about', label: 'गुरु व हमारे बारे में' },
                        { id: 'seva', label: 'सेवा व विज़न' },
                        { id: 'baglamukhi', label: 'मां बगलामुखी' },
                        { id: 'dhyan', label: 'सरल ध्यान योग' },
                        { id: 'future', label: 'परियोजनाएं' },
                        { id: 'certificates', label: 'प्रमाणपत्र व सील' },
                        { id: 'testimonials', label: 'साधक अनुभव' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedImageCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                            selectedImageCategory === cat.id
                              ? 'bg-saffron-500 text-coffee-50 border-gold-300 font-bold shadow'
                              : 'bg-coffee-950 text-gold-300 border-gold-500/20 hover:border-gold-500/40'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Filtered Single Images Grid */}
                    {(() => {
                      const filtered = IMAGE_REGISTRY.filter((meta) => {
                        // Category filter
                        if (selectedImageCategory === 'nav' && !['headerLogo', 'footerLogo', 'whatsappQr'].includes(meta.key)) return false;
                        if (selectedImageCategory === 'hero' && !['heroBg', 'heroPortrait'].includes(meta.key)) return false;
                        if (selectedImageCategory === 'about' && !['guruPortrait', 'aboutGuruji', 'aboutBabaji', 'aboutMain'].includes(meta.key)) return false;
                        if (selectedImageCategory === 'seva' && !['visionSection', 'seva1Image', 'seva2Image', 'seva3Image', 'seva4Image', 'seva5Image', 'seva6Image', 'seva7Image'].includes(meta.key)) return false;
                        if (selectedImageCategory === 'baglamukhi' && !meta.key.startsWith('baglamukhi')) return false;
                        if (selectedImageCategory === 'dhyan' && !meta.key.startsWith('dhyanYog')) return false;
                        if (selectedImageCategory === 'future' && !meta.key.startsWith('futureProject')) return false;
                        if (selectedImageCategory === 'certificates' && !['certOfficialSeal', 'certAuthorizedSignature', 'certOrgLogo'].includes(meta.key)) return false;
                        if (selectedImageCategory === 'testimonials' && !['testimonial1', 'testimonial2', 'testimonial3'].includes(meta.key)) return false;

                        // Search query (debounced)
                        if (debouncedSearchQuery.trim()) {
                          const q = debouncedSearchQuery.toLowerCase();
                          const matchTitle = meta.title.toLowerCase().includes(q);
                          const matchPage = meta.page.toLowerCase().includes(q);
                          const matchSection = meta.section.toLowerCase().includes(q);
                          const matchKey = meta.key.toLowerCase().includes(q);
                          return matchTitle || matchPage || matchSection || matchKey;
                        }

                        return true;
                      });

                      if (filtered.length === 0) {
                        return (
                          <div className="p-8 text-center bg-coffee-950 rounded-xl border border-gold-500/20 text-gold-300/60 text-xs">
                            इस श्रेणी या खोज में कोई फ़ोटो नहीं मिली।
                          </div>
                        );
                      }

                      const visibleList = filtered.slice(0, visibleImageCount);

                      return (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-xs text-gold-300/70 px-1 font-mono">
                            <span>कुल फ़ोटो: <strong className="text-gold-200">{filtered.length}</strong></span>
                            <span>प्रदर्शित: <strong className="text-gold-200">{visibleList.length} / {filtered.length}</strong></span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {visibleList.map((item) => {
                              const currentSrc = getImageUrl(item.key) || item.defaultUrl;
                              const isUploading = uploadingKeys[item.key];
                              const progress = uploadProgress[item.key] || 15;
                              const isDefault = currentSrc === item.defaultUrl;

                              return (
                                <div
                                  key={item.key}
                                  className="p-3 bg-coffee-950 rounded-xl border border-gold-500/20 flex flex-col justify-between hover:border-gold-500/40 transition-all relative group"
                                >
                                  <div>
                                    {/* Page & Section Badge */}
                                    <div className="flex items-center justify-between mb-1.5">
                                      <span className="text-[10px] font-bold text-saffron-400 bg-coffee-900 px-2 py-0.5 rounded border border-gold-500/20 truncate">
                                        {item.page}
                                      </span>
                                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${isDefault ? 'bg-gold-500/10 text-gold-300' : 'bg-emerald-500/20 text-emerald-300 font-bold'}`}>
                                        {isDefault ? 'मूल फ़ोटो' : 'कस्टम अपडेटेड'}
                                      </span>
                                    </div>

                                    <h6 className="text-xs font-bold text-gold-200 block truncate">{item.title}</h6>
                                    <p className="text-[10px] text-gold-300/60 line-clamp-1 mb-2">{item.description}</p>

                                    {/* Image Preview */}
                                    <div className="w-full h-28 rounded-lg bg-coffee-900 overflow-hidden border border-gold-500/20 my-1 relative group-hover:border-gold-500/50 transition-all flex items-center justify-center">
                                      <img
                                        src={currentSrc}
                                        alt={item.title}
                                        loading="lazy"
                                        onError={(e) => {
                                          const target = e.currentTarget;
                                          target.onerror = null;
                                          target.src = item.defaultUrl;
                                        }}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      />
                                      {isUploading && (
                                        <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center text-gold-300 text-xs font-bold gap-1.5 p-3 text-center rounded-lg">
                                          <div className="w-5 h-5 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                                          <span>अपलोड हो रहा है...</span>
                                          <div className="w-full bg-coffee-950 rounded-full h-1.5 border border-gold-500/30 overflow-hidden">
                                            <div
                                              className="bg-gradient-to-r from-saffron-500 to-gold-400 h-full transition-all duration-300"
                                              style={{ width: `${progress}%` }}
                                            />
                                          </div>
                                          <span className="text-[10px] font-mono text-gold-200">{progress}%</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={(el) => { singleInputsRef.current[item.key] = el; }}
                                    onChange={(e) => handleSingleImageChange(item.key, e)}
                                  />

                                  {/* Action Buttons */}
                                  <div className="mt-3 flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => singleInputsRef.current[item.key]?.click()}
                                      disabled={isUploading}
                                      className="flex-1 py-1.5 px-2 rounded-lg bg-coffee-900 border border-gold-500/30 text-gold-300 hover:text-white hover:bg-gold-500/20 text-[11px] font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                                    >
                                      <Upload size={12} />
                                      <span>बदले / अपलोड</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setDeleteConfirmKey(item)}
                                      disabled={isUploading}
                                      title="फ़ोटो हटाएं / रीसेट करें"
                                      className="p-1.5 rounded-lg bg-red-950/60 border border-red-500/30 text-red-300 hover:bg-red-600 hover:text-white text-[11px] transition-all cursor-pointer disabled:opacity-50"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Load More Pagination Control */}
                          {visibleImageCount < filtered.length && (
                            <div className="text-center pt-3 pb-1">
                              <button
                                type="button"
                                onClick={() => setVisibleImageCount((prev) => prev + 12)}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-coffee-900 to-divine-navy border border-gold-500/40 text-gold-200 hover:text-white text-xs font-bold shadow-lg hover:border-gold-400 transition-all cursor-pointer hover:scale-102 active:scale-98"
                              >
                                और फ़ोटो देखें ({filtered.length - visibleImageCount} फ़ोटो शेष)
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* GALLERY MANAGEMENT SECTION */}
                  <div className="p-5 rounded-2xl bg-coffee-900/40 border border-gold-500/20 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold-500/20 pb-3">
                      <div>
                        <h5 className="text-sm font-bold text-gold-300 flex items-center gap-2">
                          <Layers size={18} className="text-saffron-400" />
                          <span>📸 पावन चित्रावली - गैलरी प्रबंधन (Dynamic Gallery)</span>
                        </h5>
                        <p className="text-[11px] text-gold-300/70">
                          नया फोटो अपलोड करें या पुरानी फोटो को एक-एक करके या एक साथ डिलीट करें।
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('क्या आप केवल पुरानी/सैंपल डिफ़ॉल्ट तस्वीरें हटाना चाहते हैं?')) {
                              clearDefaultGalleryImages();
                              showToast('सैंपल फ़ोटो गैलरी से हटा दी गईं!');
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-coffee-950 border border-gold-500/30 text-gold-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <RotateCcw size={13} />
                          <span>सैंपल फोटो हटाएं</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('क्या आप गैलरी की सभी तस्वीरें डिलीट करना चाहते हैं?')) {
                              clearAllGalleryImages();
                              showToast('गैलरी की सभी तस्वीरें डिलीट कर दी गईं!');
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 hover:bg-red-600 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Trash2 size={13} />
                          <span>सभी फोटो डिलीट करें</span>
                        </button>
                      </div>
                    </div>

                    {/* Upload Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-coffee-950 p-4 rounded-xl border border-gold-500/20">
                      <div className="flex items-center gap-3">
                        <div>
                          <label className="block text-xs text-gold-200/80 mb-1 font-semibold">श्रेणी चुनें (Category):</label>
                          <select
                            value={galleryCategory}
                            onChange={(e: any) => setGalleryCategory(e.target.value)}
                            className="px-3 py-2 rounded-lg bg-coffee-900 border border-gold-500/30 text-gold-100 text-xs focus:outline-none focus:border-gold-400"
                          >
                            <option value="dhyan">ध्यान व साधना (Dhyan)</option>
                            <option value="babaji">महावतार बाबाजी (Babaji)</option>
                            <option value="seva">सेवा कार्य (Seva)</option>
                          </select>
                        </div>
                      </div>

                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleGalleryUpload}
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingGallery}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-saffron-500 to-gold-500 text-coffee-50 font-bold text-xs shadow-md hover:brightness-110 flex items-center gap-2 cursor-pointer"
                      >
                        <Upload size={15} />
                        <span>{isUploadingGallery ? 'अपलोड हो रहा है...' : '+ नई फोटो गैलरी में अपलोड करें'}</span>
                      </button>
                    </div>

                    {/* Current Gallery Items Grid */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gold-200">
                          गैलरी में उपलब्ध कुल तस्वीरें: {images.galleryImages.length}
                        </span>
                        <span className="text-[11px] text-gold-300/70">
                          (किसी भी फोटो पर 🗑️ बटन दबाकर उसे तुरंत डिलीट करें)
                        </span>
                      </div>

                      {images.galleryImages.length === 0 ? (
                        <div className="p-8 text-center bg-coffee-950 rounded-xl border border-gold-500/20 text-gold-300/60 text-xs">
                          गैलरी में कोई फोटो नहीं है। '+ नई फोटो अपलोड करें' बटन से नई तस्वीरें जोड़ें।
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-72 overflow-y-auto p-3 bg-coffee-950 rounded-xl border border-gold-500/20">
                          {images.galleryImages.map((img) => (
                            <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square bg-coffee-900 border border-gold-500/30 flex items-center justify-center">
                              <img src={img.src} alt={img.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                              <button
                                type="button"
                                onClick={() => setDeleteGalleryConfirmId(img.id)}
                                title="फोटो डिलीट करें"
                                className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-red-600/90 text-white shadow-lg hover:bg-red-700 hover:scale-110 transition-all z-20 cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                              <span className="absolute bottom-1 left-1 right-1 px-1 bg-black/80 text-[10px] text-gold-200 truncate rounded text-center">
                                {img.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 0: DONATIONS MANAGEMENT */}
              {activeTab === 'donations' && <AdminDonationManager />}

              {/* TAB 3: YOUTUBE VIDEOS MANAGEMENT */}
              {activeTab === 'videos' && <AdminYouTubeManager />}

              {/* TAB 4: MEMBERSHIP ID CARDS MANAGEMENT */}
              {activeTab === 'cards' && <AdminMembershipManager />}

              {/* TAB 6: SECURITY & PASSWORD CHANGE */}
              {activeTab === 'security' && (
                <div className="space-y-6 max-w-md mx-auto py-4">
                  <div className="p-6 rounded-2xl bg-coffee-900/60 border border-gold-500/30 text-center">
                    <div className="w-14 h-14 rounded-full bg-gold-500/20 border border-gold-400 text-gold-300 flex items-center justify-center mx-auto mb-4">
                      <KeyRound size={28} />
                    </div>

                    <h4 className="text-base font-bold text-gold-100 font-serif mb-1">एडमिन पासवर्ड बदलें</h4>
                    <p className="text-xs text-gold-300/70 mb-6">
                      भविष्य में लॉगिन करने के लिए अपना नया सुरक्षित पासवर्ड सेट करें।
                    </p>

                    <form onSubmit={handleChangePassword} className="space-y-4 text-left">
                      <div>
                        <label className="block text-xs text-gold-200/80 mb-1">नया एडमिन पासवर्ड (New Password)</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="नया पासवर्ड दर्ज करें..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-coffee-950 border border-gold-500/40 text-gold-100 text-xs focus:outline-none focus:border-gold-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gold-200/80 mb-1">पासवर्ड पुनः दर्ज करें (Confirm Password)</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="पुनः नया पासवर्ड दर्ज करें..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-coffee-950 border border-gold-500/40 text-gold-100 text-xs focus:outline-none focus:border-gold-400"
                        />
                      </div>

                      {securityMessage.text && (
                        <p
                          className={`text-xs p-2.5 rounded-lg border ${
                            securityMessage.type === 'success'
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                              : 'bg-red-950/80 text-red-300 border-red-500/40'
                          }`}
                        >
                          {securityMessage.text}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-saffron-500 to-gold-500 text-coffee-50 font-bold text-xs shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Save size={15} />
                        <span>पासवर्ड अपडेट करें</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
              </div>
            </div>
          )}

          {/* DELETE CONFIRMATION MODAL FOR SINGLE IMAGE */}
          {deleteConfirmKey && (
            <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full bg-coffee-950 border-2 border-gold-500/50 rounded-2xl p-6 text-center space-y-4 shadow-2xl"
              >
                <div className="w-12 h-12 rounded-full bg-red-900/40 border border-red-500/50 text-red-400 flex items-center justify-center mx-auto">
                  <Trash2 size={24} />
                </div>
                <h4 className="text-base font-bold text-gold-200">क्या आप इस फ़ोटो को हटाना चाहते हैं?</h4>
                <p className="text-xs text-gold-300/80 leading-relaxed">
                  "{deleteConfirmKey.title}" को हटाने पर यह अपनी मूल डिफ़ॉल्ट फ़ोटो पर रीसेट हो जाएगी।
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmKey(null)}
                    className="flex-1 py-2.5 rounded-xl bg-coffee-900 border border-gold-500/30 text-gold-200 text-xs font-semibold hover:bg-coffee-800 cursor-pointer"
                  >
                    रद्द करें (Cancel)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSingleImageDelete(deleteConfirmKey.key)}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-lg cursor-pointer"
                  >
                    हाँ, डिलीट करें (Delete)
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* DELETE CONFIRMATION MODAL FOR GALLERY ITEM */}
          {deleteGalleryConfirmId && (
            <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full bg-coffee-950 border-2 border-gold-500/50 rounded-2xl p-6 text-center space-y-4 shadow-2xl"
              >
                <div className="w-12 h-12 rounded-full bg-red-900/40 border border-red-500/50 text-red-400 flex items-center justify-center mx-auto">
                  <Trash2 size={24} />
                </div>
                <h4 className="text-base font-bold text-gold-200">गैलरी फ़ोटो हटाएं</h4>
                <p className="text-xs text-gold-300/80 leading-relaxed">
                  क्या आप इस फ़ोटो को गैलरी से हमेशा के लिए डिलीट करना चाहते हैं?
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeleteGalleryConfirmId(null)}
                    className="flex-1 py-2.5 rounded-xl bg-coffee-900 border border-gold-500/30 text-gold-200 text-xs font-semibold hover:bg-coffee-800 cursor-pointer"
                  >
                    रद्द करें (Cancel)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      removeGalleryImage(deleteGalleryConfirmId);
                      showToast('फ़ोटो गैलरी से हटा दी गई!');
                      setDeleteGalleryConfirmId(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-lg cursor-pointer"
                  >
                    हाँ, डिलीट करें (Delete)
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
