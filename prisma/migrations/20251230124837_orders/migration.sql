/*
  Warnings:

  - You are about to alter the column `totalAmount` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - A unique constraint covering the columns `[deliveryAddressId]` on the table `order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[billingAddressId]` on the table `order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `billingAddressId` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryAddressId` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "billingAddressId" TEXT NOT NULL,
ADD COLUMN     "deliveryAddressId" TEXT NOT NULL,
ADD COLUMN     "email" TEXT,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "totalAmount" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "order_deliveryAddressId_key" ON "order"("deliveryAddressId");

-- CreateIndex
CREATE UNIQUE INDEX "order_billingAddressId_key" ON "order"("billingAddressId");

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_deliveryAddressId_fkey" FOREIGN KEY ("deliveryAddressId") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_billingAddressId_fkey" FOREIGN KEY ("billingAddressId") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
