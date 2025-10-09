import React, { useState } from 'react';
import { FileText, Home, Plus, Eye } from 'lucide-react';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoiceDashboard } from './components/InvoiceDashboard';
import { PublicInvoiceView } from './components/PublicInvoiceView';
import { InvoiceData } from './types/invoice';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateInvoicePDF } from './utils/pdfGenerator';

type View = 'dashboard' | 'create' | 'edit' | 'public';

function App() {
  const [invoices, setInvoices] = useLocalStorage<InvoiceData[]>('invoices', []);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [editingInvoice, setEditingInvoice] = useState<InvoiceData | null>(null);
  const [publicInvoice, setPublicInvoice] = useState<InvoiceData | null>(null);

  const handleSaveInvoice = (invoiceData: InvoiceData) => {
    if (editingInvoice) {
      // Update existing invoice
      setInvoices(prev => 
        prev.map(invoice => 
          invoice.id === editingInvoice.id ? invoiceData : invoice
        )
      );
      setEditingInvoice(null);
    } else {
      // Create new invoice
      setInvoices(prev => [...prev, invoiceData]);
    }
    
    setCurrentView('dashboard');
    
  // Show success message
    alert('Invoice saved successfully!');
  };

  const handleEditInvoice = (invoice: InvoiceData) => {
    setEditingInvoice(invoice);
    setCurrentView('edit');
  };

  const handleDeleteInvoice = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(prev => prev.filter(invoice => invoice.id !== id));
    }
  };

  const handlePreviewInvoice = (invoice: InvoiceData) => {
    generateInvoicePDF(invoice, invoice.template);
  };

  const handleCreateNew = () => {
    setEditingInvoice(null);
    setCurrentView('create');
  };

  const navigateTo = (view: View) => {
    setCurrentView(view);
    if (view !== 'edit') {
      setEditingInvoice(null);
    }
  };

  const handleViewPublic = (invoice: InvoiceData) => {
    setPublicInvoice(invoice);
    setCurrentView('public');
  };

  const handlePayNow = () => {
    // In a real app, this would integrate with Razorpay, Stripe, etc.
    alert('Payment integration would be implemented here (Razorpay/Stripe)');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'create':
      case 'edit':
        return (
          <InvoiceForm
            onSave={handleSaveInvoice}
            onPreview={handlePreviewInvoice}
            initialData={editingInvoice || undefined}
          />
        );
      case 'public':
        return publicInvoice ? (
          <PublicInvoiceView
            invoice={publicInvoice}
            onPayNow={handlePayNow}
          />
        ) : null;
      case 'dashboard':
      default:
        return (
          <InvoiceDashboard
            invoices={invoices}
            onEdit={handleEditInvoice}
            onDelete={handleDeleteInvoice}
            onPreview={handlePreviewInvoice}
            onCreateNew={handleCreateNew}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      {currentView !== 'public' && (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <FileText size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Invoice Builder Pro
                  </h1>
                  <p className="text-xs text-gray-500">Professional Invoice Generator</p>
                </div>
              </div>
              
              <div className="hidden md:flex space-x-6">
                <button
                  onClick={() => navigateTo('dashboard')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Home size={16} />
                  Dashboard
                </button>
                
                <button
                  onClick={handleCreateNew}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'create' || currentView === 'edit'
                      ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Plus size={16} />
                  Create Invoice
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex space-x-2">
              <button
                onClick={() => navigateTo('dashboard')}
                className={`p-2 rounded-md ${
                  currentView === 'dashboard'
                    ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home size={20} />
              </button>
              
              <button
                onClick={handleCreateNew}
                className={`p-2 rounded-md ${
                  currentView === 'create' || currentView === 'edit'
                    ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      )}

      {/* Main Content */}
      <main className={currentView === 'public' ? '' : 'py-8'}>
        {renderContent()}
      </main>

      {/* Footer */}
      {currentView !== 'public' && (
        <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <FileText size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Invoice Builder Pro
                </h3>
                <p className="text-sm text-gray-600">Professional invoicing made simple</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>&copy; 2025 Invoice Builder. Built with React & TypeScript.</p>
            </div>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
}

export default App;