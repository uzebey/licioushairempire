import { Request, Response } from 'express';

import prisma from '../config/prisma';

/**
 * SQLite stores images as a JSON string (no native array type).
 * This helper parses it back into a proper string[].
 */
function parseImages(raw: string): string[] {
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export async function getAllProducts(req: Request, res: Response): Promise<void> {
  const { category } = req.query;

  const products = await prisma.product.findMany({
    where: category && typeof category === 'string' ? { category } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  res.json(products.map((p) => ({ ...p, images: parseImages(p.images) })));
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
  });

  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  res.json({ ...product, images: parseImages(product.images) });
}
