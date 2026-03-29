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
      name: 'Vikari',
      password: 'truc',
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
    },
  });
  const meetup = await prisma.furmeet.create({
    data: {
      title: 'Furmeet 1',
      description: 'First furmeet',
      date: new Date(),
      content: 'Ceci est le content de la furmeet',
    },
  });
  const meetup2 = await prisma.furmeet.create({
    data: {
      title: 'Furmeet 2',
      description: 'Second furmeet',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      content: 'Ceci est le content de la deuxième furmeet',
    },
  });

  const meetup3 = await prisma.furmeet.create({
    data: {
      title: 'Furmeet 3',
      description: 'Third furmeet',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      content: 'Ceci est le content de la troisième furmeet',
    },
  });

  const announcement = await prisma.announcement.upsert({
    where: { id: 'default-announcement' },
    update: {
      title: "Ouverture des inscriptions pour l'Internat 2026 !",
      message:
        "Vous pouvez dès à présent vous inscrire pour l'Internat 2026, qui se déroulera du 1er au 3 août. Ne manquez pas cette occasion de vivre une expérience inoubliable avec la communauté furry !",
      active: true,
      actionLabel: 'Boutique',
      actionUrl: '/about',
      updatedAt: new Date(),
    },
    create: {
      id: 'default-announcement',
      title: "Ouverture des inscriptions pour l'Internat 2026 !",
      message:
        "Vous pouvez dès à présent vous inscrire pour l'Internat 2026, qui se déroulera du 1er au 3 août. Ne manquez pas cette occasion de vivre une expérience inoubliable avec la communauté furry !",
      active: true,
      actionLabel: 'Boutique',
      actionUrl: '/about',
    },
  });

  console.log({ alice, meetup, meetup2, meetup3, announcement });
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
