/*
  Warnings:

  - You are about to drop the column `accountID` on the `signup` table. All the data in the column will be lost.
  - You are about to drop the column `captain` on the `signup` table. All the data in the column will be lost.
  - You are about to drop the column `dotabuff` on the `signup` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `signup` table. All the data in the column will be lost.
  - You are about to drop the column `captain` on the `team` table. All the data in the column will be lost.
  - Added the required column `userId` to the `signUp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `captainId` to the `team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `signup` DROP COLUMN `accountID`,
    DROP COLUMN `captain`,
    DROP COLUMN `dotabuff`,
    DROP COLUMN `email`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `team` DROP COLUMN `captain`,
    ADD COLUMN `captainId` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ALTER COLUMN `divisionId` DROP DEFAULT;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `teamId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `signUp` ADD CONSTRAINT `signUp_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team` ADD CONSTRAINT `team_captainId_fkey` FOREIGN KEY (`captainId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
