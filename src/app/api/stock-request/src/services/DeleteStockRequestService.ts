import { prisma } from "@/app/api/config/prisma"
import { NextResponse } from "next/server"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { deleteStockRequestValidation } from "../validation"

export async function deleteStockRequestService(id: string) {
    try {
        const { error } = deleteStockRequestValidation.validate(id, { abortEarly: false })

        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(", ")
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST })
        }

        const stockRequestExists = await prisma.stockRequest.findUnique({
            where: { id },
        })

        if (!stockRequestExists) {
            return NextResponse.json({ error: "Pedido de estoque não encontrado" }, { status: HttpStatus.NOT_FOUND })
        }

        await prisma.stockRequest.delete({ where: { id } })

        return NextResponse.json({ message: "Pedido de estoque deletado com sucesso" }, { status: HttpStatus.OK })
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
