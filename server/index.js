const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
// Lets the server read JSON from request bodies
app.use(express.json());

// Lets your React frontend (on a different port) talk to this server
app.use(cors());

// ─── In-Memory Storage (Week 7 only — replaced by MongoDB in Week 8) ─────────
let invoices = [
  {
    id: '1',
    invoiceNumber: 'INV-202404-001',
    fromName: 'Nishtha',
    toName: 'Client A',
    total: 5000,
    currency: 'INR',
    status: 'draft',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    invoiceNumber: 'INV-202404-002',
    fromName: 'Nishtha',
    toName: 'Client B',
    total: 12000,
    currency: 'INR',
    status: 'sent',
    createdAt: new Date().toISOString()
  }
];

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check — visit http://localhost:5000/ to confirm the server is running
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Zenvoice API is running' });
});

// GET /invoices — return all invoices
app.get('/invoices', (req, res) => {
  res.status(200).json(invoices);
});

// GET /invoices/:id — return a single invoice by ID
app.get('/invoices/:id', (req, res) => {
  const invoice = invoices.find(inv => inv.id === req.params.id);

  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }

  res.status(200).json(invoice);
});

// POST /invoices — create a new invoice
app.post('/invoices', (req, res) => {
  const data = req.body;

  // Basic validation — reject empty requests
  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'Request body cannot be empty' });
  }

  const newInvoice = {
    id: Date.now().toString(), // temporary ID — will use MongoDB ObjectId in Week 8
    ...data,
    createdAt: new Date().toISOString()
  };

  invoices.push(newInvoice);
  res.status(201).json(newInvoice);
});

// DELETE /invoices/:id — delete an invoice by ID
app.delete('/invoices/:id', (req, res) => {
  const index = invoices.findIndex(inv => inv.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Invoice not found' });
  }

  const deleted = invoices.splice(index, 1);
  res.status(200).json({ message: 'Invoice deleted', invoice: deleted[0] });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
