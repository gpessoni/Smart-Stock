import { prisma } from "@/app/api/config/prisma";
import {
  updateSeparationOrderStatusValidation,
  idValidation,
} from "../validation";
import { NextResponse } from "next/server";

export async function updateSeparationOrderStatusService(
  id: string,
  req: Request
) {
  try {
    const { error: idError } = idValidation.validate(id, { abortEarly: false });
    if (idError) {
      const errorMessage = idError.details
        .map((detail: { message: any }) => detail.message)
        .join(", ");
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const body = await req.json();
    const { error } = updateSeparationOrderStatusValidation.validate(body, {
      abortEarly: false,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail: { message: any }) => detail.message)
        .join(", ");
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const orderExists = await prisma.separationOrder.findUnique({
      where: { id },
    });

    if (!orderExists) {
      return NextResponse.json(
        { error: "Ordem de separação não encontrada" },
        { status: 404 }
      );
    }

    const updatedOrder = await prisma.separationOrder.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao atualizar a ordem de separação",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
