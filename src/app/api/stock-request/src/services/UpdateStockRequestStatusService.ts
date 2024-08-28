import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";

export async function updateStockRequestStatusService(
  id: string,
  status: "APPROVED" | "REJECTED"
) {
  try {
    if (!id || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "ID da solicitação e status são obrigatórios" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const stockRequest = await prisma.stockRequest.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!stockRequest) {
      return NextResponse.json(
        { error: "Solicitação não encontrada" },
        { status: HttpStatus.NOT_FOUND }
      );
    }

    if (status === "APPROVED") {
      for (const item of stockRequest.items) {
        await prisma.productStorageBalance.updateMany({
          where: {
            productId: item.productId,
            storageAddressId: item.storageAddressId,
          },
          data: {
            balance: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    // Atualiza o status da solicitação
    const updatedStockRequest = await prisma.stockRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedStockRequest, { status: HttpStatus.OK });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao atualizar status da solicitação",
        error: (error as Error).message,
      },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
