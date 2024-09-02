import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { updateUserValidation } from "../validation";
import bcrypt from "bcrypt";

export async function updateUserService(id: string, body: any) {
  try {
    const { error } = updateUserValidation.validate(body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map((detail: { message: any }) => detail.message).join(", ");
      return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST });
    }

    const userExists = await prisma.users.findUnique({
      where: { id },
    });

    if (!userExists) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: HttpStatus.NOT_FOUND });
    }

    const { username, password, departmentId } = body;
    let updatedData: any = { username, departmentId };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data: updatedData,
      select: {
        id: true,
        username: true,
        department: {
          select: {
            id: true,
            description: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser, { status: HttpStatus.OK });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao atualizar usuário", error: (error as Error).message },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
