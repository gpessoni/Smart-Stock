import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";

export async function listStorageAddressesService() {
    try {
        const storageAddresses = await prisma.storageAddress.findMany();
        return NextResponse.json(storageAddresses, { status: HttpStatus.OK });
    } catch (error) {
        return NextResponse.json({
            message: "Erro ao listar endereços de armazenamento",
            error: (error as Error).message
        }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}
