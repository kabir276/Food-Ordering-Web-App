-- CreateTable
CREATE TABLE "menuItems" (
    "id" SERIAL NOT NULL,
    "item" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "menuItems_pkey" PRIMARY KEY ("id")
);
