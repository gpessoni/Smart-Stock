import { loginService } from "../src/services/AuthUserService"
import { validateToken } from "../src/services/ValidateTokenService";

export async function POST(req: Request) {
    return await loginService(req)
}

export async function GET(req: Request) {
    return validateToken(req);
}