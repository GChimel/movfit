import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.user.findFirst({
    where: { email: "admin@ueek.com" },
  });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@ueek.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log("Usuário admin criado");
  } else {
    console.log("Admin já existe");
  }
}

main().finally(() => prisma.$disconnect());
