import { Router } from 'express';
import { getAllProducts, getProductById } from '../controllers/products.controller';

const router = Router();

// GET /api/products            -> all products (optionally ?category=brazilian)
router.get('/', getAllProducts);

// GET /api/products/:id        -> a single product
router.get('/:id', getProductById);

export default router;
