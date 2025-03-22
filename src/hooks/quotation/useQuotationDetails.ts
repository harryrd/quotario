
import { useFetchQuotation } from './useFetchQuotation';
import { useQuotationFormat } from './useQuotationFormat';
import { User } from '@supabase/supabase-js';

export type { QuotationData, QuotationItem } from '@/types/document-details';

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
