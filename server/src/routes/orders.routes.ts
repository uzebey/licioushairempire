import { Router } from 'express';

import { requireAuth } from '../middleware/auth';
import {
  createOrder,
  getUserOrders,
  verifyPayment,
  getOrder,
} from '../controllers/orders.controller';

const router = Router();

// All order routes require a logged-in user
router.use(requireAuth);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/verify', verifyPayment); // must come before /:id
router.get('/:id', getOrder);

export default router;
