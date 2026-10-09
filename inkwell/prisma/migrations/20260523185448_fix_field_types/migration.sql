/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Genre` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Status` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Trope` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Genre" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Status" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Trope" ALTER COLUMN "description" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Status_name_key" ON "Status"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Trope_name_key" ON "Trope"("name");
