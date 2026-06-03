import { InvoiceData } from '../types/invoice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface InvoiceRow {
  id: number;
  user_id: number;
  invoice_number: string;
  data: InvoiceData;
  status: InvoiceData['status'];
  created_at: string;
  updated_at: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  error?: string;
  message?: string;
}

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
});

const request = async <T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, init);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Request failed');
  }

  return data;
};

export const registerUser = async (name: string, email: string, password: string) => {
  return request<AuthResponse>(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
};

export const loginUser = async (email: string, password: string) => {
  return request<AuthResponse>(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
};

export const getInvoices = async () => {
  return request<InvoiceRow[]>(`${API_URL}/invoices`, {
    method: 'GET',
    headers: headers()
  });
};

export const createInvoice = async (data: InvoiceData) => {
  return request<InvoiceRow>(`${API_URL}/invoices`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data)
  });
};

export const updateInvoice = async (id: string, data: InvoiceData) => {
  return request<InvoiceRow>(`${API_URL}/invoices/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data)
  });
};

export const deleteInvoice = async (id: string) => {
  return request(`${API_URL}/invoices/${id}`, {
    method: 'DELETE',
    headers: headers()
  });
};
