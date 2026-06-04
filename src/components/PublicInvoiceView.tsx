import React from 'react';
import { Download, CreditCard, Share2 } from 'lucide-react';
import { InvoiceData } from '../types/invoice';
import { formatCurrency } from '../utils/calculations';
import { generateInvoicePDF } from '../utils/pdfGenerator';

interface PublicInvoiceViewProps {
  invoice: InvoiceData;
  onPayNow?: () => void;
}

export const PublicInvoiceView: React.FC<PublicInvoiceViewProps> = ({
  invoice,
  onPayNow
}) => {
  const handleDownloadPDF = () => {
    generateInvoicePDF(invoice);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice ${invoice.invoiceNumber}`,
          text: `Invoice from ${invoice.fromName}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              {invoice.companyLogo && (
                <img
                  src={invoice.companyLogo}
                  alt="Company Logo"
                  className="h-16 w-auto max-w-32 object-contain"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
                <p className="text-lg text-gray-600">#{invoice.invoiceNumber}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 size={18} />
                Share
              </button>
              
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={18} />
                Download PDF
              </button>
              
              {onPayNow && (
                <button
                  onClick={onPayNow}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CreditCard size={18} />
                  Pay Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">From</h3>
              <div className="space-y-1 text-gray-700">
                <p className="font-medium">{invoice.fromName}</p>
                <p>{invoice.fromEmail}</p>
                <p>{invoice.fromPhone}</p>
                <p className="whitespace-pre-line">{invoice.fromAddress}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill To</h3>
              <div className="space-y-1 text-gray-700">
                <p className="font-medium">{invoice.toName}</p>
                <p>{invoice.toEmail}</p>
                <p>{invoice.toPhone}</p>
                <p className="whitespace-pre-line">{invoice.toAddress}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Invoice Date</p>
              <p className="font-medium">{new Date(invoice.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Due Date</p>
              <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 font-semibold text-gray-900">Description</th>
                  <th className="text-right py-4 font-semibold text-gray-900">Qty</th>
                  <th className="text-right py-4 font-semibold text-gray-900">Rate</th>
                  <th className="text-right py-4 font-semibold text-gray-900">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-4 text-gray-900">{item.description}</td>
                    <td className="py-4 text-right text-gray-700">{item.quantity}</td>
                    <td className="py-4 text-right text-gray-700">
                      {formatCurrency(item.rate, invoice.currency)}
                    </td>
                    <td className="py-4 text-right font-medium text-gray-900">
                      {formatCurrency(item.amount, invoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full md:w-80 space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-700">Tax ({invoice.taxRate}%):</span>
                <span className="font-medium">{formatCurrency(invoice.taxAmount, invoice.currency)}</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-gray-200">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(invoice.total, invoice.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes and Terms */}
        {(invoice.notes || invoice.terms || invoice.paymentInstructions) && (
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            {invoice.notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}
            
            {invoice.terms && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Terms & Conditions</h3>
                <p className="text-gray-700 whitespace-pre-line">{invoice.terms}</p>
              </div>
            )}
            
            {invoice.paymentInstructions && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Instructions</h3>
                <p className="text-gray-700 whitespace-pre-line">{invoice.paymentInstructions}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
