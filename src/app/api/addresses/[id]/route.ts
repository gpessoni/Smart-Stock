import { NextResponse } from "next/server"
import { deleteStorageAddressService } from "../src/services/DeleteStorageAddressService"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { getStorageAddressByIdService } from "../src/services/GetStorageAddressByIdService"
import { updateStorageAddressService } from "../src/services/UpdateStorageAddressService"
import { authMiddleware } from "@/app/api/config/middlewares/authMiddleware"
import { logMiddleware } from "@/app/api/config/middlewares/logMiddleware"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const authResponse = await authMiddleware(req)

    if (authResponse.status !== HttpStatus.OK) {
        return NextResponse.json({ error: authResponse.error }, { status: authResponse.status })
    }

    const userId = authResponse.userId

    if (!userId) {
        return NextResponse.json({ error: "ID do usuário não encontrado no token" }, { status: HttpStatus.UNAUTHORIZED })
    }

    try {
        const { id } = params

        if (!id) {
            return NextResponse.json({ error: "ID do endereço de armazenamento é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        const result = await deleteStorageAddressService(id)

        await logMiddleware(req, userId, "excluiu um endereço de armazenamento", "DELETE")

        return result
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function GET(req: Request, context: { params: { id: string } }) {
    const authResponse = await authMiddleware(req)

    if (authResponse.status !== HttpStatus.OK) {
        return NextResponse.json({ error: authResponse.error }, { status: authResponse.status })
    }

    const userId = authResponse.userId

    if (!userId) {
        return NextResponse.json({ error: "ID do usuário não encontrado no token" }, { status: HttpStatus.UNAUTHORIZED })
    }

    try {
        const { id } = context.params

        if (!id) {
            return NextResponse.json({ error: "ID do endereço de armazenamento é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        const result = await getStorageAddressByIdService(id)

        await logMiddleware(req, userId, "visualizou um endereço de armazenamento", "LIST")

        return result
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
    const authResponse = await authMiddleware(req)

    if (authResponse.status !== HttpStatus.OK) {
        return NextResponse.json({ error: authResponse.error }, { status: authResponse.status })
    }

    const userId = authResponse.userId

    if (!userId) {
        return NextResponse.json({ error: "ID do usuário não encontrado no token" }, { status: HttpStatus.UNAUTHORIZED })
    }

    try {
        const { id } = context.params
        const body = await req.json()

        if (!id) {
            return NextResponse.json({ error: "ID do endereço de armazenamento é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        const result = await updateStorageAddressService(id, body)

        await logMiddleware(req, userId, "atualizou um endereço de armazenamento", "UPDATE")

        return result
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
