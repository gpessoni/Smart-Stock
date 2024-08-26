import { createTransferService } from "./src/services/CreateStorageAddressService";
import { listTransfersService } from "./src/services/ListTransfersService";

export async function POST(req: Request) {
  return await createTransferService(req);
}

export async function GET() {
  return await listTransfersService();
}
