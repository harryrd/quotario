
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Client, emptyClient } from '@/types/client';

export const useClients = (userId?: string) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

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
        company: client.company || null
      }));

      setClients(mappedClients);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (client: Omit<Client, 'id'>, userId: string) => {
    try {
      // Prepare client data for Supabase
      const clientData = {
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        company: client.company,
        user_id: userId
      };

      const { data, error } = await supabase
        .from('clients')
        .insert(clientData)
        .select()
        .single();

      if (error) {
        toast.error('Failed to add client');
        console.error('Error adding client:', error);
        return null;
      }

      const newClient: Client = {
        id: data.id,
        name: data.name,
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        company: data.company || null
      };

      setClients(prev => [...prev, newClient]);
      toast.success('Client added successfully');
      return newClient;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
      return null;
    }
  };

  const updateClient = async (client: Client) => {
    try {
      // Prepare client data for Supabase
      const clientData = {
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        company: client.company
      };

      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', client.id)
        .select()
        .single();

      if (error) {
        toast.error('Failed to update client');
        console.error('Error updating client:', error);
        return false;
      }

      setClients(clients.map(c => 
        c.id === data.id ? {
          ...c,
          name: data.name,
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          company: data.company || null
        } : c
      ));
      toast.success('Client updated successfully');
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
      return false;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error('Failed to delete client');
        console.error('Error deleting client:', error);
        return false;
      }

      setClients(clients.filter(client => client.id !== id));
      toast.success('Client deleted successfully');
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
      return false;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchClients();
    }
  }, [userId]);

  return {
    clients,
    loading,
    fetchClients,
    addClient,
    updateClient,
    deleteClient
  };
};
