-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceiptOrder" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReceiptOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceiptOrderDetail" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "receiptOrderId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "ReceiptOrderDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_phone_key" ON "Supplier"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_email_key" ON "Supplier"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ReceiptOrder_employeeId_key" ON "ReceiptOrder"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "ReceiptOrderDetail_productId_key" ON "ReceiptOrderDetail"("productId");

-- AddForeignKey
ALTER TABLE "ReceiptOrder" ADD CONSTRAINT "ReceiptOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptOrderDetail" ADD CONSTRAINT "ReceiptOrderDetail_receiptOrderId_fkey" FOREIGN KEY ("receiptOrderId") REFERENCES "ReceiptOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
