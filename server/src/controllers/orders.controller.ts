import { Request, Response } from 'express';
import { randomUUID } from 'crypto';

import prisma from '../config/prisma';
import { initializeTransaction, verifyTransaction } from '../services/paystack';

const CALLBACK_URL =
  process.env.PAYSTACK_CALLBACK_URL ?? 'http://localhost:4200/order-confirmation';

// ─── Create Order ────────────────────────────────────────────────────────────
// POST /api/orders  (requires auth)
// Validates cart items against DB prices, creates a pending order, then
// initialises a Paystack transaction and returns the hosted payment URL.

export async function createOrder(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const userEmail = req.user!.email;

  const { items } = req.body as {
    items: Array<{ productId: string; quantity: number }>;
  };

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ message: 'Cart is empty.' });
    return;
  }

  // Fetch product prices from the database.
  // We NEVER trust prices from the client — a malicious user could send
  // priceInKobo: 1 and pay almost nothing.
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  if (products.length !== productIds.length) {
    res.status(400).json({ message: 'One or more products not found.' });
    return;
  }

  // Check stock before charging the customer
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId)!;
    if (product.stockQuantity < item.quantity) {
      res.status(400).json({ message: `Not enough stock for "${product.name}".` });
      return;
    }
  }

  const orderItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return {
      productId: product.id,
      productName: product.name,
      priceInKobo: product.priceInKobo,
      quantity: item.quantity,
    };
  });

  const totalInKobo = orderItems.reduce(
    (sum, i) => sum + i.priceInKobo * i.quantity,
    0
  );

  const reference = `lhe-${randomUUID()}`;

  const order = await prisma.order.create({
    data: {
      userId,
      status: 'pending',
      totalInKobo,
      paystackRef: reference,
      items: { create: orderItems },
    },
  });

  const paystack = await initializeTransaction({
    email: userEmail,
    amount: totalInKobo,
    reference,
    callback_url: CALLBACK_URL,
    metadata: { orderId: order.id },
  });

  res.status(201).json({ orderId: order.id, authorizationUrl: paystack.authorization_url });
}

// ─── Get User Orders ─────────────────────────────────────────────────────────
// GET /api/orders  (requires auth)

export async function getUserOrders(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  res.json(orders);
}

// ─── Verify Payment ──────────────────────────────────────────────────────────
// GET /api/orders/verify?reference=xxx  (requires auth)
// Called by the frontend after Paystack redirects back to our site.

export async function verifyPayment(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const { reference } = req.query as { reference?: string };

  if (!reference) {
    res.status(400).json({ message: 'reference query parameter is required.' });
    return;
  }

  const order = await prisma.order.findFirst({
    where: { paystackRef: reference, userId },
    include: { items: true },
  });

  if (!order) {
    res.status(404).json({ message: 'Order not found.' });
    return;
  }

  // Already confirmed — return immediately without calling Paystack again
  if (order.status === 'paid') {
    res.json(order);
    return;
  }

  const verification = await verifyTransaction(reference);

  if (verification.status !== 'success') {
    res.status(402).json({
      message: 'Payment was not completed.',
      paymentStatus: verification.status,
    });
    return;
  }

  // Amount guard: make sure what Paystack received matches what we charged
  if (verification.amount !== order.totalInKobo) {
    res.status(400).json({ message: 'Payment amount mismatch. Contact support.' });
    return;
  }

  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: { status: 'paid' },
    include: { items: true },
  });

  res.json(updatedOrder);
}

// ─── Get Single Order ────────────────────────────────────────────────────────
// GET /api/orders/:id  (requires auth, must belong to user)

export async function getOrder(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const { id } = req.params;

  const order = await prisma.order.findFirst({
    where: { id, userId },
    include: { items: true },
  });

  if (!order) {
    res.status(404).json({ message: 'Order not found.' });
    return;
  }

  res.json(order);
}
