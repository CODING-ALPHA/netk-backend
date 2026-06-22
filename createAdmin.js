const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Admin1234!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@netk.com' },
    update: { role: 'admin' },
    create: { 
      email: 'admin@netk.com', 
      passwordHash: hash, 
      role: 'admin', 
      firstName: 'System', 
      lastName: 'Admin' 
    }
  });
  console.log('Admin user created successfully.');
  console.log('Email: admin@netk.com');
  console.log('Password: Admin1234!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
