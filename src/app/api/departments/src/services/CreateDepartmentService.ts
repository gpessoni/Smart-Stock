import { prisma } from "@/app/api/config/prisma";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { createDepartmentValidation } from "../validation";
import { NextResponse } from "next/server";
import { ValidationError } from "joi";

export async function createDepartmentService(req: Request) {
  try {
    const body = await req.json();
    const { error } = createDepartmentValidation.validate(body, {
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

    const existingDepartment = await prisma.departments.findFirst({
      where: { description },
    });

    if (existingDepartment) {
      return NextResponse.json(
        { error: "Route já existe" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const Department = await prisma.departments.create({
      data: {
        description,
      },
    });

    return NextResponse.json(Department, { status: HttpStatus.CREATED });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro no servidor", error: (error as Error).message },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
