import { prisma } from "@/app/api/config/prisma"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { getUserPermissionsValidation } from "../validation"
import { NextResponse } from "next/server"
import { ValidationError } from "joi"

export async function getUserPermissionsService(req: Request, { params }: { params: { id: string } }) {
    try {
        const userId = params.id

        const { error } = getUserPermissionsValidation.validate({ userId }, { abortEarly: false })

        if (error) {
            const validationError = error as ValidationError
            const errorMessage = validationError.details.map((detail) => detail.message).join(", ")
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST })
        }

        const department = await prisma.users.findUnique({
            where: { id: userId },
            include: { permissions: true },
        })

        if (!department) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: HttpStatus.NOT_FOUND })
        }

        return NextResponse.json(department.permissions, {
            status: HttpStatus.OK,
        })
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
