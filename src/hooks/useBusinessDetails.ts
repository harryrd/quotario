
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface BusinessDetails {
  id?: string;
  company_name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo_url: string;
}

export const useBusinessDetails = (user: User | null) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    company_name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    logo_url: '',
  });

  // Fetch business details on component mount
  useEffect(() => {
    if (!user) return;

    const fetchBusinessDetails = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('business_details')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching business details:', error);
          toast.error('Failed to load business details');
          return;
        }

        if (data) {
          setBusinessDetails({
            id: data.id,
            company_name: data.company_name,
            address: data.address || '',
            phone: data.phone || '',
            email: data.email || '',
            website: data.website || '',
            logo_url: data.logo_url || '',
          });
        }
      } catch (error) {
        console.error('Error in fetchBusinessDetails:', error);
        toast.error('Failed to load business details');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessDetails();
  }, [user]);

  const uploadLogo = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    try {
      console.log('Starting logo upload');
      
      // Create a unique file path - now following the folder structure required by RLS
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('logos')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading logo:', uploadError);
        throw uploadError;
      }
      
      console.log('Upload successful:', uploadData);
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(filePath);
      
      console.log('Logo public URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
      return null;
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a local preview
      const objectUrl = URL.createObjectURL(file);
      setBusinessDetails({ ...businessDetails, logo_url: objectUrl });
      setLogoFile(file);
    }
  };

  const saveBusinessDetails = async () => {
    if (!user) {
      toast.error('You must be logged in to save business details');
      return;
    }

    try {
      setSaving(true);

      // Upload logo if there's a new one
      let logoUrl = businessDetails.logo_url;
      if (logoFile) {
        const newLogoUrl = await uploadLogo(logoFile);
        if (newLogoUrl) {
          logoUrl = newLogoUrl;
        } else if (logoUrl.startsWith('blob:')) {
          // If upload failed but we're using a local preview, try to get the original logo
          const { data } = await supabase
            .from('business_details')
            .select('logo_url')
            .eq('user_id', user.id)
            .single();
          
          if (data && data.logo_url) {
            logoUrl = data.logo_url;
            toast.error('Logo upload failed, keeping previous logo');
          }
        }
      }

      const detailsToUpsert = {
        user_id: user.id,
        company_name: businessDetails.company_name,
        address: businessDetails.address,
        phone: businessDetails.phone,
        email: businessDetails.email,
        website: businessDetails.website,
        logo_url: logoUrl,
      };

      const { error } = await supabase
        .from('business_details')
        .upsert(detailsToUpsert, { onConflict: 'user_id' });

      if (error) {
        console.error('Error saving business details:', error);
        toast.error('Failed to save business details');
        return;
      }

      // Update the business details with the new logo URL
      setBusinessDetails({ ...businessDetails, logo_url: logoUrl });
      setLogoFile(null);
      
      toast.success('Business details saved successfully');
    } catch (error) {
      console.error('Error in saveBusinessDetails:', error);
      toast.error('Failed to save business details');
    } finally {
      setSaving(false);
    }
  };

  return {
    businessDetails,
    setBusinessDetails,
    logoFile,
    handleLogoChange,
    saveBusinessDetails,
    loading,
    saving
  };
};
