-- AlterTable
ALTER TABLE "movie" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;
