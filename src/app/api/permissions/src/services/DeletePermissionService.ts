import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { deletePermissionValidation } from "../validation";

export async function deletePermissionService(id: string) {
    try {

        if (!id) {
            return NextResponse.json({ error: "ID da Permissão é obrigatório" }, { status: HttpStatus.BAD_REQUEST });
        }

        const { error } = deletePermissionValidation.validate(id, { abortEarly: false });

        if (error) {
            const errorMessage = error.details.map((detail: { message: any }) => detail.message).join(", ");
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST });
        }

        const PermissionExists = await prisma.permissions.findUnique({
            where: { id },
        });

        if (!PermissionExists) {
            return NextResponse.json({ error: "Permissão não encontrado" }, { status: HttpStatus.NOT_FOUND });
        }

        const deletedPermission = await prisma.permissions.delete({
            where: {
                id,
            },
        });

        return NextResponse.json(deletedPermission, { status: HttpStatus.OK });
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}
