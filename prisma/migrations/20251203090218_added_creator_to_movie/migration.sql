
 


-- AlterTable
ALTER TABLE "movie" ADD COLUMN     "createdById" TEXT;

-- CreateIndex
CREATE INDEX "movie_createdById_idx" ON "movie"("createdById");

-- AddForeignKey
ALTER TABLE "movie" ADD CONSTRAINT "movie_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
