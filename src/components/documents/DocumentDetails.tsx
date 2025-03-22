
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { BusinessDetails, Document } from '@/pages/ViewDocuments';
import QuotationHeader from '@/components/quotation/QuotationHeader';
import QuotationNotes from '@/components/quotation/QuotationNotes';

interface DocumentDetailsProps {
  document: Document;
  editableDocument: Document;
  businessDetails: BusinessDetails;
  isEditing: boolean;
  savingChanges: boolean;
  setEditableDocument: (doc: Document) => void;
  formatDate: (dateString: string) => string;
}

const DocumentDetails: React.FC<DocumentDetailsProps> = ({
  document,
  editableDocument,
  businessDetails,
  isEditing,
  savingChanges,
  setEditableDocument,
  formatDate,
}) => {
  // Calculate subtotal and total
  const calculateSubtotal = (doc: Document) => {
    return doc.items.reduce((sum, item) => {
      return sum + (Number(item.quantity) * Number(item.unit_price));
    }, 0);
  };
  
  const calculateTax = (doc: Document) => {
    return doc.items.reduce((sum, item) => {
      const lineTotal = Number(item.quantity) * Number(item.unit_price);
      return sum + (lineTotal * (Number(item.tax || 0) / 100));
    }, 0);
  };
  
  const calculateTotal = (doc: Document) => {
    const subtotal = calculateSubtotal(doc);
    const tax = calculateTax(doc);
    return subtotal + tax;
  };
  
  const subtotal = calculateSubtotal(document);
  const tax = calculateTax(document);
  const total = calculateTotal(document);
  
  const editableSubtotal = calculateSubtotal(editableDocument);
  const editableTax = calculateTax(editableDocument);
  const editableTotal = calculateTotal(editableDocument);

  return (
    <div className="p-6 md:p-8 bg-white rounded-lg shadow-sm border">
      <div className="flex justify-between items-start mb-4">
        <div>
          {isEditing ? (
            <Input
              value={editableDocument.title}
              onChange={(e) => setEditableDocument({...editableDocument, title: e.target.value})}
              className="text-xl font-semibold mb-2 h-auto py-1"
            />
          ) : (
            <h1 className="text-xl md:text-2xl font-semibold mb-2">{document.title}</h1>
          )}
          <p className="text-muted-foreground mb-6">
            {document.type === 'quotation' ? 'Quotation for' : 'Invoice for'} 
            {isEditing ? (
              <Input
                value={editableDocument.client_name}
                onChange={(e) => setEditableDocument({...editableDocument, client_name: e.target.value})}
                className="mt-1 h-auto py-1"
              />
            ) : (
              <> {document.client_name}</>
            )}
          </p>
        </div>
        <Badge 
          className={`
            uppercase px-2 py-1 
            ${document.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : ''}
            ${document.status === 'sent' ? 'bg-blue-100 text-blue-800' : ''}
            ${document.status === 'draft' ? 'bg-gray-100 text-gray-800' : ''}
            ${document.status === 'accepted' ? 'bg-green-100 text-green-800' : ''}
            ${document.status === 'declined' ? 'bg-red-100 text-red-800' : ''}
          `}
        >
          {document.status}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <h3 className="font-medium mb-1">From:</h3>
          <p>{businessDetails.company_name}</p>
          <p>{businessDetails.address}</p>
          <p>{businessDetails.email}</p>
          <p>{businessDetails.phone}</p>
        </div>
        <div>
          <h3 className="font-medium mb-1">To:</h3>
          <p>{document.client_name}</p>
          <p>Client Address</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-4">
        <div>
          <h3 className="font-medium mb-1">Document Number:</h3>
          <p>{document.type === 'quotation' ? 'QUO-' : 'INV-'}{document.id.substring(0, 8).toUpperCase()}</p>
        </div>
        <div>
          <h3 className="font-medium mb-1">Date:</h3>
          {isEditing ? (
            <Input
              type="date"
              value={editableDocument.date}
              onChange={(e) => setEditableDocument({...editableDocument, date: e.target.value})}
              className="w-full md:w-auto h-auto py-1"
            />
          ) : (
            <p>{formatDate(document.date)}</p>
          )}
        </div>
        {(document.due_date || isEditing) && (
          <div>
            <h3 className="font-medium mb-1">
              {document.type === 'quotation' ? 'Valid Until' : 'Due Date'}:
            </h3>
            {isEditing ? (
              <Input
                type="date"
                value={editableDocument.due_date || ''}
                onChange={(e) => setEditableDocument({...editableDocument, due_date: e.target.value})}
                className="w-full md:w-auto h-auto py-1"
              />
            ) : (
              <p>{document.due_date ? formatDate(document.due_date) : 'N/A'}</p>
            )}
          </div>
        )}
      </div>
      
      <DocumentItemsTable 
        items={isEditing ? editableDocument.items : document.items}
        documentType={document.type}
        isEditing={isEditing}
        onItemsChange={(items) => setEditableDocument({...editableDocument, items})}
      />
      
      <div className="flex justify-end mb-8">
        <div className="w-full md:w-1/3">
          <div className="flex justify-between py-2">
            <span>Subtotal:</span>
            <span>${isEditing ? editableSubtotal.toFixed(2) : subtotal.toFixed(2)}</span>
          </div>
          
          {(tax > 0 || (isEditing && editableTax > 0)) && (
            <div className="flex justify-between py-2">
              <span>Tax:</span>
              <span>${isEditing ? editableTax.toFixed(2) : tax.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between py-2 border-t border-t-gray-200">
            <span className="font-bold">Total:</span>
            <span className="font-bold">${isEditing ? editableTotal.toFixed(2) : total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Notes:</h3>
        {isEditing ? (
          <Textarea
            value={editableDocument.notes || ''}
            onChange={(e) => setEditableDocument({...editableDocument, notes: e.target.value})}
            className="min-h-[100px]"
            placeholder="Add notes for your client..."
          />
        ) : (
          <p className="text-muted-foreground">{document.notes || 'No notes provided.'}</p>
        )}
      </div>
    </div>
  );
};

export default DocumentDetails;
