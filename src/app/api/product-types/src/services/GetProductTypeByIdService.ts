import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";

export async function getProductTypeByIdService(id: string) {
    try {
        const productType = await prisma.typeProducts.findUnique({
            where: { id },
        });

        if (!productType) {
            return NextResponse.json(
                { error: "Tipo de produto não encontrado" },
                { status: HttpStatus.NOT_FOUND }
            );
        }

        return NextResponse.json(productType, { status: HttpStatus.OK });
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao buscar Tipo de produto", error: (error as Error).message },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}
