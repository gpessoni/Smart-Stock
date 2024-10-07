import { prisma } from "@/app/api/config/prisma"
import { NextResponse } from "next/server"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { updateStockRequestValidation } from "../validation"

export async function updateStockRequestService(id: string, body: any) {
    try {
        const { error } = updateStockRequestValidation.validate(body, { abortEarly: false })

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

        const updatedStockRequest = await prisma.stockRequest.update({
            where: { id },
            data: body,
            include: {
                items: true,
            },
        })

        return NextResponse.json(updatedStockRequest, { status: HttpStatus.OK })
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao atualizar pedido de estoque", error: (error as Error).message },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        )
    }
}
