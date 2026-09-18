/*
  Warnings:

  - You are about to drop the column `state` on the `pull_request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pull_request" DROP COLUMN "state",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';
