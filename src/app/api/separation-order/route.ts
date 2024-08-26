import { NextResponse } from "next/server";
import { HttpStatus } from "../config/http/httpUtils";
import { createSeparationOrderService } from "./src/services/CreateSeparationOrderService";
import { listSeparationOrdersService } from "./src/services/ListSeparationOrdersService";

export async function POST(req: Request) {
  try {
    return await createSeparationOrderService(req);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro no servidor", error: (error as Error).message },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function GET() {
  try {
    return await listSeparationOrdersService();
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro no servidor",
        error: (error as Error).message,
      },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
