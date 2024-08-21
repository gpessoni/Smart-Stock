import { NextResponse } from "next/server";
import { HttpStatus } from "../config/http/httpUtils";
import { createStorageService } from "./src/services/CreateStorageService";
import { listStoragesService } from "./src/services/ListStoragesService";

export async function POST(req: Request) {
    try {
        return await createStorageService(req);
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}

export async function GET() {
    try {
        return await listStoragesService();
    } catch (error) {
        return NextResponse.json({
            message: "Erro no servidor",
            error: (error as Error).message
        }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}