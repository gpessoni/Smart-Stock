import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";

export async function getStorageByIdService(id: string) {
    try {
        const storage = await prisma.storage.findUnique({
            where: { id },
            include: {
                StorageAddress: true
            }
        });

        if (!storage) {
            return NextResponse.json(
                { error: "Storage não encontrado" },
                { status: HttpStatus.NOT_FOUND }
            );
        }

        return NextResponse.json(storage, { status: HttpStatus.OK });
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao buscar Storage", error: (error as Error).message },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}
