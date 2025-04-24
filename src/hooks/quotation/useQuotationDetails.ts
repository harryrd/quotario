import { useFetchQuotation } from './useFetchQuotation';
import { useQuotationFormat } from './useQuotationFormat';
import { User } from '@supabase/supabase-js';
import { type QuotationData } from '@/schemas/document-details';

export type { QuotationData } from '@/schemas/document-details';

export const useQuotationDetails = (quotationId: string | undefined, user: User | null) => {
  const { quotation, loading, total } = useFetchQuotation(quotationId, user);
  const { formatCurrency } = useQuotationFormat();

  return {
    quotation,
    loading,
    total,
    formatCurrency
  };
};
