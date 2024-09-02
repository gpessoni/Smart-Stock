import { NextResponse } from "next/server"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { addPermissionToDepartmentService } from "../src/services/AddPermissionsService"
import { removePermissionFromDepartmentService } from "../src/services/RemovePermissionsService"
import { getDepartmentPermissionsService } from "../src/services/GetPermissionsServices"

export async function POST(req: Request, context: { params: { id: string } }) {
    try {
        return await addPermissionToDepartmentService(req)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
    try {
        return await removePermissionFromDepartmentService(req)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
