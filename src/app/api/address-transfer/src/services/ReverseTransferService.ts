import { prisma } from "@/app/api/config/prisma"
import { NextResponse } from "next/server"
import { HttpStatus } from "@/app/api/config/http/httpUtils"

export async function reverseTransferService(transferId: string) {
    try {
        const originalTransfer = await prisma.addressTransfer.findUnique({
            where: {
                id: transferId,
            },
        })

        if (!originalTransfer) {
            return NextResponse.json(
                {
                    error: `Transferência com ID ${transferId} não encontrada`,
                },
                { status: HttpStatus.NOT_FOUND }
            )
        }

        const { productId, fromAddressId, toAddressId, quantity } = originalTransfer

        const toBalance = await prisma.productStorageBalance.findFirst({
            where: {
                productId,
                storageAddressId: toAddressId,
            },
        })

        if (!toBalance || toBalance.balance < quantity) {
            return NextResponse.json(
                {
                    error: `Saldo insuficiente para o produto no endereço de destino ${toAddressId} para realizar o estorno`,
                },
                { status: HttpStatus.BAD_REQUEST }
            )
        }

        const fromBalance = await prisma.productStorageBalance.findFirst({
            where: {
                productId,
                storageAddressId: fromAddressId,
            },
        })

        if (!fromBalance) {
            await prisma.productStorageBalance.create({
                data: {
                    productId,
                    storageAddressId: fromAddressId,
                    balance: quantity,
                },
            })
        } else {
            await prisma.productStorageBalance.update({
                where: {
                    id: fromBalance.id,
                },
                data: {
                    balance: fromBalance.balance + quantity,
                },
            })
        }

        await prisma.productStorageBalance.update({
            where: {
                id: toBalance.id,
            },
            data: {
                balance: toBalance.balance - quantity,
            },
        })

        const reverseTransfer = await prisma.addressTransfer.create({
            data: {
                productId,
                fromAddressId: toAddressId,
                toAddressId: fromAddressId,
                quantity,
                return: true,
            },
        })

        return NextResponse.json(reverseTransfer, { status: HttpStatus.CREATED })
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
