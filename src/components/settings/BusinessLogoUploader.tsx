
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';

interface BusinessLogoUploaderProps {
  logoUrl: string;
  companyName: string;
  handleLogoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const BusinessLogoUploader: React.FC<BusinessLogoUploaderProps> = ({
  logoUrl,
  companyName,
  handleLogoChange,
  disabled = false
}) => {
  return (
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
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default BusinessLogoUploader;
