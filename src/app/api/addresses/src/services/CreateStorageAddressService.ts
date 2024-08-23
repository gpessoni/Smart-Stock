import { prisma } from "@/app/api/config/prisma";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { createStorageAddressValidation } from "../validation";
import { NextResponse } from "next/server";
import { ValidationError } from "joi";

export async function createStorageAddressService(req: Request) {
  try {
    const body = await req.json();
    const { error } = createStorageAddressValidation.validate(body, {
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
    const { address, description, storageId } = body;

    const existingAddress = await prisma.storageAddress.findFirst({
      where: { address },
    });

    if (existingAddress) {
      return NextResponse.json(
        { error: "Endereço já existe" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const storageAddress = await prisma.storageAddress.create({
      data: {
        address,
        description,
        storageId,
      },
    });

    return NextResponse.json(storageAddress, { status: HttpStatus.CREATED });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro no servidor", error: (error as Error).message },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
