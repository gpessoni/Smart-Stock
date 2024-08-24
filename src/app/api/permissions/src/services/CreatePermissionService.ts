import { prisma } from "@/app/api/config/prisma";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { createPermissionValidation } from "../validation";
import { NextResponse } from "next/server";
import { ValidationError } from "joi";

export async function createPermissionService(req: Request) {
  try {
    const body = await req.json();
    const { error } = createPermissionValidation.validate(body, {
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
    const { route, description } = body;

    const existingPermission = await prisma.permissions.findFirst({
      where: { route },
    });

    if (existingPermission) {
      return NextResponse.json(
        { error: "Route já existe" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const Permission = await prisma.permissions.create({
      data: {
        route,
        description,
      },
    });

    return NextResponse.json(Permission, { status: HttpStatus.CREATED });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro no servidor", error: (error as Error).message },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
