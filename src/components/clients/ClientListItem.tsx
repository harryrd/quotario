
import React from 'react';
import { Building, Edit, Trash, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Client } from '@/types/client';

interface ClientListItemProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

const ClientListItem: React.FC<ClientListItemProps> = ({ client, onEdit, onDelete }) => {
  return (
    <div className="p-2 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          {client.company ? (
            <Building className="h-4 w-4 text-primary" />
          ) : (
            <User className="h-4 w-4 text-primary" />
          )}
        </div>
        <div>
          <h3 className="font-medium text-sm">{client.name}</h3>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">{client.email}</p>
            {client.company && (
              <span className="text-xs bg-secondary px-1.5 py-0.5 rounded-full">
                {client.company}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-7 w-7"
          onClick={() => onEdit(client)}
        >
          <Edit className="h-3.5 w-3.5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-7 w-7"
          onClick={() => onDelete(client.id)}
        >
          <Trash className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default ClientListItem;
