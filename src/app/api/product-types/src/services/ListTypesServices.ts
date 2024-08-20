import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";

export async function listProductTypesService() {
    try {
        const productTypes = await prisma.typeProducts.findMany();
        return NextResponse.json(productTypes, { status: HttpStatus.OK });
    } catch (error) {
        return NextResponse.json({
            message: "Erro ao listar Tipos de produtos",
            error: (error as Error).message
        }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}