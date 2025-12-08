-- DropForeignKey
ALTER TABLE "movie" DROP CONSTRAINT "movie_createdById_fkey";

-- DropIndex
DROP INDEX "movie_createdById_idx";

-- AlterTable
ALTER TABLE "artist" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "genre" ADD COLUMN     "createdById" TEXT;




-- AddForeignKey
ALTER TABLE "genre" ADD CONSTRAINT "genre_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie" ADD CONSTRAINT "movie_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist" ADD CONSTRAINT "artist_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
