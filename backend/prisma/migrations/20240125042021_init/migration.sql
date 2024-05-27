/*
  Warnings:

  - Changed the type of `country` on the `Address` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "country" AS ENUM ('india');

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "country",
ADD COLUMN     "country" "country" NOT NULL;
