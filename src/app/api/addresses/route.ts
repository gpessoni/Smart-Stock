import { NextResponse } from "next/server";
import { HttpStatus } from "../config/http/httpUtils";
import { createStorageAddressService } from "./src/services/CreateStorageAddressService";
import { listStorageAddressesService } from "./src/services/ListStorageAddressesService";

export async function POST(req: Request) {
    try {
        return await createStorageAddressService(req);
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}

export async function GET() {
    try {
        return await listStorageAddressesService();
    } catch (error) {
        return NextResponse.json({
            message: "Erro no servidor",
            error: (error as Error).message
        }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}