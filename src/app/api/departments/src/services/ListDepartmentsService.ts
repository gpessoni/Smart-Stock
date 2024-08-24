import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";

export async function listDepartmentsService() {
    try {
        const Departments = await prisma.departments.findMany();
        return NextResponse.json(Departments, { status: HttpStatus.OK });
    } catch (error) {
        return NextResponse.json({
            message: "Erro ao listar Departments",
            error: (error as Error).message
        }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}
