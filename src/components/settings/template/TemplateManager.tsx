
import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Check, X, Trash2 } from 'lucide-react'; // Added Trash2 icon for delete
import { FieldTemplate } from './types';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface TemplateManagerProps {
  fields: FieldTemplate[];
  setFields: React.Dispatch<React.SetStateAction<FieldTemplate[]>>;
  templateType: 'quotation' | 'invoice';
  onRemoveField?: (fieldId: string) => void; // passed handler for removing custom fields
}

const TemplateManager: React.FC<TemplateManagerProps> = ({
  fields,
  setFields,
  templateType,
  onRemoveField
}) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index
    }));

    setFields(updatedItems);
  };

  const toggleFieldEnabled = (fieldId: string) => {
    setFields(fields.map(field =>
      field.id === fieldId
        ? { ...field, enabled: !field.enabled }
        : field
    ));
  };

  // Determine if field is locked and can't be removed
  // Locked IDs per requirement:
  // Quotation: Description, Quantity, Unit Price, Discount, Total
  // Invoice: Description, Quantity, Unit Price, Tax, Discount, Total
  // Custom fields start with 'custom_' and can be removed
  const isLockedField = (fieldId: string) => {
    const lockedFieldsQuotation = ['description', 'quantity', 'unit_price', 'discount', 'total'];
    const lockedFieldsInvoice = ['description', 'quantity', 'unit_price', 'tax', 'discount', 'total'];

    if (fieldId.startsWith('custom_')) return false;

    if (templateType === 'quotation') {
      return lockedFieldsQuotation.includes(fieldId);
    } else if (templateType === 'invoice') {
      return lockedFieldsInvoice.includes(fieldId);
    }
    return false;
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 p-3 rounded-md">
        <h3 className="text-sm font-medium mb-1">
          {templateType === 'quotation' ? 'Quotation' : 'Invoice'} Fields
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Drag and drop to reorder fields or toggle to show/hide them
        </p>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="fields">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {fields
                  .sort((a, b) => a.position - b.position)
                  .map((field, index) => (
                    <Draggable
                      key={field.id}
                      draggableId={field.id}
                      index={index}
                    >
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`border ${field.enabled ? 'bg-card' : 'bg-muted/30'}`}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-move text-muted-foreground"
                                >
                                  <GripVertical size={16} />
                                </div>
                                <div>
                                  <p className={`text-sm font-medium ${!field.enabled && 'text-muted-foreground'}`}>
                                    {field.name}
                                  </p>
                                  <div className="flex gap-2 mt-1">
                                    <Badge variant="outline" className="text-[10px] px-1 h-4">
                                      {field.type}
                                    </Badge>
                                    {field.required && (
                                      <Badge variant="secondary" className="text-[10px] px-1 h-4">
                                        Required
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <Switch
                                    id={`toggle-${field.id}`}
                                    checked={field.enabled}
                                    onCheckedChange={() => toggleFieldEnabled(field.id)}
                                    disabled={field.required}
                                  />
                                  <Label
                                    htmlFor={`toggle-${field.id}`}
                                    className="text-xs cursor-pointer"
                                  >
                                    {field.enabled ? (
                                      <span className="text-green-500 flex items-center">
                                        <Check className="h-3 w-3 mr-1" />
                                        Visible
                                      </span>
                                    ) : (
                                      <span className="text-muted-foreground flex items-center">
                                        <X className="h-3 w-3 mr-1" />
                                        Hidden
                                      </span>
                                    )}
                                  </Label>
                                </div>
                                {/* Show Delete button only if the field is not locked and onRemoveField prop exists */}
                                {!isLockedField(field.id) && onRemoveField && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    aria-label={`Remove ${field.name}`}
                                    onClick={() => onRemoveField(field.id)}
                                    className="h-7 w-7"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className="bg-muted/30 p-3 rounded text-sm">
        <p className="text-muted-foreground">
          <strong>Note:</strong> Required fields cannot be disabled or deleted but can be reordered.
        </p>
      </div>
    </div>
  );
};

export default TemplateManager;

