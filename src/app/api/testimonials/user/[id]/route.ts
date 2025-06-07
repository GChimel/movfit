import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "ID do usuário não fornecido" },
      { status: 400 }
    );
  }

  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true },
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
