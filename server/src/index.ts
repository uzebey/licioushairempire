import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products.routes';
import authRouter from './routes/auth.routes';
import ordersRouter from './routes/orders.routes';
import adminRouter from './routes/admin.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:4200';

// Only allow requests from our Angular app's origin (prevents random
// websites from calling our API directly from a browser using a visitor's session).
app.use(cors({ origin: CLIENT_ORIGIN }));

// Parse incoming JSON request bodies into req.body
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);

// Error handler must be registered last, after all routes
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
