import React, { useRef, useState } from 'react';
import { Camera, Upload, Trash2, RotateCcw, Check, Image as ImageIcon, Sparkles, X, Plus } from 'lucide-react';
import { useImageContext, ImageState } from '../context/ImageContext';

type SingleImageKey = keyof Omit<ImageState, 'galleryImages'>;

interface SingleImageUploaderProps {
  imageKey: SingleImageKey;
  label?: string;
  className?: string;
  badgePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  children?: React.ReactNode;
}

export const SingleImageUploader: React.FC<SingleImageUploaderProps> = ({
  imageKey,
  label = 'इमेज बदलें (Upload Image)',
  className = '',
  badgePosition = 'top-right',
  children,
}) => {
  const { updateSingleImage, showOverlayControls } = useImageContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      setErrorMsg(null);
      try {
        await updateSingleImage(imageKey, files[0]);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } catch (err: any) {
        console.error('Failed to update image:', err);
        setErrorMsg(err.message || 'फ़ोटो सहेजने में विफल!');
        setTimeout(() => setErrorMsg(null), 4000);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const getPositionClasses = () => {
    switch (badgePosition) {
      case 'top-left':
        return 'top-2 left-2';
      case 'bottom-right':
        return 'bottom-2 right-2';
      case 'bottom-left':
        return 'bottom-2 left-2';
      case 'center':
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'top-right':
      default:
        return 'top-2 right-2';
    }
  };

  return (
    <div className={`relative group w-full h-full flex items-center justify-center ${className}`}>
      {children}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {showOverlayControls && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          title={label}
          className={`absolute ${getPositionClasses()} z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full ${errorMsg ? 'bg-red-950/95 border border-red-500/80 text-red-200' : 'bg-coffee-950/90 border border-gold-400/80 text-gold-300'} text-xs font-semibold shadow-2xl backdrop-blur-md hover:scale-105 transition-all cursor-pointer opacity-90 group-hover:opacity-100`}
        >
          {isUploading ? (
            <div className="w-3.5 h-3.5 border-2 border-gold-300 border-t-transparent rounded-full animate-spin" />
          ) : errorMsg ? (
            <X size={14} className="text-red-400 font-bold" />
          ) : showSuccess ? (
            <Check size={14} className="text-green-400 font-bold" />
          ) : (
            <Camera size={14} className="text-saffron-400 group-hover:text-coffee-50" />
          )}
          <span className="hidden sm:inline-block">
            {isUploading ? 'अपलोड हो रहा है...' : errorMsg ? errorMsg : showSuccess ? 'अपलोड सफल!' : label}
          </span>
          <span className="sm:hidden">
            {isUploading ? '...' : errorMsg ? '!' : showSuccess ? '✓' : 'फोटो बदलें'}
          </span>
        </button>
      )}
    </div>
  );
};

