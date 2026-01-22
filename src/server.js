// src/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

/* =======================
   MIDDLEWARES
======================= */
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* =======================
   ROUTES
======================= */
const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

const ordersRouter = require('./routes/orders');
app.use('/api/orders', ordersRouter);

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const categoriesRouter = require('./routes/categories');
app.use('/api/categories', categoriesRouter);

/* =======================
   HEALTHCHECK
======================= */
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV || 'development'
  });
});

/* =======================
   ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    }
  });
});

/* =======================
   START SERVER
======================= */
const port = Number(process.env.PORT) || 3000;
const server = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

/* =======================
   GRACEFUL SHUTDOWN
======================= */
const shutdown = () => {
  console.log('Shutting down server...');
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('unhandledRejection', shutdown);
