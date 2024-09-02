import { prisma } from "@/app/api/config/prisma"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { removePermissionFromUserValidation } from "../validation"
import { NextResponse } from "next/server"
import { ValidationError } from "joi"

export async function removePermissionFromUserService(req: Request) {
    try {
        const body = await req.json()
        const { error } = removePermissionFromUserValidation.validate(body, {
            abortEarly: false,
        })

        if (error) {
            const validationError = error as ValidationError
            const errorMessage = validationError.details.map((detail) => detail.message).join(", ")
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST })
        }

        const { userId, permissionId } = body

        const existingUser = await prisma.users.findUnique({
            where: { id: userId },
            include: { permissions: true },
        })

        if (!existingUser) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: HttpStatus.NOT_FOUND })
        }

        const isPermissionAssociated = existingUser.permissions.some((permission) => permission.id === permissionId)

        if (!isPermissionAssociated) {
            return NextResponse.json({ error: "Permissão não está associada ao usuário" }, { status: HttpStatus.BAD_REQUEST })
        }

        await prisma.users.update({
            where: { id: userId },
            data: {
                permissions: {
                    disconnect: { id: permissionId },
                },
            },
        })

        return NextResponse.json({ message: "Permissão removida do usuário com sucesso" }, { status: HttpStatus.OK })
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
