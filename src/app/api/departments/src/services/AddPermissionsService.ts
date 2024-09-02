import { prisma } from "@/app/api/config/prisma"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { addPermissionToDepartmentValidation } from "../validation"
import { NextResponse } from "next/server"
import { ValidationError } from "joi"

export async function addPermissionToDepartmentService(req: Request) {
    try {
        const body = await req.json()
        const { error } = addPermissionToDepartmentValidation.validate(body, {
            abortEarly: false,
        })

        if (error) {
            const validationError = error as ValidationError
            const errorMessage = validationError.details.map((detail) => detail.message).join(", ")
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST })
        }

        const { departmentId, permissionId } = body
        const existingDepartment = await prisma.departments.findUnique({
            where: { id: departmentId },
            include: { permissions: true },
        })

        if (!existingDepartment) {
            return NextResponse.json({ error: "Departamento não encontrado" }, { status: HttpStatus.NOT_FOUND })
        }

        const existingPermission = await prisma.permissions.findUnique({
            where: { id: permissionId },
        })

        if (!existingPermission) {
            return NextResponse.json({ error: "Permissão não encontrada" }, { status: HttpStatus.NOT_FOUND })
        }

        const isPermissionAlreadyAdded = existingDepartment.permissions.some((permission) => permission.id === permissionId)

        if (isPermissionAlreadyAdded) {
            return NextResponse.json({ error: "Permissão já está associada ao departamento" }, { status: HttpStatus.CONFLICT })
        }

        await prisma.departments.update({
            where: { id: departmentId },
            data: {
                permissions: {
                    connect: { id: permissionId },
                },
            },
        })

        return NextResponse.json({ message: "Permissão adicionada ao departamento com sucesso" }, { status: HttpStatus.OK })
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
