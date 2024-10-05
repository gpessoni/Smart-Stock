import { NextResponse } from "next/server"
import jwt, { JwtPayload } from "jsonwebtoken" // Importa também JwtPayload
import { HttpStatus } from "@/app/api/config/http/httpUtils"

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret"

// Função para validar o token JWT
export function validateToken(token: string) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload // Decodifica o token
        return decoded
    } catch (error) {
        return null
    }
}

// Middleware de autenticação
export async function authMiddleware(req: Request) {
    const authHeader = req.headers.get("Authorization")

    if (!authHeader) {
        return { status: HttpStatus.UNAUTHORIZED, error: "Token não fornecido" }
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
        return { status: HttpStatus.UNAUTHORIZED, error: "Token inválido" }
    }

    const decoded = validateToken(token)

    if (!decoded) {
        return { status: HttpStatus.UNAUTHORIZED, error: "Token inválido ou expirado" }
    }

    // Verifica se o payload contém o campo "id" ou "userId"
    const userId = decoded.id || (decoded as JwtPayload).userId

    if (!userId) {
        return { status: HttpStatus.UNAUTHORIZED, error: "ID do usuário não encontrado no token" }
    }

    return { status: HttpStatus.OK, userId }
}
