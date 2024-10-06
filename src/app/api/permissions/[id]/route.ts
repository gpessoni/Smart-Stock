import { NextResponse } from "next/server"
import { deletePermissionService } from "../src/services/DeletePermissionService"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { getPermissionByIdService } from "../src/services/GetPermissionByIdService"
import { updatePermissionService } from "../src/services/UpdatePermissionService"
import { authMiddleware } from "../../config/middlewares/authMiddleware"
import { logMiddleware } from "../../config/middlewares/logMiddleware"

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
        const result = await deletePermissionService(params.id)

        await logMiddleware(req, userId, `deletou permissão com ID: ${params.id}`, "DELETE")

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
            return NextResponse.json({ error: "ID da permissão é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        const result = await getPermissionByIdService(id)

        await logMiddleware(req, userId, `visualizou permissão com ID: ${id}`, "LIST")

        return result
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
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
            return NextResponse.json({ error: "ID da permissão é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        const result = await updatePermissionService(id, body)

        await logMiddleware(req, userId, `atualizou permissão com ID: ${id}`, "UPDATE")

        return result
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
