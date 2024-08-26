import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { updateProductInventoryValidation } from "../validation";
import { ValidationError } from "joi";

export async function updateProductInventoryService(id: string, body: any) {
  try {
    const { error } = updateProductInventoryValidation.validate(body, {
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
    const ProductInventoryExists = await prisma.productInventory.findUnique({
      where: { id },
    });

    if (!ProductInventoryExists) {
      return NextResponse.json(
        { error: "Inventário não encontrado" },
        { status: HttpStatus.NOT_FOUND }
      );
    }

    if (ProductInventoryExists.status === "PROCESSED") {
      return NextResponse.json(
        { error: "Inventário já está processado" },
        { status: HttpStatus.CONFLICT }
      );
    }

    const updatedProductInventory = await prisma.productInventory.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedProductInventory, {
      status: HttpStatus.OK,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao atualizar Inventário",
        error: (error as Error).message,
      },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
