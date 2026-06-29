import { Product } from '../models/product.model';

/**
 * Temporary in-memory product list, standing in for a real database.
 * Once the basic flow (Angular <-> API) works end to end, this gets
 * replaced by a real database (e.g. PostgreSQL or MongoDB) without
 * changing the controllers/routes that use it.
 */
export const products: Product[] = [
  {
    id: '1',
    name: 'Brazilian Straight Bundle',
    description:
      '100% virgin Brazilian human hair, straight texture. Soft, silky and tangle-free with minimal shedding.',
    category: 'brazilian',
    texture: 'straight',
    lengthInches: 18,
    priceInKobo: 2500000,
    currency: 'NGN',
    stockQuantity: 25,
    images: ['/assets/products/brazilian-straight-18.jpg'],
    createdAt: new Date('2026-01-10').toISOString(),
    updatedAt: new Date('2026-01-10').toISOString(),
  },
  {
    id: '2',
    name: 'Peruvian Body Wave Bundle',
    description:
      'Premium Peruvian hair with a natural body wave pattern. Holds curls well and blends easily with relaxed hair.',
    category: 'peruvian',
    texture: 'body-wave',
    lengthInches: 20,
    priceInKobo: 3200000,
    currency: 'NGN',
    stockQuantity: 18,
    images: ['/assets/products/peruvian-body-wave-20.jpg'],
    createdAt: new Date('2026-01-12').toISOString(),
    updatedAt: new Date('2026-01-12').toISOString(),
  },
  {
    id: '3',
    name: 'Deep Wave Weavon (Single Pack)',
    description:
      'Affordable synthetic-blend weavon with a deep wave texture. Great for everyday styling.',
    category: 'weavon',
    texture: 'deep-wave',
    lengthInches: 16,
    priceInKobo: 850000,
    currency: 'NGN',
    stockQuantity: 50,
    images: ['/assets/products/deep-wave-weavon-16.jpg'],
    createdAt: new Date('2026-02-01').toISOString(),
    updatedAt: new Date('2026-02-01').toISOString(),
  },
  {
    id: '4',
    name: 'HD Lace Closure 4x4',
    description:
      'Undetectable HD lace closure, pre-plucked hairline, matches Brazilian and Peruvian bundles.',
    category: 'closure',
    texture: 'straight',
    lengthInches: 14,
    priceInKobo: 1800000,
    currency: 'NGN',
    stockQuantity: 12,
    images: ['/assets/products/hd-closure-14.jpg'],
    createdAt: new Date('2026-02-15').toISOString(),
    updatedAt: new Date('2026-02-15').toISOString(),
  },
];
