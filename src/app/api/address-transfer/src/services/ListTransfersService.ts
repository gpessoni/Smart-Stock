import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";

export async function listTransfersService() {
  try {
    const transfers = await prisma.addressTransfer.findMany({
      include: {
        product: true,
        fromAddress: true,
        toAddress: true,
      },
    });
    return NextResponse.json(transfers, { status: HttpStatus.OK });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro no servidor", error: (error as Error).message },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
