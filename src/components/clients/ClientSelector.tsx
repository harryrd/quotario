
import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Client } from '@/types/client';
import { useClients } from '@/hooks/useClients';
import { useAuth } from '@/components/AuthContext';

interface ClientSelectorProps {
  onClientSelect: (client: Client) => void;
  selectedClientName?: string;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({ 
  onClientSelect,
  selectedClientName = '' 
}) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { clients = [], loading } = useClients(user?.id);
  const [value, setValue] = useState(selectedClientName);

  useEffect(() => {
    // If a client name is already selected (for instance, during edit mode)
    if (selectedClientName) {
      setValue(selectedClientName);
    }
  }, [selectedClientName]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9 compact-input"
        >
          {value || "Select client..."}
          <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search client..." className="h-9" />
          <CommandEmpty>
            {loading ? 'Loading clients...' : 'No client found.'}
          </CommandEmpty>
          <CommandGroup>
            {clients.map((client) => (
              <CommandItem
                key={client.id}
                value={client.name}
                onSelect={(currentValue) => {
                  const selectedClient = clients.find(c => c.name.toLowerCase() === currentValue.toLowerCase());
                  if (selectedClient) {
                    setValue(selectedClient.name);
                    onClientSelect(selectedClient);
                  }
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === client.name ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span className="text-sm">{client.name}</span>
                  {client.company && (
                    <span className="text-xs text-muted-foreground">{client.company}</span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ClientSelector;
