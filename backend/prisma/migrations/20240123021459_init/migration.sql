-- CreateTable
CREATE TABLE "otp" (
    "phonenumber" INTEGER NOT NULL,
    "code" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "otp_phonenumber_key" ON "otp"("phonenumber");

-- CreateIndex
CREATE UNIQUE INDEX "otp_code_key" ON "otp"("code");
