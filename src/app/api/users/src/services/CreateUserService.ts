import { prisma } from "@/app/api/config/prisma";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { createUserValidation } from "../validation";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function createUserService(req: Request) {
    try {
        const body = await req.json();
        const { error } = createUserValidation.validate(body, { abortEarly: false });

        if (error) {
            const errorMessage = error.details.map((detail: { message: any }) => detail.message).join(", ");
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST });
        }

        const { username, password, departmentId } = body;

        const existingUser = await prisma.users.findFirst({
            where: {
                username,
            },
        });

        if (existingUser) {
            return NextResponse.json({ error: "Usuário com o mesmo nome já existe" }, { status: HttpStatus.BAD_REQUEST });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: {
                username,
                password: hashedPassword,
                departmentId,
            },
        });

        return NextResponse.json(user, { status: HttpStatus.CREATED });
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}
