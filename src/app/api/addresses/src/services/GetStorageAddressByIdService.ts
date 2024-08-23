import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";

export async function getStorageAddressByIdService(id: string) {
    try {
        const storageAddress = await prisma.storageAddress.findUnique({
            where: { id },
            include: {
                storage: true,
            }
        });

        if (!storageAddress) {
            return NextResponse.json(
                { error: "Endereço de armazenamento não encontrado" },
                { status: HttpStatus.NOT_FOUND }
            );
        }

        return NextResponse.json(storageAddress, { status: HttpStatus.OK });
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao buscar endereço de armazenamento", error: (error as Error).message },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}
