import React from 'react';
import { Edit, Trash, Mail, Phone, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Client } from '@/schemas/client';

interface ClientListItemProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

const ClientListItem: React.FC<ClientListItemProps> = ({ client, onEdit, onDelete }) => {
  return (
    <div className="p-3 hover:bg-muted/50 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <div>
          <h3 className="font-medium text-sm">{client.name}</h3>
          
          <div className="flex flex-col gap-1 mt-1">
            {client.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{client.email}</span>
              </div>
            )}
            
            {client.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{client.phone}</span>
              </div>
            )}
            
            {client.company && (
              <div className="flex items-center gap-1.5">
                <Building className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-secondary-foreground font-medium">{client.company}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={() => onEdit(client)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => onDelete(client.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ClientListItem;
