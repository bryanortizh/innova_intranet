-- CreateTable
CREATE TABLE `horarios_intra` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `courseId` INTEGER NOT NULL,
    `cicloId` INTEGER NULL,
    `diaSemana` VARCHAR(20) NOT NULL,
    `horaInicio` VARCHAR(10) NOT NULL,
    `horaFin` VARCHAR(10) NOT NULL,
    `aula` VARCHAR(100) NULL,
    `modalidad` VARCHAR(50) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `horarios_intra_courseId_idx`(`courseId`),
    INDEX `horarios_intra_cicloId_idx`(`cicloId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `horarios_intra` ADD CONSTRAINT `horarios_intra_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses_intra`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `horarios_intra` ADD CONSTRAINT `horarios_intra_cicloId_fkey` FOREIGN KEY (`cicloId`) REFERENCES `ciclos_intra`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
