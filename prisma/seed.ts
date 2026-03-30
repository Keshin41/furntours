import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env['POSTGRES_URL'],
});
const prisma = new PrismaClient({ adapter });
async function main() {
  const alice = await prisma.user.upsert({
    where: {
      email: 'vgorgeon@gmail.com',
    },
    update: {},
    create: {
      email: 'vgorgeon@gmail.com',
      firstname: 'Vikari',
      lastname: 'Gorgeon',
      nickname: 'Vikari',
      password: 'truc',
    },
  });

  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@furntours.com',
    },
    update: {},
    create: {
      email: 'admin@furntours.com',
      firstname: 'Admin',
      lastname: 'FurN',
      nickname: 'Admin',
      password: 'admin123',
      role: 'ADMIN',
    },
  });
  const internat = await prisma.product.upsert({
    where: {
      id: 'internat-1',
    },
    update: {},
    create: {
      id: 'internat-1',
      name: 'Internat',
      description: "Interna pour l'asso Furry",
      basePrice: 45,
      category: 'INTERNAT',
      virtual: true
    },
  });

  const cup = await prisma.product.upsert({
    where: { id: 'cup-1' },
    update: {},
    create: {
      id: 'cup-1',
      name: 'Tasse FurN',
      description: 'Mug en céramique 350ml, design association FurN.',
      basePrice: 12.5,
      category: 'MUG',
      imageUrl: 'https://example.com/images/cup.png',
    },
  });

  const tourDeCou = await prisma.product.upsert({
    where: { id: 'tour-de-cou-1' },
    update: {},
    create: {
      id: 'tour-de-cou-1',
      name: 'Tour de cou FurN',
      description: 'Tour de cou tissu avec logo FurN, idéal pour les conventions.',
      basePrice: 8.0,
      category: 'ACCESSOIRE',
      imageUrl: 'https://example.com/images/tour-de-cou.png',
    },
  });

  const pin = await prisma.product.upsert({
    where: { id: 'pin-1' },
    update: {},
    create: {
      id: 'pin-1',
      name: 'Pin FurN',
      description: 'Pin métallique 25mm, édition limitée.',
      basePrice: 4.0,
      category: 'PIN',
      imageUrl: 'https://example.com/images/pin.png',
    },
  });

  const sticker = await prisma.product.upsert({
    where: { id: 'sticker-1' },
    update: {},
    create: {
      id: 'sticker-1',
      name: 'Sticker FurN',
      description: 'Sticker vinyl waterproof 6x6cm.',
      basePrice: 2.5,
      category: 'STICKER',
      imageUrl: 'https://example.com/images/sticker.png',
    },
  });

  const cupSku = await prisma.sku.upsert({
    where: { skuCode: 'CUP-STD' },
    update: {},
    create: {
      productId: cup.id,
      skuCode: 'CUP-STD',
      priceOverride: 12.5,
      stock: 120,
      trackStock: true,
      imageUrl: 'https://example.com/images/cup-sku.png',
    },
  });

  const tourDeCouSku = await prisma.sku.upsert({
    where: { skuCode: 'NECK-STRAP' },
    update: {},
    create: {
      productId: tourDeCou.id,
      skuCode: 'NECK-STRAP',
      priceOverride: 8.0,
      stock: 80,
      trackStock: true,
      imageUrl: 'https://example.com/images/tour-de-cou-sku.png',
    },
  });

  const pinSku = await prisma.sku.upsert({
    where: { skuCode: 'PIN-25' },
    update: {},
    create: {
      productId: pin.id,
      skuCode: 'PIN-25',
      priceOverride: 4.0,
      stock: 250,
      trackStock: true,
      imageUrl: 'https://example.com/images/pin-sku.png',
    },
  });

  const stickerSku = await prisma.sku.upsert({
    where: { skuCode: 'STICKER-6' },
    update: {},
    create: {
      productId: sticker.id,
      skuCode: 'STICKER-6',
      priceOverride: 2.5,
      stock: 500,
      trackStock: true,
      imageUrl: 'https://example.com/images/sticker-sku.png',
    },
  });

  const meetup = await prisma.event.create({
    data: {
      title: 'Furmeet 1',
      description: 'First furmeet',
      type: 'MEET',
      published: true,
      opened: true,
    },
  });
  const meetup2 = await prisma.event.create({
    data: {
      title: 'Furmeet 2',
      description: 'Second furmeet',
      type: 'MEET',
      published: true,
      opened: true,
    },
  });

  const meetup3 = await prisma.event.create({
    data: {
      title: 'Furmeet 3',
      description: 'Third furmeet',
      type: 'MEET',
      published: true,
      opened: true,
    },
  });

  const announcement = await prisma.announcement.upsert({
    where: { id: 'default-announcement' },
    update: {
      title: "Ouverture des inscriptions pour l'Internat 2026 !",
      message:
        "Vous pouvez dès à présent vous inscrire pour l'Internat 2026, qui se déroulera du 1er au 3 août. Ne manquez pas cette occasion de vivre une expérience inoubliable avec la communauté furry !",
      active: true,
      actionLabel: 'Internat',
      actionUrl: '/internat',
      updatedAt: new Date(),
    },
    create: {
      id: 'default-announcement',
      title: "Ouverture des inscriptions pour l'Internat 2026 !",
      message:
        "Vous pouvez dès à présent vous inscrire pour l'Internat 2026, qui se déroulera du 1er au 3 août. Ne manquez pas cette occasion de vivre une expérience inoubliable avec la communauté furry !",
      active: true,
      actionLabel: 'Internat',
      actionUrl: '/internat',
    },
  });

  console.log({ alice, admin, meetup, meetup2, meetup3, announcement, internat, tourDeCou, cup, pin, sticker, cupSku, tourDeCouSku, pinSku, stickerSku });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e: unknown) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
