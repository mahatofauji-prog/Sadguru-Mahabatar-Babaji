import React, { useState } from 'react';
import {
  Youtube,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Check,
  ExternalLink,
  Sparkles,
  ListOrdered,
  Search,
  RotateCcw,
  Film,
  AlertCircle,
} from 'lucide-react';
import {
  useYouTubeContext,
  extractYouTubeVideoId,
  getYouTubeThumbnailUrl,
  getYouTubeFallbackThumbnailUrl,
  YouTubeVideoItem,
} from '../context/YouTubeContext';

export const AdminYouTubeManager: React.FC = () => {
  const {
    videos,
    showYouTubeSection,
    toggleShowYouTubeSection,
    addVideo,
    updateVideo,
    deleteVideo,
    togglePublished,
    toggleFeatured,
    stats,
  } = useYouTubeContext();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState<string>('');
  const [titleInput, setTitleInput] = useState<string>('');
  const [descInput, setDescInput] = useState<string>('');
  const [categoryInput, setCategoryInput] = useState<string>('ध्यान व साधना');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [orderInput, setOrderInput] = useState<number>(1);
  const [isPublishedInput, setIsPublishedInput] = useState<boolean>(true);
  const [isFeaturedInput, setIsFeaturedInput] = useState<boolean>(false);

  const [searchFilter, setSearchFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'hidden' | 'featured'>('all');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Extracted YouTube Video ID for live form preview
  const detectedVideoId = extractYouTubeVideoId(urlInput);
  const liveThumbnailUrl = detectedVideoId ? getYouTubeThumbnailUrl(detectedVideoId) : '';

  const handleStartEdit = (video: YouTubeVideoItem) => {
    setEditingId(video.id);
    setUrlInput(video.url);
    setTitleInput(video.title);
    setDescInput(video.description || '');
    if (['ध्यान व साधना', 'प्रवचन व सत्संग', 'सेवा कार्य', 'मंत्र व यज्ञ'].includes(video.category)) {
      setCategoryInput(video.category);
      setCustomCategory('');
    } else {
      setCategoryInput('custom');
      setCustomCategory(video.category);
    }
    setOrderInput(video.displayOrder || 1);
    setIsPublishedInput(video.isPublished);
    setIsFeaturedInput(video.isFeatured);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setUrlInput('');
    setTitleInput('');
    setDescInput('');
    setCategoryInput('ध्यान व साधना');
    setCustomCategory('');
    setOrderInput(videos.length + 1);
    setIsPublishedInput(true);
    setIsFeaturedInput(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      alert('कृपया YouTube वीडियो का URL दर्ज करें!');
      return;
    }

    const videoId = extractYouTubeVideoId(urlInput);
    if (!videoId) {
      alert('अमान्य YouTube URL! कृपया सही YouTube लिंक दर्ज करें (उदा. https://www.youtube.com/watch?v=...)');
      return;
    }

    if (!titleInput.trim()) {
      alert('कृपया वीडियो का शीर्षक (Title) दर्ज करें!');
      return;
    }

    const finalCategory =
      categoryInput === 'custom' && customCategory.trim()
        ? customCategory.trim()
        : categoryInput;

    const thumbnailUrl = getYouTubeThumbnailUrl(videoId);

    try {
      if (editingId) {
        await updateVideo(editingId, {
          url: urlInput.trim(),
          videoId,
          title: titleInput.trim(),
          description: descInput.trim(),
          category: finalCategory,
          displayOrder: Number(orderInput) || 1,
          isPublished: isPublishedInput,
          isFeatured: isFeaturedInput,
          thumbnailUrl,
        });
        setFeedbackMsg('✅ वीडियो सफलतापूर्वक अपडेट किया गया!');
      } else {
        await addVideo({
          url: urlInput.trim(),
          videoId,
          title: titleInput.trim(),
          description: descInput.trim(),
          category: finalCategory,
          displayOrder: Number(orderInput) || videos.length + 1,
          isPublished: isPublishedInput,
          isFeatured: isFeaturedInput,
          thumbnailUrl,
        });
        setFeedbackMsg('✅ नया YouTube वीडियो सफलतापूर्वक जोड़ा गया!');
      }

      handleCancelEdit();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err) {
      console.error(err);
      alert('त्रुटि: वीडियो सहेजने में विफल।');
    }
  };

  const handleDelete = async (video: YouTubeVideoItem) => {
    if (window.confirm(`क्या आप वीडियो "${video.title}" को स्थायी रूप से डिलीट करना चाहते हैं?`)) {
      await deleteVideo(video.id);
      setFeedbackMsg('🗑️ वीडियो सफलतापूर्वक डिलीट किया गया!');
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  // Filtered List for Table
  const filteredVideosList = videos.filter((v) => {
    const matchesSearch =
      !searchFilter.trim() ||
      v.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      v.category.toLowerCase().includes(searchFilter.toLowerCase());

    if (statusFilter === 'published') return matchesSearch && v.isPublished;
    if (statusFilter === 'hidden') return matchesSearch && !v.isPublished;
    if (statusFilter === 'featured') return matchesSearch && v.isFeatured;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 text-gold-100">
      {/* 0. Main YouTube Section Visibility Toggle Banner */}
      <div className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4 ${
        showYouTubeSection
          ? 'bg-gradient-to-r from-coffee-900 via-coffee-950 to-coffee-900 border-gold-500/40 shadow-lg'
          : 'bg-red-950/40 border-red-500/40 shadow-inner'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
            showYouTubeSection
              ? 'bg-green-600/20 border border-green-500/50 text-green-400'
              : 'bg-red-600/20 border border-red-500/50 text-red-400'
          }`}>
            <Youtube size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-gold-100 font-serif">
                वेबसाइट पर YouTube वीडियो सेक्शन
              </h4>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                showYouTubeSection
                  ? 'bg-green-600/90 text-white shadow-sm'
                  : 'bg-red-600/90 text-white shadow-sm'
              }`}>
                {showYouTubeSection ? '🟢 दृश्यमान (Visible)' : '🔴 छिपा हुआ (Hidden)'}
              </span>
            </div>
            <p className="text-xs text-gold-300/70 mt-0.5">
              {showYouTubeSection
                ? 'वर्तमान में YouTube सेक्शन मुख्य वेबसाइट पर सभी साधकों के लिए दिखाई दे रहा है।'
                : 'वर्तमान में YouTube सेक्शन वेबसाइट से पूरी तरह छिपा दिया गया है।'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggleShowYouTubeSection()}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
            showYouTubeSection
              ? 'bg-red-950 border border-red-500/50 text-red-200 hover:bg-red-800 hover:text-white'
              : 'bg-gradient-to-r from-saffron-500 to-gold-500 text-coffee-50 hover:brightness-110'
          }`}
        >
          {showYouTubeSection ? (
            <>
              <EyeOff size={16} />
              <span>वेबसाइट से YouTube सेक्शन छिपाएं (Hide Section)</span>
            </>
          ) : (
            <>
              <Eye size={16} />
              <span>वेबसाइट पर YouTube सेक्शन चालू करें (Show Section)</span>
            </>
          )}
        </button>
      </div>

      {/* 1. Dashboard Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-coffee-900/80 border border-gold-500/30 p-3.5 rounded-2xl flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0">
            <Youtube size={20} />
          </div>
          <div>
            <p className="text-[11px] text-gold-300/70 font-semibold uppercase tracking-wider">कुल वीडियो</p>
            <h4 className="text-xl font-extrabold text-gold-100">{stats.total}</h4>
          </div>
        </div>

        <div className="bg-coffee-900/80 border border-gold-500/30 p-3.5 rounded-2xl flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-green-600/20 border border-green-500/40 text-green-400 flex items-center justify-center shrink-0">
            <Eye size={20} />
          </div>
          <div>
            <p className="text-[11px] text-gold-300/70 font-semibold uppercase tracking-wider">प्रकाशित (Live)</p>
            <h4 className="text-xl font-extrabold text-green-300">{stats.published}</h4>
          </div>
        </div>

        <div className="bg-coffee-900/80 border border-gold-500/30 p-3.5 rounded-2xl flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-gray-600/20 border border-gray-500/40 text-gray-400 flex items-center justify-center shrink-0">
            <EyeOff size={20} />
          </div>
          <div>
            <p className="text-[11px] text-gold-300/70 font-semibold uppercase tracking-wider">छिपे हुए (Hidden)</p>
            <h4 className="text-xl font-extrabold text-gold-200/60">{stats.hidden}</h4>
          </div>
        </div>

        <div className="bg-coffee-900/80 border border-gold-500/30 p-3.5 rounded-2xl flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-saffron-500/20 border border-saffron-400/40 text-saffron-300 flex items-center justify-center shrink-0">
            <Star size={20} className="fill-current" />
          </div>
          <div>
            <p className="text-[11px] text-gold-300/70 font-semibold uppercase tracking-wider">विशेष (Featured)</p>
            <h4 className="text-xl font-extrabold text-saffron-300">{stats.featured}</h4>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-green-950/80 border border-green-500/40 rounded-xl text-green-300 text-xs font-bold text-center animate-fade-in">
          {feedbackMsg}
        </div>
      )}

      {/* 2. Add / Edit Video Form */}
      <div className="p-5 rounded-2xl bg-coffee-900/50 border border-gold-500/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-gold-500/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-600 text-white">
              <Film size={16} />
            </div>
            <h4 className="text-sm font-bold text-gold-200">
              {editingId ? 'वीडियो संपादित करें (Edit Video)' : 'नया YouTube वीडियो जोड़ें (Add YouTube Video)'}
            </h4>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs text-gold-300 hover:text-white underline flex items-center gap-1"
            >
              <RotateCcw size={12} />
              <span>रद्द करें (Cancel)</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Column: Form Fields */}
            <div className="md:col-span-8 space-y-3.5">
              {/* YouTube Link Input */}
              <div>
                <label className="block text-xs font-bold text-gold-200 mb-1">
                  1. YouTube वीडियो URL / लिंक <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="उदा. https://www.youtube.com/watch?v=dQw4w9WgXcQ या https://youtu.be/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-coffee-950 border border-gold-500/40 text-gold-100 text-xs focus:outline-none focus:border-gold-400"
                  required
                />
                <p className="text-[10px] text-gold-300/60 mt-1">
                  💡 किसी भी फॉर्मेट का YouTube लिंक पेस्ट करें। थंबनेल स्वतः जनरेट हो जाएगा।
                </p>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-gold-200 mb-1">
                  2. वीडियो शीर्षक (Title) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="उदा. महावतार बाबाजी की अमूल्य साधना व चेतना संदेश"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-coffee-950 border border-gold-500/40 text-gold-100 text-xs focus:outline-none focus:border-gold-400"
                  required
                />
              </div>

              {/* Short Description Input */}
              <div>
                <label className="block text-xs font-semibold text-gold-200/80 mb-1">
                  3. विवरण (Short Description - ऐच्छिक)
                </label>
                <textarea
                  rows={2}
                  placeholder="वीडियो के बारे में संक्षिप्त जानकारी..."
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-coffee-950 border border-gold-500/40 text-gold-100 text-xs focus:outline-none focus:border-gold-400 resize-none"
                />
              </div>

              {/* Category & Display Order Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gold-200/80 mb-1">
                    4. श्रेणी (Category)
                  </label>
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-coffee-950 border border-gold-500/40 text-gold-100 text-xs"
                  >
                    <option value="ध्यान व साधना">ध्यान व साधना</option>
                    <option value="प्रवचन व सत्संग">प्रवचन व सत्संग</option>
                    <option value="सेवा कार्य">सेवा कार्य</option>
                    <option value="मंत्र व यज्ञ">मंत्र व यज्ञ</option>
                    <option value="custom">+ नई श्रेणी लिखें...</option>
                  </select>

                  {categoryInput === 'custom' && (
                    <input
                      type="text"
                      placeholder="श्रेणी का नाम लिखें..."
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full mt-2 px-3 py-1.5 rounded-lg bg-coffee-950 border border-gold-500/40 text-gold-100 text-xs"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gold-200/80 mb-1">
                    5. प्रदर्शन क्रम (Display Order)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={orderInput}
                    onChange={(e) => setOrderInput(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-coffee-950 border border-gold-500/40 text-gold-100 text-xs"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-gold-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublishedInput}
                    onChange={(e) => setIsPublishedInput(e.target.checked)}
                    className="w-4 h-4 rounded accent-saffron-500 cursor-pointer"
                  />
                  <span>वेबसाइट पर दिखाएं (Live / Published)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-saffron-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeaturedInput}
                    onChange={(e) => setIsFeaturedInput(e.target.checked)}
                    className="w-4 h-4 rounded accent-saffron-500 cursor-pointer"
                  />
                  <span>⭐ विशेष वीडियो (Pin as Featured)</span>
                </label>
              </div>
            </div>

            {/* Right Column: Live Auto-Generated Thumbnail Preview */}
            <div className="md:col-span-4 flex flex-col justify-between p-3.5 bg-coffee-950 rounded-2xl border border-gold-500/20">
              <div>
                <span className="text-[11px] font-bold text-gold-300/80 uppercase tracking-wider block mb-2">
                  📸 ऑटो थंबनेल पूर्वावलोकन (Preview)
                </span>

                {detectedVideoId ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-gold-500/30 group">
                    <img
                      src={liveThumbnailUrl}
                      alt="Thumbnail Preview"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getYouTubeFallbackThumbnailUrl(detectedVideoId);
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                        <Youtube size={20} />
                      </div>
                    </div>
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-[10px] text-green-400 font-mono rounded">
                      ID: {detectedVideoId}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video rounded-xl bg-coffee-900 border border-dashed border-gold-500/30 flex flex-col items-center justify-center text-center p-3 text-gold-300/50">
                    <AlertCircle size={24} className="mb-1 text-gold-500/40" />
                    <p className="text-[11px]">YouTube लिंक दर्ज करते ही थंबनेल दिखेगा</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gold-500/20 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-saffron-500 to-gold-500 text-coffee-50 font-bold text-xs shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check size={16} />
                  <span>{editingId ? 'अपडेट करें' : 'वीडियो सहेजें'}</span>
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-3 py-2.5 rounded-xl bg-coffee-900 text-gold-300 hover:text-white border border-gold-500/30 text-xs font-semibold"
                  >
                    रद्द
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* 3. Managed Videos List / Table */}
      <div className="space-y-3">
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-coffee-950 p-3 rounded-2xl border border-gold-500/20">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <span className="text-xs text-gold-300/70 font-semibold whitespace-nowrap">फ़िल्टर:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-gold-500 text-coffee-50 font-bold'
                  : 'text-gold-300 hover:bg-coffee-900'
              }`}
            >
              सभी ({videos.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'published'
                  ? 'bg-green-600 text-white font-bold'
                  : 'text-gold-300 hover:bg-coffee-900'
              }`}
            >
              प्रकाशित ({stats.published})
            </button>
            <button
              onClick={() => setStatusFilter('hidden')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'hidden'
                  ? 'bg-gray-700 text-white font-bold'
                  : 'text-gold-300 hover:bg-coffee-900'
              }`}
            >
              छिपे ({stats.hidden})
            </button>
            <button
              onClick={() => setStatusFilter('featured')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'featured'
                  ? 'bg-saffron-500 text-coffee-50 font-bold'
                  : 'text-gold-300 hover:bg-coffee-900'
              }`}
            >
              विशेष ({stats.featured})
            </button>
          </div>

          <div className="relative w-full sm:w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-400/60" />
            <input
              type="text"
              placeholder="खोजें..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-coffee-900 border border-gold-500/30 text-xs text-gold-100 placeholder-gold-300/40 focus:outline-none"
            />
          </div>
        </div>

        {/* Video Cards Grid in Admin */}
        {filteredVideosList.length === 0 ? (
          <div className="p-8 text-center bg-coffee-950 rounded-2xl border border-gold-500/20 text-gold-300/60 text-xs">
            कोई वीडियो मौजूद नहीं है। ऊपर दिए गए फॉर्म से नया YouTube वीडियो जोड़ें।
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredVideosList.map((video) => (
              <div
                key={video.id}
                className={`p-3 rounded-2xl bg-coffee-950 border transition-all flex flex-col sm:flex-row items-center justify-between gap-3 ${
                  editingId === video.id
                    ? 'border-gold-400 bg-coffee-900/90 ring-2 ring-gold-400/30'
                    : 'border-gold-500/20 hover:border-gold-500/40'
                }`}
              >
                {/* Left: Thumbnail & Main Info */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative w-24 aspect-video rounded-xl overflow-hidden bg-black shrink-0 border border-gold-500/30">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getYouTubeFallbackThumbnailUrl(video.videoId);
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Youtube size={16} className="text-red-500" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="px-2 py-0.5 rounded bg-coffee-900 border border-gold-500/30 text-gold-300 text-[10px] font-semibold">
                        {video.category}
                      </span>
                      <span className="text-[10px] text-gold-400/60 font-mono">
                        क्रम: #{video.displayOrder}
                      </span>
                    </div>

                    <h5 className="text-xs font-bold text-gold-100 truncate max-w-sm">
                      {video.title}
                    </h5>

                    {video.description && (
                      <p className="text-[11px] text-gold-300/60 truncate max-w-sm">
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Badges & Action Buttons */}
                <div className="flex items-center justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gold-500/10">
                  {/* Status Toggle Button */}
                  <button
                    type="button"
                    onClick={() => togglePublished(video.id)}
                    title={video.isPublished ? 'छिपाएं (Hide)' : 'प्रकाशित करें (Publish)'}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      video.isPublished
                        ? 'bg-green-950/80 text-green-300 border border-green-500/40 hover:bg-green-900'
                        : 'bg-gray-900 text-gray-400 border border-gray-700 hover:bg-gray-800'
                    }`}
                  >
                    {video.isPublished ? <Eye size={13} /> : <EyeOff size={13} />}
                    <span>{video.isPublished ? 'प्रकाशित' : 'छिपा हुआ'}</span>
                  </button>

                  {/* Featured Toggle Button */}
                  <button
                    type="button"
                    onClick={() => toggleFeatured(video.id)}
                    title={video.isFeatured ? 'विशेष से हटाएं' : 'विशेष (Pin) बनाएं'}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      video.isFeatured
                        ? 'bg-saffron-500 text-coffee-50 border-saffron-400'
                        : 'bg-coffee-900 text-gold-300/60 border-gold-500/20 hover:text-gold-200'
                    }`}
                  >
                    <Star size={14} className={video.isFeatured ? 'fill-current' : ''} />
                  </button>

                  {/* Open Link */}
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-coffee-900 text-gold-300 hover:text-white border border-gold-500/20"
                    title="YouTube पर खोलें"
                  >
                    <ExternalLink size={14} />
                  </a>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => handleStartEdit(video)}
                    title="संपादित करें"
                    className="p-1.5 rounded-lg bg-coffee-900 text-gold-200 hover:text-saffron-300 border border-gold-500/30 transition-all cursor-pointer"
                  >
                    <Pencil size={14} />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDelete(video)}
                    title="हटाएं"
                    className="p-1.5 rounded-lg bg-red-950/80 text-red-300 hover:bg-red-600 hover:text-white border border-red-500/40 transition-all cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminYouTubeManager;
