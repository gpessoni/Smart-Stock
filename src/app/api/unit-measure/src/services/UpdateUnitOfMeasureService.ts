import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { updateUnitOfMeasureValidation } from "../validation";
import { ValidationError } from "joi";

export async function updateUnitOfMeasureService(id: string, body: any) {
  try {
    const { error } = updateUnitOfMeasureValidation.validate(body, {
      abortEarly: false,
    });

    if (error) {
      const validationError = error as ValidationError;
      const errorMessage = validationError.details
        .map((detail) => detail.message)
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
        { error: "Unidade de Medida não encontrada" },
        { status: HttpStatus.NOT_FOUND }
      );
    }

    const updatedUnitOfMeasure = await prisma.unitOfMeasure.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedUnitOfMeasure, { status: HttpStatus.OK });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao atualizar UnitOfMeasure",
        error: (error as Error).message,
      },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
