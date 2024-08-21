import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { updateGroupsValidation } from "../validation";
import { ValidationError } from "joi";

export async function updateProductGroupService(id: string, body: any) {
  try {
    const { error } = updateGroupsValidation.validate(body, {
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
    const { code, description } = body;

    const groupExists = await prisma.groupProduct.findUnique({
      where: { id },
    });

    if (!groupExists) {
      return NextResponse.json(
        { error: "Grupo de produto não encontrado" },
        { status: HttpStatus.NOT_FOUND }
      );
    }

    const existingGroup = await prisma.groupProduct.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [{ code }, { description }],
          },
        ],
      },
    });

    if (existingGroup) {
      if (existingGroup.code === code) {
        return NextResponse.json(
          { error: "Código já cadastrado para outro grupo" },
          { status: HttpStatus.BAD_REQUEST }
        );
      }
      if (existingGroup.description === description) {
        return NextResponse.json(
          { error: "Descrição já cadastrada para outro grupo" },
          { status: HttpStatus.BAD_REQUEST }
        );
      }
    }

    const updatedGroup = await prisma.groupProduct.update({
      where: { id },
      data: {
        code,
        description,
      },
    });

    return NextResponse.json(updatedGroup, { status: HttpStatus.OK });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao atualizar Grupo de produto",
        error: (error as Error).message,
      },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
