-- This is an empty migration.
ALTER TABLE "movie" ADD COLUMN     "priceCents" INTEGER;
UPDATE "movie" SET "priceCents" = ROUND("price" * 100);
ALTER TABLE "movie" DROP COLUMN "price";
ALTER TABLE "movie" RENAME COLUMN "priceCents" TO "price";
ALTER TABLE "movie" ALTER COLUMN "price" SET NOT NULL;