import { prisma } from "@/app/api/config/prisma"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { createStockRequestValidation } from "../validation"
import { NextResponse } from "next/server"

export async function createStockRequestService(req: Request) {
    try {
        const body = await req.json()
        const { error } = createStockRequestValidation.validate(body, { abortEarly: false })

        if (error) {
            const errorMessage = error.details.map((detail: { message: any }) => detail.message).join(", ")
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST })
        }

        const { items } = body

        const stockRequest = await prisma.stockRequest.create({
            data: {
                status: "PENDING",
                items: {
                    create: items,
                },
            },
            include: {
                items: true,
            },
        })

        return NextResponse.json(stockRequest, { status: HttpStatus.CREATED })
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
