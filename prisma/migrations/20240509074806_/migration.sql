/*
  Warnings:

  - The primary key for the `BookAuthor` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "BookAuthor" DROP CONSTRAINT "BookAuthor_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "BookAuthor_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "BookAuthor_bookId_authorId_idx" ON "BookAuthor"("bookId", "authorId");
