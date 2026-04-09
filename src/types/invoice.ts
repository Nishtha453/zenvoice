export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  
  // Company/From details
  fromName: string;
  fromEmail: string;
  fromPhone: string;
  fromAddress: string;
  companyLogo?: string;
  
  // Client/To details
  toName: string;
  toEmail: string;
  toPhone: string;
  toAddress: string;
  
  // Invoice items
  items: InvoiceItem[];
  
  // Calculations
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  
  // Notes
  notes: string;
  terms: string;
  paymentInstructions: string;
  
  // Status
  status: 'draft' | 'sent' | 'paid';
  createdAt: string;
  updatedAt: string;
  
  template: 'modern' | 'classic' | 'minimal';
  shareableLink?: string;
}