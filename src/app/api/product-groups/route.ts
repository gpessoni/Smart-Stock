import { NextResponse } from "next/server";
import { HttpStatus } from "../config/http/httpUtils";
import { createGroupsService } from "./src/services/CreateGroupsService";
import { listProductGroupsService } from "./src/services/ListProductGroupsService";

export async function POST(req: Request) {
    try {
        return await createGroupsService(req);
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}

export async function GET() {
    try {
        return await listProductGroupsService();
    } catch (error) {
        return NextResponse.json({
            message: "Erro no servidor",
            error: (error as Error).message
        }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}