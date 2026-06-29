import process from 'process';
import bcrypt from 'bcryptjs';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Delete in dependency order: items → orders → products
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: 'Kinky Curly Headband Wig',
        description:
          'Effortless and beginner-friendly — no glue, no lace. Natural black kinky curls with a stylish headband for a secure, comfortable fit. Perfect for everyday wear.',
        category: 'wig',
        texture: 'kinky-curly',
        lengthInches: 14,
        priceInKobo: 3500000,
        currency: 'NGN',
        stockQuantity: 15,
        images: JSON.stringify([
          '/assets/products/curly-headband-wig-1.jpg',
          '/assets/products/curly-headband-wig-2.jpg',
          '/assets/products/curly-headband-wig-3.jpg',
          '/assets/products/curly-headband-wig-4.jpg',
        ]),
      },
      {
        name: 'Chocolate Deep Wave Lace Front Wig',
        description:
          'Rich chocolate brown deep wave lace front wig with an invisible HD lace hairline. Luxurious curls and a stunning colour — a true statement piece.',
        category: 'wig',
        texture: 'deep-wave',
        lengthInches: 26,
        priceInKobo: 5500000,
        currency: 'NGN',
        stockQuantity: 8,
        images: JSON.stringify([
          '/assets/products/chocolate-deep-wave-wig-1.jpg',
          '/assets/products/chocolate-deep-wave-wig-2.jpg',
          '/assets/products/chocolate-deep-wave-wig-3.jpg',
        ]),
      },
      {
        name: 'Body Wave Wig with Bangs',
        description:
          'Glamorous full-volume body wave wig with soft face-framing bangs. Natural black, machine-made cap for all-day comfort. No lace, no fuss.',
        category: 'wig',
        texture: 'body-wave',
        lengthInches: 22,
        priceInKobo: 4500000,
        currency: 'NGN',
        stockQuantity: 10,
        images: JSON.stringify([
          '/assets/products/body-wave-bangs-wig.jpg',
          '/assets/products/body-wave-bangs-wig-2.jpg',
        ]),
      },
      {
        name: 'Body Wave Lace Front Wig',
        description:
          'Premium natural black body wave wig with HD lace front for a seamless, undetectable hairline. Full, lush and easy to style.',
        category: 'wig',
        texture: 'body-wave',
        lengthInches: 24,
        priceInKobo: 5000000,
        currency: 'NGN',
        stockQuantity: 12,
        images: JSON.stringify([
          '/assets/products/body-wave-lace-front-wig.jpg',
          '/assets/products/body-wave-lace-front-wig-2.jpg',
        ]),
      },
      {
        name: 'Kinky Curly Ombré Lace Front Wig',
        description:
          'Head-turning black-to-brown ombré kinky curly lace front wig. Thick, bouncy curls with a natural hairline — perfect for a bold, glamorous look.',
        category: 'wig',
        texture: 'kinky-curly',
        lengthInches: 26,
        priceInKobo: 4800000,
        currency: 'NGN',
        stockQuantity: 6,
        images: JSON.stringify([
          '/assets/products/kinky-curly-ombre-wig.jpg',
          '/assets/products/kinky-curly-ombre-wig-2.jpg',
          '/assets/products/kinky-curly-ombre-wig-3.jpg',
        ]),
      },
      {
        name: 'Straight Ombré Lace Front Wig',
        description:
          'Sleek and sophisticated — natural black melting into a deep dark red at the tips. Ultra-straight, silky texture with a clean HD lace hairline.',
        category: 'wig',
        texture: 'straight',
        lengthInches: 28,
        priceInKobo: 5800000,
        currency: 'NGN',
        stockQuantity: 7,
        images: JSON.stringify(['/assets/products/straight-ombre-lace-front-wig.jpg']),
      },
      {
        name: 'Burgundy Body Wave Wig',
        description:
          'Rich, deep burgundy body wave wig — bold colour meets effortless waves. A glamorous choice for queens who love to stand out.',
        category: 'wig',
        texture: 'body-wave',
        lengthInches: 22,
        priceInKobo: 4800000,
        currency: 'NGN',
        stockQuantity: 9,
        images: JSON.stringify(['/assets/products/burgundy-body-wave-wig.jpg']),
      },
      {
        name: 'Ginger Body Wave Lace Front Wig',
        description:
          'Warm ginger/auburn body wave lace front wig with a gorgeous copper tone. Turns heads instantly. HD lace for a seamless, natural-looking hairline.',
        category: 'wig',
        texture: 'body-wave',
        lengthInches: 24,
        priceInKobo: 5200000,
        currency: 'NGN',
        stockQuantity: 5,
        images: JSON.stringify(['/assets/products/ginger-body-wave-lace-front-wig.jpg']),
      },
      {
        name: 'Kinky Curly Wig with Bangs',
        description:
          'Full, fluffy and fabulous. Natural black kinky curls with fun, textured bangs. No lace needed — just put it on and go.',
        category: 'wig',
        texture: 'kinky-curly',
        lengthInches: 16,
        priceInKobo: 3800000,
        currency: 'NGN',
        stockQuantity: 11,
        images: JSON.stringify(['/assets/products/kinky-curly-bangs-wig.jpg']),
      },
      {
        name: 'Straight Bob Lace Front Wig',
        description:
          'Classic sleek bob lace front wig — clean, chic and timeless. Natural black with a defined cut and invisible HD lace parting.',
        category: 'wig',
        texture: 'straight',
        lengthInches: 12,
        priceInKobo: 4200000,
        currency: 'NGN',
        stockQuantity: 14,
        images: JSON.stringify(['/assets/products/straight-bob-lace-front-wig.jpg']),
      },
      {
        name: 'Plum Body Wave Lace Front Wig',
        description:
          'Deep, dark plum/purple body wave lace front wig — bold, luxurious and unforgettable. HD lace for a seamless hairline. For the queen who loves to make a statement.',
        category: 'wig',
        texture: 'body-wave',
        lengthInches: 24,
        priceInKobo: 5500000,
        currency: 'NGN',
        stockQuantity: 6,
        images: JSON.stringify(['/assets/products/plum-body-wave-lace-front-wig.jpg']),
      },
    ],
  });

  const productCount = await prisma.product.count();
  console.log(`Done — ${productCount} products in the database.`);

  const adminPasswordHash = await bcrypt.hash('Admin@Licious2024', 12);
  await prisma.user.upsert({
    where: { email: 'admin@licioushairempire.com' },
    create: {
      email: 'admin@licioushairempire.com',
      passwordHash: adminPasswordHash,
      name: 'Admin',
      role: 'admin',
    },
    update: {},
  });

  console.log('Admin user ready — email: admin@licioushairempire.com  password: Admin@Licious2024');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
