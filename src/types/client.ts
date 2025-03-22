
export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string | null;
};

export const emptyClient: Client = {
  id: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  company: null,
};
