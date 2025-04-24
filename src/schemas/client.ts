
import { z } from 'zod';

export const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
});

export type Client = z.infer<typeof clientSchema>;

export const emptyClient: Client = {
  id: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  company: null,
};
