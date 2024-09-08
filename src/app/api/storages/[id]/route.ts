import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { NextResponse } from "next/server"
import { deleteStorageService } from "../src/services/DeleteStorageService"
import { getStorageByIdService } from "../src/services/GetStorageByIdService"
import { updateStorageService } from "../src/services/UpdateStorageService"
import { authMiddleware } from "@/app/api/config/middlewares/authMiddleware" 

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const authResponse = authMiddleware(req)
    if (authResponse.status !== 200) {
        return authResponse
    }

    try {
        return await deleteStorageService(params.id)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function GET(req: Request, context: { params: { id: string } }) {
    const authResponse = authMiddleware(req)
    if (authResponse.status !== 200) {
        return authResponse
    }

    try {
        const { id } = context.params

        if (!id) {
            return NextResponse.json({ error: "ID do Armazém é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        return await getStorageByIdService(id)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
    const authResponse = authMiddleware(req)
    if (authResponse.status !== 200) {
        return authResponse
    }

    try {
        const { id } = context.params
        const body = await req.json()

        if (!id) {
            return NextResponse.json({ error: "ID do Armazém é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        return await updateStorageService(id, body)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
