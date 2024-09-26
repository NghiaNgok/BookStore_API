/*
  Warnings:

  - You are about to drop the column `cartId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_cartId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cartId";
