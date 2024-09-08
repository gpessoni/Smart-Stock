import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";

export async function getProductInventoryByIdService(id: string) {
    try {
        const ProductInventory = await prisma.productInventory.findUnique({
            where: { id },
            include: {
                product: true,
                storageAddress: true
            }
        });

        if (!ProductInventory) {
            return NextResponse.json(
                { error: "Inventário não encontrado" },
                { status: HttpStatus.NOT_FOUND }
            );
        }

        return NextResponse.json(ProductInventory, { status: HttpStatus.OK });
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao buscar Inventário", error: (error as Error).message },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}
