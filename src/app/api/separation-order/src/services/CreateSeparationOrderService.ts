import { prisma } from "@/app/api/config/prisma";
import { createSeparationOrderValidation } from "../validation";
import { NextResponse } from "next/server";

export async function createSeparationOrderService(req: Request) {
  try {
    const body = await req.json();
    const { error } = createSeparationOrderValidation.validate(body, {
      abortEarly: false,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail: { message: any }) => detail.message)
        .join(", ");
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { code, items } = body;

    const existingOrder = await prisma.separationOrder.findUnique({
      where: { code },
    });

    if (existingOrder) {
      return NextResponse.json(
        { error: "Código de ordem já existe" },
        { status: 400 }
      );
    }

    const separationOrder = await prisma.separationOrder.create({
      data: {
        code,
        items: {
          create: items,
        },
      },
    });

    return NextResponse.json(separationOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro no servidor", error: (error as Error).message },
      { status: 500 }
    );
  }
}
