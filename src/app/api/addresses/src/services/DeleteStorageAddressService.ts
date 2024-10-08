import { prisma } from "@/app/api/config/prisma"
import { NextResponse } from "next/server"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { deleteStorageAddressValidation } from "../validation"
import { ValidationError } from "joi"

export async function deleteStorageAddressService(id: string) {
    try {
        if (!id) {
            return NextResponse.json({ error: "ID do endereço de armazenamento é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        const { error } = deleteStorageAddressValidation.validate(id, {
            abortEarly: false,
        })

        if (error) {
            const validationError = error as ValidationError
            const errorMessage = validationError.details.map((detail) => detail.message).join(", ")
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST })
        }

        const addressExists = await prisma.storageAddress.findUnique({
            where: { id },
        })

        if (!addressExists) {
            return NextResponse.json({ error: "Endereço de armazenamento não encontrado" }, { status: HttpStatus.NOT_FOUND })
        }

        const deletedStorageAddress = await prisma.storageAddress.delete({
            where: { id },
        })

        return NextResponse.json(deletedStorageAddress, { status: HttpStatus.OK })
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
