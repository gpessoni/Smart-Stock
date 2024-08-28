import { NextResponse } from "next/server";
import { HttpStatus } from "../config/http/httpUtils";
import { createStockRequestService } from "./src/services/CreateProductInventoryService";
import { listStockRequestsService } from "./src/services/ListProductInventoriesService";
import { updateStockRequestStatusService } from "./src/services/UpdateStockRequestStatusService";

export async function POST(req: Request) {
  try {
    return await createStockRequestService(req);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro no servidor", error: (error as Error).message },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function GET() {
  try {
    return await listStockRequestsService();
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

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    return await updateStockRequestStatusService(id, status);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro no servidor", error: (error as Error).message },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
