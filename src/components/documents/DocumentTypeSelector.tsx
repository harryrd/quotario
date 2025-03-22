
import React from 'react';

type DocumentType = 'quotation' | 'invoice';

interface DocumentTypeSelectorProps {
  documentType: DocumentType;
  onTypeChange: (type: DocumentType) => void;
}

const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({ 
  documentType, 
  onTypeChange 
}) => {
  return (
    <div className="flex justify-center p-3">
      <div className="flex items-center bg-secondary rounded-md">
        <button
          className={`px-3 py-1 text-xs font-medium rounded-md ${
            documentType === 'quotation' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground'
          }`}
          onClick={() => onTypeChange('quotation')}
        >
          Quotation
        </button>
        <button
          className={`px-3 py-1 text-xs font-medium rounded-md ${
            documentType === 'invoice' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground'
          }`}
          onClick={() => onTypeChange('invoice')}
        >
          Invoice
        </button>
      </div>
    </div>
  );
};

export default DocumentTypeSelector;
