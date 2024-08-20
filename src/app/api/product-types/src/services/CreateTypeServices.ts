import { prisma } from "@/app/api/config/prisma";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { createTypesValidation } from "../validation";
import { NextResponse } from "next/server";
import { ValidationError } from "joi";

export async function createTypesService(req: Request) {
  try {
    const body = await req.json();
    const { error } = createTypesValidation.validate(body, {
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
    const { description } = body;

    const existingType = await prisma.typeProducts.findFirst({
      where: {
        description,
      },
    });

    if (existingType) {
      return NextResponse.json(
        { error: "Tipo com o mesmo nome já existe" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const Type = await prisma.typeProducts.create({
      data: {
        description,
      },
    });

    return NextResponse.json(Type, { status: HttpStatus.CREATED });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro no servidor", error: (error as Error).message },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
