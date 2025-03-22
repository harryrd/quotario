
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/AuthContext';
import { Client } from '@/types/client';
import { useClients } from '@/hooks/useClients';
import ClientsList from '@/components/clients/ClientsList';
import ClientForm from '@/components/clients/ClientForm';

const ClientsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  
  const { 
    clients, 
    loading, 
    addClient, 
    updateClient, 
    deleteClient 
  } = useClients(user?.id);

  const handleAddClient = () => {
    setCurrentClient(null);
    setIsDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setCurrentClient(client);
    setIsDialogOpen(true);
  };

  const handleDeleteClient = async (id: string) => {
    await deleteClient(id);
  };

  const handleSaveClient = async (client: Client) => {
    if (!user) return;
    
    let success = false;
    
    if (client.id) {
      // Update existing client
      success = await updateClient(client);
    } else {
      // Add new client
      const newClient = await addClient(client, user.id);
      success = !!newClient;
    }
    
    if (success) {
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-medium">Clients Management</h2>
        <p className="text-sm text-muted-foreground">
          Manage your clients for quick selection when creating documents
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            className="pl-8 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={handleAddClient} size="sm">
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add
        </Button>
      </div>

      <ClientsList 
        clients={clients}
        searchQuery={searchQuery}
        loading={loading}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
      />

      <ClientForm 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveClient}
        client={currentClient}
      />
    </div>
  );
};

export default ClientsManagement;
