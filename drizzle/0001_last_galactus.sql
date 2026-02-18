CREATE TABLE `exam_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` varchar(64) NOT NULL,
	`examName` text NOT NULL,
	`category` varchar(100) NOT NULL,
	`unit` varchar(50) NOT NULL,
	`trend` enum('up','down','stable','insufficient_data') NOT NULL,
	`trendValue` decimal(10,2),
	`interpretation` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `exam_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`examId` varchar(64) NOT NULL,
	`patientId` varchar(64) NOT NULL,
	`name` text NOT NULL,
	`category` varchar(100) NOT NULL,
	`unit` varchar(50) NOT NULL,
	`value` decimal(10,2),
	`valueText` text,
	`status` enum('normal','low','high','critical','unknown') NOT NULL,
	`date` date NOT NULL,
	`referenceMin` decimal(10,2),
	`referenceMax` decimal(10,2),
	`referenceText` text,
	`method` text,
	`sourceFile` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `exams_id` PRIMARY KEY(`id`),
	CONSTRAINT `exams_examId_unique` UNIQUE(`examId`)
);
--> statement-breakpoint
CREATE TABLE `patients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` varchar(64) NOT NULL,
	`name` text NOT NULL,
	`cpf` varchar(14),
	`birthDate` date,
	`age` int,
	`gender` varchar(20),
	`email` varchar(320),
	`phone` varchar(20),
	`avatar` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `patients_id` PRIMARY KEY(`id`),
	CONSTRAINT `patients_patientId_unique` UNIQUE(`patientId`)
);
