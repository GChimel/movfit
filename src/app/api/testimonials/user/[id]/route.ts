import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (!params.id) {
    return NextResponse.json(
      { error: "ID do usuário não fornecido" },
      { status: 400 }
    );
  }

  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { userId: params.id },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Erro ao buscar depoimentos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar depoimentos do usuário" },
      { status: 500 }
    );
  }
}
