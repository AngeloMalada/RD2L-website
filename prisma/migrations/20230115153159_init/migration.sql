/*
  Warnings:

  - A unique constraint covering the columns `[captainId]` on the table `team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `team_captainId_key` ON `team`(`captainId`);
