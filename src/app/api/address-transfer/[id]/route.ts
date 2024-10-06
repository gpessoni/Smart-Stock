import { NextResponse } from "next/server"
import { reverseTransferService } from "../src/services/ReverseTransferService"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { authMiddleware } from "@/app/api/config/middlewares/authMiddleware"
import { logMiddleware } from "@/app/api/config/middlewares/logMiddleware"

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

        if (!id) {
            return NextResponse.json({ error: "ID da Transferência é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        const result = await reverseTransferService(id)

        await logMiddleware(req, userId, `reverteu a transferência ${id}`, "REVERSE")

        return result
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
