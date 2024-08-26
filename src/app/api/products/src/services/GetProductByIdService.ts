import { prisma } from "@/app/api/config/prisma"
import { NextResponse } from "next/server"
import { HttpStatus } from "@/app/api/config/http/httpUtils"

export async function getProductByIdService(id: string) {
    try {
        const product = await prisma.products.findUnique({
            where: { id },
            include: {
                groupProduct: true,
                typeProduct: true,
                unitOfMeasure: true,
                ProductStorageBalances: {
                    include: {
                        storageAddress: true,
                    },
                },
            },
        })

        if (!product) {
            return NextResponse.json({ error: "Produto não encontrado" }, { status: HttpStatus.NOT_FOUND })
        }

        return NextResponse.json(product, { status: HttpStatus.OK })
    } catch (error) {
        return NextResponse.json({ message: "Erro ao buscar Produto", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
