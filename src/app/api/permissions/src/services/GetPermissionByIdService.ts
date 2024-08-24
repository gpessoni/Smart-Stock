import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";

export async function getPermissionByIdService(id: string) {
    try {
        const Permission = await prisma.permissions.findUnique({
            where: { id },
        });

        if (!Permission) {
            return NextResponse.json(
                { error: "Permmissão não encontrada" },
                { status: HttpStatus.NOT_FOUND }
            );
        }

        return NextResponse.json(Permission, { status: HttpStatus.OK });
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao buscar Permissão", error: (error as Error).message },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}
