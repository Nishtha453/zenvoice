import React, { useState } from 'react';
import { FileText, Home, Plus, LogOut } from 'lucide-react';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoiceDashboard } from './components/InvoiceDashboard';
import { PublicInvoiceView } from './components/PublicInvoiceView';
import { InvoiceData } from './types/invoice';
import { generateInvoicePDF } from './utils/pdfGenerator';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './components/AuthPage';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from './utils/api';

type View = 'dashboard' | 'create' | 'edit' | 'public';

const AppContent: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [editingInvoice, setEditingInvoice] = useState<InvoiceData | null>(null);
  const [publicInvoice, setPublicInvoice] = useState<InvoiceData | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  React.useEffect(() => {
    if (user) {
      fetchInvoices();
    }
  }, [user]);

  const fetchInvoices = async () => {
    setIsFetching(true);
    try {
      const data = await getInvoices();
      if (Array.isArray(data)) {
        const parsed = data.map((row) => ({
          ...row.data,
          id: String(row.id),
          status: row.status || row.data.status,
          createdAt: row.created_at || row.data.createdAt,
          updatedAt: row.updated_at || row.data.updatedAt
        }));
        setInvoices(parsed);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSaveInvoice = async (invoiceData: InvoiceData) => {
    try {
      if (editingInvoice) {
        await updateInvoice(editingInvoice.id, invoiceData);
        setEditingInvoice(null);
      } else {
        await createInvoice(invoiceData);
      }
      await fetchInvoices();
      setCurrentView('dashboard');
      alert('Invoice saved successfully!');
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error saving invoice. Please try again.');
    }
  };

  const handleEditInvoice = (invoice: InvoiceData) => {
    setEditingInvoice(invoice);
    setCurrentView('edit');
  };

  const handleDeleteInvoice = async (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      try {
        await deleteInvoice(id);
        await fetchInvoices();
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
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
    alert('Payment integration would be implemented here (Razorpay/Stripe)');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

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
            onViewPublic={handleViewPublic}
            onCreateNew={handleCreateNew}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
                      Zenvoice
                    </h1>
                    <p className="text-xs text-gray-500">Welcome, {user.name}</p>
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

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}

      <main className={currentView === 'public' ? '' : 'py-8'}>
        {isFetching ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          renderContent()
        )}
      </main>

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
                    Zenvoice
                  </h3>
                  <p className="text-sm text-gray-600">Professional invoicing made simple</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <p>&copy; 2025 Zenvoice. Built with React & TypeScript.</p>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
