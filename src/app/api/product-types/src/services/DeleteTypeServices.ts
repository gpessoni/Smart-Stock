import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { deleteTypesValidation } from "../validation";

export async function deleteTypesService(id: string) {
    try {

        if (!id) {
            return NextResponse.json({ error: "ID do Tipo é obrigatório" }, { status: HttpStatus.BAD_REQUEST });
        }

        const { error } = deleteTypesValidation.validate(id, { abortEarly: false });

        if (error) {
            const errorMessage = error.details.map((detail: { message: any }) => detail.message).join(", ");
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST });
        }

        const typeExists = await prisma.typeProducts.findUnique({
            where: { id },
        });

        if (!typeExists) {
            return NextResponse.json({ error: "Tipo não encontrado" }, { status: HttpStatus.NOT_FOUND });
        }

        const deletedType = await prisma.typeProducts.delete({
            where: {
                id,
            },
        });

        return NextResponse.json(deletedType, { status: HttpStatus.OK });
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}
