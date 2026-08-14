import { saveSupabaseVideoDoc, deleteSupabaseVideoDoc, fetchSupabaseVideos } from '../supabase';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface YouTubeVideoItem {
  id: string;
  url: string;
  videoId: string;
  title: string;
  description?: string;
  category: string;
  displayOrder: number;
  isPublished: boolean;
  isFeatured: boolean;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
}

export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function getYouTubeFallbackThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export const DEFAULT_YOUTUBE_VIDEOS: YouTubeVideoItem[] = [];

const LOCAL_STORAGE_KEY = 'peeth_youtube_videos_v1';

interface YouTubeContextType {
  videos: YouTubeVideoItem[];
  publishedVideos: YouTubeVideoItem[];
  showYouTubeSection: boolean;
  toggleShowYouTubeSection: (val?: boolean) => Promise<void>;
  addVideo: (data: Omit<YouTubeVideoItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateVideo: (id: string, data: Partial<YouTubeVideoItem>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  togglePublished: (id: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  reorderVideos: (newOrder: YouTubeVideoItem[]) => Promise<void>;
  isLoading: boolean;
  stats: {
    total: number;
    published: number;
    hidden: number;
    featured: number;
  };
}

const YouTubeContext = createContext<YouTubeContextType | undefined>(undefined);

export const YouTubeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<YouTubeVideoItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.log('LocalStorage videos parse warning:', e);
    }
    return DEFAULT_YOUTUBE_VIDEOS;
  });

  const [showYouTubeSection, setShowYouTubeSection] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('peeth_show_youtube_section');
      if (saved !== null) return JSON.parse(saved);
    } catch (_) {}
    return true;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 0. Check settings in Firestore for showYouTubeSection
    try {
      const settingsDocRef = doc(db, 'site_settings', 'youtube_settings');
      const unsubSettings = onSnapshot(settingsDocRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (typeof data.showSection === 'boolean') {
            setShowYouTubeSection(data.showSection);
            try {
              localStorage.setItem('peeth_show_youtube_section', JSON.stringify(data.showSection));
            } catch (_) {}
          }
        }
      }, (err) => {
        console.log('Firestore snapshot error for youtube_settings:', err);
      });
      return () => unsubSettings();
    } catch (e) {
      console.log('Settings listener note:', e);
    }
  }, []);

