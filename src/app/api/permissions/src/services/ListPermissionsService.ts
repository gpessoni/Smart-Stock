import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";

export async function listPermissionsService() {
    try {
        const Permissions = await prisma.permissions.findMany();
        return NextResponse.json(Permissions, { status: HttpStatus.OK });
    } catch (error) {
        return NextResponse.json({
            message: "Erro ao listar Permissions",
            error: (error as Error).message
        }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}
