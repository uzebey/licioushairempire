const BASE_URL = 'https://api.paystack.co';

async function paystackFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    throw new Error('PAYSTACK_SECRET_KEY is not set in environment variables.');
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const body = (await res.json()) as { status: boolean; message: string; data: T };

  if (!body.status) {
    throw new Error(`Paystack error: ${body.message}`);
  }

  return body.data;
}

export interface PaystackTransaction {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface PaystackVerification {
  status: string; // 'success' | 'failed' | 'abandoned'
  reference: string;
  amount: number; // in kobo
  paid_at: string;
  customer: { email: string };
}

export async function initializeTransaction(params: {
  email: string;
  amount: number;
  reference: string;
  callback_url: string;
  metadata?: Record<string, unknown>;
}): Promise<PaystackTransaction> {
  return paystackFetch<PaystackTransaction>('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function verifyTransaction(reference: string): Promise<PaystackVerification> {
  return paystackFetch<PaystackVerification>(
    `/transaction/verify/${encodeURIComponent(reference)}`
  );
}
