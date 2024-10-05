const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

export async function logMiddleware(req: Request, userId: string, action: string, type: string) {
    console.log("middle")
    try {
        await prisma.logs.create({
            data: {
                action: action,
                userId: userId,
                type: type,
            },
        })
    } catch (error) {
        console.error("Erro ao criar log:", error)
    }
}
