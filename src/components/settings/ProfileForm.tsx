
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Loader2 } from 'lucide-react';

interface ProfileFormProps {
  fullName: string;
  setFullName: (name: string) => void;
  email: string;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  fullName,
  setFullName,
  email,
  loading,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full-name">Full Name</Label>
        <div className="relative">
          <Input
            id="full-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="pl-9"
            placeholder="Enter your full name"
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
  );
};

export default ProfileForm;
