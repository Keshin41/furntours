import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env['POSTGRES_URL'],
});

const prisma = new PrismaClient({ adapter });

const SHOP_PRODUCT_IDS = [
  'cup-1',
  'tour-de-cou-1',
  'tee-1',
  'pin-1',
  'sticker-1',
];
const FURMEET_EVENT_IDS = [
  'furmeet-avril-2026',
  'furmeet-fevrier-2026',
  'furmeet-mars-2026',
];

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

async function resetFurmeetEvents() {
  await prisma.eventPart.deleteMany({
    where: {
      eventId: {
        in: FURMEET_EVENT_IDS,
      },
    },
  });

  await prisma.event.deleteMany({
    where: {
      id: {
        in: FURMEET_EVENT_IDS,
      },
    },
  });
}

async function createFurmeet(input: {
  id: string;
  title: string;
  description: string;
  opened: boolean;
  published: boolean;
  activities: Array<{
    title: string;
    description: string;
    date: string;
    order: number;
    type: 'ACTIVITY' | 'RESTAURANT' | 'BAR' | 'OTHER';
  }>;
}) {
  return prisma.event.create({
    data: {
      id: input.id,
      title: input.title,
      description: input.description,
      type: 'MEET',
      published: input.published,
      opened: input.opened,
      eventActivities: {
        create: input.activities.map((activity) => ({
          title: activity.title,
          description: activity.description,
          date: new Date(activity.date),
          order: activity.order,
          type: activity.type,
        })),
      },
    },
    include: {
      eventActivities: {
        orderBy: {
          order: 'asc',
        },
      },
    },
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
      nickname: 'Vikari',
      password: '$2a$12$ni6NdoEzusEij9idFWGnT.rztLIJIofywONZWNJXl5.LHjMR..XY.',
      firstname: 'Valentin',
      lastname: 'Gorgeon',
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
    update: {
      id: 'internat-1',
      name: 'Internat',
      description: "Interna pour l'asso Furry",
      basePrice: 45,
      category: 'INTERNAT',
      optionTypes: {
        connectOrCreate: [
          {
            where: {
              id: 'option-draps-1',
            },
            create: {
              name: 'Option draps',
              optionValues: {
                connectOrCreate: [
                  {
                    where: {
                      id: 'option-draps-1-oui',
                    },
                    create: {
                      value: 'Oui',
                    },
                  },
                  {
                    where: {
                      id: 'option-draps-1-non',
                    },
                    create: {
                      value: 'Non',
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
    create: {
      id: 'internat-1',
      name: 'Internat',
      description: "Interna pour l'asso Furry",
      basePrice: 45,
      category: 'INTERNAT',
      virtual: true,
      optionTypes: {
        connectOrCreate: [
          {
            where: {
              id: 'option-draps-1',
            },
            create: {
              id: 'option-draps-1',
              name: 'Option draps',
              optionValues: {
                connectOrCreate: [
                  {
                    where: {
                      id: 'option-draps-1-oui',
                    },
                    create: {
                      id: 'option-draps-1-oui',
                      value: 'Oui',
                    },
                  },
                  {
                    where: {
                      id: 'option-draps-1-non',
                    },
                    create: {
                      id: 'option-draps-1-non',
                      value: 'Non',
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
    include: {
      optionTypes: {
        include: {
          optionValues: true,
        },
      },
    },
  });

  console.log('internat', internat);

  const skuDrapsOui = await prisma.sku.upsert({
    where: {
      id: 'internat-1-sku-draps-oui',
    },
    update: {},
    create: {
      id: 'internat-1-sku-draps-oui',
      productId: internat.id,
      priceOverride: 50,
      skuCode: 'INTERNAT-1-DRAPS-OUI',
    },
  });

  await resetShopCatalog();
  await resetFurmeetEvents();

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
      description:
        'Tour de cou tissu avec logo FurN, idéal pour les conventions.',
      basePrice: 8.0,
      category: 'ACCESSOIRE',
      imageUrl: 'https://example.com/images/tour-de-cou.png',
    },
  });

  const tee = await prisma.product.create({
    data: {
      id: 'tee-1',
      name: 'T-shirt FurN',
      description:
        'T-shirt officiel de l’association, disponible en plusieurs tailles et visuels.',
      basePrice: 18.0,
      category: 'TEXTILE',
      imageUrl: 'https://example.com/images/tshirt-furn.png',
    },
  });

  const pin = await prisma.product.create({
    data: {
      id: 'pin-1',
      name: 'Pins FurN',
      description:
        'Collection de pins FurN avec plusieurs designs à choisir sur la fiche produit.',
      basePrice: 4.0,
      category: 'PIN',
      imageUrl: 'https://example.com/images/pins-furn.png',
    },
  });

  const sticker = await prisma.product.create({
    data: {
      id: 'sticker-1',
      name: 'Stickers FurN',
      description:
        'Stickers vinyl waterproof disponibles en plusieurs illustrations et formats.',
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

  const teeSizeS = await prisma.optionValue.create({
    data: { optionTypeId: teeSize.id, value: 'S' },
  });
  const teeSizeM = await prisma.optionValue.create({
    data: { optionTypeId: teeSize.id, value: 'M' },
  });
  const teeSizeL = await prisma.optionValue.create({
    data: { optionTypeId: teeSize.id, value: 'L' },
  });
  const teeLogoBlue = await prisma.optionValue.create({
    data: { optionTypeId: teeVisual.id, value: 'Logo bleu' },
  });
  const teeMascot = await prisma.optionValue.create({
    data: { optionTypeId: teeVisual.id, value: 'Mascotte' },
  });

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

  const pinClassic = await prisma.optionValue.create({
    data: { optionTypeId: pinType.id, value: 'Logo classique' },
  });
  const pinPaw = await prisma.optionValue.create({
    data: { optionTypeId: pinType.id, value: 'Patte rainbow' },
  });
  const pinMoon = await prisma.optionValue.create({
    data: { optionTypeId: pinType.id, value: 'Lune FurN' },
  });

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

  const stickerLogo = await prisma.optionValue.create({
    data: { optionTypeId: stickerType.id, value: 'Logo FurN' },
  });
  const stickerMascot = await prisma.optionValue.create({
    data: { optionTypeId: stickerType.id, value: 'Mascotte' },
  });
  const stickerHolo = await prisma.optionValue.create({
    data: { optionTypeId: stickerType.id, value: 'Holographique' },
  });
  const stickerSmall = await prisma.optionValue.create({
    data: { optionTypeId: stickerFormat.id, value: 'Petit 5 cm' },
  });
  const stickerLarge = await prisma.optionValue.create({
    data: { optionTypeId: stickerFormat.id, value: 'Grand 9 cm' },
  });

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

  const meetup = await createFurmeet({
    id: 'furmeet-mars-2026',
    title: 'Meet – 14 Mars – Atelier, Jeux et Soirée',
    description:
      'Résumé de la journée, Nous vous proposons une journée conviviale entre membres de la communauté furry avec un atelier créatif, des jeux de société, puis une soirée restaurant et bar dans le centre de Tours.',
    published: true,
    opened: false,
    activities: [
      {
        title: 'Atelier Créatif',
        description:
          'Un moment créatif pour se retrouver et partager une activité artistique ensemble dans une ambiance détendue.Des jeux seront disponibles pour passer l’après-midi ensemble, discuter et s’amuser. Cette activité se déroule au même endroit et au même moment que l’atelier pour permettre à chacun de participer librement.',
        date: '2026-04-11T13:30:00.000Z',
        order: 1,
        type: 'ACTIVITY',
      },
      {
        title: 'Diner au restaurant Traditoria Italiano',
        description:
          'Repas du soir pour continuer la rencontre dans une ambiance conviviale.',
        date: '2026-04-11T18:45:00.000Z',
        order: 2,
        type: 'RESTAURANT',
      },
      {
        title: 'After au Bar Shuffle Factory',
        description:
          'Fin de soirée autour d’un verre pour celles et ceux qui souhaitent prolonger la sortie.',
        date: '2026-04-11T21:15:00.000Z',
        order: 3,
        type: 'BAR',
      },
    ],
  });

  const meetup2 = await createFurmeet({
    id: 'furmeet-avril-2026',
    title: 'Meet - Avril 2026',
    description:
      'Awooo les fluff, on se retrouve pour le planning de la meet du 11 Avril.Rendez-vous a 16h pour l’activité au choix.⚠️ Toutes personne non inscrite pour le resto se verra refusé !',
    published: true,
    opened: true,
    activities: [
      {
        title: 'Mini-golf au Maxxparc',
        description:
          'Petite apres-midi de détente et de fun au mini-golf du Maxxparc, ouvert à tous les niveaux pour passer un bon moment ensemble.',
        date: '2026-05-09T14:00:00.000Z',
        order: 1,
        type: 'ACTIVITY',
      },
      {
        title: 'Restaurant Les 3 Brasseurs ',
        description: '⚠️ Les fursuits ne sont pas autorisés au restaurant',
        date: '2026-05-09T19:00:00.000Z',
        order: 2,
        type: 'RESTAURANT',
      },
      {
        title: 'Suite et fin de la journée le bar',
        description:
          '🎲 21h30 – Bar & fun\n👉 Shuffle Factory\n 💬 N’hésitez pas à venir, que vous soyez en fursuit (hors resto) ou non !',
        date: '2026-05-09T21:30:00.000Z',
        order: 3,
        type: 'BAR',
      },
    ],
  });

  const meetup3 = await createFurmeet({
    id: 'furmeet-fevrier-2026',
    title: 'Meet – Vendredi 7 février',
    description:
      'Venez partager une journée pleine d’aventures, de convivialité et de fun avec nous lors de notre prochaine meet ! 🐾\n Voici le programme complet de la journée:',
    published: true,
    opened: false,
    activities: [
      {
        title: 'Escape game Prison Island Tours',
        description:
          'Adresse : 99 Avenue Gustave Eiffel, 37100 Tours\nDurée : 1h30\nPrix : 21,90 € / personne\n Mettez vos talents de détective et votre esprit d’équipe à l’épreuve dans ce jeu d’évasion immersif composé de nombreuses cellules à défis ! 🧩',
        date: '2026-06-13T13:45:00.000Z',
        order: 1,
        type: 'ACTIVITY',
      },
      {
        title: 'Diner au  Basilic & Co',
        description:
          'Adresse : 42 Rue Daniel Mayer, 37100 Tours\nPrix : entre 10 € et 20 € / personne\nUn moment détente autour d’un bon repas pour reprendre des forces et discuter tous ensemble 🍕',
        date: '2026-06-13T18:30:00.000Z',
        order: 2,
        type: 'RESTAURANT',
      },
      {
        title: 'Bar Shuffle Factory',
        description:
          'Adresse : 194 Avenue Maginot, 37100 Tours\n\nFinissons la soirée en beauté autour d’un verre 🍹 dans une ambiance décontractée !\n\nLe bar dispose de plusieurs activités :\n\n    Babyfoot\n    Billard\n    Jeux de fléchettes\n',
        date: '2026-06-13T21:00:00.000Z',
        order: 3,
        type: 'BAR',
      },
    ],
  });

  const skuDrapsNon = await prisma.sku.upsert({
    where: {
      id: 'internat-1-sku-draps-non',
    },
    update: {},
    create: {
      id: 'internat-1-sku-draps-non',
      productId: internat.id,
      priceOverride: 45,
      skuCode: 'INTERNAT-1-DRAPS-NON',
    },
  });

  const skuDrapsOuiOptionValue = await prisma.skuOptionValue.upsert({
    where: {
      skuId_optionValueId: {
        skuId: skuDrapsOui.id,
        optionValueId: 'option-draps-1-oui',
      },
    },
    update: {},
    create: {
      skuId: skuDrapsOui.id,
      optionValueId: 'option-draps-1-oui',
    },
  });

  const skuDrapsNonOptionValue = await prisma.skuOptionValue.upsert({
    where: {
      skuId_optionValueId: {
        skuId: skuDrapsNon.id,
        optionValueId: 'option-draps-1-non',
      },
    },
    update: {},
    create: {
      skuId: skuDrapsNon.id,
      optionValueId: 'option-draps-1-non',
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
  console.log({
    alice,
    internat,
    skuDrapsOui,
    skuDrapsNon,
    skuDrapsOuiOptionValue,
    skuDrapsNonOptionValue,
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
