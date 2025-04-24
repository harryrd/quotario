
import { z } from 'zod';

export const paymentAccountSchema = z.object({
  id: z.string(),
  type: z.enum(['bank', 'paypal']),
  accountName: z.string(),
  accountNumber: z.string(),
  bankName: z.string(),
  swiftCode: z.string().optional(),
});

export type PaymentAccount = z.infer<typeof paymentAccountSchema>;

export type PaymentAccountFormData = Omit<PaymentAccount, 'id'>;
