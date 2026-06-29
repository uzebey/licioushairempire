import { Request, Response } from 'express';

import prisma from '../config/prisma';

function parseImages(raw: string): string[] {
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

const VALID_STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

// ─── Products ────────────────────────────────────────────────────────────────

export async function adminGetProducts(_req: Request, res: Response): Promise<void> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { orderItems: true } } },
  });

  res.json(products.map((p) => ({ ...p, images: parseImages(p.images) })));
}

export async function adminCreateProduct(req: Request, res: Response): Promise<void> {
  const { name, description, category, texture, lengthInches, priceInKobo, stockQuantity, images } =
    req.body as {
      name: string;
      description: string;
      category: string;
      texture?: string;
      lengthInches?: number;
      priceInKobo: number;
      stockQuantity: number;
      images?: string[];
    };

  if (!name || !description || !category || !priceInKobo || stockQuantity == null) {
    res.status(400).json({ message: 'name, description, category, priceInKobo and stockQuantity are required.' });
    return;
  }

  if (priceInKobo <= 0) {
    res.status(400).json({ message: 'Price must be greater than zero.' });
    return;
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      category,
      texture: texture ?? null,
      lengthInches: lengthInches ?? null,
      priceInKobo,
      stockQuantity,
      images: JSON.stringify(images ?? []),
    },
  });

  res.status(201).json({ ...product, images: parseImages(product.images) });
}

export async function adminUpdateProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { name, description, category, texture, lengthInches, priceInKobo, stockQuantity, images } =
    req.body as {
      name?: string;
      description?: string;
      category?: string;
      texture?: string | null;
      lengthInches?: number | null;
      priceInKobo?: number;
      stockQuantity?: number;
      images?: string[];
    };

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ message: 'Product not found.' });
    return;
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
      ...(texture !== undefined && { texture }),
      ...(lengthInches !== undefined && { lengthInches }),
      ...(priceInKobo !== undefined && { priceInKobo }),
      ...(stockQuantity !== undefined && { stockQuantity }),
      ...(images !== undefined && { images: JSON.stringify(images) }),
    },
  });

  res.json({ ...product, images: parseImages(product.images) });
}

export async function adminDeleteProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ message: 'Product not found.' });
    return;
  }

  await prisma.product.delete({ where: { id } });
  res.status(204).send();
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function adminGetOrders(_req: Request, res: Response): Promise<void> {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(orders);
}

export async function adminUpdateOrderStatus(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { status } = req.body as { status: string };

  if (!VALID_STATUSES.includes(status)) {
    res.status(400).json({ message: `Status must be one of: ${VALID_STATUSES.join(', ')}.` });
    return;
  }

  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ message: 'Order not found.' });
    return;
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: {
      items: true,
      user: { select: { name: true, email: true } },
    },
  });

  res.json(order);
}
