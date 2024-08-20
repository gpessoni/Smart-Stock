import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { updateTypesValidation } from "../validation";

export async function updateProductTypeService(id: string, body: any) {
    try {
        const { error } = updateTypesValidation.validate(body, { abortEarly: false });

        if (error) {
            const errorMessage = error.details.map((detail: { message: any }) => detail.message).join(", ");
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST });
        }

        const typeExists = await prisma.typeProducts.findUnique({
            where: { id },
        });

        if (!typeExists) {
            return NextResponse.json({ error: "Tipo de produto não encontrado" }, { status: HttpStatus.NOT_FOUND });
        }

        const updatedType = await prisma.typeProducts.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(updatedType, { status: HttpStatus.OK });
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao atualizar Tipo de produto", error: (error as Error).message },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}