
import React from 'react';
import ClientListItem from './ClientListItem';
import { Client } from '@/types/client';
import { Loader2 } from 'lucide-react';

interface ClientsListProps {
  clients: Client[];
  searchQuery: string;
  loading: boolean;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  sortBy: 'name' | 'company';
}

const ClientsList: React.FC<ClientsListProps> = ({ 
  clients, 
  searchQuery, 
  loading, 
  onEdit, 
  onDelete,
  sortBy
}) => {
  // Filter clients by search query
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort clients based on sortBy
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      // Sort by company, with clients without company last
      if (!a.company) return 1;
      if (!b.company) return -1;
      return a.company.localeCompare(b.company);
    }
  });

  // Group clients by first letter or company first letter
  const groupedClients: Record<string, Client[]> = {};
  
  sortedClients.forEach(client => {
    let groupKey = '';
    
    if (sortBy === 'name') {
      groupKey = client.name.charAt(0).toUpperCase();
    } else {
      groupKey = client.company ? client.company.charAt(0).toUpperCase() : '#';
    }
    
    if (!groupedClients[groupKey]) {
      groupedClients[groupKey] = [];
    }
    
    groupedClients[groupKey].push(client);
  });

  // Get sorted group keys
  const groupKeys = Object.keys(groupedClients).sort();

  if (loading) {
    return (
      <div className="border rounded-md p-8 text-center">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <p className="text-muted-foreground">Loading clients...</p>
        </div>
      </div>
    );
  }

  if (sortedClients.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center">
        <p className="text-muted-foreground">
          {searchQuery ? 'No clients match your search' : 'No clients yet. Add your first client with the button above.'}
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      {groupKeys.map(key => (
        <div key={key} className="phonebook-section">
          <div className="bg-muted px-3 py-1.5 sticky top-0 z-10">
            <h3 className="text-sm font-medium">{key}</h3>
          </div>
          <div className="divide-y">
            {groupedClients[key].map(client => (
              <ClientListItem 
                key={client.id} 
                client={client} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientsList;
