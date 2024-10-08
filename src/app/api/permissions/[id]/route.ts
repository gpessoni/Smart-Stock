import { NextResponse } from "next/server"
import { deletePermissionService } from "../src/services/DeletePermissionService"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { getPermissionByIdService } from "../src/services/GetPermissionByIdService"
import { updatePermissionService } from "../src/services/UpdatePermissionService"
import { logMiddleware } from "../../config/middlewares/logMiddleware"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await logMiddleware(req, "Deletou uma permissão", "DELETE")
        return await deletePermissionService(params.id)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function GET(req: Request, context: { params: { id: string } }) {
    try {
        const { id } = context.params

        if (!id) {
            return NextResponse.json({ error: "ID do Grupo de produto é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        return await getPermissionByIdService(id)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
    try {
        const { id } = context.params
        const body = await req.json()

        if (!id) {
            return NextResponse.json({ error: "ID do Armazém é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        return await updatePermissionService(id, body)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
