const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@restaurante.com' },
    update: {},
    create: {
      email: 'admin@restaurante.com',
      password: hashedPassword,
    },
  });

  // Create Restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Burger House',
      logoUrl: 'https://picsum.photos/seed/burger/200/200',
      bannerUrl: 'https://picsum.photos/seed/food/1200/400',
      whatsappNumber: '5511999999999',
      primaryColor: '#FF6321',
      accentColor: '#000000',
      address: 'Rua das Flores, 123 - São Paulo, SP',
    },
  });

  // Create Categories
  const cat1 = await prisma.category.create({
    data: {
      name: 'Hambúrgueres',
      order: 1,
    },
  });

  const cat2 = await prisma.category.create({
    data: {
      name: 'Bebidas',
      order: 2,
    },
  });

  // Create Products
  await prisma.product.createMany({
    data: [
      {
        name: 'X-Burger',
        description: 'Pão, carne 150g, queijo e maionese artesanal.',
        price: 25.0,
        imageUrl: 'https://picsum.photos/seed/xburger/400/300',
        categoryId: cat1.id,
        available: true,
      },
      {
        name: 'X-Bacon',
        description: 'Pão, carne 150g, queijo, bacon crocante e maionese.',
        price: 30.0,
        imageUrl: 'https://picsum.photos/seed/xbacon/400/300',
        categoryId: cat1.id,
        available: true,
      },
      {
        name: 'Coca-Cola 350ml',
        description: 'Lata gelada.',
        price: 7.0,
        imageUrl: 'https://picsum.photos/seed/coke/400/300',
        categoryId: cat2.id,
        available: true,
      },
      {
        name: 'Suco de Laranja',
        description: 'Natural 500ml.',
        price: 12.0,
        imageUrl: 'https://picsum.photos/seed/juice/400/300',
        categoryId: cat2.id,
        available: true,
      },
    ],
  });

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
