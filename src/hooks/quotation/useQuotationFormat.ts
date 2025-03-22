
export const useQuotationFormat = () => {
  // Format currency according to the user's settings
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD' // This should ideally come from user settings
    }).format(amount);
  };

  return {
    formatCurrency
  };
};
