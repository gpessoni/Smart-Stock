import { prisma } from "@/app/api/config/prisma";
import { idValidation } from "../validation";
import { NextResponse } from "next/server";

export async function deleteSeparationOrderService(id: string) {
  try {
    const { error } = idValidation.validate(id, { abortEarly: false });

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

    if (orderExists.status !== "PENDING") {
      return NextResponse.json(
        {
          error:
            "Ordem de separação não pode ser excluída, pois está em andamento.",
        },
        { status: 400 }
      );
    }

    const deletedOrder = await prisma.separationOrder.delete({
      where: { id },
    });

    return NextResponse.json(deletedOrder, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao excluir a ordem de separação",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
