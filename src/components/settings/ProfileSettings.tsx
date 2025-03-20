
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Upload, Mail } from 'lucide-react';
import { toast } from 'sonner';

const ProfileSettings: React.FC = () => {
  const [fullName, setFullName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a storage service
      // For now, we'll create a local object URL
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
      toast.success('Avatar updated successfully');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to a database
    toast.success('Profile updated successfully');
  };

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
            {fullName.split(' ').map(name => name[0]).join('')}
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
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
            />
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </motion.div>
  );
};

export default ProfileSettings;
