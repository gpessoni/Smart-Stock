import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";

export async function listSeparationOrdersService() {
  try {
    const orders = await prisma.separationOrder.findMany({
      include: {
        items: true,
      },
    });
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao listar ordens de separação",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
