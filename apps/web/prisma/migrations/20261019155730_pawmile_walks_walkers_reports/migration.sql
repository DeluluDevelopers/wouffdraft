-- CreateEnum
CREATE TYPE "VisitMood" AS ENUM ('Happy', 'Calm', 'Energetic', 'Anxious');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('NEW', 'SHORTLISTED', 'ONBOARDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "EnquiryTopic" AS ENUM ('General', 'Booking', 'Partnership', 'Press', 'CityWaitlist');

-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'RESOLVED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Service" ADD VALUE 'Walk';
ALTER TYPE "Service" ADD VALUE 'HomeVisit';
ALTER TYPE "Service" ADD VALUE 'PetSitting';

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "walkerId" TEXT;

-- AlterTable
ALTER TABLE "BookingGroup" ADD COLUMN     "discountInRupees" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Walker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "area" TEXT,
    "bio" TEXT,
    "photoUrl" TEXT,
    "yearsExperience" INTEGER NOT NULL DEFAULT 0,
    "languages" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Walker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitReport" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "distanceMeters" INTEGER,
    "pee" BOOLEAN NOT NULL DEFAULT false,
    "poo" BOOLEAN NOT NULL DEFAULT false,
    "water" BOOLEAN NOT NULL DEFAULT false,
    "fed" BOOLEAN NOT NULL DEFAULT false,
    "mood" "VisitMood" NOT NULL DEFAULT 'Happy',
    "note" TEXT NOT NULL,
    "photoUrl" TEXT,
    "route" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walkerId" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalkerApplication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "availability" TEXT[],
    "hasOwnPet" BOOLEAN NOT NULL DEFAULT false,
    "about" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalkerApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "topic" "EnquiryTopic" NOT NULL DEFAULT 'General',
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "city" TEXT,
    "message" TEXT,
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Walker_phoneNumber_key" ON "Walker"("phoneNumber");

-- CreateIndex
CREATE INDEX "Walker_city_idx" ON "Walker"("city");

-- CreateIndex
CREATE UNIQUE INDEX "VisitReport_bookingId_key" ON "VisitReport"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_bookingId_key" ON "Review"("bookingId");

-- CreateIndex
CREATE INDEX "Review_walkerId_idx" ON "Review"("walkerId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "WalkerApplication_status_idx" ON "WalkerApplication"("status");

-- CreateIndex
CREATE INDEX "Enquiry_status_idx" ON "Enquiry"("status");

-- CreateIndex
CREATE INDEX "Enquiry_topic_idx" ON "Enquiry"("topic");

-- CreateIndex
CREATE INDEX "Booking_walkerId_idx" ON "Booking"("walkerId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_walkerId_fkey" FOREIGN KEY ("walkerId") REFERENCES "Walker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitReport" ADD CONSTRAINT "VisitReport_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_walkerId_fkey" FOREIGN KEY ("walkerId") REFERENCES "Walker"("id") ON DELETE SET NULL ON UPDATE CASCADE;
