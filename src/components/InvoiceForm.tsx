import React, { useState } from 'react';
import { Plus, Trash2, Save, Eye, Mail, Repeat, Link } from 'lucide-react';
import { InvoiceData, InvoiceItem } from '../types/invoice';
import { 
  calculateItemAmount, 
  calculateSubtotal, 
  calculateTaxAmount, 
  calculateTotal,
  generateInvoiceNumber,
  formatCurrency
} from '../utils/calculations';
import { LogoUpload } from './LogoUpload';
import { TemplateSelector } from './TemplateSelector';
import { CurrencySelector } from './CurrencySelector';
import { EmailInvoice } from './EmailInvoice';
import { sendInvoiceEmail } from '../utils/api';

interface InvoiceFormProps {
  onSave: (invoice: InvoiceData) => void;
  onPreview: (invoice: InvoiceData) => void;
  initialData?: InvoiceData;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ 
  onSave, 
  onPreview, 
  initialData 
}) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const initialShareToken = initialData?.shareToken || crypto.randomUUID();
  
  const [formData, setFormData] = useState<InvoiceData>(
    initialData || {
      id: crypto.randomUUID(),
      invoiceNumber: generateInvoiceNumber(),
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      
      fromName: '',
      fromEmail: '',
      fromPhone: '',
      fromAddress: '',
      companyLogo: undefined,
      
      toName: '',
      toEmail: '',
      toPhone: '',
      toAddress: '',
      
      items: [{
        id: crypto.randomUUID(),
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0
      }],
      
      subtotal: 0,
      taxRate: 18,
      taxAmount: 0,
      total: 0,
      currency: 'INR',
      
      notes: '',
      terms: '',
      paymentInstructions: '',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      
      template: 'modern',
      isRecurring: false,
      shareToken: initialShareToken,
      shareableLink: `${window.location.origin}/invoice/${initialShareToken}`,
      paymentLink: undefined
    }
  );

  const updateCalculations = (items: InvoiceItem[], taxRate: number) => {
    const subtotal = calculateSubtotal(items);
    const taxAmount = calculateTaxAmount(subtotal, taxRate);
    const total = calculateTotal(subtotal, taxAmount);
    
    setFormData(prev => ({
      ...prev,
      items,
      subtotal,
      taxAmount,
      total,
      updatedAt: new Date().toISOString()
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    
    const newItems = [...formData.items, newItem];
    updateCalculations(newItems, formData.taxRate);
  };

  const removeItem = (id: string) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter(item => item.id !== id);
      updateCalculations(newItems, formData.taxRate);
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const newItems = formData.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = calculateItemAmount(updatedItem.quantity, updatedItem.rate);
        }
        return updatedItem;
      }
      return item;
    });
    
    updateCalculations(newItems, formData.taxRate);
  };

  const updateTaxRate = (taxRate: number) => {
    const taxAmount = calculateTaxAmount(formData.subtotal, taxRate);
    const total = calculateTotal(formData.subtotal, taxAmount);
    
    setFormData(prev => ({
      ...prev,
      taxRate,
      taxAmount,
      total,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handlePreview = () => {
    onPreview(formData);
  };

  const handleEmailSend = async (emailData: { to: string; subject: string; message: string }) => {
    await sendInvoiceEmail(formData.id, emailData);
    alert('Invoice email sent successfully.');
  };

  const generateShareableLink = async () => {
    const shareToken = formData.shareToken || crypto.randomUUID();
    const newLink = `${window.location.origin}/invoice/${shareToken}`;
    setFormData(prev => ({ ...prev, shareToken, shareableLink: newLink }));

    try {
      await navigator.clipboard.writeText(newLink);
      alert(initialData
        ? 'Public invoice link copied. Save the invoice if you changed it.'
        : 'Public invoice link copied. Save the invoice before sharing it.');
    } catch {
      window.prompt('Copy this public invoice link:', newLink);
    }
  };
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {initialData ? 'Edit Invoice' : 'Create Invoice'}
        </h1>
        <p className="text-gray-600">Fill in the details below to generate your professional invoice</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Template and Logo Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
          <TemplateSelector
            selectedTemplate={formData.template}
            onTemplateChange={(template) => setFormData(prev => ({ ...prev, template }))}
          />
          
          <LogoUpload
            currentLogo={formData.companyLogo}
            onLogoChange={(logo) => setFormData(prev => ({ ...prev, companyLogo: logo }))}
          />
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-gray-50 rounded-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Number
            </label>
            <input
              type="text"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <CurrencySelector
            selectedCurrency={formData.currency}
            onCurrencyChange={(currency) => setFormData(prev => ({ ...prev, currency }))}
          />
        </div>

        {/* From and To Addresses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* From Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">From</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.fromName}
                onChange={(e) => setFormData(prev => ({ ...prev, fromName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.fromEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, fromEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.fromPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, fromPhone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={formData.fromAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, fromAddress: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* To Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Bill To</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
              <input
                type="text"
                value={formData.toName}
                onChange={(e) => setFormData(prev => ({ ...prev, toName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Email</label>
              <input
                type="email"
                value={formData.toEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, toEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Phone</label>
              <input
                type="tel"
                value={formData.toPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, toPhone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Address</label>
              <textarea
                value={formData.toAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, toAddress: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 font-medium text-gray-700">Description</th>
                  <th className="text-right p-4 font-medium text-gray-700 w-24">Qty</th>
                  <th className="text-right p-4 font-medium text-gray-700 w-32">Rate</th>
                  <th className="text-right p-4 font-medium text-gray-700 w-32">Amount</th>
                  <th className="p-4 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-4">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Enter description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                        required
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                        required
                      />
                    </td>
                    <td className="p-4 text-right font-medium">
                      {formatCurrency(item.amount, formData.currency)}
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={formData.items.length === 1}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end">
          <div className="w-full md:w-96 space-y-4 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
            <div className="flex justify-between">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-medium">{formatCurrency(formData.subtotal, formData.currency)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <label className="text-gray-700">Tax Rate (%):</label>
              <input
                type="number"
                value={formData.taxRate}
                onChange={(e) => updateTaxRate(parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                step="0.01"
                className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-700">Tax Amount:</span>
              <span className="font-medium">{formatCurrency(formData.taxAmount, formData.currency)}</span>
            </div>
            
            <div className="flex justify-between text-lg font-bold border-t pt-4">
              <span>Total:</span>
              <span className="text-blue-600">{formatCurrency(formData.total, formData.currency)}</span>
            </div>
          </div>
        </div>

        {/* Notes, Terms, and Payment Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
              placeholder="Add any additional notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
            <textarea
              value={formData.terms}
              onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
              rows={4}
              placeholder="Payment due in 30 days..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Instructions</label>
            <textarea
              value={formData.paymentInstructions}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentInstructions: e.target.value }))}
              rows={4}
              placeholder="Bank details, UPI ID, etc..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Recurring Invoice Option */}
        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <Repeat className="text-purple-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">Recurring Invoice</h3>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Make this a recurring invoice</span>
            </label>
            
            {formData.isRecurring && (
              <select
                value={formData.recurringFrequency || 'monthly'}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  recurringFrequency: e.target.value as 'weekly' | 'monthly' | 'quarterly'
                }))}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={generateShareableLink}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
          >
            <Link size={18} />
            Generate Link
          </button>
          
          <button
            type="button"
            onClick={() => {
              if (!initialData || !formData.shareToken) {
                alert('Generate a public link and save the invoice first, then edit it to email the working link.');
                return;
              }
              setShowEmailModal(true);
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <Mail size={18} />
            Email Invoice
          </button>
          
          <button
            type="button"
            onClick={handlePreview}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
          >
            <Eye size={18} />
            Preview & Download
          </button>
          
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Save size={18} />
            Save Invoice
          </button>
        </div>
      </form>
      
      {/* Email Modal */}
      <EmailInvoice
        invoice={formData}
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSend={handleEmailSend}
      />
    </div>
  );
};
