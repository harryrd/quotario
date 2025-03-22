
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Upload, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthContext';

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

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
  }, [user]);

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      setAvatarUrl(publicUrl);
      toast.success('Avatar updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a local preview
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
      
      // Upload to Supabase
      uploadAvatar(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
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
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatarUrl} alt={fullName} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {fullName ? fullName.split(' ').map(name => name[0]).join('') : '?'}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <Label htmlFor="avatar-upload" className="cursor-pointer">
            <div className="flex items-center gap-2 text-sm text-primary hover:underline">
              <Upload className="h-4 w-4" />
              <span>Change avatar</span>
            </div>
          </Label>
          <Input 
            id="avatar-upload" 
            type="file" 
            accept="image/*"
            className="hidden" 
            onChange={handleAvatarChange}
            disabled={loading}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full-name">Full Name</Label>
          <div className="relative">
            <Input
              id="full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="pl-9"
              disabled={loading}
            />
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={email}
              className="pl-9"
              disabled={true} // Email can't be changed directly
              readOnly
            />
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default ProfileSettings;
