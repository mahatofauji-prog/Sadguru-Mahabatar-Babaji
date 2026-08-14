import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://pgmrntffpeepzewvvcon.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_coAW-Q6ZaTt2uuJnDWzbUQ_L9IKSTzw';

function isValidHttpUrl(urlStr: unknown): boolean {
  if (!urlStr || typeof urlStr !== 'string') return false;
  try {
    const url = new URL(urlStr.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

function getSafeSupabaseConfig(): { url: string; key: string } {
  const meta = import.meta as unknown as { env?: Record<string, string> };
  const envUrl = meta.env?.VITE_SUPABASE_URL;
  const envKey = meta.env?.VITE_SUPABASE_ANON_KEY;

  const url = isValidHttpUrl(envUrl) ? (envUrl as string).trim() : DEFAULT_SUPABASE_URL;
  const key =
    typeof envKey === 'string' && envKey.trim().length > 0
      ? envKey.trim()
      : DEFAULT_SUPABASE_KEY;

  return { url, key };
}

let supabaseInstance: SupabaseClient;

try {
  const { url, key } = getSafeSupabaseConfig();
  supabaseInstance = createClient(url, key);
} catch (e) {
  console.log('Failed to initialize Supabase client with environment config:', e);
  try {
    supabaseInstance = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_KEY);
  } catch (err) {
    console.error('Fatal error initializing Supabase client:', err);
    supabaseInstance = createClient('https://placeholder.supabase.co', 'placeholder');
  }
}

export const supabase = supabaseInstance;

export interface SupabaseSiteImageDoc {
  id: string;
  url?: string;
  items?: any[];
  updated_at?: string;
}

export interface SupabaseSiteContentDoc {
  id: string;
  data: any;
  updated_at?: string;
}

/**
 * Upsert single image or gallery array to Supabase
 */
export async function saveSupabaseImageDoc(id: string, payload: { url?: string; items?: any[] }) {
  try {
    const { error } = await supabase
      .from('site_images')
      .upsert({
        id,
        ...payload,
        updated_at: new Date().toISOString(),
      });
    if (error) {
      console.log('Supabase site_images upsert notice:', error.message);
    }
  } catch (e) {
    console.log('Supabase site_images connection note:', e);
  }
}

/**
 * Fetch all site images from Supabase
 */
export async function fetchSupabaseImages(): Promise<Record<string, any> | null> {
  try {
    const { data, error } = await supabase.from('site_images').select('*');
    if (error || !data) return null;
    const result: Record<string, any> = {};
    data.forEach((row: any) => {
      if (row.id) {
        result[row.id] = row;
      }
    });
    return result;
  } catch (e) {
    console.log('Supabase fetch images notice:', e);
    return null;
  }
}

/**
 * Upsert site content to Supabase
 */
export async function saveSupabaseContentDoc(id: string, dataObj: any) {
  try {
    const { error } = await supabase
      .from('site_content')
      .upsert({
        id,
        data: dataObj,
        updated_at: new Date().toISOString(),
      });
    if (error) {
      console.log('Supabase site_content upsert notice:', error.message);
    }
  } catch (e) {
    console.log('Supabase site_content connection note:', e);
  }
}

/**
 * Fetch site content from Supabase
 */
export async function fetchSupabaseContent(id = 'main'): Promise<any | null> {
  try {
    const { data, error } = await supabase.from('site_content').select('*').eq('id', id).single();
    if (error || !data) return null;
    return data.data;
  } catch (e) {
    console.log('Supabase fetch content notice:', e);
    return null;
  }
}

/**
 * Upsert YouTube video to Supabase
 */
export async function saveSupabaseVideoDoc(videoData: any) {
  try {
    const { error } = await supabase
      .from('youtube_videos')
      .upsert({
        id: videoData.id,
        url: videoData.url,
        video_id: videoData.videoId,
        title: videoData.title,
        description: videoData.description,
        category: videoData.category,
        display_order: videoData.displayOrder,
        is_published: videoData.isPublished,
        is_featured: videoData.isFeatured,
        thumbnail_url: videoData.thumbnailUrl,
        updated_at: new Date().toISOString(),
      });
    if (error) {
      console.log('Supabase youtube_videos upsert notice:', error.message);
    }
  } catch (e) {
    console.log('Supabase youtube_videos connection note:', e);
  }
}

/**
 * Delete YouTube video from Supabase
 */
export async function deleteSupabaseVideoDoc(id: string) {
  try {
    const { error } = await supabase.from('youtube_videos').delete().eq('id', id);
    if (error) {
      console.log('Supabase delete video notice:', error.message);
    }
  } catch (e) {
    console.log('Supabase delete video connection note:', e);
  }
}

/**
 * Fetch YouTube videos from Supabase
 */
export async function fetchSupabaseVideos(): Promise<any[] | null> {
  try {
    const { data, error } = await supabase.from('youtube_videos').select('*');
    if (error || !data) return null;
    return data.map((row: any) => ({
      id: row.id,
      url: row.url,
      videoId: row.video_id || row.videoId,
      title: row.title,
      description: row.description || '',
      category: row.category || 'सत्संग व साधना',
      displayOrder: row.display_order ?? row.displayOrder ?? 0,
      isPublished: row.is_published ?? row.isPublished ?? true,
      isFeatured: row.is_featured ?? row.isFeatured ?? false,
      thumbnailUrl: row.thumbnail_url || row.thumbnailUrl,
      createdAt: row.created_at || row.createdAt || new Date().toISOString(),
      updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
    }));
  } catch (e) {
    console.log('Supabase fetch videos notice:', e);
    return null;
  }
}
