const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./auth');
const invoiceRoutes = require('./invoices');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Zenvoice API is running' });
});

app.use('/auth', authRoutes);
app.use('/invoices', invoiceRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});