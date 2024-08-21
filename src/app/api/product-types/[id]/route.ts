import { NextResponse } from "next/server";
import { deleteTypesService } from "../src/services/DeleteTypeServices";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { getProductTypeByIdService } from "../src/services/GetProductTypeByIdService";
import { updateProductTypeService } from "../src/services/UpdateProductTypeService";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        return await deleteTypesService(params.id);
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}

export async function GET(req: Request, context: { params: { id: string } }) {
    try {
        const { id } = context.params;

        if (!id) {
            return NextResponse.json(
                { error: "ID do Grupo de produto é obrigatório" },
                { status: HttpStatus.BAD_REQUEST }
            );
        }

        return await getProductTypeByIdService(id);
    } catch (error) {
        return NextResponse.json(
            { message: "Erro no servidor", error: (error as Error).message },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
    try {
        const { id } = context.params;
        const body = await req.json();

        if (!id) {
            return NextResponse.json({ error: "ID do Grupo de produto é obrigatório" }, { status: HttpStatus.BAD_REQUEST });
        }

        return await updateProductTypeService(id, body);
    } catch (error) {
        return NextResponse.json(
            { message: "Erro no servidor", error: (error as Error).message },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}