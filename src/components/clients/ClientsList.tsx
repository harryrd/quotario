
import React from 'react';
import ClientListItem from './ClientListItem';
import { Client } from '@/types/client';

interface ClientsListProps {
  clients: Client[];
  searchQuery: string;
  loading: boolean;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

const ClientsList: React.FC<ClientsListProps> = ({ 
  clients, 
  searchQuery, 
  loading, 
  onEdit, 
  onDelete 
}) => {
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="border rounded-md p-8 text-center">
        <p className="text-muted-foreground">Loading clients...</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md divide-y">
      {filteredClients.length > 0 ? (
        filteredClients.map((client) => (
          <ClientListItem 
            key={client.id} 
            client={client} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))
      ) : (
        <div className="p-4 text-center">
          <p className="text-muted-foreground text-sm">No clients found</p>
        </div>
      )}
    </div>
  );
};

export default ClientsList;
