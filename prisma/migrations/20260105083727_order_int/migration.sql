/*
  Warnings:

  - You are about to alter the column `priceAtPurchase` on the `order_item` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "order_item" ALTER COLUMN "priceAtPurchase" SET DATA TYPE INTEGER;
