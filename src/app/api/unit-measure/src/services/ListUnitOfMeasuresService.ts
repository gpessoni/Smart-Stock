import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";

export async function listUnitOfMeasuresService() {
  try {
    const UnitOfMeasures = await prisma.unitOfMeasure.findMany();
    return NextResponse.json(UnitOfMeasures, { status: HttpStatus.OK });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao listar UnitOfMeasures",
        error: (error as Error).message,
      },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
