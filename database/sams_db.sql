-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 06, 2024 at 08:03 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sams_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `acc_tb`
--

CREATE TABLE `acc_tb` (
  `u_id` int(11) NOT NULL,
  `u_fullname` varchar(50) DEFAULT NULL,
  `u_role` enum('student','teacher','admin','parent') DEFAULT NULL,
  `u_department` varchar(50) DEFAULT NULL,
  `u_year` varchar(50) DEFAULT NULL,
  `u_email` varchar(50) DEFAULT NULL,
  `u_contact` varchar(50) DEFAULT NULL,
  `u_address` varchar(50) DEFAULT NULL,
  `u_password` varchar(250) DEFAULT NULL,
  `u_qr` varchar(50) DEFAULT NULL,
  `u_profile` varchar(50) DEFAULT NULL,
  `u_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `acc_tb`
--

INSERT INTO `acc_tb` (`u_id`, `u_fullname`, `u_role`, `u_department`, `u_year`, `u_email`, `u_contact`, `u_address`, `u_password`, `u_qr`, `u_profile`, `u_date`) VALUES
(35, 'potangimao', 'student', 'fdfd', 'fddf', 'nganoka@gmail.com', 'asda', 'fddfsfd', '1', 'qr-35-1733335380302.png', 'profile-1733335380326-325499860.PNG', NULL),
(36, '1', 'student', '1', '1', '1@gmail.com', '1', '1', '1', 'qr-36-1733381672421.png', 'default.jpg', NULL),
(37, '2', 'student', '2', '2', '2@gmail.com', '2', '2', '2', 'qr-37-1733381710734.png', 'profile-1733381710751-815244088.jpg', NULL),
(38, '3', 'admin', '3', '3', 'yawaka@gmail.com', '3', '3', '3', 'qr-38-1733384262222.png', 'profile-1733384262246-529895923.PNG', NULL),
(39, 'yawa', 'student', 'yawa', 'yawa', 'yawaka@gmail.com', 'yawa', 'yawa', 'yawa', 'qr-39-1733410375872.png', 'profile-1733410375897-562622866.PNG', NULL),
(40, 'atay', 'teacher', 'atay', 'atay', 'yawaka@gmail.com', 'atay', 'atay', 'atay', 'qr-40-1733410622065.png', 'profile-1733410622088-530238255.PNG', '2024-12-05'),
(41, 'bago', 'student', 'bago', 'bago', 'bago@gmail.com', 'bago', 'bago', 'bago', 'qr-41-1733413717218.png', 'profile-1733413717239-371271114.PNG', '2024-12-05'),
(42, 'natoy', 'student', 'natoy', 'natoy', 'natoy@gmail.com', 'natoy', 'natoy', 'natoy', 'qr-42-1733416589546.png', 'profile-1733416589567-336569405.PNG', '2024-12-05');

-- --------------------------------------------------------

--
-- Table structure for table `announcement_attachments`
--

CREATE TABLE `announcement_attachments` (
  `att_id` int(11) NOT NULL,
  `am_id` int(11) NOT NULL,
  `att_filePath` varchar(50) NOT NULL,
  `att_fileName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcement_attachments`
--

INSERT INTO `announcement_attachments` (`att_id`, `am_id`, `att_filePath`, `att_fileName`) VALUES
(2, 6, '1733451042449-273099087.txt', 'EventCard.tsx.txt'),
(3, 8, '1733451814630-960965793.PNG', '2.PNG');

-- --------------------------------------------------------

--
-- Table structure for table `announcement_tb`
--

CREATE TABLE `announcement_tb` (
  `am_id` int(11) NOT NULL,
  `am_title` varchar(50) NOT NULL,
  `am_desc` varchar(50) NOT NULL,
  `am_date` varchar(50) NOT NULL,
  `am_department` varchar(50) NOT NULL,
  `am_react` int(50) NOT NULL,
  `am_avatar` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcement_tb`
--

INSERT INTO `announcement_tb` (`am_id`, `am_title`, `am_desc`, `am_date`, `am_department`, `am_react`, `am_avatar`) VALUES
(5, 'asdasd', 'asdasdad', 'December 06', 'REGISTRAR OFFICE', 0, 'default-avatar.png'),
(6, 'asdasd', 'asdasd', 'December 06', 'REGISTRAR OFFICE', 0, 'default-avatar.png'),
(7, 'New Announcement', 'NATAY KA', 'December 06', 'SAO OFFICE', 0, 'default-avatar.png'),
(8, 'List of Deans', 'kayaasa binoang maning imo bai', 'December 06', 'GUIDANCE OFFICE', 0, 'default-avatar.png'),
(9, 'BAGO NI', 'BAGO NI', 'December 06', 'SAO OFFICE', 0, 'default-avatar.png'),
(10, 'asdasda', 'asdasdasd', 'December 06', 'GUIDANCE OFFICE', 1, 'default-avatar.png');

-- --------------------------------------------------------

--
-- Table structure for table `attendance_tb`
--

CREATE TABLE `attendance_tb` (
  `a_id` int(11) NOT NULL,
  `u_id` int(50) NOT NULL,
  `a_total` int(50) DEFAULT NULL,
  `a_late` int(50) DEFAULT NULL,
  `a_absent` int(50) DEFAULT NULL,
  `a_predicate` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance_tb`
--

INSERT INTO `attendance_tb` (`a_id`, `u_id`, `a_total`, `a_late`, `a_absent`, `a_predicate`) VALUES
(1, 39, 100, 0, 0, 'New Students'),
(2, 40, 2001, 0, 0, 'New Student'),
(3, 41, 2002, 0, 0, 'New Student'),
(4, 42, 0, 0, 0, 'New Student');

-- --------------------------------------------------------

--
-- Table structure for table `events_tb`
--

CREATE TABLE `events_tb` (
  `e_id` int(11) NOT NULL,
  `e_title` varchar(50) DEFAULT NULL,
  `e_status` enum('Ongoing','Upcoming','Done') DEFAULT NULL,
  `e_avatar` varchar(50) DEFAULT NULL,
  `e_type` enum('Academic','Sports','Cultural') DEFAULT NULL,
  `e_location` varchar(50) DEFAULT NULL,
  `e_startDate` varchar(50) DEFAULT NULL,
  `e_endDate` varchar(50) DEFAULT NULL,
  `e_startTime` varchar(50) DEFAULT NULL,
  `e_endTime` varchar(50) DEFAULT NULL,
  `e_department` varchar(50) DEFAULT NULL,
  `e_organizer` varchar(50) DEFAULT NULL,
  `e_description` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events_tb`
--

INSERT INTO `events_tb` (`e_id`, `e_title`, `e_status`, `e_avatar`, `e_type`, `e_location`, `e_startDate`, `e_endDate`, `e_startTime`, `e_endTime`, `e_department`, `e_organizer`, `e_description`) VALUES
(1, 'Event Name', 'Upcoming', 'Avatar', 'Sports', 'Location', '2024-12-12', '2024-12-12', '00:12', '00:12', 'Department', 'Organizer', 'Decro[tion'),
(2, 'FOSTER OCTAGON', 'Upcoming', 'https://api.dicebear.com/7.x/shapes/svg?seed=acade', 'Academic', 'BED COMLAB 4TH FLOOR', '2024-12-12', '2024-12-12', '10:30', '12:00', 'ALL', 'Mike BUstamante', 'Help me ill help you madapakers'),
(3, 'asd2121', 'Done', 'https://api.dicebear.com/7.x/shapes/svg?seed=cultu', 'Cultural', '1221', '2024-12-12', '2024-12-12', '12:12', '12:12', 'fsdaafdasfd', 'sdfasfad', 'asdasdasddsfdfsdafsadf');

-- --------------------------------------------------------

--
-- Table structure for table `meeting_tb`
--

CREATE TABLE `meeting_tb` (
  `mt_id` int(11) NOT NULL,
  `u_id` int(11) NOT NULL,
  `mt_status` enum('Pending','Approved','Done') NOT NULL,
  `mt_title` varchar(50) NOT NULL,
  `mt_description` varchar(50) NOT NULL,
  `mt_date` varchar(50) NOT NULL,
  `mt_time` varchar(50) NOT NULL,
  `mt_avatarURL` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notes_tb`
--

CREATE TABLE `notes_tb` (
  `n_id` int(11) NOT NULL,
  `u_id` int(11) NOT NULL,
  `n_totalTask` int(50) NOT NULL,
  `n_ongoing` int(50) NOT NULL,
  `n_withDeadline` int(50) NOT NULL,
  `n_completed` int(50) NOT NULL,
  `n_title` varchar(50) NOT NULL,
  `n_description` varchar(50) NOT NULL,
  `n_hasDeadline` varchar(50) NOT NULL,
  `n_image` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teacher_tb`
--

CREATE TABLE `teacher_tb` (
  `t_id` int(11) NOT NULL,
  `u_id` int(11) NOT NULL,
  `t_subject` varchar(50) DEFAULT NULL,
  `t_sectionName` varchar(50) DEFAULT NULL,
  `t_schedule` varchar(50) DEFAULT NULL,
  `t_excelURL` varchar(250) DEFAULT NULL,
  `t_attendanceURL` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `acc_tb`
--
ALTER TABLE `acc_tb`
  ADD PRIMARY KEY (`u_id`);

--
-- Indexes for table `announcement_attachments`
--
ALTER TABLE `announcement_attachments`
  ADD PRIMARY KEY (`att_id`);

--
-- Indexes for table `announcement_tb`
--
ALTER TABLE `announcement_tb`
  ADD PRIMARY KEY (`am_id`);

--
-- Indexes for table `attendance_tb`
--
ALTER TABLE `attendance_tb`
  ADD PRIMARY KEY (`a_id`);

--
-- Indexes for table `events_tb`
--
ALTER TABLE `events_tb`
  ADD PRIMARY KEY (`e_id`);

--
-- Indexes for table `meeting_tb`
--
ALTER TABLE `meeting_tb`
  ADD PRIMARY KEY (`mt_id`);

--
-- Indexes for table `notes_tb`
--
ALTER TABLE `notes_tb`
  ADD PRIMARY KEY (`n_id`);

--
-- Indexes for table `teacher_tb`
--
ALTER TABLE `teacher_tb`
  ADD PRIMARY KEY (`t_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `acc_tb`
--
ALTER TABLE `acc_tb`
  MODIFY `u_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `announcement_attachments`
--
ALTER TABLE `announcement_attachments`
  MODIFY `att_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `announcement_tb`
--
ALTER TABLE `announcement_tb`
  MODIFY `am_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `attendance_tb`
--
ALTER TABLE `attendance_tb`
  MODIFY `a_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `events_tb`
--
ALTER TABLE `events_tb`
  MODIFY `e_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `meeting_tb`
--
ALTER TABLE `meeting_tb`
  MODIFY `mt_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notes_tb`
--
ALTER TABLE `notes_tb`
  MODIFY `n_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teacher_tb`
--
ALTER TABLE `teacher_tb`
  MODIFY `t_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
