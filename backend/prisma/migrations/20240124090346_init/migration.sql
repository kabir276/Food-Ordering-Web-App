/*
  Warnings:

  - You are about to drop the column `ItemId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `productName` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'Dispached';

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_ItemId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "ItemId",
ADD COLUMN     "productName" TEXT NOT NULL;
