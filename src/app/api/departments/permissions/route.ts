import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { NextResponse } from "next/server"
import { logMiddleware } from "../../config/middlewares/logMiddleware"
import { addPermissionToDepartmentService } from "../src/services/AddPermissionsService"
import { removePermissionFromDepartmentService } from "../src/services/RemovePermissionsService"

export async function POST(req: Request, context: { params: { id: string } }) {
    try {
        return await addPermissionToDepartmentService(req)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
    try {
        await logMiddleware(req, "Removeu uma permissão do Departamento", "DELETE")
        return await removePermissionFromDepartmentService(req)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
