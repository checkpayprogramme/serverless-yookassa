/*
  Warnings:

  - Added the required column `description` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "description" STRING NOT NULL;
ALTER TABLE "Order" ADD COLUMN     "name" STRING NOT NULL;
ALTER TABLE "Order" ADD COLUMN     "quantity" FLOAT8 NOT NULL;
