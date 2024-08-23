import { prisma } from "@/app/api/config/prisma";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { createUnitOfMeasureValidation } from "../validation";
import { NextResponse } from "next/server";
import { ValidationError } from "joi";

export async function createUnitOfMeasureService(req: Request) {
  try {
    const body = await req.json();
    const { error } = createUnitOfMeasureValidation.validate(body, {
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
    const { abbreviation, description } = body;

    const existingUnitOfMeasure = await prisma.unitOfMeasure.findFirst({
      where: { description },
    });

    if (existingUnitOfMeasure) {
      return NextResponse.json(
        { error: "Route já existe" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const UnitOfMeasure = await prisma.unitOfMeasure.create({
      data: {
        abbreviation,
        description,
      },
    });

    return NextResponse.json(UnitOfMeasure, { status: HttpStatus.CREATED });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro no servidor", error: (error as Error).message },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
