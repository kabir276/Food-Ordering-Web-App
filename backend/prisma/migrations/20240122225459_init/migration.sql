/*
  Warnings:

  - Changed the type of `phonenumber` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "phonenumber",
ADD COLUMN     "phonenumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_phonenumber_key" ON "User"("phonenumber");
