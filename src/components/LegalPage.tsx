import React from 'react';
import { BrandMark } from './BrandMark';

type LegalPageType = 'privacy' | 'terms';

interface LegalPageProps {
  type: LegalPageType;
  onHome: () => void;
  onLogin: () => void;
}

const updatedAt = 'June 4, 2026';

export const LegalPage: React.FC<LegalPageProps> = ({ type, onHome, onLogin }) => {
  const isPrivacy = type === 'privacy';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={onHome} className="text-left">
            <BrandMark subtitle="Professional invoicing" />
          </button>
          <button
            onClick={onLogin}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <p className="text-sm text-gray-500">Last updated: {updatedAt}</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">
            {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
          </h1>
          <p className="mt-4 text-gray-600">
            {isPrivacy
              ? 'This policy explains what information Zenvoice collects and how it is used to provide the invoicing service.'
              : 'These terms explain the basic rules for using Zenvoice. They are a practical starter policy and should be reviewed before a larger public launch.'}
          </p>

          {isPrivacy ? <PrivacyContent /> : <TermsContent />}
        </article>
      </main>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mt-8">
    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    <div className="mt-3 text-gray-600 space-y-3">{children}</div>
  </section>
);

const PrivacyContent = () => (
  <>
    <Section title="Information We Collect">
      <p>We collect account information such as your name, email address, and password hash when you register.</p>
      <p>We store invoice information you create, including business details, client details, invoice items, totals, statuses, public invoice tokens, and timestamps.</p>
    </Section>
    <Section title="How We Use Information">
      <p>We use your information to authenticate your account, save and display invoices, generate public invoice links, and support invoice email delivery when configured.</p>
      <p>We may use service logs to diagnose errors, protect the service, and improve reliability.</p>
    </Section>
    <Section title="Sharing">
      <p>We do not sell personal information. Information is shared only with hosting, database, and email providers needed to run the service.</p>
      <p>Anyone with a public invoice link may view the invoice connected to that link.</p>
    </Section>
    <Section title="Security">
      <p>Zenvoice uses authentication, HTTPS deployment, database access controls, security headers, and rate limiting. No online service can guarantee perfect security.</p>
    </Section>
    <Section title="Contact">
      <p>For privacy questions, contact support@zenvoice.app.</p>
    </Section>
  </>
);

const TermsContent = () => (
  <>
    <Section title="Use of Zenvoice">
      <p>You may use Zenvoice to create, manage, download, email, and share invoices for lawful business purposes.</p>
      <p>You are responsible for the accuracy of invoice details, taxes, payment instructions, and client information you enter.</p>
    </Section>
    <Section title="Accounts">
      <p>You are responsible for keeping your login credentials secure and for activity under your account.</p>
    </Section>
    <Section title="Invoice Links">
      <p>Public invoice links can be opened by anyone who has the link. Do not share links with people who should not view that invoice.</p>
    </Section>
    <Section title="No Financial or Legal Advice">
      <p>Zenvoice helps create invoice documents. It does not provide tax, legal, accounting, or financial advice.</p>
    </Section>
    <Section title="Availability">
      <p>We aim to keep the service reliable, but uptime and uninterrupted access are not guaranteed.</p>
    </Section>
    <Section title="Contact">
      <p>For support questions, contact support@zenvoice.app.</p>
    </Section>
  </>
);
