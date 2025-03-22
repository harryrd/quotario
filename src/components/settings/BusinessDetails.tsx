
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, Upload, Mail, Phone, Globe, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthContext';

interface BusinessDetails {
  id?: string;
  company_name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo_url: string;
}

const BusinessDetails: React.FC = () => {
  const { user } = useAuth();
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
    const fetchBusinessDetails = async () => {
      if (!user) return;

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

  const uploadLogo = async (file: File) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      console.error('Error in handleSubmit:', error);
      toast.error('Failed to save business details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading business details...</span>
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
        <Avatar className="h-20 w-20">
          <AvatarImage src={businessDetails.logo_url} alt={businessDetails.company_name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {businessDetails.company_name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <Label htmlFor="logo-upload" className="cursor-pointer">
            <div className="flex items-center gap-2 text-sm text-primary hover:underline">
              <Upload className="h-4 w-4" />
              <span>Change company logo</span>
            </div>
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            This logo will appear on your invoices and quotations
          </p>
          <Input 
            id="logo-upload" 
            type="file" 
            accept="image/*"
            className="hidden" 
            onChange={handleLogoChange}
            disabled={saving}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company-name">Company Name</Label>
          <div className="relative">
            <Input
              id="company-name"
              value={businessDetails.company_name}
              onChange={(e) => setBusinessDetails({...businessDetails, company_name: e.target.value})}
              className="pl-9"
              placeholder="Enter your company name"
              disabled={saving}
            />
            <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Company Address</Label>
          <Input
            id="address"
            value={businessDetails.address}
            onChange={(e) => setBusinessDetails({...businessDetails, address: e.target.value})}
            placeholder="Enter your company address"
            disabled={saving}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <div className="relative">
            <Input
              id="phone"
              value={businessDetails.phone}
              onChange={(e) => setBusinessDetails({...businessDetails, phone: e.target.value})}
              className="pl-9"
              placeholder="Enter your phone number"
              disabled={saving}
            />
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="business-email">Email</Label>
          <div className="relative">
            <Input
              id="business-email"
              type="email"
              value={businessDetails.email}
              onChange={(e) => setBusinessDetails({...businessDetails, email: e.target.value})}
              className="pl-9"
              placeholder="Enter your business email"
              disabled={saving}
            />
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <div className="relative">
            <Input
              id="website"
              value={businessDetails.website}
              onChange={(e) => setBusinessDetails({...businessDetails, website: e.target.value})}
              className="pl-9"
              placeholder="Enter your website URL (e.g. https://example.com)"
              disabled={saving}
            />
            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : 'Save Business Details'}
        </Button>
      </form>
    </motion.div>
  );
};

export default BusinessDetails;
