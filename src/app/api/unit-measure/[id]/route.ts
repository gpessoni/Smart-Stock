import { NextResponse } from "next/server"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { deleteUnitOfMeasureService } from "../src/services/DeleteUnitOfMeasureService"
import { getUnitOfMeasureByIdService } from "../src/services/GetUnitOfMeasureByIdService"
import { updateUnitOfMeasureService } from "../src/services/UpdateUnitOfMeasureService"
import { authMiddleware } from "@/app/api/config/middlewares/authMiddleware"
import { logMiddleware } from "../../config/middlewares/logMiddleware"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const authResponse = authMiddleware(req)
    if (authResponse.status !== HttpStatus.OK) {
        return authResponse
    }

    try {
        await logMiddleware(req, "Deletou um Unidade de Medida", "DELETE")
        return await deleteUnitOfMeasureService(params.id)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function GET(req: Request, context: { params: { id: string } }) {
    const authResponse = authMiddleware(req)
    if (authResponse.status !== HttpStatus.OK) {
        return authResponse
    }

    try {
        const { id } = context.params

        if (!id) {
            return NextResponse.json({ error: "ID do Grupo de produto é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        return await getUnitOfMeasureByIdService(id)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
    const authResponse = authMiddleware(req)
    if (authResponse.status !== HttpStatus.OK) {
        return authResponse
    }

    try {
        const { id } = context.params
        const body = await req.json()

        if (!id) {
            return NextResponse.json({ error: "ID do Armazém é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        return await updateUnitOfMeasureService(id, body)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
