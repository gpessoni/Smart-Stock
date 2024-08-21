import { prisma } from "@/app/api/config/prisma";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { createStorageValidation } from "../validation";
import { NextResponse } from "next/server";

export async function createStorageService(req: Request) {
    try {
        const body = await req.json();
        const { error } = createStorageValidation.validate(body, { abortEarly: false });

        if (error) {
            const errorMessage = error.details.map((detail: { message: any }) => detail.message).join(", ");
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST });
        }

        const { code, description } = body;

        const existingStorage = await prisma.storage.findFirst({
            where: { code },
        });

        if (existingStorage) {
            return NextResponse.json({ error: "Storage com o mesmo código já existe" }, { status: HttpStatus.BAD_REQUEST });
        }

        const storage = await prisma.storage.create({
            data: {
                code,
                description,
            },
        });

        return NextResponse.json(storage, { status: HttpStatus.CREATED });
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}
