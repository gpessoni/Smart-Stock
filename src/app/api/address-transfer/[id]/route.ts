import { NextResponse } from "next/server"
import { reverseTransferService } from "../src/services/ReverseTransferService"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { authMiddleware } from "@/app/api/config/middlewares/authMiddleware"

export async function PATCH(req: Request, context: { params: { id: string } }) {
    const authResponse = authMiddleware(req)
    if (authResponse.status !== 200) {
        return authResponse
    }

    try {
        const { id } = context.params

        if (!id) {
            return NextResponse.json({ error: "ID do Armazém é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        return await reverseTransferService(id)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
