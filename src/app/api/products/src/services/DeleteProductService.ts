import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { deleteProductValidation } from "../validation";

export async function deleteProductService(id: string) {
    try {
        if (!id) {
            return NextResponse.json({ error: "ID do Produto é obrigatório" }, { status: HttpStatus.BAD_REQUEST });
        }

        const { error } = deleteProductValidation.validate(id, { abortEarly: false });

        if (error) {
            const errorMessage = error.details.map((detail: { message: any }) => detail.message).join(", ");
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST });
        }

        const productExists = await prisma.products.findUnique({
            where: { id },
        });

        if (!productExists) {
            return NextResponse.json({ error: "Produto não encontrado" }, { status: HttpStatus.NOT_FOUND });
        }

        const deletedProduct = await prisma.products.delete({
            where: { id },
        });

        return NextResponse.json(deletedProduct, { status: HttpStatus.OK });
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}
