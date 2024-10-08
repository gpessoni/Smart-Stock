import { NextResponse } from "next/server"
import { HttpStatus } from "../config/http/httpUtils"
import { createUnitOfMeasureService } from "./src/services/CreateUnitOfMeasureService"
import { listUnitOfMeasuresService } from "./src/services/ListUnitOfMeasuresService"
import { authMiddleware } from "@/app/api/config/middlewares/authMiddleware"
import { logMiddleware } from "../config/middlewares/logMiddleware"

export async function POST(req: Request) {
    const authResponse = authMiddleware(req)
    if (authResponse.status !== HttpStatus.OK) {
        return authResponse
    }

    try {
        await logMiddleware(req, "Criou uma Unidade de Medida", "CREATE")
        return await createUnitOfMeasureService(req)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function GET(req: Request) {
    const authResponse = authMiddleware(req)
    if (authResponse.status !== HttpStatus.OK) {
        return authResponse
    }

    try {
        await logMiddleware(req, "Listou as Unidades de Medidas", "LIST")

        return await listUnitOfMeasuresService()
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
