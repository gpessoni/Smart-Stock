import { NextResponse } from "next/server";
import { HttpStatus } from "../config/http/httpUtils";
import { createUnitOfMeasureService } from "./src/services/CreateUnitOfMeasureService";
import { listUnitOfMeasuresService } from "./src/services/ListUnitOfMeasuresService";

export async function POST(req: Request) {
  try {
    return await createUnitOfMeasureService(req);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro no servidor", error: (error as Error).message },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function GET() {
  try {
    return await listUnitOfMeasuresService();
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
