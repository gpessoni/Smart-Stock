import { NextResponse } from "next/server"
import { HttpStatus } from "../config/http/httpUtils"
import { createStorageService } from "./src/services/CreateStorageService"
import { listStoragesService } from "./src/services/ListStoragesService"
import { authMiddleware } from "@/app/api/config/middlewares/authMiddleware"
import { logMiddleware } from "../config/middlewares/logMiddleware"

export async function POST(req: Request) {
    const authResponse = authMiddleware(req)
    if (authResponse.status !== 200) {
        return authResponse
    }

    try {
        await logMiddleware(req, "Criou um Armazém", "CREATE")
        return await createStorageService(req)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function GET(req: Request) {
    const authResponse = authMiddleware(req)
    if (authResponse.status !== 200) {
        return authResponse
    }

    try {
        return await listStoragesService()
    } catch (error) {
        return NextResponse.json(
            {
                message: "Erro no servidor",
                error: (error as Error).message,
            },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        )
    }
}
