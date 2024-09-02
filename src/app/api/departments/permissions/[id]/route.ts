import { NextResponse } from "next/server"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { getDepartmentPermissionsService } from "../../src/services/GetPermissionsServices"
export async function GET(req: Request, context: { params: { id: string } }) {
    try {
        return await getDepartmentPermissionsService(req, context)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
