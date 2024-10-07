import { NextResponse } from "next/server"
import { HttpStatus } from "../config/http/httpUtils"
import { createStockRequestService } from "./src/services/CreateStockRequestService"
import { listStockRequestsService } from "./src/services/ListStockRequestsService"
import { authMiddleware } from "@/app/api/config/middlewares/authMiddleware"

export async function POST(req: Request) {
    const authResponse = authMiddleware(req)
    if (authResponse.status !== HttpStatus.OK) {
        return authResponse
    }

    try {
        return await createStockRequestService(req)
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
        return await listStockRequestsService()
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
