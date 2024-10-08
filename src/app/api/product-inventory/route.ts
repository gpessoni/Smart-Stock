import { NextResponse } from "next/server";
import { HttpStatus } from "../config/http/httpUtils";
import { createProductInventoryService } from "./src/services/CreateProductInventoryService";
import { listProductInventoriesService } from "./src/services/ListProductInventoriesService";
import { logMiddleware } from "../config/middlewares/logMiddleware";

export async function POST(req: Request) {
    try {
        await logMiddleware(req, "Criou Inventário de Produto", "CREATE")
        return await createProductInventoryService(req);
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}

export async function GET() {
    try {
        return await listProductInventoriesService();
    } catch (error) {
        return NextResponse.json({
            message: "Erro no servidor",
            error: (error as Error).message
        }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}