const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./auth');
const invoiceRoutes = require('./invoices');
const emailRoutes = require('./email');
const { securityHeaders, createRateLimiter } = require('./security');

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(securityHeaders);
app.use(express.json({ limit: '1mb' }));

const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many authentication attempts. Please try again later.'
});

const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: 'Too many requests. Please slow down and try again shortly.'
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Zenvoice API is running' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/auth', authRateLimiter, authRoutes);
app.use('/invoices', apiRateLimiter, invoiceRoutes);
app.use('/email', apiRateLimiter, emailRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
if (process.env.NODE_ENV === 'production') require('./keep-alive');