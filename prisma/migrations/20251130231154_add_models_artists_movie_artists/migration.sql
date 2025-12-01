-- CreateEnum
CREATE TYPE "ArtistRole" AS ENUM ('ACTOR', 'DIRECTOR');

-- CreateTable
CREATE TABLE "artist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movie_artist" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "role" "ArtistRole" NOT NULL,
    "billingOrder" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movie_artist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "movie_artist_movieId_idx" ON "movie_artist"("movieId");

-- CreateIndex
CREATE INDEX "movie_artist_artistId_idx" ON "movie_artist"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "movie_artist_movieId_artistId_role_key" ON "movie_artist"("movieId", "artistId", "role");

-- AddForeignKey
ALTER TABLE "movie_artist" ADD CONSTRAINT "movie_artist_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_artist" ADD CONSTRAINT "movie_artist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
