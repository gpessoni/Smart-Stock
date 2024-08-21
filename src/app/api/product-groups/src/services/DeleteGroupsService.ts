import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { deleteGroupsValidation } from "../validation";

export async function deleteGroupsService(id: string) {
    try {

        if (!id) {
            return NextResponse.json({ error: "ID do Grupo é obrigatório" }, { status: HttpStatus.BAD_REQUEST });
        }

        const { error } = deleteGroupsValidation.validate(id, { abortEarly: false });

        if (error) {
            const errorMessage = error.details.map((detail: { message: any }) => detail.message).join(", ");
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST });
        }

        const GroupExists = await prisma.groupProduct.findUnique({
            where: { id },
        });

        if (!GroupExists) {
            return NextResponse.json({ error: "Grupo não encontrado" }, { status: HttpStatus.NOT_FOUND });
        }

        const deletedGroup = await prisma.groupProduct.delete({
            where: {
                id,
            },
        });

        return NextResponse.json(deletedGroup, { status: HttpStatus.OK });
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}
