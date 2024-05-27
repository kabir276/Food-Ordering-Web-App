/*
  Warnings:

  - Changed the type of `phonenumber` on the `Otp` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "phonenumber",
ADD COLUMN     "phonenumber" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phonenumber" SET DATA TYPE DOUBLE PRECISION;
