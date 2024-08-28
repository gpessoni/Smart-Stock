import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";

export async function listStockRequestsService() {
  try {
    const stockRequests = await prisma.stockRequest.findMany({
      include: {
        items: {
          include: {
            product: true,
            storageAddress: true,
          },
        },
      },
    });

    return NextResponse.json(stockRequests, { status: HttpStatus.OK });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao listar solicitações",
        error: (error as Error).message,
      },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
