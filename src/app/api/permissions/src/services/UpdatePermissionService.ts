import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { updatePermissionValidation } from "../validation";
import { ValidationError } from "joi";

export async function updatePermissionService(id: string, body: any) {
  try {
    const { error } = updatePermissionValidation.validate(body, {
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

    const PermissionExists = await prisma.permissions.findUnique({
      where: { id },
    });

    if (!PermissionExists) {
      return NextResponse.json(
        { error: "Permissão não encontrada" },
        { status: HttpStatus.NOT_FOUND }
      );
    }

    const updatedPermission = await prisma.permissions.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedPermission, { status: HttpStatus.OK });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao atualizar Permission",
        error: (error as Error).message,
      },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
