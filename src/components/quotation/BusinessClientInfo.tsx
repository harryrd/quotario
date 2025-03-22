
import React from 'react';
import { Building, User, Phone, Mail, Globe, MapPin } from 'lucide-react';

interface BusinessInfo {
  company_name: string;
  address?: string;
  email?: string;
  phone?: string;
  website?: string;
}

interface ClientInfo {
  name: string;
  company?: string;
  address?: string;
  email?: string;
  phone?: string;
}

interface BusinessClientInfoProps {
  businessDetails: BusinessInfo;
  clientDetails: ClientInfo;
}

const BusinessClientInfo: React.FC<BusinessClientInfoProps> = ({
  businessDetails,
  clientDetails
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Sender details */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium flex items-center">
          <Building className="mr-2 h-4 w-4" />
          From
        </h3>
        <div className="space-y-1">
          <p className="font-medium">{businessDetails.company_name}</p>
          {businessDetails.address && (
            <p className="flex items-start text-sm text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4 shrink-0 mt-0.5" />
              <span>{businessDetails.address}</span>
            </p>
          )}
          {businessDetails.phone && (
            <p className="flex items-center text-sm text-muted-foreground">
              <Phone className="mr-1 h-4 w-4 shrink-0" />
              <span>{businessDetails.phone}</span>
            </p>
          )}
          {businessDetails.email && (
            <p className="flex items-center text-sm text-muted-foreground">
              <Mail className="mr-1 h-4 w-4 shrink-0" />
              <span>{businessDetails.email}</span>
            </p>
          )}
          {businessDetails.website && (
            <p className="flex items-center text-sm text-muted-foreground">
              <Globe className="mr-1 h-4 w-4 shrink-0" />
              <span>{businessDetails.website}</span>
            </p>
          )}
        </div>
      </div>
      
      {/* Recipient details */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium flex items-center">
          <User className="mr-2 h-4 w-4" />
          To
        </h3>
        <div className="space-y-1">
          <p className="font-medium">{clientDetails.name}</p>
          {clientDetails.company && (
            <p className="text-sm">{clientDetails.company}</p>
          )}
          {clientDetails.address && (
            <p className="flex items-start text-sm text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4 shrink-0 mt-0.5" />
              <span>{clientDetails.address}</span>
            </p>
          )}
          {clientDetails.phone && (
            <p className="flex items-center text-sm text-muted-foreground">
              <Phone className="mr-1 h-4 w-4 shrink-0" />
              <span>{clientDetails.phone}</span>
            </p>
          )}
          {clientDetails.email && (
            <p className="flex items-center text-sm text-muted-foreground">
              <Mail className="mr-1 h-4 w-4 shrink-0" />
              <span>{clientDetails.email}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessClientInfo;
