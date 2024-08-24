import { NextResponse } from "next/server";
import { HttpStatus } from "../config/http/httpUtils";
import { createDepartmentService } from "./src/services/CreateDepartmentService";
import { listDepartmentsService } from "./src/services/ListDepartmentsService";

export async function POST(req: Request) {
    try {
        return await createDepartmentService(req);
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}

export async function GET() {
    try {
        return await listDepartmentsService();
    } catch (error) {
        return NextResponse.json({
            message: "Erro no servidor",
            error: (error as Error).message
        }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}