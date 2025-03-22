
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthContext';
import AvatarUploader from './AvatarUploader';
import ProfileForm from './ProfileForm';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  
  const {
    avatarUrl,
    setAvatarUrl,
    avatarFile,
    setAvatarFile,
    uploadAvatar,
    handleAvatarChange,
    resetAvatarState,
    loading,
    setLoading
  } = useAvatarUpload(user?.id);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setInitialLoading(true);
        
        // Get profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          throw error;
        }
        
        if (data) {
          setFullName(data.full_name || '');
          setAvatarUrl(data.avatar_url || '');
        }
        
        setEmail(user.email || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, setAvatarUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Upload avatar if we have a new one
      let finalAvatarUrl = avatarUrl;
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(avatarFile);
        if (uploadedUrl) {
          finalAvatarUrl = uploadedUrl;
        } else {
          // If upload failed but we're using a local preview, don't update the avatar URL
          if (avatarUrl.startsWith('blob:')) {
            toast.error('Avatar upload failed, keeping previous avatar');
            finalAvatarUrl = await resetAvatarState();
          }
        }
      }
      
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: finalAvatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Update state with the new avatar URL
      setAvatarUrl(finalAvatarUrl);
      setAvatarFile(null);
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <AvatarUploader 
        avatarUrl={avatarUrl}
        fullName={fullName}
        handleAvatarChange={handleAvatarChange}
        disabled={loading}
      />

      <ProfileForm
        fullName={fullName}
        setFullName={setFullName}
        email={email}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </motion.div>
  );
};

export default ProfileSettings;
