-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';
