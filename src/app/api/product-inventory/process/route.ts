import { HttpStatus } from "../../config/http/httpUtils"
import { processInventoriesService } from "../src/services/ProcessInventoriesService"
import { NextResponse } from "next/server"
import { authMiddleware } from "@/app/api/config/middlewares/authMiddleware"

export async function POST(req: Request) {
    const authResponse = authMiddleware(req)
    if (authResponse.status !== 200) {
        return authResponse
    }

    try {
        return await processInventoriesService()
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