export const MultipleGalleryUploader: React.FC = () => {
  const { addGalleryImages, images, removeGalleryImage, clearDefaultGalleryImages, clearAllGalleryImages, showOverlayControls } = useImageContext();
  const multiInputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<'babaji' | 'dhyan' | 'seva' | 'baglamukhi'>('dhyan');
  const [isUploading, setIsUploading] = useState(false);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showManageModal, setShowManageModal] = useState(false);

  if (!showOverlayControls) return null;

  const handleMultipleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      setErrorMsg(null);
      try {
        await addGalleryImages(files, category);
        setSuccessCount(files.length);
        setTimeout(() => setSuccessCount(null), 3500);
      } catch (err: any) {
        console.error('Failed to add gallery images:', err);
        setErrorMsg(err.message || 'गैलरी में फ़ोटो जोड़ने में विफलता!');
        setTimeout(() => setErrorMsg(null), 5000);
      } finally {
        setIsUploading(false);
        if (multiInputRef.current) {
          multiInputRef.current.value = '';
        }
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-coffee-900/90 via-coffee-950 to-coffee-900/90 p-6 rounded-3xl border-2 border-gold-500/40 shadow-2xl mb-10 max-w-4xl mx-auto backdrop-blur-md">
      <input
        type="file"
        ref={multiInputRef}
        onChange={handleMultipleFiles}
        accept="image/*"
        multiple
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/20 text-saffron-300 text-xs font-bold uppercase tracking-wider mb-2 border border-saffron-500/30">
            <Sparkles size={13} />
            <span>मल्टीपल फोटो अपलोड करें (Multiple Image Upload)</span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-gold-200">
            मोबाइल गैलरी से 1 साथ कई फोटो चुनें
          </h3>
          <p className="text-xs text-gold-300/70 mt-1 font-sans">
            You can select multiple photos at once from your phone/computer gallery.
          </p>
          
          {successCount !== null && (
            <div className="mt-3 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg inline-block animate-pulse">
              ✓ {successCount} फ़ोटो सफलतापूर्वक अपलोड कर दी गई हैं और क्लाउड में सुरक्षित हो चुकी हैं!
            </div>
          )}
          {errorMsg !== null && (
            <div className="mt-3 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg inline-block">
              ⚠ {errorMsg}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 shrink-0">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-coffee-900 border border-gold-500/40 text-gold-200 text-xs font-semibold focus:outline-none focus:border-gold-400"
          >
            <option value="dhyan">ध्यान व शिविर (Meditation)</option>
            <option value="baglamukhi">माँ बगलामुखी एवं यज्ञ (Havan)</option>
            <option value="babaji">गुरु परंपरा (Guru Lineage)</option>
            <option value="seva">सेवा कार्य (Sacred Seva)</option>
          </select>

          <button
            type="button"
            onClick={() => multiInputRef.current?.click()}
            disabled={isUploading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-saffron-500 via-gold-500 to-gold-400 text-coffee-50 font-bold text-xs sm:text-sm tracking-wider shadow-[0_0_20px_rgba(255,153,51,0.4)] hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <div className="w-4 h-4 border-2 border-coffee-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus size={16} className="stroke-[3]" />
            )}
            <span>{isUploading ? 'अपलोड हो रहा है...' : 'फोटो चुनें (Select Photos)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowManageModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-coffee-900 border border-gold-500/40 text-gold-300 hover:text-gold-100 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ImageIcon size={15} />
            <span>प्रबंधन ({images.galleryImages.length})</span>
          </button>
        </div>
      </div>

      {/* Quick Action Delete Buttons */}
      <div className="mt-4 pt-3 border-t border-gold-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-gold-300/70">कुल गैलरी फोटो: {images.galleryImages.length}</span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={clearDefaultGalleryImages}
            className="px-3 py-1.5 rounded-lg bg-coffee-900 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 font-medium flex items-center gap-1.5 cursor-pointer transition-all"
            title="पुराने प्री-लोडेड 14 डिफ़ॉल्ट फोटो हटाएं"
          >
            <Trash2 size={13} className="text-amber-400" />
            <span>पुराने डिफ़ॉल्ट फोटो हटाएं</span>
          </button>
          <button
            type="button"
            onClick={clearAllGalleryImages}
            className="px-3 py-1.5 rounded-lg bg-coffee-900 border border-red-500/40 text-red-400 hover:bg-red-500/20 font-medium flex items-center gap-1.5 cursor-pointer transition-all"
            title="गैलरी की सभी फोटो हटाएं"
          >
            <Trash2 size={13} className="text-red-400" />
            <span>सभी गैलरी फोटो हटाएं</span>
          </button>
        </div>
      </div>

      {successCount !== null && (
        <div className="mt-4 p-3 rounded-xl bg-green-950/80 border border-green-500/50 text-green-300 text-xs font-medium text-center animate-fade-in flex items-center justify-center gap-2">
          <Check size={16} />
          <span>{successCount} नए फोटो सफलतापूर्वक गैलरी में जोड़ दिए गए हैं!</span>
        </div>
      )}

      {/* Gallery Manage Modal */}
      {showManageModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-coffee-950 border-2 border-gold-500 rounded-3xl p-6 max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
              <h3 className="font-serif text-xl font-bold gold-gradient-text flex items-center gap-2">
                <ImageIcon size={20} className="text-saffron-400" />
                <span>गैलरी फोटो प्रबंधन (Manage & Delete Gallery Photos)</span>
              </h3>
              <button
                onClick={() => setShowManageModal(false)}
                className="p-1.5 rounded-full bg-coffee-900 text-gold-300 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 my-3 p-3 bg-coffee-900/60 rounded-xl border border-gold-500/20">
              <span className="text-xs text-gold-300">
                कुल फोटो: <strong>{images.galleryImages.length}</strong>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={clearDefaultGalleryImages}
                  className="px-3 py-1.5 rounded-lg bg-coffee-900 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>पुराने डिफ़ॉल्ट फोटो हटाएं</span>
                </button>
                <button
                  type="button"
                  onClick={clearAllGalleryImages}
                  className="px-3 py-1.5 rounded-lg bg-coffee-900 border border-red-500/40 text-red-400 hover:bg-red-500/20 text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>सभी फोटो हटाएं (Clear All)</span>
                </button>
              </div>
            </div>

            <div className="py-2 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 flex-1 my-2">
              {images.galleryImages.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gold-300/60 text-sm">
                  कोई फोटो मौजूद नहीं है। ऊपर "फोटो चुनें" बटन पर क्लिक करके नए फोटो जोड़ें।
                </div>
              ) : (
                images.galleryImages.map((item) => (
                  <div key={item.id} className="relative group rounded-xl overflow-hidden border border-gold-500/30 w-full aspect-square bg-coffee-900 flex items-center justify-center">
                    <img src={item.src} alt={item.title} className="w-full h-full object-cover object-center" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                      <button
                        onClick={() => removeGalleryImage(item.id)}
                        className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-lg cursor-pointer flex items-center gap-1 text-xs"
                        title="हटाएं (Remove)"
                      >
                        <Trash2 size={16} />
                        <span>हटाएं</span>
                      </button>
                    </div>
                    <span className="absolute bottom-1 left-1 right-1 bg-coffee-950/80 text-[10px] text-gold-300 px-1.5 py-0.5 rounded truncate text-center">
                      {item.title}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-gold-500/20 flex items-center justify-between">
              <span className="text-xs text-gold-300/70">कुल चित्र: {images.galleryImages.length}</span>
              <button
                onClick={() => setShowManageModal(false)}
                className="px-5 py-2 rounded-xl bg-gold-500 text-coffee-50 font-bold text-xs"
              >
                हो गया (Done)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const FloatingImageManager: React.FC = () => {
  const { images, resetAllImages, showOverlayControls, setShowOverlayControls, updateSingleImage, clearSingleImage, addGalleryImages, removeGalleryImage, clearDefaultGalleryImages, clearAllGalleryImages, getImageUrl } = useImageContext();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'single' | 'gallery'>('single');

  if (!showOverlayControls) return null;

  const singleImageInputsRef = useRef<Record<string, HTMLInputElement | null>>({});
  const globalMultiInputRef = useRef<HTMLInputElement>(null);

  const sectionsList: Array<{ key: SingleImageKey; title: string; hint: string }> = [
    { key: 'heroBg', title: '🌄 Hero Background (मुख्य बैकग्राउंड)', hint: '1 Image Max' },
    { key: 'heroPortrait', title: '🪷 Hero Round Portrait (मुख्य गोल फोटो)', hint: '1 Image Max' },
    { key: 'headerLogo', title: '🔱 Header Logo (ऊपरी लोगो)', hint: '1 Image Max' },
    { key: 'footerLogo', title: '🪷 Footer Logo (निचला लोगो)', hint: '1 Image Max' },
    { key: 'guruPortrait', title: '👑 Guru Parampara Portrait (गुरु परंपरा फोटो)', hint: '1 Image Max' },
    { key: 'aboutGuruji', title: '🧘 About Section Guruji Image (सदगुरू दर्शन)', hint: '1 Image Max' },
    { key: 'aboutBabaji', title: '⚡ About Section Babaji Image (महावतार बाबाजी)', hint: '1 Image Max' },
    { key: 'seva1Image', title: '🏠 Seva I: Guru Seva Dham (त्र्यंबकेश्वर सेवा फोटो)', hint: '1 Image Max' },
    { key: 'seva2Image', title: '🐄 Seva II: Gaushala (गऊशाला सेवा फोटो)', hint: '1 Image Max' },
    { key: 'seva3Image', title: '❤️ Seva III: Abhaya Dham (वरिष्ठ नागरिक सेवा फोटो)', hint: '1 Image Max' },
    { key: 'seva4Image', title: '🔥 Seva IV: Mantra Yajna (वैदिक यज्ञ सेवा फोटो)', hint: '1 Image Max' },
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-3 rounded-full bg-gradient-to-r from-saffron-500 via-gold-500 to-gold-400 text-coffee-50 font-extrabold text-xs sm:text-sm tracking-wider shadow-[0_0_25px_rgba(255,153,51,0.6)] hover:shadow-[0_0_35px_rgba(255,215,0,0.8)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer border-2 border-coffee-950"
        >
          <Camera size={18} className="text-coffee-50" />
          <span>📸 इमेज बदलें / हटाएं (Manage Photos)</span>
        </button>
      </div>

      {/* Full Control Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-coffee-950 border-2 border-gold-500 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
              <div className="flex items-center gap-2">
                <Camera className="text-saffron-400" size={22} />
                <h3 className="font-serif text-xl font-bold gold-gradient-text">
                  वेबसाइट इमेज बदलें व हटाएं (Image Manager)
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full bg-coffee-900 text-gold-300 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center gap-2 my-4 bg-coffee-900/80 p-1.5 rounded-xl border border-gold-500/20">
              <button
                onClick={() => setActiveTab('single')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'single'
                    ? 'bg-gradient-to-r from-saffron-500 to-gold-400 text-coffee-50 shadow-md'
                    : 'text-gold-200 hover:text-gold-400'
                }`}
              >
                सिंगल इमेज सेक्शन (1 Image Max)
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'gallery'
                    ? 'bg-gradient-to-r from-saffron-500 to-gold-400 text-coffee-50 shadow-md'
                    : 'text-gold-200 hover:text-gold-400'
                }`}
              >
                गैलरी ({images.galleryImages.length} Photos)
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {activeTab === 'single' ? (
                <div className="space-y-3">
                  {sectionsList.map((sec) => (
                    <div
                      key={sec.key}
                      className="p-3.5 rounded-2xl bg-coffee-900/70 border border-gold-500/30 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {getImageUrl(sec.key) ? (
                          <img
                            src={getImageUrl(sec.key)}
                            alt={sec.title}
                            className="w-12 h-12 rounded-xl object-cover border border-gold-500/40 shrink-0 bg-coffee-950"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl border border-dashed border-red-500/50 shrink-0 bg-coffee-950 flex items-center justify-center text-[10px] text-red-400 font-bold">
                            खाली
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-gold-200 truncate">{sec.title}</p>
                          <span className="text-[10px] text-saffron-300 bg-saffron-500/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            {getImageUrl(sec.key) ? sec.hint : 'चित्र हटा दिया गया है'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="file"
                          accept="image/*"
                          ref={(el) => { singleImageInputsRef.current[sec.key] = el; }}
                          className="hidden"
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              await updateSingleImage(sec.key, e.target.files[0]);
                              if (e.target) e.target.value = '';
                            }
                          }}
                        />
                        <button
                          onClick={() => singleImageInputsRef.current[sec.key]?.click()}
                          className="px-2.5 py-1.5 rounded-lg bg-gold-500 text-coffee-50 text-xs font-bold hover:bg-gold-400 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                        >
                          <Upload size={12} />
                          <span>बदलें</span>
                        </button>

                        {getImageUrl(sec.key) && (
                          <button
                            onClick={() => clearSingleImage(sec.key)}
                            className="px-2.5 py-1.5 rounded-lg bg-red-950/80 border border-red-500/50 text-red-400 text-xs font-bold hover:bg-red-600 hover:text-white flex items-center gap-1 cursor-pointer whitespace-nowrap transition-all"
                            title="इस फोटो को हटाएं"
                          >
                            <Trash2 size={12} />
                            <span>हटाएं</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-coffee-900/70 border border-gold-500/30 text-center space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      ref={globalMultiInputRef}
                      className="hidden"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          await addGalleryImages(e.target.files, 'dhyan');
                          if (e.target) e.target.value = '';
                        }
                      }}
                    />

                    <div className="p-5 border-2 border-dashed border-gold-500/40 rounded-2xl bg-coffee-950/60">
                      <Upload size={28} className="text-saffron-400 mx-auto mb-2" />
                      <p className="text-sm font-bold text-gold-200">
                        मोबाइल से 1 या उससे अधिक फोटो एक साथ अपलोड करें
                      </p>
                      <button
                        onClick={() => globalMultiInputRef.current?.click()}
                        className="mt-3 px-5 py-2 rounded-xl bg-gradient-to-r from-saffron-500 to-gold-400 text-coffee-50 text-xs font-bold shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Plus size={16} />
                        <span>गैलरी फोटो चुनें (Select Multiple Photos)</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-gold-500/20">
                      <button
                        type="button"
                        onClick={clearDefaultGalleryImages}
                        className="px-3 py-1.5 rounded-lg bg-coffee-950 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 text-xs font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>पुराने डिफ़ॉल्ट फोटो हटाएं</span>
                      </button>
                      <button
                        type="button"
                        onClick={clearAllGalleryImages}
                        className="px-3 py-1.5 rounded-lg bg-coffee-950 border border-red-500/40 text-red-400 hover:bg-red-500/20 text-xs font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>सभी फोटो हटाएं (Clear All)</span>
                      </button>
                    </div>
                  </div>

                  {/* Mini Gallery List inside drawer */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-52 overflow-y-auto p-1">
                    {images.galleryImages.map((item) => (
                      <div key={item.id} className="relative group rounded-lg overflow-hidden border border-gold-500/30 aspect-square bg-coffee-900 flex items-center justify-center">
                        <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeGalleryImage(item.id)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md cursor-pointer"
                          title="हटाएं"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gold-500/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOverlayControls(!showOverlayControls)}
                  className="text-xs text-gold-300 underline hover:text-gold-100"
                >
                  {showOverlayControls ? 'ऑन-स्क्रीन कैमरा बटन छिपाएं' : 'ऑन-स्क्रीन कैमरा बटन दिखाएं'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetAllImages}
                  className="px-3.5 py-1.5 rounded-xl border border-red-500/50 text-red-400 hover:bg-red-500/10 text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>मूल फोटो रीसेट करें (Reset Default)</span>
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-1.5 rounded-xl bg-gold-500 text-coffee-50 font-bold text-xs"
                >
                  संपन्न (Close)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
