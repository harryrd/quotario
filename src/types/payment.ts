
export interface PaymentAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  swiftCode: string;
}

export type PaymentAccountFormData = Omit<PaymentAccount, 'id'>;
