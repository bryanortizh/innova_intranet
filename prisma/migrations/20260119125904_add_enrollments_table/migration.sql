/*
  Warnings:

  - You are about to drop the column `courseId` on the `students_intra` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `students_intra` DROP FOREIGN KEY `students_intra_courseId_fkey`;

-- DropIndex
DROP INDEX `students_intra_courseId_idx` ON `students_intra`;

-- AlterTable
ALTER TABLE `students_intra` DROP COLUMN `courseId`;

-- CreateTable
CREATE TABLE `enrollments_intra` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `courseId` INTEGER NOT NULL,
    `estado` VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `enrollments_intra_studentId_idx`(`studentId`),
    INDEX `enrollments_intra_courseId_idx`(`courseId`),
    UNIQUE INDEX `enrollments_intra_studentId_courseId_key`(`studentId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `enrollments_intra` ADD CONSTRAINT `enrollments_intra_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students_intra`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enrollments_intra` ADD CONSTRAINT `enrollments_intra_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses_intra`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
