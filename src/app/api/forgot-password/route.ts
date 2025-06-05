import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  const validation = z
    .object({
      email: z.string().email(),
    })
    .safeParse(await req.json());

  if (!validation.success) {
    return new Response(validation.error.message, { status: 400 });
  }

  const { email } = validation.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json("Usuário não existe", { status: 404 });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 3600 * 1000;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: token,
      resetTokenExpiry: new Date(expires),
    },
  });

  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const emailJsRes = await fetch(
    "https://api.emailjs.com/api/v1.0/email/send",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: process.env.EMAIL_JS_SERVICE_ID,
        template_id: process.env.EMAIL_JS_TEMPLATE_ID,
        user_id: process.env.EMAIL_JS_USER_ID,
        template_params: {
          email,
          link: resetLink,
        },
      }),
    }
  );

  if (!emailJsRes.ok) {
    return NextResponse.json("Erro ao enviar e-mail", { status: 500 });
  }

  return NextResponse.json("E-mail enviado", { status: 200 });
}

export async function PUT(req: Request) {
  const validation = z
    .object({
      password: z.string(),
      token: z.string(),
    })
    .safeParse(await req.json());

  if (!validation.success) {
    return new Response(validation.error.message, { status: 400 });
  }

  const { password, token } = validation.data;

  const user = await prisma.user.findFirst({
    where: { resetToken: token },
  });

  if (!user || user.resetTokenExpiry! < new Date()) {
    return NextResponse.json("Token inválido", { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return NextResponse.json("Senha alterada com sucesso", { status: 200 });
}
