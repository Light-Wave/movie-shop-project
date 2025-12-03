/*
  Warnings:

  - Added the required column `createdById` to the `movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movie" ADD COLUMN     "createdById" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "movie_createdById_idx" ON "movie"("createdById");

-- AddForeignKey
ALTER TABLE "movie" ADD CONSTRAINT "movie_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
