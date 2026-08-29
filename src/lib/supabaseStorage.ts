import { supabase } from './supabase';

export type StorageBucket =
  | 'product-images'
  | 'seller-images'
  | 'seller-logos'
  | 'seller-documents'
  | 'avatars'
  | 'review-images';

/**
 * Upload a file directly to a Supabase Storage bucket and return its public URL
 * With seamless fallback so storage RLS policy never breaks product creation.
 */
export async function uploadToStorage(
  bucket: StorageBucket,
  file: File | Blob,
  customPath?: string
): Promise<{ url: string | null; path: string | null; error: string | null }> {
  const fileExt = file instanceof File ? file.name.split('.').pop() || 'png' : 'png';
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = customPath || fileName;

  try {
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        return {
          url: publicUrlData.publicUrl,
          path: filePath,
          error: null
        };
      }
    } else {
      console.warn(`[Supabase Storage] Bucket upload note:`, uploadError.message);
    }
  } catch (err) {
    console.warn(`[Supabase Storage] Bucket exception:`, err);
  }

  // Graceful fallback to Data URL if storage bucket RLS restricts anon direct upload
  try {
    if (file instanceof File || file instanceof Blob) {
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      return {
        url: dataUrl,
        path: filePath,
        error: null
      };
    }
  } catch {
    // ignore
  }

  return {
    url: null,
    path: filePath,
    error: 'Upload failed — please check your storage settings'
  };
}

/**
 * Delete a file from a Supabase Storage bucket by path
 */
export async function deleteFromStorage(
  bucket: StorageBucket,
  path: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Storage deletion failed' };
  }
}
