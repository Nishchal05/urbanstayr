/*
  Warnings:

  - You are about to drop the column `attachedWashroom` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `doubleAC` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `doubleCooler` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `doubleTable` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `singleAC` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `singleCooler` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `singleTable` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `tripleAC` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `tripleCooler` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `tripleFan` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `tripleTable` on the `Property` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_userId_fkey";

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "attachedWashroom",
DROP COLUMN "doubleAC",
DROP COLUMN "doubleCooler",
DROP COLUMN "doubleTable",
DROP COLUMN "singleAC",
DROP COLUMN "singleCooler",
DROP COLUMN "singleTable",
DROP COLUMN "tripleAC",
DROP COLUMN "tripleCooler",
DROP COLUMN "tripleFan",
DROP COLUMN "tripleTable",
ADD COLUMN     "ac" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "attachedBathroom" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "boostEndsAt" TIMESTAMP(3),
ADD COLUMN     "boostMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
ADD COLUMN     "boostStartedAt" TIMESTAMP(3),
ADD COLUMN     "boostedSeoScore" INTEGER,
ADD COLUMN     "chair" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "clickCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "cooler" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "impressionCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isBoosted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastClickedAt" TIMESTAMP(3),
ADD COLUMN     "lastImpressionAt" TIMESTAMP(3),
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "seoLastUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "seoScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "table" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verifiedBy" TEXT DEFAULT '',
ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "Employ" (
    "employid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "personalEmail" TEXT NOT NULL,
    "companyEmail" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employ_pkey" PRIMARY KEY ("employid")
);

-- CreateTable
CREATE TABLE "Access" (
    "id" TEXT NOT NULL,
    "Employaccess" BOOLEAN NOT NULL DEFAULT false,
    "accessEmployee" BOOLEAN NOT NULL DEFAULT false,
    "propertyVerification" BOOLEAN NOT NULL DEFAULT false,
    "accountVerification" BOOLEAN NOT NULL DEFAULT false,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "Access_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employ_personalEmail_key" ON "Employ"("personalEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Employ_companyEmail_key" ON "Employ"("companyEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Access_employeeId_key" ON "Access"("employeeId");

-- CreateIndex
CREATE INDEX "Property_latitude_longitude_idx" ON "Property"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "Property_seoScore_idx" ON "Property"("seoScore");

-- CreateIndex
CREATE INDEX "Property_boostEndsAt_idx" ON "Property"("boostEndsAt");

-- CreateIndex
CREATE INDEX "Property_seoLastUpdatedAt_idx" ON "Property"("seoLastUpdatedAt");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Access" ADD CONSTRAINT "Access_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employ"("employid") ON DELETE RESTRICT ON UPDATE CASCADE;
