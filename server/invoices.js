const express = require('express');
const router = express.Router();
const pool = require('./db');
const authMiddleware = require('./middleware');

const isValidPublicToken = (token) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token);

const validateInvoiceData = (data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return 'Invoice data is required';
  }

  const requiredFields = [
    'invoiceNumber',
    'date',
    'dueDate',
    'fromName',
    'fromEmail',
    'fromAddress',
    'toName',
    'toEmail',
    'toAddress',
    'currency',
    'status'
  ];

  for (const field of requiredFields) {
    if (!String(data[field] || '').trim()) {
      return `${field} is required`;
    }
  }

  if (!Array.isArray(data.items) || data.items.length === 0) {
    return 'At least one invoice item is required';
  }

  if (!['draft', 'sent', 'paid'].includes(data.status)) {
    return 'Invalid invoice status';
  }

  if (!['INR', 'USD', 'EUR', 'GBP'].includes(data.currency)) {
    return 'Invalid currency';
  }

  if (data.shareToken && !isValidPublicToken(data.shareToken)) {
    return 'Invalid public invoice token';
  }

  return null;
};

router.get('/public/:token', async (req, res) => {
  if (!isValidPublicToken(req.params.token)) {
    return res.status(400).json({ error: 'Invalid invoice link' });
  }

  try {
    const result = await pool.query(
      `SELECT id, data, status, created_at, updated_at
       FROM invoices
       WHERE data->>'shareToken' = $1
       LIMIT 1`,
      [req.params.token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Get public invoice error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM invoices WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM invoices WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const data = req.body;
  const validationError = validateInvoiceData(data);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const result = await pool.query(
      'INSERT INTO invoices (user_id, invoice_number, data, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, data.invoiceNumber, JSON.stringify(data), data.status || 'draft']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const data = req.body;
  const validationError = validateInvoiceData(data);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const result = await pool.query(
      'UPDATE invoices SET data = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *',
      [JSON.stringify(data), data.status || 'draft', req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM invoices WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
