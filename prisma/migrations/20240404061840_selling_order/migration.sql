-- CreateTable
CREATE TABLE "SellingOrder" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellingOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellingOrderDetail" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "sellingOrderId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "SellingOrderDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SellingOrder" ADD CONSTRAINT "SellingOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellingOrderDetail" ADD CONSTRAINT "SellingOrderDetail_sellingOrderId_fkey" FOREIGN KEY ("sellingOrderId") REFERENCES "SellingOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
