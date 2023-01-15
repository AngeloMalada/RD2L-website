/*
  Warnings:

  - The primary key for the `division` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `division` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `signup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `signup` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `team` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `divisionId` on the `team` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `example` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `team` DROP FOREIGN KEY `team_divisionId_fkey`;

-- AlterTable
ALTER TABLE `division` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `signup` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `team` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `divisionId` INTEGER NOT NULL DEFAULT 1,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` MODIFY `dotabuff` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `example`;

-- AddForeignKey
ALTER TABLE `team` ADD CONSTRAINT `team_divisionId_fkey` FOREIGN KEY (`divisionId`) REFERENCES `division`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
