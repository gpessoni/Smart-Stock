-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('NOT_PROCESSED', 'PROCESSED');

-- CreateEnum
CREATE TYPE "StockRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SeparationStatus" AS ENUM ('PENDING', 'SEPARATED', 'DELIVERED');

-- CreateEnum
CREATE TYPE "SeparationItemStatus" AS ENUM ('NOT_SEPARATED', 'SEPARATED', 'DELIVERED');

-- CreateTable
CREATE TABLE "Permissions" (
    "id" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departments" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeProducts" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TypeProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupProduct" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitOfMeasure" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnitOfMeasure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Products" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "typeProductId" TEXT NOT NULL,
    "groupProductId" TEXT NOT NULL,
    "unitOfMeasureId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Storage" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Storage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorageAddress" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "storageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorageAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductStorageBalance" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "storageAddressId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductStorageBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductInventory" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "storageAddressId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "InventoryStatus" NOT NULL DEFAULT 'NOT_PROCESSED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockRequest" (
    "id" TEXT NOT NULL,
    "status" "StockRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockRequestItem" (
    "id" TEXT NOT NULL,
    "stockRequestId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "storageAddressId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "StockRequestItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddressTransfer" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "fromAddressId" TEXT NOT NULL,
    "toAddressId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AddressTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeparationOrder" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" "SeparationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeparationOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeparationOrderItem" (
    "id" TEXT NOT NULL,
    "separationOrderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "storageAddressId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "SeparationItemStatus" NOT NULL DEFAULT 'NOT_SEPARATED',

    CONSTRAINT "SeparationOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permissions_route_key" ON "Permissions"("route");

-- CreateIndex
CREATE UNIQUE INDEX "GroupProduct_code_key" ON "GroupProduct"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Products_code_key" ON "Products"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Storage_code_key" ON "Storage"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SeparationOrder_code_key" ON "SeparationOrder"("code");

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_typeProductId_fkey" FOREIGN KEY ("typeProductId") REFERENCES "TypeProducts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_groupProductId_fkey" FOREIGN KEY ("groupProductId") REFERENCES "GroupProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_unitOfMeasureId_fkey" FOREIGN KEY ("unitOfMeasureId") REFERENCES "UnitOfMeasure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorageAddress" ADD CONSTRAINT "StorageAddress_storageId_fkey" FOREIGN KEY ("storageId") REFERENCES "Storage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductStorageBalance" ADD CONSTRAINT "ProductStorageBalance_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductStorageBalance" ADD CONSTRAINT "ProductStorageBalance_storageAddressId_fkey" FOREIGN KEY ("storageAddressId") REFERENCES "StorageAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInventory" ADD CONSTRAINT "ProductInventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInventory" ADD CONSTRAINT "ProductInventory_storageAddressId_fkey" FOREIGN KEY ("storageAddressId") REFERENCES "StorageAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockRequestItem" ADD CONSTRAINT "StockRequestItem_stockRequestId_fkey" FOREIGN KEY ("stockRequestId") REFERENCES "StockRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockRequestItem" ADD CONSTRAINT "StockRequestItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockRequestItem" ADD CONSTRAINT "StockRequestItem_storageAddressId_fkey" FOREIGN KEY ("storageAddressId") REFERENCES "StorageAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddressTransfer" ADD CONSTRAINT "AddressTransfer_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddressTransfer" ADD CONSTRAINT "AddressTransfer_fromAddressId_fkey" FOREIGN KEY ("fromAddressId") REFERENCES "StorageAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddressTransfer" ADD CONSTRAINT "AddressTransfer_toAddressId_fkey" FOREIGN KEY ("toAddressId") REFERENCES "StorageAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeparationOrderItem" ADD CONSTRAINT "SeparationOrderItem_separationOrderId_fkey" FOREIGN KEY ("separationOrderId") REFERENCES "SeparationOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeparationOrderItem" ADD CONSTRAINT "SeparationOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeparationOrderItem" ADD CONSTRAINT "SeparationOrderItem_storageAddressId_fkey" FOREIGN KEY ("storageAddressId") REFERENCES "StorageAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
