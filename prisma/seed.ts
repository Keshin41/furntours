import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';
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
  const meetup = await prisma.furmeet.create({
    data: {
      title: 'Furmeet 1',
      description: 'First furmeet',
      date: new Date(),
      content: 'Ceci est le content de la furmeet',
    },
  });
  console.log({ alice, meetup });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
