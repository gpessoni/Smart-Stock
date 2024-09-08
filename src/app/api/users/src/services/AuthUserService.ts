import { prisma } from "@/app/api/config/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { loginValidation } from "../validation"

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret"
const JWT_EXPIRES_IN = "6h" 

export async function loginService(req: Request) {
    try {
        const body = await req.json()
        const { error } = loginValidation.validate(body, { abortEarly: false })

        if (error) {
            const errorMessage = error.details.map((detail: { message: any }) => detail.message).join(", ")
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST })
        }

        const { username, password } = body

        const user = await prisma.users.findUnique({
            where: {
                username,
            },
        })

        if (!user) {
            return NextResponse.json({ error: "Credenciais inválidas" }, { status: HttpStatus.UNAUTHORIZED })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Credenciais inválidas" }, { status: HttpStatus.UNAUTHORIZED })
        }

        const token = jwt.sign({ id: user.id, username: user.username, role: user.departmentId }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        })

        return NextResponse.json({ token }, { status: HttpStatus.OK })
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
