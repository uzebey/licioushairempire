# Licious Hair Empire

E-commerce site for Licious Hair Empire (Brazilian, Peruvian & other premium hair
extensions, weavons, closures, frontals and accessories).

## Project structure

This is a monorepo with two independent apps:

```
licious-hair-empire/
├── client/   Angular + TypeScript storefront (and later, admin dashboard)
└── server/   Node.js + Express + TypeScript API
```

They run as two separate processes during development and can be deployed
separately later (e.g. client to Netlify/Vercel, server to Render/Railway).

## Prerequisites

- Node.js 20+ and npm (already installed)

## Running the project locally

You need **two terminals** open at the same time — one for the API, one for the
Angular app.

### 1. Start the backend API

```bash
cd server
npm install        # first time only
npm run dev
```

This starts the API on **http://localhost:3000**. You should see:

```
Server running on http://localhost:3000
```

The server reads configuration from `server/.env` (copied from
`server/.env.example`). **Never commit `.env`** — it's already in `.gitignore`
because it will hold real secrets (payment API keys, database URLs, etc.) later.

### 2. Start the Angular app

```bash
cd client
npm install        # first time only
npm run start
```

This starts the Angular dev server on **http://localhost:4200**. Open that URL
in your browser — you should see the "Shop Our Hair Collection" page with
product cards loaded live from the API.

> If port 4200 is already used by something else on your machine, run
> `npm run start -- --port 4201` instead and open that port.

### Health check

With the server running, visit http://localhost:3000/api/health — you should
get `{"status":"ok"}`. This is a simple endpoint to confirm the API is alive,
useful for debugging connection issues later.

## What's implemented so far

- **`server/src/data/products.ts`** — temporary in-memory product catalog
  (4 example products: Brazilian, Peruvian, weavon, closure). This will be
  replaced by a real database without changing the API shape.
- **`server/src/routes/products.routes.ts`** — `GET /api/products` (optionally
  `?category=brazilian`) and `GET /api/products/:id`.
- **`client/src/app/core/models/product.model.ts`** — shared TypeScript shape
  for a `Product`, mirrored on both client and server so they "speak the same
  language".
- **`client/src/app/core/services/product.ts`** — `ProductService`, the only
  place in the Angular app that knows how to call the products API.
- **`client/src/app/features/shop/product-list/`** — the shop page, listing
  products with category, texture, length, price (formatted in NGN) and stock
  status.

## Roadmap (next steps)

1. Shopping cart (Angular service + persisted state)
2. User accounts (register/login, JWT auth)
3. Checkout flow + Paystack/Flutterwave payment integration
4. Replace in-memory data with a real database
5. Admin dashboard (manage products, view orders)
6. Security hardening pass (rate limiting, headers, input validation)
7. Deployment

## Security notes

- All prices are stored as **integers in kobo** (1 NGN = 100 kobo) to avoid
  floating-point rounding errors with money.
- The API only accepts requests from the Angular app's origin (CORS), set via
  `CLIENT_ORIGIN` in `server/.env`.
- Secrets (payment keys, DB credentials, JWT secret) will live in `server/.env`
  only — never in Angular code, since anything in the Angular bundle is
  visible to anyone who opens DevTools.
