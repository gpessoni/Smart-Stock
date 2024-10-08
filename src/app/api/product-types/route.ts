import { NextResponse } from "next/server"
import { HttpStatus } from "../config/http/httpUtils"
import { createTypesService } from "./src/services/CreateTypeServices"
import { listProductTypesService } from "./src/services/ListTypesServices"
import { authMiddleware } from "../config/middlewares/authMiddleware"
import { logMiddleware } from "../config/middlewares/logMiddleware"

export async function POST(req: Request) {
    const authResponse = authMiddleware(req)
    if (authResponse.status !== 200) {
        return authResponse
    }

    try {
        await logMiddleware(req, "Criou Tipo de Produto", "CREATE")
        return await createTypesService(req)
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
        await logMiddleware(req, "Listou os Tipos de Produtos", "LIST")

        return await listProductTypesService()
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
