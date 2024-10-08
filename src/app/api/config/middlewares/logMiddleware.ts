import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import { HttpStatus } from "@/app/api/config/http/httpUtils"

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret"

export function validateToken(token: string) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        return decoded
    } catch (error) {
        return null
    }
}

export async function logMiddleware(req: Request, action: string, type: "CREATE" | "UPDATE" | "DELETE" | "LIST" = "LIST") {
    const authHeader = req.headers.get("Authorization")

    if (!authHeader) {
        return NextResponse.json({ error: "Token não fornecido" }, { status: HttpStatus.UNAUTHORIZED })
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
        return NextResponse.json({ error: "Token inválido" }, { status: HttpStatus.UNAUTHORIZED })
    }

    const decoded: any = validateToken(token)

    if (!decoded) {
        return NextResponse.json({ error: "Token inválido ou expirado" }, { status: HttpStatus.UNAUTHORIZED })
    }

    const userId = decoded?.id
    if (!userId) {
        return NextResponse.json({ error: "Token inválido, sem userId" }, { status: HttpStatus.UNAUTHORIZED })
    }

    try {
        await prisma.logs.create({
            data: {
                action,
                type,
                userId,
            },
        })

        return NextResponse.next() 
    } catch (error) {
        return NextResponse.json({ message: "Erro ao criar log", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
