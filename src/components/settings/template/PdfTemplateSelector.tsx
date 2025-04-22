
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { File } from 'lucide-react';

export type TemplateOption = {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
};

interface PdfTemplateSelectorProps {
  templateType: 'quotation' | 'invoice';
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

const dummyTemplates: TemplateOption[] = [
  {
    id: 'classic',
    name: 'Classic',
    thumbnail: '/placeholder.svg',
    description: 'A professional, clean design with a traditional layout'
  },
  {
    id: 'modern',
    name: 'Modern',
    thumbnail: '/placeholder.svg',
    description: 'A contemporary design with a sleek, minimal aesthetic'
  },
  {
    id: 'elegant',
    name: 'Elegant',
    thumbnail: '/placeholder.svg',
    description: 'A sophisticated design with refined typography and layout'
  },
  {
    id: 'bold',
    name: 'Bold',
    thumbnail: '/placeholder.svg',
    description: 'A striking design that makes a strong impression'
  }
];

const PdfTemplateSelector: React.FC<PdfTemplateSelectorProps> = ({
  templateType,
  selectedTemplate,
  onSelectTemplate
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold">PDF Template</h3>
          <p className="text-sm text-muted-foreground">
            Select how your {templateType === 'quotation' ? 'quotations' : 'invoices'} will look as PDFs
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setOpen(true)}
          className="flex items-center gap-2"
        >
          <File className="h-4 w-4" />
          Select Template
        </Button>
      </div>
      
      <div className="p-4 border rounded-md bg-muted/30">
        <div className="text-sm font-medium mb-2">Current Template:</div>
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-20 bg-background border rounded-md overflow-hidden">
            <img 
              src="/placeholder.svg" 
              alt="Current template thumbnail" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium">
              {dummyTemplates.find(t => t.id === selectedTemplate)?.name || 'Classic'}
            </div>
            <div className="text-xs text-muted-foreground">
              {dummyTemplates.find(t => t.id === selectedTemplate)?.description || 
                'A professional, clean design with a traditional layout'}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select PDF Template</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 mt-4 max-h-[60vh] overflow-y-auto p-1">
            {dummyTemplates.map((template) => (
              <div 
                key={template.id}
                className={`border rounded-md p-3 cursor-pointer transition-all hover:border-primary
                  ${selectedTemplate === template.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => {
                  onSelectTemplate(template.id);
                  setOpen(false);
                }}
              >
                <div className="relative w-full h-40 bg-background border rounded-md overflow-hidden mb-3">
                  <img 
                    src={template.thumbnail} 
                    alt={`${template.name} template thumbnail`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-medium">{template.name}</div>
                <div className="text-xs text-muted-foreground">{template.description}</div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PdfTemplateSelector;
