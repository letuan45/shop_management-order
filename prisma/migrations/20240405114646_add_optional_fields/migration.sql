-- DropForeignKey
ALTER TABLE "SellingOrder" DROP CONSTRAINT "SellingOrder_customerId_fkey";

-- AlterTable
ALTER TABLE "SellingOrder" ALTER COLUMN "customerId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "SellingBill" (
    "id" SERIAL NOT NULL,
    "totalPayment" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "customerId" INTEGER,
    "customerPayment" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellingBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellingBillDetail" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "sellingBillId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "SellingBillDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SellingOrder" ADD CONSTRAINT "SellingOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellingBill" ADD CONSTRAINT "SellingBill_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellingBillDetail" ADD CONSTRAINT "SellingBillDetail_sellingBillId_fkey" FOREIGN KEY ("sellingBillId") REFERENCES "SellingBill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
