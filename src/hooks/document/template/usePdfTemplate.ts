
import { useState } from 'react';

export const usePdfTemplate = (initialTemplate: string = 'template1') => {
  const [pdfTemplate, setPdfTemplate] = useState(initialTemplate);

  const updatePdfTemplate = (templateId: string) => {
    setPdfTemplate(templateId);
  };

  return {
    pdfTemplate,
    updatePdfTemplate,
  };
};
