import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { updateStorageValidation } from "../validation";
import { ValidationError } from "joi";

export async function updateStorageService(id: string, body: any) {
  try {
    const { error } = updateStorageValidation.validate(body, {
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

    const storageExists = await prisma.storage.findUnique({
      where: { id },
    });

    if (!storageExists) {
      return NextResponse.json(
        { error: "Storage não encontrado" },
        { status: HttpStatus.NOT_FOUND }
      );
    }

    const updatedStorage = await prisma.storage.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedStorage, { status: HttpStatus.OK });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao atualizar Storage", error: (error as Error).message },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
