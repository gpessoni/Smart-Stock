import { loginService } from "../src/services/AuthUserService"

export async function POST(req: Request) {
    return await loginService(req)
}
