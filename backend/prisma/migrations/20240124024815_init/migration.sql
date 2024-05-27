/*
  Warnings:

  - A unique constraint covering the columns `[phonenumber]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Otp_phonenumber_key" ON "Otp"("phonenumber");
