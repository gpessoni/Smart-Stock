import { prisma } from "@/app/api/config/prisma"
import { NextResponse } from "next/server"
import { HttpStatus } from "@/app/api/config/http/httpUtils"

export async function listProductInventoriesService() {
    try {
        const ProductInventories = await prisma.productInventory.findMany({
            include: {
                product: {
                    select: {
                        image: true,
                        code: true,
                        description: true,
                    },
                },
                storageAddress: {
                    select: {
                        address: true,
                    },
                },
            },
        })
        return NextResponse.json(ProductInventories, { status: HttpStatus.OK })
    } catch (error) {
        return NextResponse.json(
            {
                message: "Erro ao listar Inventários",
                error: (error as Error).message,
            },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        )
    }
}
