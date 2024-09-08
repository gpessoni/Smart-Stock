import { NextResponse } from "next/server"
import { HttpStatus } from "../config/http/httpUtils"
import { createProductInventoryService } from "./src/services/CreateProductInventoryService"
import { listProductInventoriesService } from "./src/services/ListProductInventoriesService"
import { authMiddleware } from "@/app/api/config/middlewares/authMiddleware" 

export async function POST(req: Request) {
    const authResponse = authMiddleware(req)
    if (authResponse.status !== HttpStatus.OK) {
        return authResponse
    }

    try {
        return await createProductInventoryService(req)
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
        return await listProductInventoriesService()
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
