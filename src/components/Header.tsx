
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, MoreVertical } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBack = false, 
  actions,
  className
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const goBack = () => {
    if (location.pathname === '/create') {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-10 w-full px-3 py-2 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-border",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {showBack && (
          <Button variant="ghost" size="icon" onClick={goBack} className="rounded-full h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <h1 className="text-base font-medium">{title}</h1>
      </div>
      
      <div className="flex items-center gap-1">
        {actions}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};

export default Header;
