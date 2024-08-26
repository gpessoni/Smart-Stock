import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { createTransferValidation } from "../validation";

export async function createTransferService(req: Request) {
  try {
    const body = await req.json();
    const { productId, fromAddressId, toAddressId, quantity } = body;

    const fromBalance = await prisma.productStorageBalance.findFirst({
      where: {
        productId,
        storageAddressId: fromAddressId,
      },
    });

    if (!fromBalance || fromBalance.balance < quantity) {
      return NextResponse.json(
        {
          error: `Saldo insuficiente para o produto no endereço de origem ${fromAddressId}`,
        },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const toBalance = await prisma.productStorageBalance.findFirst({
      where: {
        productId,
        storageAddressId: toAddressId,
      },
    });

    if (!toBalance) {
      await prisma.productStorageBalance.create({
        data: {
          productId,
          storageAddressId: toAddressId,
          balance: quantity,
        },
      });
    } else {
      await prisma.productStorageBalance.update({
        where: {
          id: toBalance.id,
        },
        data: {
          balance: toBalance.balance + quantity,
        },
      });
    }

    await prisma.productStorageBalance.update({
      where: {
        id: fromBalance.id,
      },
      data: {
        balance: fromBalance.balance - quantity,
      },
    });

    const transfer = await prisma.addressTransfer.create({
      data: {
        productId,
        fromAddressId,
        toAddressId,
        quantity,
      },
    });

    return NextResponse.json(transfer, { status: HttpStatus.CREATED });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro no servidor", error: (error as Error).message },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
