import { prisma } from "@/app/api/config/prisma"
import { NextResponse } from "next/server"
import { HttpStatus } from "@/app/api/config/http/httpUtils"

export async function listProductsService() {
    try {
        const products = await prisma.products.findMany({
            include: {
                unitOfMeasure: true,
                groupProduct: true,
                typeProduct: true,
                ProductStorageBalances: {
                    include: {
                        storageAddress: true,
                    },
                    where: {
                        balance: {
                            gt: 0,
                        },
                    },
                },
            },
        })
        return NextResponse.json(products, { status: HttpStatus.OK })
    } catch (error) {
        return NextResponse.json(
            {
                message: "Erro ao listar Produtos",
                error: (error as Error).message,
            },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        )
    }
}
