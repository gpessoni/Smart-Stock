import { prisma } from "@/app/api/config/prisma"
import { NextResponse } from "next/server"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { updateProductValidation } from "../validation"


export async function updateProductService(id: string, body: any) {
    try {
        const { error } = updateProductValidation.validate(body, { abortEarly: false })

        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(", ")
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST })
        }

        const productExists = await prisma.products.findUnique({
            where: { id },
        })

        if (!productExists) {
            return NextResponse.json({ error: "Produto não encontrado" }, { status: HttpStatus.NOT_FOUND })
        }

        const updatedProduct = await prisma.products.update({
            where: { id },
            data: body, 
            select: {
                id: true,
                code: true,
                description: true,
                image: true, 
                createdAt: true,
                updatedAt: true,
                typeProductId: true,
                groupProductId: true,
                unitOfMeasureId: true,
                typeProduct: {
                    select: {
                        id: true,
                        description: true,
                    },
                },
                groupProduct: {
                    select: {
                        id: true,
                        description: true,
                    },
                },
                unitOfMeasure: {
                    select: {
                        id: true,
                        abbreviation: true,
                        description: true,
                    },
                },
            },
        })

        return NextResponse.json(updatedProduct, { status: HttpStatus.OK })
    } catch (error) {
        return NextResponse.json({ message: "Erro ao atualizar Produto", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
