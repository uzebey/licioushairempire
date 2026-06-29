import { Router } from 'express';

import { requireAuth, requireAdmin } from '../middleware/auth';
import {
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetOrders,
  adminUpdateOrderStatus,
} from '../controllers/admin.controller';

const router = Router();

// Every admin route requires a valid JWT AND the admin role
router.use(requireAuth, requireAdmin);

// Products
router.get('/products', adminGetProducts);
router.post('/products', adminCreateProduct);
router.put('/products/:id', adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);

// Orders
router.get('/orders', adminGetOrders);
router.patch('/orders/:id/status', adminUpdateOrderStatus);

export default router;
