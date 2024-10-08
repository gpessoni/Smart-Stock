import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { prisma } from "@/app/api/config/prisma"
import { NextResponse } from "next/server"
import { deleteDepartmentValidation } from "../validation"
import { logMiddleware } from "@/app/api/config/middlewares/logMiddleware"

export async function deleteDepartmentService(id: string) {
    try {
        if (!id) {
            return NextResponse.json({ error: "ID do Departamento é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        const { error } = deleteDepartmentValidation.validate(id, { abortEarly: false })

        if (error) {
            const errorMessage = error.details.map((detail: { message: any }) => detail.message).join(", ")
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST })
        }

        const DepartmentExists = await prisma.departments.findUnique({
            where: { id },
        })

        if (!DepartmentExists) {
            return NextResponse.json({ error: "Departamento não encontrado" }, { status: HttpStatus.NOT_FOUND })
        }

        const deletedDepartment = await prisma.departments.delete({
            where: {
                id,
            },
        })

        return NextResponse.json(deletedDepartment, { status: HttpStatus.OK })
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
