
import React, { useState, useEffect } from 'react';
import { Building, Plus, Search, Edit, Trash, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/components/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
};

const ClientsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const emptyClient: Client = {
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
  };

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        toast.error('Failed to fetch clients');
        console.error('Error fetching clients:', error);
        return;
      }

      // Map database fields to our Client type
      const mappedClients = data.map(client => ({
        id: client.id,
        name: client.name,
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        company: client.company
      }));

      setClients(mappedClients);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = () => {
    setCurrentClient({ ...emptyClient, id: '' });
    setIsDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setCurrentClient(client);
    setIsDialogOpen(true);
  };

  const handleDeleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error('Failed to delete client');
        console.error('Error deleting client:', error);
        return;
      }

      setClients(clients.filter(client => client.id !== id));
      toast.success('Client deleted successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentClient) return;
    
    const { name, value } = e.target;
    setCurrentClient({
      ...currentClient,
      [name]: value,
    });
  };

  const handleSaveClient = async () => {
    if (!currentClient || !user) return;
    
    if (!currentClient.name || !currentClient.email) {
      toast.error('Name and email are required');
      return;
    }

    try {
      // Prepare client data for Supabase
      const clientData = {
        name: currentClient.name,
        email: currentClient.email,
        phone: currentClient.phone,
        address: currentClient.address,
        company: currentClient.company,
        user_id: user.id
      };

      if (currentClient.id) {
        // Update existing client
        const { data, error } = await supabase
          .from('clients')
          .update(clientData)
          .eq('id', currentClient.id)
          .select()
          .single();

        if (error) {
          toast.error('Failed to update client');
          console.error('Error updating client:', error);
          return;
        }

        setClients(clients.map(client => 
          client.id === data.id ? {
            ...client,
            name: data.name,
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            company: data.company
          } : client
        ));
        toast.success('Client updated successfully');
      } else {
        // Add new client
        const { data, error } = await supabase
          .from('clients')
          .insert(clientData)
          .select()
          .single();

        if (error) {
          toast.error('Failed to add client');
          console.error('Error adding client:', error);
          return;
        }

        setClients([...clients, {
          id: data.id,
          name: data.name,
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          company: data.company
        }]);
        toast.success('Client added successfully');
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    }
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

      {loading ? (
        <div className="border rounded-md p-8 text-center">
          <p className="text-muted-foreground">Loading clients...</p>
        </div>
      ) : (
        <div className="border rounded-md divide-y">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <div 
                key={client.id} 
                className="p-2 flex items-center justify-between gap-2"
              >
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
                    onClick={() => handleEditClient(client)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleDeleteClient(client.id)}
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center">
              <p className="text-muted-foreground text-sm">No clients found</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentClient && currentClient.id
                ? 'Edit Client' 
                : 'Add New Client'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs">Full Name</Label>
                <Input 
                  id="name"
                  name="name"
                  value={currentClient?.name || ''}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="h-9"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs">Email</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  value={currentClient?.email || ''}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="h-9"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="phone" className="text-xs">Phone Number</Label>
                <Input 
                  id="phone"
                  name="phone"
                  value={currentClient?.phone || ''}
                  onChange={handleInputChange}
                  placeholder="(123) 456-7890"
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="company" className="text-xs">Company (Optional)</Label>
                <Input 
                  id="company"
                  name="company"
                  value={currentClient?.company || ''}
                  onChange={handleInputChange}
                  placeholder="Acme Corp"
                  className="h-9"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="address" className="text-xs">Address</Label>
              <Input 
                id="address"
                name="address"
                value={currentClient?.address || ''}
                onChange={handleInputChange}
                placeholder="123 Main St, City, State 12345"
                className="h-9"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveClient}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsManagement;
