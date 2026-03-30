import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env['POSTGRES_URL'],
});

const prisma = new PrismaClient({ adapter });

const SHOP_PRODUCT_IDS = ['cup-1', 'tour-de-cou-1', 'tee-1', 'pin-1', 'sticker-1'];

async function resetShopCatalog() {
  await prisma.orderItem.deleteMany({
    where: { sku: { productId: { in: SHOP_PRODUCT_IDS } } },
  });

  await prisma.skuOptionValue.deleteMany({
    where: { sku: { productId: { in: SHOP_PRODUCT_IDS } } },
  });

  await prisma.sku.deleteMany({
    where: { productId: { in: SHOP_PRODUCT_IDS } },
  });

  await prisma.optionValue.deleteMany({
    where: { optionType: { productId: { in: SHOP_PRODUCT_IDS } } },
  });

  await prisma.optionType.deleteMany({
    where: { productId: { in: SHOP_PRODUCT_IDS } },
  });

  await prisma.product.deleteMany({
    where: { id: { in: SHOP_PRODUCT_IDS } },
  });
}

async function createSkuWithOptions(input: {
  productId: string;
  skuCode: string;
  priceOverride: number;
  stock: number;
  imageUrl?: string;
  optionValueIds?: string[];
}) {
  return prisma.sku.create({
    data: {
      productId: input.productId,
      skuCode: input.skuCode,
      priceOverride: input.priceOverride,
      stock: input.stock,
      trackStock: true,
      imageUrl: input.imageUrl,
      options: input.optionValueIds?.length
        ? {
            create: input.optionValueIds.map((optionValueId) => ({
              optionValueId,
            })),
          }
        : undefined,
    },
  });
}

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
      virtual: true,
    },
  });

  await resetShopCatalog();

  const cup = await prisma.product.create({
    data: {
      id: 'cup-1',
      name: 'Tasse FurN',
      description: 'Mug en céramique 350ml, design association FurN.',
      basePrice: 12.5,
      category: 'MUG',
      imageUrl: 'https://example.com/images/cup.png',
    },
  });

  const tourDeCou = await prisma.product.create({
    data: {
      id: 'tour-de-cou-1',
      name: 'Tour de cou FurN',
      description: 'Tour de cou tissu avec logo FurN, idéal pour les conventions.',
      basePrice: 8.0,
      category: 'ACCESSOIRE',
      imageUrl: 'https://example.com/images/tour-de-cou.png',
    },
  });

  const tee = await prisma.product.create({
    data: {
      id: 'tee-1',
      name: 'T-shirt FurN',
      description: 'T-shirt officiel de l’association, disponible en plusieurs tailles et visuels.',
      basePrice: 18.0,
      category: 'TEXTILE',
      imageUrl: 'https://example.com/images/tshirt-furn.png',
    },
  });

  const pin = await prisma.product.create({
    data: {
      id: 'pin-1',
      name: 'Pins FurN',
      description: 'Collection de pins FurN avec plusieurs designs à choisir sur la fiche produit.',
      basePrice: 4.0,
      category: 'PIN',
      imageUrl: 'https://example.com/images/pins-furn.png',
    },
  });

  const sticker = await prisma.product.create({
    data: {
      id: 'sticker-1',
      name: 'Stickers FurN',
      description: 'Stickers vinyl waterproof disponibles en plusieurs illustrations et formats.',
      basePrice: 2.5,
      category: 'STICKER',
      imageUrl: 'https://example.com/images/stickers-furn.png',
    },
  });

  const cupSku = await createSkuWithOptions({
    productId: cup.id,
    skuCode: 'CUP-STD',
    priceOverride: 12.5,
    stock: 120,
    imageUrl: 'https://example.com/images/cup-sku.png',
  });

  const tourDeCouSku = await createSkuWithOptions({
    productId: tourDeCou.id,
    skuCode: 'NECK-STRAP',
    priceOverride: 8.0,
    stock: 80,
    imageUrl: 'https://example.com/images/tour-de-cou-sku.png',
  });

  const teeSize = await prisma.optionType.create({
    data: {
      productId: tee.id,
      name: 'Taille',
    },
  });

  const teeVisual = await prisma.optionType.create({
    data: {
      productId: tee.id,
      name: 'Design',
    },
  });

  const teeSizeS = await prisma.optionValue.create({ data: { optionTypeId: teeSize.id, value: 'S' } });
  const teeSizeM = await prisma.optionValue.create({ data: { optionTypeId: teeSize.id, value: 'M' } });
  const teeSizeL = await prisma.optionValue.create({ data: { optionTypeId: teeSize.id, value: 'L' } });
  const teeLogoBlue = await prisma.optionValue.create({ data: { optionTypeId: teeVisual.id, value: 'Logo bleu' } });
  const teeMascot = await prisma.optionValue.create({ data: { optionTypeId: teeVisual.id, value: 'Mascotte' } });

  const teeSkuBlueS = await createSkuWithOptions({
    productId: tee.id,
    skuCode: 'TEE-BLUE-S',
    priceOverride: 18.0,
    stock: 10,
    imageUrl: 'https://example.com/images/tshirt-blue-s.png',
    optionValueIds: [teeSizeS.id, teeLogoBlue.id],
  });

  const teeSkuBlueM = await createSkuWithOptions({
    productId: tee.id,
    skuCode: 'TEE-BLUE-M',
    priceOverride: 18.0,
    stock: 14,
    imageUrl: 'https://example.com/images/tshirt-blue-m.png',
    optionValueIds: [teeSizeM.id, teeLogoBlue.id],
  });

  const teeSkuBlueL = await createSkuWithOptions({
    productId: tee.id,
    skuCode: 'TEE-BLUE-L',
    priceOverride: 18.0,
    stock: 8,
    imageUrl: 'https://example.com/images/tshirt-blue-l.png',
    optionValueIds: [teeSizeL.id, teeLogoBlue.id],
  });

  const teeSkuMascotS = await createSkuWithOptions({
    productId: tee.id,
    skuCode: 'TEE-MASCOT-S',
    priceOverride: 20.0,
    stock: 6,
    imageUrl: 'https://example.com/images/tshirt-mascot-s.png',
    optionValueIds: [teeSizeS.id, teeMascot.id],
  });

  const teeSkuMascotM = await createSkuWithOptions({
    productId: tee.id,
    skuCode: 'TEE-MASCOT-M',
    priceOverride: 20.0,
    stock: 9,
    imageUrl: 'https://example.com/images/tshirt-mascot-m.png',
    optionValueIds: [teeSizeM.id, teeMascot.id],
  });

  const teeSkuMascotL = await createSkuWithOptions({
    productId: tee.id,
    skuCode: 'TEE-MASCOT-L',
    priceOverride: 20.0,
    stock: 4,
    imageUrl: 'https://example.com/images/tshirt-mascot-l.png',
    optionValueIds: [teeSizeL.id, teeMascot.id],
  });

  const pinType = await prisma.optionType.create({
    data: {
      productId: pin.id,
      name: 'Modèle',
    },
  });

  const pinClassic = await prisma.optionValue.create({ data: { optionTypeId: pinType.id, value: 'Logo classique' } });
  const pinPaw = await prisma.optionValue.create({ data: { optionTypeId: pinType.id, value: 'Patte rainbow' } });
  const pinMoon = await prisma.optionValue.create({ data: { optionTypeId: pinType.id, value: 'Lune FurN' } });

  const pinSkuClassic = await createSkuWithOptions({
    productId: pin.id,
    skuCode: 'PIN-CLASSIC',
    priceOverride: 4.0,
    stock: 80,
    imageUrl: 'https://example.com/images/pin-classic.png',
    optionValueIds: [pinClassic.id],
  });

  const pinSkuPaw = await createSkuWithOptions({
    productId: pin.id,
    skuCode: 'PIN-PAW',
    priceOverride: 4.5,
    stock: 65,
    imageUrl: 'https://example.com/images/pin-paw.png',
    optionValueIds: [pinPaw.id],
  });

  const pinSkuMoon = await createSkuWithOptions({
    productId: pin.id,
    skuCode: 'PIN-MOON',
    priceOverride: 5.0,
    stock: 40,
    imageUrl: 'https://example.com/images/pin-moon.png',
    optionValueIds: [pinMoon.id],
  });

  const stickerType = await prisma.optionType.create({
    data: {
      productId: sticker.id,
      name: 'Illustration',
    },
  });

  const stickerFormat = await prisma.optionType.create({
    data: {
      productId: sticker.id,
      name: 'Format',
    },
  });

  const stickerLogo = await prisma.optionValue.create({ data: { optionTypeId: stickerType.id, value: 'Logo FurN' } });
  const stickerMascot = await prisma.optionValue.create({ data: { optionTypeId: stickerType.id, value: 'Mascotte' } });
  const stickerHolo = await prisma.optionValue.create({ data: { optionTypeId: stickerType.id, value: 'Holographique' } });
  const stickerSmall = await prisma.optionValue.create({ data: { optionTypeId: stickerFormat.id, value: 'Petit 5 cm' } });
  const stickerLarge = await prisma.optionValue.create({ data: { optionTypeId: stickerFormat.id, value: 'Grand 9 cm' } });

  const stickerSkuLogoSmall = await createSkuWithOptions({
    productId: sticker.id,
    skuCode: 'STICKER-LOGO-SM',
    priceOverride: 2.5,
    stock: 120,
    imageUrl: 'https://example.com/images/sticker-logo-small.png',
    optionValueIds: [stickerLogo.id, stickerSmall.id],
  });

  const stickerSkuLogoLarge = await createSkuWithOptions({
    productId: sticker.id,
    skuCode: 'STICKER-LOGO-LG',
    priceOverride: 3.5,
    stock: 85,
    imageUrl: 'https://example.com/images/sticker-logo-large.png',
    optionValueIds: [stickerLogo.id, stickerLarge.id],
  });

  const stickerSkuMascotSmall = await createSkuWithOptions({
    productId: sticker.id,
    skuCode: 'STICKER-MASCOT-SM',
    priceOverride: 3.0,
    stock: 90,
    imageUrl: 'https://example.com/images/sticker-mascot-small.png',
    optionValueIds: [stickerMascot.id, stickerSmall.id],
  });

  const stickerSkuMascotLarge = await createSkuWithOptions({
    productId: sticker.id,
    skuCode: 'STICKER-MASCOT-LG',
    priceOverride: 4.0,
    stock: 70,
    imageUrl: 'https://example.com/images/sticker-mascot-large.png',
    optionValueIds: [stickerMascot.id, stickerLarge.id],
  });

  const stickerSkuHoloSmall = await createSkuWithOptions({
    productId: sticker.id,
    skuCode: 'STICKER-HOLO-SM',
    priceOverride: 3.5,
    stock: 60,
    imageUrl: 'https://example.com/images/sticker-holo-small.png',
    optionValueIds: [stickerHolo.id, stickerSmall.id],
  });

  const stickerSkuHoloLarge = await createSkuWithOptions({
    productId: sticker.id,
    skuCode: 'STICKER-HOLO-LG',
    priceOverride: 4.5,
    stock: 45,
    imageUrl: 'https://example.com/images/sticker-holo-large.png',
    optionValueIds: [stickerHolo.id, stickerLarge.id],
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

  console.log({
    alice,
    admin,
    meetup,
    meetup2,
    meetup3,
    announcement,
    internat,
    tourDeCou,
    cup,
    tee,
    pin,
    sticker,
    cupSku,
    tourDeCouSku,
    teeSkuBlueS,
    teeSkuBlueM,
    teeSkuBlueL,
    teeSkuMascotS,
    teeSkuMascotM,
    teeSkuMascotL,
    pinSkuClassic,
    pinSkuPaw,
    pinSkuMoon,
    stickerSkuLogoSmall,
    stickerSkuLogoLarge,
    stickerSkuMascotSmall,
    stickerSkuMascotLarge,
    stickerSkuHoloSmall,
    stickerSkuHoloLarge,
  });
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
