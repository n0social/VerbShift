import { PrismaClient as SQLiteClient } from '@prisma/client';
import { PrismaClient as NeonClient } from '@prisma/client';

// SQLite client (local dev.db)
const sqlite = new SQLiteClient({
  datasources: { db: { url: 'file:./dev.db' } }
});
// Neon client (remote Neon database)
const neon = new NeonClient({
  datasources: { db: { url: 'postgresql://neondb_owner:npg_5lueIfJaH6om@ep-crimson-leaf-ahpvm55j-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' } }
});

async function migrateUsers() {
  const users = await sqlite.user.findMany();
  for (const user of users) {
    await neon.user.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    });
  }
  console.log('User migration complete!');
}

async function migrateAll() {
  await migrateUsers();
  // Add similar functions for other tables if needed
}

async function main() {
  await migrateAll();
  await sqlite.$disconnect();
  await neon.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
