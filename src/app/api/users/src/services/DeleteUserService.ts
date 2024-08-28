import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { deleteUserValidation } from "../validation";

export async function deleteUserService(id: string) {
  try {
    if (!id) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: HttpStatus.BAD_REQUEST });
    }

    const { error } = deleteUserValidation.validate(id, { abortEarly: false });

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

    const deletedUser = await prisma.users.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(deletedUser, { status: HttpStatus.OK });
  } catch (error) {
    return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}
