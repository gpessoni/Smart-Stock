import { NextResponse } from "next/server";
import { HttpStatus } from "../config/http/httpUtils";
import { createProductService } from "./src/services/CreateProductService";
import { listProductsService } from "./src/services/ListProductsService";

export async function POST(req: Request) {
    try {
        return await createProductService(req);
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}

export async function GET() {
    try {
        return await listProductsService();
    } catch (error) {
        return NextResponse.json({
            message: "Erro no servidor",
            error: (error as Error).message
        }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}