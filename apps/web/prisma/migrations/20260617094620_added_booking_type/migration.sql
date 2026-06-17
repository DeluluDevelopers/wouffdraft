/*
  Warnings:

  - Added the required column `service` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Service" AS ENUM ('Bathing', 'Cutting', 'Hygiene');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "service" "Service" NOT NULL;
