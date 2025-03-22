
import React from 'react';
import DocumentDetailsForm from '@/components/documents/DocumentDetailsForm';
import { DocumentType } from '@/types/document';
import { UserSettings } from '@/hooks/document/useUserSettings';
import { DocumentDetails } from '@/types/document';
import AnimatedTransition from '@/components/AnimatedTransition';

interface DocumentDetailsTabProps {
  documentType: DocumentType;
  details: DocumentDetails;
  onDetailsChange: (details: DocumentDetails) => void;
  onContinue: () => void;
  userSettings: UserSettings;
}

const DocumentDetailsTab: React.FC<DocumentDetailsTabProps> = ({
  documentType,
  details,
  onDetailsChange,
  onContinue,
  userSettings
}) => {
  return (
    <AnimatedTransition>
      <DocumentDetailsForm
        documentType={documentType}
        details={details}
        onDetailsChange={onDetailsChange}
        onContinue={onContinue}
        prefix={documentType === 'quotation' ? userSettings.quotationPrefix : userSettings.invoicePrefix}
        startNumber={documentType === 'quotation' ? userSettings.quotationStartNumber : userSettings.invoiceStartNumber}
        currency={userSettings.currency}
      />
    </AnimatedTransition>
  );
};

export default DocumentDetailsTab;
