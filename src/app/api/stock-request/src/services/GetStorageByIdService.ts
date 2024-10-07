import { prisma } from "@/app/api/config/prisma"
import { NextResponse } from "next/server"
import { HttpStatus } from "@/app/api/config/http/httpUtils"

export async function getStockRequestByIdService(id: string) {
    try {
        const stockRequest = await prisma.stockRequest.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                        storageAddress: true,
                    },
                },
            },
        })

        if (!stockRequest) {
            return NextResponse.json({ error: "Pedido de estoque não encontrado" }, { status: HttpStatus.NOT_FOUND })
        }

        return NextResponse.json(stockRequest, { status: HttpStatus.OK })
    } catch (error) {
        return NextResponse.json({ message: "Erro ao buscar pedido de estoque", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
