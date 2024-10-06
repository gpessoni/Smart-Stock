import { NextResponse } from "next/server"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { createTransferService } from "./src/services/CreateStorageAddressService"
import { listTransfersService } from "./src/services/ListTransfersService"
import { authMiddleware } from "@/app/api/config/middlewares/authMiddleware"
import { logMiddleware } from "@/app/api/config/middlewares/logMiddleware"

export async function POST(req: Request) {
    const authResponse = await authMiddleware(req)

    if (authResponse.status !== HttpStatus.OK) {
        return NextResponse.json({ error: authResponse.error }, { status: authResponse.status })
    }

    const userId = authResponse.userId

    if (!userId) {
        return NextResponse.json({ error: "ID do usuário não encontrado no token" }, { status: HttpStatus.UNAUTHORIZED })
    }

    try {
        const result = await createTransferService(req)

        await logMiddleware(req, userId, "criou uma transferência", "CREATE")

        return result
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function GET(req: Request) {
    const authResponse = await authMiddleware(req)

    if (authResponse.status !== HttpStatus.OK) {
        return NextResponse.json({ error: authResponse.error }, { status: authResponse.status })
    }

    const userId = authResponse.userId

    if (!userId) {
        return NextResponse.json({ error: "ID do usuário não encontrado no token" }, { status: HttpStatus.UNAUTHORIZED })
    }

    try {
        const result = await listTransfersService()

        await logMiddleware(req, userId, "visualizou a lista de transferências", "VIEW")

        return result
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
