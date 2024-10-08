import { NextResponse } from "next/server"
import { deleteProductService } from "../src/services/DeleteProductService"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { getProductByIdService } from "../src/services/GetProductByIdService"
import { updateProductService } from "../src/services/UpdateProductService"
import { authMiddleware } from "@/app/api/config/middlewares/authMiddleware"
import { logMiddleware } from "../../config/middlewares/logMiddleware"

export async function DELETE(req: Request, context: { params: { id: string } }) {
    const authResponse = authMiddleware(req)
    if (authResponse.status !== 200) {
        return authResponse
    }

    try {
        const { id } = context.params
        if (!id) {
            return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        await logMiddleware(req, "Deletou um Tipo de Produto", "DELETE")

        return await deleteProductService(id)
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
            return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }
        return await getProductByIdService(id)
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
            return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }
        return await updateProductService(id, body)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
