import { NextResponse } from "next/server"
import { HttpStatus } from "../config/http/httpUtils"
import { prisma } from "../config/prisma" // Importa o Prisma diretamente

// Rota GET - Retornar logs
export async function GET(req: Request) {
    try {
        const logs = await prisma.logs.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: true,
            },
        })

        return NextResponse.json(logs, { status: HttpStatus.OK })
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
