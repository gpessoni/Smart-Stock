import { NextResponse } from "next/server"
import { deleteUserService } from "../src/services/DeleteUserService"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { getUserByIdService } from "../src/services/GetUserByIdService"
import { updateUserService } from "../src/services/UpdateUserService"
import { logMiddleware } from "../../config/middlewares/logMiddleware"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await logMiddleware(req, "Deletou um Usuário", "DELETE")
        return await deleteUserService(params.id)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function GET(req: Request, context: { params: { id: string } }) {
    try {
        const { id } = context.params

        if (!id) {
            return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        return await getUserByIdService(id)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
    try {
        const { id } = context.params
        const body = await req.json()

        if (!id) {
            return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }
        await logMiddleware(req, "Editou um Usuário", "UPDATE")
        return await updateUserService(id, body)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
