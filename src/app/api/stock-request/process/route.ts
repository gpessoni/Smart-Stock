import { HttpStatus } from "../../config/http/httpUtils";
import { processInventoriesService } from "../src/services/ProcessInventoriesService";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        return await processInventoriesService();
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}