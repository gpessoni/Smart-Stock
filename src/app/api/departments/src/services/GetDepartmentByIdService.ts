import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";

export async function getDepartmentByIdService(id: string) {
    try {
        const Department = await prisma.departments.findUnique({
            where: { id },
        });

        if (!Department) {
            return NextResponse.json(
                { error: "Permmissão não encontrada" },
                { status: HttpStatus.NOT_FOUND }
            );
        }

        return NextResponse.json(Department, { status: HttpStatus.OK });
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao buscar Departamento", error: (error as Error).message },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}
