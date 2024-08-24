import { NextResponse } from "next/server";
import { deleteDepartmentService } from "../src/services/DeleteDepartmentService";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { getDepartmentByIdService } from "../src/services/GetDepartmentByIdService";
import { updateDepartmentService } from "../src/services/UpdateDepartmentService";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        return await deleteDepartmentService(params.id);
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

        return await getDepartmentByIdService(id);
    } catch (error) {
        return NextResponse.json(
            { message: "Erro no servidor", error: (error as Error).message },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}

export async function PUT(req: Request, context: { params: { id: string } }) {
    try {
        const { id } = context.params;
        const body = await req.json();

        if (!id) {
            return NextResponse.json({ error: "ID do departamento é obrigatório" }, { status: HttpStatus.BAD_REQUEST });
        }

        return await updateDepartmentService(id, body);
    } catch (error) {
        return NextResponse.json(
            { message: "Erro no servidor", error: (error as Error).message },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}