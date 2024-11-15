import { prisma } from "@/app/api/config/prisma"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { deleteProductInventoryValidation } from "../validation"
import { NextResponse } from "next/server"
import { ValidationError } from "joi"

export async function deleteProductInventoryService(id: string) {
    try {
        if (!id) {
            return NextResponse.json({ error: "ID do Inventário é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        const { error } = deleteProductInventoryValidation.validate(id, {
            abortEarly: false,
        })

        if (error) {
            const validationError = error as ValidationError
            const errorMessage = validationError.details.map((detail) => detail.message).join(", ")
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST })
        }
        const ProductInventoryExists = await prisma.productInventory.findUnique({
            where: { id },
        })

        if (!ProductInventoryExists) {
            return NextResponse.json({ error: "Inventário não encontrado" }, { status: HttpStatus.NOT_FOUND })
        }

        if (ProductInventoryExists.status === "PROCESSED") {
            return NextResponse.json({ error: "Inventário já está processado" }, { status: HttpStatus.CONFLICT })
        }

        const deletedProductInventory = await prisma.productInventory.delete({
            where: { id },
        })

        return NextResponse.json(deletedProductInventory, {
            status: HttpStatus.OK,
        })
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
