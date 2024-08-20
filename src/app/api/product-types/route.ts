import { NextResponse } from "next/server";
import { HttpStatus } from "../config/http/httpUtils";
import { createTypesService } from "./src/services/CreateTypeServices";
import { listProductTypesService } from "./src/services/ListTypesServices";

export async function POST(req: Request) {
    try {
        return await createTypesService(req);
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}

export async function GET() {
    try {
        return await listProductTypesService();
    } catch (error) {
        return NextResponse.json({
            message: "Erro no servidor",
            error: (error as Error).message
        }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}