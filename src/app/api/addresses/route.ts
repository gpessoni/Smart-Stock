import { NextResponse } from "next/server"
import { HttpStatus } from "../config/http/httpUtils"
import { createStorageAddressService } from "./src/services/CreateStorageAddressService"
import { listStorageAddressesService } from "./src/services/ListStorageAddressesService"
import { authMiddleware } from "../config/middlewares/authMiddleware"
import { logMiddleware } from "../config/middlewares/logMiddleware"

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
        const result = await createStorageAddressService(req)

        await logMiddleware(req, userId, "criou um endereço de armazenamento", "CREATE")

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
        const result = await listStorageAddressesService()

        await logMiddleware(req, userId, "visualizou a lista de endereços de armazenamento", "LIST")

        return result
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
