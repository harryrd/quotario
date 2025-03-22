
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, Mail, Phone, Globe, Loader2 } from 'lucide-react';
import { BusinessDetails } from '@/hooks/useBusinessDetails';

interface BusinessFormProps {
  businessDetails: BusinessDetails;
  setBusinessDetails: (details: BusinessDetails) => void;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const BusinessForm: React.FC<BusinessFormProps> = ({
  businessDetails,
  setBusinessDetails,
  saving,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
  );
};

export default BusinessForm;
