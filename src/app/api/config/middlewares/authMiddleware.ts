import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { HttpStatus } from "@/app/api/config/http/httpUtils"

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret"

export function validateToken(token: string) {
    try {
        console.log(token)
        const decoded = jwt.verify(token, JWT_SECRET)
        return decoded
    } catch (error) {
        return null
    }
}

export function authMiddleware(req: Request) {
    const authHeader = req.headers.get("Authorization")

    if (!authHeader) {
        return NextResponse.json({ error: "Token não fornecido" }, { status: HttpStatus.UNAUTHORIZED })
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
        return NextResponse.json({ error: "Token inválido" }, { status: HttpStatus.UNAUTHORIZED })
    }

    const decoded = validateToken(token)

    if (!decoded) {
        return NextResponse.json({ error: "Token inválido ou expirado" }, { status: HttpStatus.UNAUTHORIZED })
    }

    return NextResponse.next()
}
