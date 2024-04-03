-- CreateTable
CREATE TABLE "ReceiptBill" (
    "id" SERIAL NOT NULL,
    "totalPayment" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReceiptBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceiptBillDetail" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "receiptBillId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "ReceiptBillDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReceiptBill" ADD CONSTRAINT "ReceiptBill_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptBillDetail" ADD CONSTRAINT "ReceiptBillDetail_receiptBillId_fkey" FOREIGN KEY ("receiptBillId") REFERENCES "ReceiptBill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
