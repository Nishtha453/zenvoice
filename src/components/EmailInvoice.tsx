import React, { useEffect, useState } from 'react';
import { Mail, Send, X } from 'lucide-react';
import { InvoiceData } from '../types/invoice';

interface EmailInvoiceProps {
  invoice: InvoiceData;
  isOpen: boolean;
  onClose: () => void;
  onSend: (emailData: { to: string; subject: string; message: string }) => void;
}

const createEmailData = (invoice: InvoiceData) => ({
  to: invoice.toEmail,
  subject: `Invoice ${invoice.invoiceNumber} from ${invoice.fromName}`,
  message: `Dear ${invoice.toName},

Please view your invoice ${invoice.invoiceNumber} for the amount of ${invoice.total} using this secure link:
${invoice.shareableLink || window.location.href}

Payment is due by ${new Date(invoice.dueDate).toLocaleDateString()}.

Thank you for your business!

Best regards,
${invoice.fromName}`
});

export const EmailInvoice: React.FC<EmailInvoiceProps> = ({
  invoice,
  isOpen,
  onClose,
  onSend
}) => {
  const [emailData, setEmailData] = useState(() => createEmailData(invoice));

  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEmailData(createEmailData(invoice));
    }
  }, [isOpen, invoice]);

  const handleSend = async () => {
    setIsSending(true);
    setSendError('');
    try {
      await onSend(emailData);
      onClose();
    } catch (error) {
      setSendError(error instanceof Error ? error.message : 'Email could not be sent');
    } finally {
      setIsSending(false);
    }
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

          {sendError && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">
              {sendError}
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Zenvoice sends this message to the client email saved on the invoice.
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
            disabled={isSending}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Send Invoice
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
