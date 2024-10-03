import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";

export async function listUsersService() {
    try {
        const users = await prisma.users.findMany({
            include: {
                department: true,
            },
        });

        return NextResponse.json(users, { status: HttpStatus.OK });
    } catch (error) {
        return NextResponse.json({
            message: "Erro ao listar usuários",
            error: (error as Error).message
        }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}
