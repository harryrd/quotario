
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, Upload, Mail, Phone, Globe } from 'lucide-react';
import { toast } from 'sonner';

const BusinessDetails: React.FC = () => {
  const [companyName, setCompanyName] = useState('Acme Corporation');
  const [address, setAddress] = useState('123 Business Street, City, Country');
  const [phone, setPhone] = useState('+1 234 567 8900');
  const [email, setEmail] = useState('info@acmecorp.com');
  const [website, setWebsite] = useState('www.acmecorp.com');
  const [logoUrl, setLogoUrl] = useState('');

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a storage service
      const objectUrl = URL.createObjectURL(file);
      setLogoUrl(objectUrl);
      toast.success('Company logo updated successfully');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Business details updated successfully');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={logoUrl} alt={companyName} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {companyName.substring(0, 2).toUpperCase()}
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
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company-name">Company Name</Label>
          <div className="relative">
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="pl-9"
            />
            <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Company Address</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <div className="relative">
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-9"
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
            />
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <div className="relative">
            <Input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="pl-9"
            />
            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <Button type="submit" className="w-full">
          Save Business Details
        </Button>
      </form>
    </motion.div>
  );
};

export default BusinessDetails;
