import { prisma } from "@/app/api/config/prisma"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { createProductValidation } from "../validation"
import { NextResponse } from "next/server"

export async function createProductService(req: Request) {
    try {
        const body = await req.json()
        const { error } = createProductValidation.validate(body, { abortEarly: false })

        if (error) {
            const errorMessage = error.details.map((detail: { message: any }) => detail.message).join(", ")
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST })
        }

        const { code, description, typeProductId, groupProductId, unitOfMeasureId } = body

        const existingProduct = await prisma.products.findFirst({
            where: { code },
        })

        if (existingProduct) {
            return NextResponse.json({ error: "Código de produto já existe" }, { status: HttpStatus.BAD_REQUEST })
        }

        const product = await prisma.products.create({
            data: {
                code,
                description,
                typeProductId,
                groupProductId,
                unitOfMeasureId,
            },
            select: {
                id: true,
                code: true,
                description: true,
                createdAt: true,
                updatedAt: true,
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

        return NextResponse.json(product, { status: HttpStatus.CREATED })
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
