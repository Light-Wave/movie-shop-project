/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `user_data` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_data_userId_key" ON "user_data"("userId");
