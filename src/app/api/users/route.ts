import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/utils/isAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await isAdmin();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(users, { status: 200 });
}
