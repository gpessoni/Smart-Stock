import { NextResponse } from "next/server"
import { deleteDepartmentService } from "../src/services/DeleteDepartmentService"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { getDepartmentByIdService } from "../src/services/GetDepartmentByIdService"
import { updateDepartmentService } from "../src/services/UpdateDepartmentService"
import { authMiddleware } from "@/app/api/config/middlewares/authMiddleware"
import { logMiddleware } from "@/app/api/config/middlewares/logMiddleware"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const authResponse = await authMiddleware(req)

    if (authResponse.status !== HttpStatus.OK) {
        return NextResponse.json({ error: authResponse.error }, { status: authResponse.status })
    }

    const userId = authResponse.userId

    if (!userId) {
        return NextResponse.json({ error: "ID do usuário não encontrado no token" }, { status: HttpStatus.UNAUTHORIZED })
    }

    try {
        const result = await deleteDepartmentService(params.id)

        await logMiddleware(req, userId, "excluiu um departamento", "DELETE")

        return result
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function GET(req: Request, context: { params: { id: string } }) {
    const authResponse = await authMiddleware(req)

    if (authResponse.status !== HttpStatus.OK) {
        return NextResponse.json({ error: authResponse.error }, { status: authResponse.status })
    }

    const userId = authResponse.userId

    if (!userId) {
        return NextResponse.json({ error: "ID do usuário não encontrado no token" }, { status: HttpStatus.UNAUTHORIZED })
    }

    try {
        const { id } = context.params

        if (!id) {
            return NextResponse.json({ error: "ID do departamento é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        const result = await getDepartmentByIdService(id)

        await logMiddleware(req, userId, "visualizou um departamento", "LIST")

        return result
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function PUT(req: Request, context: { params: { id: string } }) {
    const authResponse = await authMiddleware(req)

    if (authResponse.status !== HttpStatus.OK) {
        return NextResponse.json({ error: authResponse.error }, { status: authResponse.status })
    }

    const userId = authResponse.userId

    if (!userId) {
        return NextResponse.json({ error: "ID do usuário não encontrado no token" }, { status: HttpStatus.UNAUTHORIZED })
    }

    try {
        const { id } = context.params
        const body = await req.json()

        if (!id) {
            return NextResponse.json({ error: "ID do departamento é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        const result = await updateDepartmentService(id, body)

        await logMiddleware(req, userId, "atualizou um departamento", "UPDATE")

        return result
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
