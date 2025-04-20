
export interface PaymentAccount {
  id: string;
  type: 'bank' | 'paypal'; // New field to specify payment method type
  accountName: string;   // For bank: account name; For PayPal: paypal account description/name
  accountNumber: string; // For bank: account number; For PayPal: paypal email or id
  bankName: string;      // For bank only; empty or ignored for PayPal
  swiftCode: string;     // For bank only; empty or ignored for PayPal
}

export type PaymentAccountFormData = Omit<PaymentAccount, 'id'>;

