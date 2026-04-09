import React, { useState } from 'react';
import { Mail, Send, X } from 'lucide-react';
import { InvoiceData } from '../types/invoice';

interface EmailInvoiceProps {
  invoice: InvoiceData;
  isOpen: boolean;
  onClose: () => void;
}

export const EmailInvoice: React.FC<EmailInvoiceProps> = ({
  invoice,
  isOpen,
  onClose
}) => {
  const [emailData, setEmailData] = useState({
    to: invoice.toEmail,
    subject: `Invoice ${invoice.invoiceNumber} from ${invoice.fromName}`,
    message: `Dear ${invoice.toName},

Please find your invoice ${invoice.invoiceNumber} for the amount of ${invoice.total} ${invoice.currency}.

Payment is due by ${new Date(invoice.dueDate).toLocaleDateString()}.

Thank you for your business!

Best regards,
${invoice.fromName}`
  });

  const handleSend = () => {
    const mailtoLink = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.message)}`;
    window.open(mailtoLink);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Mail className="text-blue-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Email Invoice</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Email
            </label>
            <input
              type="email"
              value={emailData.to}
              onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={emailData.subject}
              onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={emailData.message}
              onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Clicking "Open in Email Client" will open your default email app with this message pre-filled. Download the PDF separately and attach it manually.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Send size={16} />
            Open in Email Client
          </button>
        </div>
      </div>
    </div>
  );
};