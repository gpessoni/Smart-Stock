import { prisma } from "@/app/api/config/prisma"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { createProductInventoryValidation } from "../validation"
import { NextResponse } from "next/server"

export async function createProductInventoryService(req: Request) {
    try {
        const body = await req.json()
        const { error } = createProductInventoryValidation.validate(body, { abortEarly: false })

        if (error) {
            const errorMessage = error.details.map((detail: { message: any }) => detail.message).join(", ")
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST })
        }

        const { productId, storageAddressId, quantity } = body

        const ProductInventory = await prisma.productInventory.create({
            data: {
                productId,
                storageAddressId,
                quantity,
                status: "NOT_PROCESSED",
            },
            include: {
                product: {
                    select: {
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

        return NextResponse.json(ProductInventory, { status: HttpStatus.CREATED })
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
