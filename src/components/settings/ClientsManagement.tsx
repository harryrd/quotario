
import React, { useState } from 'react';
import { Building, Plus, Search, Edit, Trash, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '(123) 456-7890',
      address: '123 Main St, City, State 12345',
      company: 'Acme Corp',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '(098) 765-4321',
      address: '456 Oak Ave, Town, State 54321',
      company: 'XYZ Inc',
    },
  ]);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const emptyClient: Client = {
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
  };

  const handleAddClient = () => {
    setCurrentClient({ ...emptyClient, id: Date.now().toString() });
    setIsDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setCurrentClient(client);
    setIsDialogOpen(true);
  };

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(client => client.id !== id));
    toast.success('Client deleted successfully');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentClient) return;
    
    const { name, value } = e.target;
    setCurrentClient({
      ...currentClient,
      [name]: value,
    });
  };

  const handleSaveClient = () => {
    if (!currentClient) return;
    
    if (!currentClient.name || !currentClient.email) {
      toast.error('Name and email are required');
      return;
    }

    if (clients.some(client => client.id === currentClient.id)) {
      // Update existing client
      setClients(clients.map(client => 
        client.id === currentClient.id ? currentClient : client
      ));
      toast.success('Client updated successfully');
    } else {
      // Add new client
      setClients([...clients, currentClient]);
      toast.success('Client added successfully');
    }
    
    setIsDialogOpen(false);
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
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
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={handleAddClient}>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="border rounded-md divide-y">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <div 
              key={client.id} 
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {client.company ? (
                    <Building className="h-5 w-5 text-primary" />
                  ) : (
                    <User className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{client.name}</h3>
                  {client.company && (
                    <p className="text-sm text-muted-foreground">{client.company}</p>
                  )}
                  <p className="text-sm">{client.email}</p>
                  <p className="text-sm text-muted-foreground">{client.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleEditClient(client)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleDeleteClient(client.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No clients found</p>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentClient && clients.some(client => client.id === currentClient.id) 
                ? 'Edit Client' 
                : 'Add New Client'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                name="name"
                value={currentClient?.name || ''}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={currentClient?.email || ''}
                onChange={handleInputChange}
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone"
                name="phone"
                value={currentClient?.phone || ''}
                onChange={handleInputChange}
                placeholder="(123) 456-7890"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input 
                id="company"
                name="company"
                value={currentClient?.company || ''}
                onChange={handleInputChange}
                placeholder="Acme Corp"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address"
                name="address"
                value={currentClient?.address || ''}
                onChange={handleInputChange}
                placeholder="123 Main St, City, State 12345"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveClient}>
              Save Client
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsManagement;
