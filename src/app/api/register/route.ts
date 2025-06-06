import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import * as z from "zod";

export async function POST(req: Request) {
  const validation = z
    .object({
      name: z
        .string({ message: "Informe seu nome!" })
        .min(4, { message: "Nome muito curto!" }),
      email: z.string().email("E-mail inválido!"),
      password: z
        .string()
        .min(6, "Senha mutio curta! Ela deve ser maior que 6 caracteres!"),
    })
    .safeParse(await req.json());

  if (!validation.success) {
    return new Response(validation.error.message, { status: 400 });
  }

  const { name, email, password } = validation.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return new Response("E-mail já cadastrado", { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, password: hashed },
  });

  return new Response("Usuário registrado com sucesso", { status: 201 });
}
