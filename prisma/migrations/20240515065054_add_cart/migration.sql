-- CreateTable
CREATE TABLE "CartDetail" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "CartDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CartDetail" ADD CONSTRAINT "CartDetail_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartDetail" ADD CONSTRAINT "CartDetail_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
