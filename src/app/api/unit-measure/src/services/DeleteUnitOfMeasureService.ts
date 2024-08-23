import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { deleteUnitOfMeasureValidation } from "../validation";

export async function deleteUnitOfMeasureService(id: string) {
  try {
    if (!id) {
      return NextResponse.json(
        { error: "ID da Unidade de Medida é obrigatório" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const { error } = deleteUnitOfMeasureValidation.validate(id, {
      abortEarly: false,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail: { message: any }) => detail.message)
        .join(", ");
      return NextResponse.json(
        { error: errorMessage },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const UnitOfMeasureExists = await prisma.unitOfMeasure.findUnique({
      where: { id },
    });

    if (!UnitOfMeasureExists) {
      return NextResponse.json(
        { error: "Unidade de Medida não encontrado" },
        { status: HttpStatus.NOT_FOUND }
      );
    }

    const deletedUnitOfMeasure = await prisma.unitOfMeasure.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(deletedUnitOfMeasure, { status: HttpStatus.OK });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro no servidor", error: (error as Error).message },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
