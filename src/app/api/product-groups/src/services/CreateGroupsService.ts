import { prisma } from "@/app/api/config/prisma";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { createGroupsValidation } from "../validation";
import { NextResponse } from "next/server";

export async function createGroupsService(req: Request) {
    try {
        const body = await req.json();
        const { error } = createGroupsValidation.validate(body, { abortEarly: false });

        if (error) {
            const errorMessage = error.details.map((detail: { message: any }) => detail.message).join(", ");
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST });
        }

        const { code, description } = body;

        const existingGroup = await prisma.groupProduct.findFirst({
            where: {
                OR: [
                    { code },
                    { description }
                ],
            },
        });

        if (existingGroup) {
            if (existingGroup.code === code) {
                return NextResponse.json({ error: "Código já cadastrado" }, { status: HttpStatus.BAD_REQUEST });
            }
            if (existingGroup.description === description) {
                return NextResponse.json({ error: "Descrição já cadastrada" }, { status: HttpStatus.BAD_REQUEST });
            }
        }

        const Group = await prisma.groupProduct.create({
            data: {
                code,
                description,
            },
        });

        return NextResponse.json(Group, { status: HttpStatus.CREATED });
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}
