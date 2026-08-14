import React, { useState, useMemo } from 'react';
import { Play, Search, Youtube, ExternalLink, Sparkles, Filter, ChevronDown, Radio } from 'lucide-react';
import { useYouTubeContext, getYouTubeFallbackThumbnailUrl, YouTubeVideoItem } from '../context/YouTubeContext';

export const YouTubeSection: React.FC = () => {
  const { publishedVideos, showYouTubeSection } = useYouTubeContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(8);

  if (!showYouTubeSection) {
    return null;
  }

  // Extract unique categories from published videos
  const categories = useMemo(() => {
    const defaultCats = ['सभी', 'ध्यान व साधना', 'प्रवचन व सत्संग', 'सेवा कार्य', 'मंत्र व यज्ञ'];
    const catsInVideos = Array.from(new Set(publishedVideos.map((v) => v.category).filter(Boolean)));
    const merged = ['all', ...Array.from(new Set([...defaultCats.slice(1), ...catsInVideos]))];
    return merged;
  }, [publishedVideos]);

  // Featured video
  const featuredVideo = useMemo(() => {
    return publishedVideos.find((v) => v.isFeatured) || publishedVideos[0];
  }, [publishedVideos]);

  // Filtered video list
  const filteredVideos = useMemo(() => {
    return publishedVideos.filter((v) => {
      const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [publishedVideos, selectedCategory, searchQuery]);

  const displayedVideos = useMemo(() => {
    return filteredVideos.slice(0, visibleCount);
  }, [filteredVideos, visibleCount]);

  const handleOpenVideo = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="videos" className="py-20 relative bg-coffee-950 text-gold-100 overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-saffron-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Youtube size={16} className="text-red-500 animate-pulse" />
            <span>पावन वीडियो संदेश व सत्संग</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-300 to-saffron-400 mb-4 leading-tight">
            सत्संग व साधना वीडियो (YouTube)
          </h2>

          <p className="text-gold-200/80 text-base sm:text-lg leading-relaxed">
            श्री श्री १००८ अनंत विभूषित महामंडलेश्वर स्वामी डॉ. निर्मल जी महाराज के दिव्य प्रवचन, सरल ध्यान साधना शिविर एवं गुरु सेवा धाम की पावन गतिविधियों के वीडियो देखें।
          </p>
        </div>

        {/* Featured Video Highlight Banner (if available) */}
        {featuredVideo && (
          <div className="mb-14 rounded-3xl overflow-hidden border border-gold-500/30 bg-gradient-to-br from-coffee-900/90 via-coffee-950 to-coffee-900 shadow-2xl transition-all duration-300 hover:border-gold-500/50">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
              {/* Thumbnail Container with Play Overlay */}
              <div
                onClick={() => handleOpenVideo(featuredVideo.url)}
                className="lg:col-span-7 relative group cursor-pointer overflow-hidden aspect-video bg-coffee-950"
              >
                <img
                  src={featuredVideo.thumbnailUrl}
                  alt={featuredVideo.title}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getYouTubeFallbackThumbnailUrl(featuredVideo.videoId);
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-coffee-950/90 via-black/30 to-transparent group-hover:via-black/20 transition-all" />

                {/* Live Badge & Category */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Radio size={12} className="animate-ping" />
                    <span>विशेष वीडियो</span>
                  </span>
                  {featuredVideo.category && (
                    <span className="px-3 py-1 rounded-full bg-coffee-950/80 border border-gold-500/40 text-gold-300 text-xs font-semibold backdrop-blur-md">
                      {featuredVideo.category}
                    </span>
                  )}
                </div>

                {/* Center Giant Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-600/50 group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300">
                    <Play size={32} className="ml-1 fill-current" />
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-black/80 text-[11px] text-gold-200 font-mono flex items-center gap-1">
                  <ExternalLink size={11} />
                  <span>YouTube पर देखें</span>
                </div>
              </div>

              {/* Info Details */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-4">
                <div className="flex items-center gap-2 text-saffron-400 text-xs font-bold uppercase tracking-widest">
                  <Sparkles size={14} />
                  <span>मुख्य आकर्षण (Featured Video)</span>
                </div>

                <h3
                  onClick={() => handleOpenVideo(featuredVideo.url)}
                  className="text-xl sm:text-2xl font-bold text-gold-100 hover:text-saffron-400 transition-colors cursor-pointer leading-snug line-clamp-2"
                >
                  {featuredVideo.title}
                </h3>

                {featuredVideo.description && (
                  <p className="text-gold-200/70 text-sm leading-relaxed line-clamp-3">
                    {featuredVideo.description}
                  </p>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => handleOpenVideo(featuredVideo.url)}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-saffron-600 hover:from-red-500 hover:to-saffron-500 text-white font-bold text-sm shadow-xl shadow-red-950/50 hover:shadow-red-600/30 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <Play size={18} className="fill-current group-hover:scale-110 transition-transform" />
                    <span>YouTube पर तुरंत चलाएं</span>
                    <ExternalLink size={14} className="ml-1 opacity-80" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {publishedVideos.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-gold-500/30 bg-gradient-to-br from-coffee-900/90 via-coffee-950 to-coffee-900 p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center shadow-inner">
              <Youtube size={44} />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-gold-100 mb-3">
              स्वामी डॉ. निर्मल जी महाराज - ऑफिशियल यूट्यूब चैनल
            </h3>

            <p className="text-gold-200/80 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              पूज्य गुरुदेव के पावन सत्संग, सरल ध्यान साधना विधि, मां बगलामुखी हवन एवं सेवा गतिविधियों के वीडियो देखने के लिए हमारे आधिकारिक यूट्यूब चैनल पर पधारें।
            </p>

            <a
              href="https://youtube.com/@dr.nirmalgirimaharaj?si=gWx7yYJGfZ42bGA0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-base shadow-xl shadow-red-950/60 hover:scale-105 transition-all duration-300"
            >
              <Youtube size={22} className="fill-current" />
              <span>यूट्यूब चैनल पर जाएं एवं सब्सक्राइब करें</span>
              <ExternalLink size={18} />
            </a>
          </div>
        ) : (
          <>
            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-coffee-900/60 p-4 rounded-2xl border border-gold-500/20 backdrop-blur-md">
              {/* Category Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  const label = cat === 'all' ? 'सभी वीडियो' : cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setVisibleCount(8);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-saffron-500 to-gold-500 text-coffee-50 shadow-md font-bold'
                          : 'bg-coffee-950/80 text-gold-300/80 hover:text-gold-100 hover:bg-coffee-900 border border-gold-500/20'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-400/60" />
                <input
                  type="text"
                  placeholder="वीडियो खोजें (Search)..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(8);
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-coffee-950 border border-gold-500/30 text-xs sm:text-sm text-gold-100 placeholder-gold-300/40 focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>
            </div>

            {/* Videos Grid */}
            {filteredVideos.length === 0 ? (
              <div className="text-center py-16 px-4 bg-coffee-900/30 rounded-3xl border border-gold-500/20 max-w-md mx-auto">
                <Youtube size={48} className="mx-auto text-gold-500/40 mb-3" />
                <h4 className="text-lg font-bold text-gold-200 mb-1">कोई वीडियो नहीं मिला</h4>
                <p className="text-xs text-gold-300/60">
                  कृपया अन्य श्रेणी चुनें या खोज शब्द बदलें।
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedVideos.map((video) => (
                  <VideoCard key={video.id} video={video} onOpen={handleOpenVideo} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {filteredVideos.length > visibleCount && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="px-8 py-3.5 rounded-2xl bg-coffee-900 hover:bg-coffee-800 border border-gold-500/40 text-gold-200 hover:text-white text-sm font-bold shadow-lg hover:border-gold-500 transition-all flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <span>और वीडियो देखें ({filteredVideos.length - visibleCount} अधिक)</span>
                  <ChevronDown size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

// Sub-component: Individual Video Card
const VideoCard: React.FC<{ video: YouTubeVideoItem; onOpen: (url: string) => void }> = ({ video, onOpen }) => {
  return (
    <div
      onClick={() => onOpen(video.url)}
      className="group cursor-pointer rounded-2xl overflow-hidden bg-coffee-900/60 border border-gold-500/20 hover:border-gold-500/60 shadow-lg hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1.5"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video bg-coffee-950 overflow-hidden">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getYouTubeFallbackThumbnailUrl(video.videoId);
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dark Overlay on Hover */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

        {/* Category Tag */}
        {video.category && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="px-2.5 py-0.5 rounded-md bg-coffee-950/80 border border-gold-500/30 text-gold-300 text-[11px] font-semibold backdrop-blur-md">
              {video.category}
            </span>
          </div>
        )}

        {/* Red YouTube Play Badge */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-600 transition-all duration-300">
            <Play size={22} className="ml-0.5 fill-current" />
          </div>
        </div>

        {/* External Link Hint */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-gold-200/90 font-mono flex items-center gap-1 opacity-90">
          <ExternalLink size={10} />
          <span>YouTube</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col justify-between flex-grow space-y-2">
        <h4 className="text-sm font-bold text-gold-100 group-hover:text-saffron-400 transition-colors line-clamp-2 leading-snug">
          {video.title}
        </h4>

        {video.description && (
          <p className="text-xs text-gold-200/60 line-clamp-2 leading-relaxed">
            {video.description}
          </p>
        )}

        <div className="pt-2 mt-auto border-t border-gold-500/10 flex items-center justify-between text-[11px] text-gold-300/70 font-semibold">
          <span className="flex items-center gap-1 text-saffron-400 group-hover:translate-x-1 transition-transform">
            <span>देखें</span>
            <ExternalLink size={11} />
          </span>

          <span className="text-[10px] text-gold-400/50">
            {new Date(video.createdAt).toLocaleDateString('hi-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
export default YouTubeSection;
