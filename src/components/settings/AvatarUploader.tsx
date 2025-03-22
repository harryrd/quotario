
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AvatarUploaderProps {
  avatarUrl: string;
  fullName: string;
  handleAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  avatarUrl,
  fullName,
  handleAvatarChange,
  disabled = false
}) => {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={avatarUrl} alt={fullName} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {fullName ? fullName.split(' ').map(name => name[0]).join('') : '?'}
        </AvatarFallback>
      </Avatar>
      
      <div>
        <div className="flex items-center gap-2">
          <Label htmlFor="avatar-upload" className="cursor-pointer">
            <div className="flex items-center gap-2 text-sm text-primary hover:underline">
              <Upload className="h-4 w-4" />
              <span>Change avatar</span>
            </div>
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">This avatar will be visible across your account</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input 
          id="avatar-upload" 
          type="file" 
          accept="image/*"
          className="hidden" 
          onChange={handleAvatarChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default AvatarUploader;
