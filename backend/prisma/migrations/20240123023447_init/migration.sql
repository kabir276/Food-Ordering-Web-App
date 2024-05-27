-- AlterTable
ALTER TABLE "otp" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "otp_pkey" PRIMARY KEY ("id");
