/*
  Warnings:

  - Changed the type of `installationId` on the `pull_request` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "pull_request" DROP COLUMN "installationId",
ADD COLUMN     "installationId" INTEGER NOT NULL;
