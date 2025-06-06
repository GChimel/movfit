import { prisma } from "@/lib/prisma";
import { Testimonial } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

export interface ResponseTestimonial extends Testimonial {
  user: {
    name: string;
  };
}

export async function GET(): Promise<NextResponse<ResponseTestimonial[]>> {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return NextResponse.json(testimonials, {
    status: 200,
  });
}

export async function POST(request: Request) {
  const validation = z
    .object({
      content: z.string({ message: "Informe o conteudo!" }),
      userId: z.string({ message: "Informe o id do usuário!" }),
    })
    .safeParse(await request.json());

  if (!validation.success) {
    return new Response(validation.error.message, { status: 400 });
  }

  const { content, userId } = validation.data;

  const testimonial = await prisma.testimonial.create({
    data: {
      content,
      userId,
    },
  });

  return NextResponse.json(testimonial, { status: 201 });
}

export async function DELETE(request: Request) {
  const validation = z
    .object({
      id: z.string({ message: "Informe o id!" }),
    })
    .safeParse(await request.json());

  if (!validation.success) {
    return new Response(validation.error.message, { status: 400 });
  }

  const { id } = validation.data;

  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  });

  if (!testimonial) {
    return NextResponse.json(
      { error: "Testimonial not found" },
      { status: 404 }
    );
  }

  await prisma.testimonial.delete({ where: { id } });

  return NextResponse.json({ success: true }, { status: 200 });
}

export async function PUT(request: Request) {
  const validation = z
    .object({
      id: z.string({ message: "Informe o id!" }),
      content: z.string({ message: "Informe o conteudo!" }),
      userId: z.string({ message: "Informe o id do usuário!" }),
    })
    .safeParse(await request.json());

  if (!validation.success) {
    return new Response(validation.error.message, { status: 400 });
  }

  const { id, content, userId } = validation.data;

  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  });

  if (!testimonial) {
    return NextResponse.json(
      { error: "Testimonial not found" },
      { status: 404 }
    );
  }

  await prisma.testimonial.update({
    where: { id },
    data: {
      content,
      userId,
    },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
