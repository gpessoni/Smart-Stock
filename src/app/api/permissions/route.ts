import { NextResponse } from "next/server"
import { HttpStatus } from "../config/http/httpUtils"
import { createPermissionService } from "./src/services/CreatePermissionService"
import { listPermissionsService } from "./src/services/ListPermissionsService"
import { authMiddleware } from "../config/middlewares/authMiddleware"

export async function POST(req: Request) {
    const authResponse = authMiddleware(req)
    if (authResponse.status !== 200) {
        return authResponse
    }

    try {
        return await createPermissionService(req)
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
        return await listPermissionsService()
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
