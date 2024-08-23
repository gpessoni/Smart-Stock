import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";

export async function getUnitOfMeasureByIdService(id: string) {
    try {
        const UnitOfMeasure = await prisma.unitOfMeasure.findUnique({
            where: { id },
        });

        if (!UnitOfMeasure) {
            return NextResponse.json(
                { error: "Permmissão não encontrada" },
                { status: HttpStatus.NOT_FOUND }
            );
        }

        return NextResponse.json(UnitOfMeasure, { status: HttpStatus.OK });
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao buscar Unidade de Medida", error: (error as Error).message },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}
