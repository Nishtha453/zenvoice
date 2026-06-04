const express = require('express');
const router = express.Router();
const pool = require('./db');
const authMiddleware = require('./middleware');

router.post('/send-invoice', authMiddleware, async (req, res) => {
  const { invoiceId, to, subject, message } = req.body;

  if (!invoiceId || !to || !subject || !message) {
    return res.status(400).json({ error: 'Invoice, recipient, subject, and message are required' });
  }

  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return res.status(503).json({ error: 'Email service is not configured yet' });
  }

  try {
    const invoiceResult = await pool.query(
      'SELECT data FROM invoices WHERE id = $1 AND user_id = $2',
      [invoiceId, req.user.id]
    );

    if (invoiceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const invoice = invoiceResult.rows[0].data;
    if (to.toLowerCase() !== invoice.toEmail.toLowerCase()) {
      return res.status(400).json({ error: 'Recipient must match the invoice client email' });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [to],
        subject,
        text: message
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(502).json({ error: data.message || 'Email could not be sent' });
    }

    res.status(200).json({ message: 'Invoice email sent', id: data.id });
  } catch (error) {
    console.error('Send invoice email error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
