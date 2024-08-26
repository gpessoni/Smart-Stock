import { prisma } from "@/app/api/config/prisma";
import { idValidation } from "../validation";
import { NextResponse } from "next/server";

export async function getSeparationOrderByIdService(id: string) {
  try {
    const { error } = idValidation.validate(id, { abortEarly: false });

    if (error) {
      const errorMessage = error.details
        .map((detail: { message: any }) => detail.message)
        .join(", ");
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const order = await prisma.separationOrder.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Ordem de separação não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao buscar a ordem de separação",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
