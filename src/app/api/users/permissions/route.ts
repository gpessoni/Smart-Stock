import { NextResponse } from "next/server"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { addPermissionToUserService } from "../src/services/AddPermissionsService"
import { removePermissionFromUserService } from "../src/services/RemovePermissionsService"
import { logMiddleware } from "../../config/middlewares/logMiddleware"

export async function POST(req: Request, context: { params: { id: string } }) {
    try {
        return await addPermissionToUserService(req)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
    try {
        await logMiddleware(req, "Deletou uma permissão", "DELETE")
        return await removePermissionFromUserService(req)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
