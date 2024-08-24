import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { updateDepartmentValidation } from "../validation";

export async function updateDepartmentService(id: string, body: any) {
    try {
        const { error } = updateDepartmentValidation.validate(body, { abortEarly: false });

        if (error) {
            const errorMessage = error.details.map((detail: { message: any }) => detail.message).join(", ");
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST });
        }

        const DepartmentExists = await prisma.departments.findUnique({
            where: { id },
        });

        if (!DepartmentExists) {
            return NextResponse.json({ error: "Departamento não encontrada" }, { status: HttpStatus.NOT_FOUND });
        }

        const updatedDepartment = await prisma.departments.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(updatedDepartment, { status: HttpStatus.OK });
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao atualizar Department", error: (error as Error).message },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}
