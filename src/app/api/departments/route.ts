import { NextResponse } from "next/server"
import { HttpStatus } from "../config/http/httpUtils"
import { createDepartmentService } from "./src/services/CreateDepartmentService"
import { listDepartmentsService } from "./src/services/ListDepartmentsService"
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
        const result = await createDepartmentService(req)

        await logMiddleware(req, userId, "criou um departamento", "CREATE")

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
        const result = await listDepartmentsService()

        await logMiddleware(req, userId, "visualizou a lista de departamentos", "LIST")

        return result
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
