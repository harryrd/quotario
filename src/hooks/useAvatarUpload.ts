
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAvatarUpload = (userId: string | undefined) => {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!userId) return null;
    
    try {
      console.log('Starting avatar upload');
      
      // Create a unique file path - following the folder structure required by RLS
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error during avatar upload:', uploadError);
        throw uploadError;
      }
      
      console.log('Upload successful:', uploadData);
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      console.log('Avatar public URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
      return null;
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a local preview
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
      setAvatarFile(file);
    }
  };

  const resetAvatarState = async () => {
    if (!userId) return avatarUrl;
    
    // Fetch the current avatar URL from the database to reset the UI
    const { data } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', userId)
      .single();
    
    if (data && data.avatar_url) {
      setAvatarUrl(data.avatar_url);
      return data.avatar_url;
    }
    
    return avatarUrl;
  };

  return {
    avatarUrl,
    setAvatarUrl,
    avatarFile,
    setAvatarFile,
    uploadAvatar,
    handleAvatarChange,
    resetAvatarState,
    loading,
    setLoading
  };
};
