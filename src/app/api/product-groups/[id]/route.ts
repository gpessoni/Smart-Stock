import { NextResponse } from "next/server"
import { deleteGroupsService } from "../src/services/DeleteGroupsService"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { getProductGroupByIdService } from "../src/services/GetProductGroupByIdService"
import { updateProductGroupService } from "../src/services/UpdateProductGroupService"
import { authMiddleware } from "@/app/api/config/middlewares/authMiddleware"

export async function DELETE(req: Request, context: { params: { id: string } }) {
    const authResponse = authMiddleware(req)
    if (authResponse.status !== 200) {
        return authResponse
    }

    try {
        const { id } = context.params
        if (!id) {
            return NextResponse.json({ error: "ID do Grupo de produto é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }
        return await deleteGroupsService(id)
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
            return NextResponse.json({ error: "ID do Grupo de produto é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }
        return await getProductGroupByIdService(id)
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
            return NextResponse.json({ error: "ID do Grupo de produto é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }
        return await updateProductGroupService(id, body)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
