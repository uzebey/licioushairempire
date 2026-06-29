import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import productsRouter from './routes/products.routes';
import authRouter from './routes/auth.routes';
import ordersRouter from './routes/orders.routes';
import adminRouter from './routes/admin.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;
const isProduction = process.env.NODE_ENV === 'production';

// In production Angular is served from the same origin, so no CORS needed.
// In dev the Angular dev server runs on a different port.
if (!isProduction) {
  const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:4200';
  app.use(cors({ origin: CLIENT_ORIGIN }));
}

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);

// In production: serve the Angular build and let Angular's router handle all
// non-API paths (so page refreshes on /cart, /login etc. still work).
if (isProduction) {
  const clientBuild = path.join(__dirname, '../../client/dist/client/browser');
  app.use(express.static(clientBuild));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
