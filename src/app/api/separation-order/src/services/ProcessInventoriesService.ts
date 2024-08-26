import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";

export async function processInventoriesService() {
    try {
        // Busca todos os inventários não processados, ordenados por data de criação
        const inventories = await prisma.productInventory.findMany({
            where: { status: "NOT_PROCESSED" },
            orderBy: { createdAt: 'asc' },
        });

        if (inventories.length === 0) {
            return NextResponse.json({ message: "Nenhum inventário para processar" }, { status: HttpStatus.OK });
        }

        for (const inventory of inventories) {
            const existingBalance = await prisma.productStorageBalance.findFirst({
                where: {
                    productId: inventory.productId,
                    storageAddressId: inventory.storageAddressId,
                },
            });

            if (existingBalance) {
                await prisma.productStorageBalance.update({
                    where: { id: existingBalance.id },
                    data: {
                        balance: inventory.quantity,
                        updatedAt: new Date(),
                    },
                });
            } else {
                await prisma.productStorageBalance.create({
                    data: {
                        productId: inventory.productId,
                        storageAddressId: inventory.storageAddressId,
                        balance: inventory.quantity,
                    },
                });
            }

            await prisma.productInventory.update({
                where: { id: inventory.id },
                data: {
                    status: "PROCESSED",
                    updatedAt: new Date(),
                },
            });
        }

        return NextResponse.json({ message: "Inventários processados com sucesso" }, { status: HttpStatus.OK });
    } catch (error) {
        return NextResponse.json({ message: "Erro ao processar inventários", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}
