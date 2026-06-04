import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  Download,
  FileText,
  Link as LinkIcon,
  Mail,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { BrandMark } from './BrandMark';

interface LandingPageProps {
  onLogin: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
}

const features = [
  {
    icon: FileText,
    title: 'Create invoices fast',
    description: 'Add client details, line items, tax, currency, notes, and payment instructions in one clean workflow.'
  },
  {
    icon: Download,
    title: 'Download professional PDFs',
    description: 'Generate polished invoice PDFs that are ready to send to clients or keep for your records.'
  },
  {
    icon: LinkIcon,
    title: 'Share public invoice links',
    description: 'Create client-friendly invoice links that work without asking your client to log in.'
  },
  {
    icon: Mail,
    title: 'Email invoices',
    description: 'Connect email delivery so invoices can be sent from the app when your production email is configured.'
  },
  {
    icon: BarChart3,
    title: 'Track invoice status',
    description: 'See draft, sent, and paid invoices from a simple dashboard with totals and filters.'
  },
  {
    icon: ShieldCheck,
    title: 'Built for real use',
    description: 'Authentication, PostgreSQL storage, security headers, rate limiting, and production deployment support.'
  }
];

const steps = [
  'Create your account',
  'Add your business and client details',
  'Save, download, email, or share the invoice'
];

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onPrivacy, onTerms }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900">
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <BrandMark subtitle="Professional invoicing" />
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a href="#features" className="hover:text-blue-700">Features</a>
          <a href="#how-it-works" className="hover:text-blue-700">How it works</a>
          <a href="#faq" className="hover:text-blue-700">FAQ</a>
        </nav>
        <button
          onClick={onLogin}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </div>
    </header>

    <main>
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-blue-100 text-sm text-blue-700 shadow-sm mb-6">
            <Sparkles size={16} />
            Invoicing for freelancers and small businesses
          </div>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Create invoices that look professional and get sent faster.
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Zenvoice helps you create, save, manage, download, email, and share invoices from one simple web app.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={onLogin}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:opacity-95 transition-opacity"
            >
              Start creating invoices
            </button>
            <a
              href="#features"
              className="px-6 py-3 bg-white text-gray-800 rounded-xl font-semibold border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors text-center"
            >
              See features
            </a>
          </div>
          <div className="mt-8 grid sm:grid-cols-3 gap-3 text-sm text-gray-600">
            {['PDF download', 'Public links', 'Status tracking'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <BrandMark subtitle="Invoice preview" />
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">Paid</span>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">From</p>
              <p className="font-semibold">Your Studio</p>
              <p className="text-gray-500">hello@yourstudio.com</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Invoice</p>
              <p className="font-semibold">INV-2026-001</p>
              <p className="text-gray-500">Due in 30 days</p>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {[
              ['Website design', 'Rs. 45,000'],
              ['Brand kit', 'Rs. 18,000'],
              ['Launch support', 'Rs. 12,000']
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between bg-gray-50 rounded-xl p-4">
                <span>{label}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between text-xl font-bold">
            <span>Total</span>
            <span className="text-blue-700">Rs. 75,000</span>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold">Everything you need for simple invoicing</h2>
          <p className="mt-3 text-gray-600">A focused toolkit for creating, storing, and sharing client invoices.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mb-4">
                <Icon size={22} className="text-blue-700" />
              </div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="mt-2 text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center">Launch an invoice in three steps</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div key={step} className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <p className="mt-4 font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Questions people ask first</h2>
        <div className="space-y-4">
          {[
            ['Is Zenvoice free to try?', 'Yes. You can create an account and test the core invoice workflow.'],
            ['Can clients open invoice links without logging in?', 'Yes. Public invoice links are designed for client viewing.'],
            ['Does Zenvoice replace accounting software?', 'No. It is focused invoicing software and should be used alongside your accounting records where needed.']
          ].map(([question, answer]) => (
            <div key={question} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-semibold">{question}</h3>
              <p className="mt-2 text-gray-600">{answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 text-white shadow-xl">
          <h2 className="text-3xl font-bold">Ready to send cleaner invoices?</h2>
          <p className="mt-3 text-blue-50">Create your Zenvoice account and test the full workflow today.</p>
          <button
            onClick={onLogin}
            className="mt-6 px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            Get started
          </button>
        </div>
      </section>
    </main>

    <footer className="border-t border-gray-200 bg-white/80">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between gap-4 text-sm text-gray-600">
        <p>© 2026 Zenvoice. Professional invoicing made simple.</p>
        <div className="flex gap-5">
          <button onClick={onPrivacy} className="hover:text-blue-700">Privacy Policy</button>
          <button onClick={onTerms} className="hover:text-blue-700">Terms</button>
          <a href="mailto:support@zenvoice.app" className="hover:text-blue-700">Contact</a>
        </div>
      </div>
    </footer>
  </div>
);
