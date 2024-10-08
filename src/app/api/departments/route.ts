import { NextResponse } from "next/server"
import { HttpStatus } from "../config/http/httpUtils"
import { createDepartmentService } from "./src/services/CreateDepartmentService"
import { listDepartmentsService } from "./src/services/ListDepartmentsService"
import { authMiddleware } from "../config/middlewares/authMiddleware"
import { logMiddleware } from "../config/middlewares/logMiddleware"
export async function POST(req: Request) {
    const authResponse = authMiddleware(req)
    if (authResponse.status !== 200) {
        return authResponse
    }

    try {
        await logMiddleware(req, "Criou Departamento", "CREATE")
        return await createDepartmentService(req)
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
        await logMiddleware(req, "Listou os Departamentos", "LIST")
        return await listDepartmentsService()
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