useEffect(() => {
    // 1. Fetch from Supabase on mount
    fetchSupabaseVideos().then((supaList) => {
      if (supaList && supaList.length > 0) {
        const filteredList = supaList.filter(v => !v.id.startsWith('yt_default_'));
        setVideos(filteredList);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredList));
        } catch (e) {
          console.log(e);
        }
      }
    }).catch(() => {});

    // 2. Real-time Firestore sync
    try {
      const colRef = collection(db, 'youtube_videos');
      const unsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: YouTubeVideoItem[] = [];
            let foundDefault = false;
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              if (docSnap.id.startsWith('yt_default_')) {
                foundDefault = true;
                // Auto-delete existing default videos so they are completely removed
                deleteDoc(doc(db, 'youtube_videos', docSnap.id)).catch(console.error);
                deleteSupabaseVideoDoc(docSnap.id).catch(console.error);
              } else {
                list.push({
                  id: docSnap.id,
                  url: data.url || '',
                  videoId: data.videoId || '',
                  title: data.title || '',
                  description: data.description || '',
                  category: data.category || 'सत्संग व साधना',
                  displayOrder: data.displayOrder ?? 0,
                  isPublished: data.isPublished ?? true,
                  isFeatured: data.isFeatured ?? false,
                  thumbnailUrl: data.thumbnailUrl || getYouTubeThumbnailUrl(data.videoId || ''),
                  createdAt: data.createdAt || new Date().toISOString(),
                  updatedAt: data.updatedAt || new Date().toISOString(),
                });
              }
            });

            if (foundDefault) {
              // We found default videos and triggered deletion.
              // We will just continue and render the list without them.
            }

            // Sort by displayOrder ascending, then createdAt descending
            list.sort((a, b) => {
              if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });

            setVideos(list);
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
            } catch (e) {
              console.log(e);
            }
          } else {
            setVideos([]);
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
            } catch (e) {
              console.log(e);
            }
          }
          setIsLoading(false);
        },
        (err) => {
          console.log('Firestore snapshot error for youtube_videos:', err);
          setIsLoading(false);
        }
      );

      return () => {
      unsubscribe();
    };
    } catch (e) {
      console.error('Failed to attach youtube_videos listener:', e);
      setIsLoading(false);
    }
  }, []);

  const toggleShowYouTubeSection = async (val?: boolean) => {
    const nextVal = val !== undefined ? val : !showYouTubeSection;
    setShowYouTubeSection(nextVal);
    try {
      localStorage.setItem('peeth_show_youtube_section', JSON.stringify(nextVal));
    } catch (_) {}

    try {
      await setDoc(doc(db, 'site_settings', 'youtube_settings'), {
        showSection: nextVal,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      console.error('Failed to save YouTube section visibility to Firestore:', e);
    }
  };

  const saveVideoLocallyAndRemote = async (video: YouTubeVideoItem) => {
    // 1. Local state update
    setVideos((prev) => {
      const exists = prev.some((v) => v.id === video.id);
      let updated: YouTubeVideoItem[];
      if (exists) {
        updated = prev.map((v) => (v.id === video.id ? video : v));
      } else {
        updated = [...prev, video];
      }
      updated.sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.log(e);
      }
      return updated;
    });

    // 2. Save to Firestore
    try {
      await setDoc(doc(db, 'youtube_videos', video.id), video, { merge: true });
    saveSupabaseVideoDoc(video);
    } catch (e) {
      console.error('Failed to save video to Firestore:', e);
    }
    
  };

  const addVideo = async (
    data: Omit<YouTubeVideoItem, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const id = 'yt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const now = new Date().toISOString();
    const newVideo: YouTubeVideoItem = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    await saveVideoLocallyAndRemote(newVideo);
  };

  const updateVideo = async (id: string, data: Partial<YouTubeVideoItem>) => {
    const existing = videos.find((v) => v.id === id);
    if (!existing) return;
    const updated: YouTubeVideoItem = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await saveVideoLocallyAndRemote(updated);
  };

  const deleteVideo = async (id: string) => {
    setVideos((prev) => {
      const filtered = prev.filter((v) => v.id !== id);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      } catch (e) {
        console.log(e);
      }
      return filtered;
    });

    try {
      await deleteDoc(doc(db, 'youtube_videos', id));
    deleteSupabaseVideoDoc(id);
    } catch (e) {
      console.error('Failed to delete video from Firestore:', e);
    }
    
  };

  const togglePublished = async (id: string) => {
    const v = videos.find((item) => item.id === id);
    if (v) {
      await updateVideo(id, { isPublished: !v.isPublished });
    }
  };

  const toggleFeatured = async (id: string) => {
    const v = videos.find((item) => item.id === id);
    if (v) {
      await updateVideo(id, { isFeatured: !v.isFeatured });
    }
  };

  const reorderVideos = async (newOrder: YouTubeVideoItem[]) => {
    const updated = newOrder.map((item, index) => ({
      ...item,
      displayOrder: index + 1,
      updatedAt: new Date().toISOString(),
    }));

    setVideos(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.log(e);
    }

    for (const v of updated) {
      setDoc(doc(db, 'youtube_videos', v.id), v, { merge: true }).catch(console.error);
    }
  };

  const publishedVideos = videos.filter((v) => v.isPublished);

  const stats = {
    total: videos.length,
    published: videos.filter((v) => v.isPublished).length,
    hidden: videos.filter((v) => !v.isPublished).length,
    featured: videos.filter((v) => v.isFeatured && v.isPublished).length,
  };

  return (
    <YouTubeContext.Provider
      value={{
        videos,
        publishedVideos,
        showYouTubeSection,
        toggleShowYouTubeSection,
        addVideo,
        updateVideo,
        deleteVideo,
        togglePublished,
        toggleFeatured,
        reorderVideos,
        isLoading,
        stats,
      }}
    >
      {children}
    </YouTubeContext.Provider>
  );
};

export const useYouTubeContext = () => {
  const context = useContext(YouTubeContext);
  if (!context) {
    throw new Error('useYouTubeContext must be used within a YouTubeProvider');
  }
  return context;
};
