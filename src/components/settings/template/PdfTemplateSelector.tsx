
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { File } from 'lucide-react';

interface PdfTemplateSelectorProps {
  selectedTemplate: string;
  onChange: (templateId: string) => void;
  templateType: 'quotation' | 'invoice';
}

const templates = [
  { id: 'template1', name: 'Basic Template' },
  { id: 'template2', name: 'Professional Template' },
  { id: 'template3', name: 'Modern Template' },
  { id: 'template4', name: 'Elegant Template' },
];

const PdfTemplateSelector: React.FC<PdfTemplateSelectorProps> = ({
  selectedTemplate,
  onChange,
  templateType
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold mb-2">
          Select {templateType === 'quotation' ? 'Quotation' : 'Invoice'} PDF Template
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose a template design for your {templateType === 'quotation' ? 'quotations' : 'invoices'}
        </p>
      </div>

      <RadioGroup
        value={selectedTemplate || 'template1'}
        onValueChange={onChange}
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        {templates.map((template) => (
          <div key={template.id} className="relative">
            <RadioGroupItem
              value={template.id}
              id={`${templateType}-${template.id}`}
              className="sr-only"
            />
            <Label
              htmlFor={`${templateType}-${template.id}`}
              className="cursor-pointer"
            >
              <Card className={`overflow-hidden transition-all ${
                selectedTemplate === template.id ? 'ring-2 ring-primary' : 'hover:border-muted-foreground/50'
              }`}>
                <CardContent className="p-0">
                  <div className="aspect-[3/4] bg-muted/30 relative flex items-center justify-center">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <File className="h-12 w-12 mb-2" />
                      <div className="text-xs text-center px-2">
                        {template.name}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default PdfTemplateSelector;
