import { NextResponse } from "next/server"
import { deleteStorageAddressService } from "../src/services/DeleteStorageAddressService"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { getStorageAddressByIdService } from "../src/services/GetStorageAddressByIdService"
import { updateStorageAddressService } from "../src/services/UpdateStorageAddressService"
import { authMiddleware } from "@/app/api/config/middlewares/authMiddleware"
import { logMiddleware } from "../../config/middlewares/logMiddleware"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const authResponse = authMiddleware(req)
    if (authResponse.status !== 200) {
        return authResponse
    }

    try {
        const { id } = params
        if (!id) {
            return NextResponse.json({ error: "ID do endereço de armazenamento é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }
        await logMiddleware(req, "Deletou um Endereço de Armazenamento", "DELETE")
        return await deleteStorageAddressService(id)
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
            return NextResponse.json({ error: "ID do endereço de armazenamento é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }
        return await getStorageAddressByIdService(id)
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
            return NextResponse.json({ error: "ID do endereço de armazenamento é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        await logMiddleware(req, "Editou um Endereço", "UPDATE")
        return await updateStorageAddressService(id, body)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
