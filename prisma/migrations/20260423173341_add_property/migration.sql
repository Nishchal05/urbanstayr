-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'client',
    "subscription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sector" TEXT,
    "area" TEXT,
    "street" TEXT,
    "phone" TEXT,
    "location" TEXT,
    "singleAC" BOOLEAN NOT NULL DEFAULT false,
    "singleCooler" BOOLEAN NOT NULL DEFAULT false,
    "singleTable" BOOLEAN NOT NULL DEFAULT false,
    "doubleAC" BOOLEAN NOT NULL DEFAULT false,
    "doubleCooler" BOOLEAN NOT NULL DEFAULT false,
    "doubleTable" BOOLEAN NOT NULL DEFAULT false,
    "tripleAC" BOOLEAN NOT NULL DEFAULT false,
    "tripleCooler" BOOLEAN NOT NULL DEFAULT false,
    "tripleTable" BOOLEAN NOT NULL DEFAULT false,
    "tripleFan" BOOLEAN NOT NULL DEFAULT false,
    "attachedWashroom" BOOLEAN NOT NULL DEFAULT false,
    "sharingWashroom" TEXT,
    "breakfast" BOOLEAN NOT NULL DEFAULT false,
    "lunch" BOOLEAN NOT NULL DEFAULT false,
    "dinner" BOOLEAN NOT NULL DEFAULT false,
    "menu" JSONB,
    "housekeeping" BOOLEAN NOT NULL DEFAULT false,
    "washingMachine" BOOLEAN NOT NULL DEFAULT false,
    "parking" BOOLEAN NOT NULL DEFAULT false,
    "kitchen" BOOLEAN NOT NULL DEFAULT false,
    "photoRooms" JSONB,
    "photoWashroom" TEXT,
    "photoKitchen" TEXT,
    "photoProperty" TEXT,
    "photoWashing" TEXT,
    "photoParking" TEXT,
    "photoDining" TEXT,
    "photoTerrace" TEXT,
    "rent" INTEGER NOT NULL,
    "electricity" INTEGER NOT NULL,
    "propertyType" TEXT NOT NULL,
    "listingType" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
