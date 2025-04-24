
import { useQuotationDetails as useFetchQuotation } from './useFetchQuotation';
import { useQuotationFormat } from './useQuotationFormat';
import { User } from '@supabase/supabase-js';
import { type Document } from '@/schemas/document-details';

export type { Document };

export const useQuotationDetails = (quotationId: string | undefined, user: User | null) => {
  const { quotation, loading, total, formatCurrency: formatQuotationCurrency } = useFetchQuotation(quotationId, user);
  const { formatCurrency } = useQuotationFormat();

  return {
    quotation,
    loading,
    total,
    formatCurrency: formatQuotationCurrency || formatCurrency
  };
};
