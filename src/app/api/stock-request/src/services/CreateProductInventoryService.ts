import { prisma } from "@/app/api/config/prisma";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { createStockRequestValidation } from "../validation";
import { ValidationError } from "joi";



export async function createStockRequestService(req: Request) {
  try {
    const body = await req.json();
    const { error } = createStockRequestValidation.validate(body, {
      abortEarly: false,
    });

    if (error) {
      const validationError = error as ValidationError;
      const errorMessage = validationError.details
        .map((detail) => detail.message)
        .join(", ");
      return NextResponse.json(
        { error: errorMessage },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const { items } = body;

    for (const item of items) {
      const balance = await prisma.productStorageBalance.findFirst({
        where: {
          productId: item.productId,
          storageAddressId: item.storageAddressId,
        },
        include: {
          product: true,
          storageAddress: true,
        },
      });

      if (!balance || balance.balance < item.quantity) {
        const product = await prisma.products.findUnique({
          where: { id: item.productId },
        });

        const storageAddress = await prisma.storageAddress.findUnique({
          where: { id: item.storageAddressId },
        });

        // Create error message with detailed information
        const productName = product ? product.description : "Desconhecido";
        const addressDescription = storageAddress
          ? storageAddress.address
          : "Desconhecido";

        return NextResponse.json(
          {
            error: `Saldo insuficiente para o produto ${productName} no endereço ${addressDescription}`,
          },
          { status: HttpStatus.BAD_REQUEST }
        );
      }
    }

    const stockRequest = await prisma.stockRequest.create({
      data: {
        items: {
          create: items,
        },
      },
    });

    return NextResponse.json(stockRequest, { status: HttpStatus.CREATED });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro no servidor", error: (error as Error).message },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
