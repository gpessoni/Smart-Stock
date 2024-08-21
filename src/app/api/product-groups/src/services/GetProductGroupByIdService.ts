import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";

export async function getProductGroupByIdService(id: string) {
    try {
        const productGroup = await prisma.groupProduct.findUnique({
            where: { id },
        });

        if (!productGroup) {
            return NextResponse.json(
                { error: "Grupo de produto não encontrado" },
                { status: HttpStatus.NOT_FOUND }
            );
        }

        return NextResponse.json(productGroup, { status: HttpStatus.OK });
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao buscar Grupo de produto", error: (error as Error).message },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}
