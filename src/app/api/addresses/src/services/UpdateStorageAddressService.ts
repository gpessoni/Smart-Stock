import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { updateStorageAddressValidation } from "../validation";

export async function updateStorageAddressService(id: string, body: any) {
    try {
        const { error } = updateStorageAddressValidation.validate(body, { abortEarly: false });

        if (error) {
            const errorMessage = error.details.map((detail: { message: any }) => detail.message).join(", ");
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST });
        }

        const addressExists = await prisma.storageAddress.findUnique({
            where: { id },
        });

        if (!addressExists) {
            return NextResponse.json({ error: "Endereço de armazenamento não encontrado" }, { status: HttpStatus.NOT_FOUND });
        }

        const updatedStorageAddress = await prisma.storageAddress.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(updatedStorageAddress, { status: HttpStatus.OK });
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao atualizar endereço de armazenamento", error: (error as Error).message },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}
