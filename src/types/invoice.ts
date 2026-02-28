export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface InvoiceData {
  // Emissor
  companyName: string;
  companyEmail: string;
  companyCnpj: string;
  companyAddress: string;
  companyPhone: string;

  // Cliente
  clientName: string;
  clientEmail: string;
  clientCnpjCpf: string;
  clientAddress: string;

  // Pagamento
  paymentMethod: 'PIX' | 'Transferência Bancária' | 'Boleto' | 'Outro';
  pixKey: string;
  pixKeyType: string;
  bankName: string;
  bankAgency: string;
  bankAccount: string;

  // Detalhes da invoice
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  notes: string;

  // Itens
  items: InvoiceItem[];
}

export const defaultInvoice: InvoiceData = {
  companyName: '',
  companyEmail: '',
  companyCnpj: '',
  companyAddress: '',
  companyPhone: '',
  clientName: '',
  clientEmail: '',
  clientCnpjCpf: '',
  clientAddress: '',
  pixKey: '',
  pixKeyType: 'CPF',
  bankName: '',
  invoiceNumber: 'INV-0001',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  notes: '',
  items: [
    { id: '1', description: '', quantity: 1, rate: 0 },
  ],
};
