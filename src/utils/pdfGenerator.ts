import { InvoiceData } from '../types/invoice';

const printableCurrency = (amount: number, currency: InvoiceData['currency']) => {
  return `${currency} ${amount.toFixed(2)}`;
};

export const generateInvoicePDF = async (invoice: InvoiceData): Promise<void> => {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const ensureSpace = (height: number) => {
    if (y + height > 280) {
      pdf.addPage();
      y = 20;
    }
  };

  const addTextBlock = (text: string, x: number, maxWidth: number, lineHeight = 5) => {
    const lines = pdf.splitTextToSize(text || '-', maxWidth);
    pdf.text(lines, x, y);
    y += lines.length * lineHeight;
  };

  pdf.setTextColor(37, 99, 235);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INVOICE', margin, y);

  pdf.setTextColor(31, 41, 55);
  pdf.setFontSize(12);
  pdf.text(`#${invoice.invoiceNumber}`, pageWidth - margin, y, { align: 'right' });
  y += 8;

  pdf.setDrawColor(37, 99, 235);
  pdf.setLineWidth(0.8);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Invoice date: ${new Date(invoice.date).toLocaleDateString()}`, margin, y);
  pdf.text(`Due date: ${new Date(invoice.dueDate).toLocaleDateString()}`, pageWidth - margin, y, { align: 'right' });
  y += 10;

  const addressTop = y;
  pdf.setFont('helvetica', 'bold');
  pdf.text('FROM', margin, y);
  pdf.text('BILL TO', pageWidth / 2 + 5, y);
  y += 6;

  pdf.setFont('helvetica', 'normal');
  const fromLines = pdf.splitTextToSize(
    [invoice.fromName, invoice.fromEmail, invoice.fromPhone, invoice.fromAddress].filter(Boolean).join('\n'),
    contentWidth / 2 - 8
  );
  const toLines = pdf.splitTextToSize(
    [invoice.toName, invoice.toEmail, invoice.toPhone, invoice.toAddress].filter(Boolean).join('\n'),
    contentWidth / 2 - 8
  );
  pdf.text(fromLines, margin, y);
  pdf.text(toLines, pageWidth / 2 + 5, y);
  y = addressTop + 8 + Math.max(fromLines.length, toLines.length) * 5 + 8;

  ensureSpace(25);
  pdf.setFillColor(37, 99, 235);
  pdf.rect(margin, y, contentWidth, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Description', margin + 2, y + 5.5);
  pdf.text('Qty', 125, y + 5.5, { align: 'right' });
  pdf.text('Rate', 158, y + 5.5, { align: 'right' });
  pdf.text('Amount', pageWidth - margin - 2, y + 5.5, { align: 'right' });
  y += 11;

  pdf.setTextColor(31, 41, 55);
  pdf.setFont('helvetica', 'normal');
  invoice.items.forEach((item) => {
    const descriptionLines = pdf.splitTextToSize(item.description || '-', 82);
    const rowHeight = Math.max(8, descriptionLines.length * 5 + 3);
    ensureSpace(rowHeight);
    pdf.text(descriptionLines, margin + 2, y + 4);
    pdf.text(String(item.quantity), 125, y + 4, { align: 'right' });
    pdf.text(printableCurrency(item.rate, invoice.currency), 158, y + 4, { align: 'right' });
    pdf.text(printableCurrency(item.amount, invoice.currency), pageWidth - margin - 2, y + 4, { align: 'right' });
    pdf.setDrawColor(229, 231, 235);
    pdf.line(margin, y + rowHeight - 1, pageWidth - margin, y + rowHeight - 1);
    y += rowHeight;
  });

  y += 5;
  ensureSpace(30);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Subtotal', 145, y, { align: 'right' });
  pdf.text(printableCurrency(invoice.subtotal, invoice.currency), pageWidth - margin, y, { align: 'right' });
  y += 6;
  pdf.text(`Tax (${invoice.taxRate}%)`, 145, y, { align: 'right' });
  pdf.text(printableCurrency(invoice.taxAmount, invoice.currency), pageWidth - margin, y, { align: 'right' });
  y += 7;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('Total', 145, y, { align: 'right' });
  pdf.text(printableCurrency(invoice.total, invoice.currency), pageWidth - margin, y, { align: 'right' });
  y += 14;

  pdf.setFontSize(10);
  const sections = [
    ['Notes', invoice.notes],
    ['Terms & Conditions', invoice.terms],
    ['Payment Instructions', invoice.paymentInstructions]
  ] as const;

  sections.forEach(([title, content]) => {
    if (!content) return;
    const lines = pdf.splitTextToSize(content, contentWidth);
    ensureSpace(lines.length * 5 + 10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, margin, y);
    y += 6;
    pdf.setFont('helvetica', 'normal');
    addTextBlock(content, margin, contentWidth);
    y += 4;
  });

  pdf.setTextColor(107, 114, 128);
  pdf.setFontSize(9);
  pdf.text('Generated with Zenvoice', margin, 290);

  const safeNumber = invoice.invoiceNumber.replace(/[^a-z0-9-_]/gi, '-');
  pdf.save(`Invoice-${safeNumber}.pdf`);
};
