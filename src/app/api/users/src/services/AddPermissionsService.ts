import { prisma } from "@/app/api/config/prisma"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { addPermissionToUserValidation } from "../validation"
import { NextResponse } from "next/server"
import { ValidationError } from "joi"

export async function addPermissionToUserService(req: Request) {
    try {
        const body = await req.json()
        const { error } = addPermissionToUserValidation.validate(body, {
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

        const existingPermission = await prisma.permissions.findUnique({
            where: { id: permissionId },
        })

        if (!existingPermission) {
            return NextResponse.json({ error: "Permissão não encontrada" }, { status: HttpStatus.NOT_FOUND })
        }

        const isPermissionAlreadyAdded = existingUser.permissions.some((permission) => permission.id === permissionId)

        if (isPermissionAlreadyAdded) {
            return NextResponse.json({ error: "Permissão já está associada ao usuário" }, { status: HttpStatus.CONFLICT })
        }

        await prisma.users.update({
            where: { id: userId },
            data: {
                permissions: {
                    connect: { id: permissionId },
                },
            },
        })

        return NextResponse.json({ message: "Permissão adicionada ao usuário com sucesso" }, { status: HttpStatus.OK })
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
