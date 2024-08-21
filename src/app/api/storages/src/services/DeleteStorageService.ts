import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { deleteStorageValidation } from "../validation";
import { ValidationError } from "joi";

export async function deleteStorageService(id: string) {
  try {
    if (!id) {
      return NextResponse.json(
        { error: "ID do Storage é obrigatório" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const { error } = deleteStorageValidation.validate(id, {
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

    const deletedStorage = await prisma.storage.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(deletedStorage, { status: HttpStatus.OK });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro no servidor", error: (error as Error).message },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
