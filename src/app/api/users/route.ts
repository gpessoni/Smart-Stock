import { NextResponse } from "next/server";
import { HttpStatus } from "../config/http/httpUtils";
import { createUserService } from "./src/services/CreateUserService";
import { listUsersService } from "./src/services/ListUsersService";
import { logMiddleware } from "../config/middlewares/logMiddleware";

export async function POST(req: Request) {
    try {
        await logMiddleware(req, "Criou um usuário", "CREATE")
        return await createUserService(req);
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}

export async function GET() {
    try {
        return await listUsersService();
    } catch (error) {
        return NextResponse.json({
            message: "Erro no servidor",
            error: (error as Error).message
        }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}