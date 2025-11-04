const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = bcrypt.hashSync("tonmotdepasse", 10);
  await prisma.user.create({
    data: {
      email: "test@example.com",
      password: hashedPassword,
      name: "Matteo",
    },
  });
  console.log("✅ Utilisateur créé");
}

main();
