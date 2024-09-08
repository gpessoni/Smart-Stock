import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"
import { HttpStatus } from "@/app/api/config/http/httpUtils"

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret"

export async function validateToken(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Token não fornecido ou formato inválido" }, { status: HttpStatus.UNAUTHORIZED })
        }

        const token = authHeader.split(" ")[1]
        if (!token) {
            return NextResponse.json({ error: "Token não fornecido" }, { status: HttpStatus.UNAUTHORIZED })
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET)
            return NextResponse.json({ valid: true, decoded }, { status: HttpStatus.OK })
        } catch (err) {
            return NextResponse.json({ error: "Token inválido" }, { status: HttpStatus.UNAUTHORIZED })
        }
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
