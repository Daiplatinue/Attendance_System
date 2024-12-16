-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 16, 2024 at 08:22 AM
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
  `u_date` date DEFAULT NULL,
  `u_section` varchar(50) DEFAULT NULL,
  `u_studentParentID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `acc_tb`
--

INSERT INTO `acc_tb` (`u_id`, `u_fullname`, `u_role`, `u_department`, `u_year`, `u_email`, `u_contact`, `u_address`, `u_password`, `u_qr`, `u_profile`, `u_date`, `u_section`, `u_studentParentID`) VALUES
(35, 'potangimao', 'student', 'fdfd', 'fddf', 'nganoka@gmail.com', 'asda', 'fddfsfd', '1', 'qr-35-1733335380302.png', 'profile-1733335380326-325499860.PNG', NULL, '', 0),
(36, '1', 'student', '1', '1', '1@gmail.com', '1', '1', '1', 'qr-36-1733381672421.png', 'default.jpg', NULL, '', 0),
(37, '2', 'student', '2', '2', '2@gmail.com', '2', '2', '2', 'qr-37-1733381710734.png', 'profile-1733381710751-815244088.jpg', NULL, '', 0),
(38, '3', 'admin', '3', '3', 'yawaka@gmail.com', '3', '3', '3', 'qr-38-1733384262222.png', 'profile-1733384262246-529895923.PNG', NULL, '', 0),
(39, 'yawa', 'student', 'yawa', 'yawa', 'yawaka@gmail.com', 'yawa', 'yawa', 'yawa', 'qr-39-1733410375872.png', 'profile-1733410375897-562622866.PNG', NULL, '', 0),
(40, 'atay', 'teacher', 'atay', 'atay', 'yawaka@gmail.com', 'atay', 'atay', 'atay', 'qr-40-1733410622065.png', 'profile-1733410622088-530238255.PNG', '2024-12-05', 'B', 0),
(41, 'bago', 'student', 'bago', 'bago', 'bago@gmail.com', 'bago', 'bago', 'bago', 'qr-41-1733413717218.png', 'profile-1733413717239-371271114.PNG', '2024-12-05', 'C', 56),
(42, 'natoy', 'student', 'natoy', 'natoy', 'natoy@gmail.com', 'natoy', 'natoy', 'natoy', 'qr-42-1733416589546.png', 'profile-1733416589567-336569405.PNG', '2024-12-05', '', 0),
(43, '123', 'parent', '123', '1123', '123@gmail.com', '123', '123', '123', 'qr-43-1734025687186.png', 'profile-1734025687283-120480948.png', '2024-12-12', '123', 0),
(44, 'FULLNAME', 'parent', 'DEPARTMENT', 'YEAR', 'EMAIL@GMAIL.COM', '6395605705454', 'ADDRESS', 'PASSWORD', 'qr-44-1734275431643.png', 'profile-1734275431743-690640386.png', '2024-12-15', 'SECTION', 0),
(45, 'ddd', 'student', 'ddd', 'ddd', 'ddd@gmail.com', 'ddd', 'ddd', 'ddd', 'qr-45-1734296366578.png', 'profile-1734296366599-298802682.png', '2024-12-15', 'ddd', 0),
(55, 'asd', 'parent', 'asd', 'asd', '1@gmail.com', 'asd', 'asd', 'asd', 'qr-55-1734306730939.png', 'profile-1734306730963-809233048.png', '2024-12-15', 'asd', 0),
(56, '123', 'parent', '123', '123', 'potanigamoka@gmail.com', 'psiteka', '123', '123', 'qr-56-1734314075844.png', 'profile-1734314075866-62438578.png', '2024-12-16', '123', 41);

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
(1, 39, 3000, 0, 0, 'New Students'),
(2, 40, 2100, 100, 0, 'New Student'),
(3, 41, 2005, 0, 2, 'New Student'),
(4, 42, 5000, 0, 0, 'New Student'),
(5, 43, 0, 0, 0, 'New Student'),
(6, 44, 0, 0, 0, 'New Student'),
(7, 45, 0, 0, 0, 'New Student'),
(8, 55, 0, 0, 0, 'New Student');

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
(3, 'asd2121', 'Done', 'https://api.dicebear.com/7.x/shapes/svg?seed=cultu', 'Cultural', '1221', '2024-12-12', '2024-12-12', '12:12', '12:12', 'fsdaafdasfd', 'sdfasfad', 'asdasdasddsfdfsdafsadf'),
(4, 'asd', 'Upcoming', 'https://api.dicebear.com/7.x/shapes/svg?seed=sport', 'Sports', 'asd', '2024-12-12', '2024-12-12', '00:12', '00:12', '12', '12', '12'),
(5, '12', 'Upcoming', 'https://api.dicebear.com/7.x/shapes/svg?seed=cultu', 'Cultural', '12', '2024-12-12', '2024-12-12', '00:12', '00:12', 'asd', 'asd', 'Annual sports competition between departments feat'),
(6, 'asdasd', 'Upcoming', 'https://www.cleveland.com/resizer/v2/https%3A%2F%2', 'Cultural', 'asd', '2024-12-12', '2024-12-12', '00:12', '00:12', 'IT.BSIT', '213213213', '213231231321321'),
(7, 'asd', 'Upcoming', 'https://marvel-b1-cdn.bc0a.com/f00000000100045/www', 'Sports', 'asd', '2024-12-12', '2024-12-12', '02:11', '00:21', '123123123123', '123123', 'asdasd'),
(8, 'adasd', 'Upcoming', 'https://marvel-b1-cdn.bc0a.com/f00000000100045/www', 'Academic', 'asdasd', '2024-12-12', '2024-12-12', '00:12', '12:21', '213123', '12312', 'sa'),
(9, 'asd', 'Upcoming', 'https://i.ytimg.com/vi/nAqn0_NSU5o/maxresdefault.j', 'Academic', 'asd', '2024-12-12', '2024-12-12', '00:21', '02:13', '123', '123', '123'),
(10, 'asd', 'Upcoming', 'https://i.ytimg.com/vi/nAqn0_NSU5o/maxresdefault.j', 'Academic', 'asdasd', '2024-12-12', '2024-12-12', '00:12', '02:12', '123123', '12312', 'asd');

-- --------------------------------------------------------

--
-- Table structure for table `meeting_tb`
--

CREATE TABLE `meeting_tb` (
  `mt_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `mt_status` enum('Pending','Approved','Done') NOT NULL,
  `mt_title` varchar(50) NOT NULL,
  `mt_description` varchar(50) NOT NULL,
  `mt_date` varchar(50) NOT NULL,
  `mt_time` varchar(50) NOT NULL,
  `mt_avatarURL` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meeting_tb`
--

INSERT INTO `meeting_tb` (`mt_id`, `teacher_id`, `student_id`, `parent_id`, `mt_status`, `mt_title`, `mt_description`, `mt_date`, `mt_time`, `mt_avatarURL`) VALUES
(1, 39, 0, 0, 'Pending', 'Dina mo skwela', 'yawa nalng jd ani', '2024-12-12', '10:30', ''),
(2, 39, 0, 0, 'Pending', 'sub', 'desc', '2024-12-12', '10:30', ''),
(3, 36, 0, 0, 'Pending', 'asd', 'a', '2024-12-12', '00:12', ''),
(4, 39, 0, 0, 'Pending', 'asdasd', 'de', '2024-12-12', '22:10', ''),
(5, 0, 0, 0, 'Pending', 'asd', 'desc', '2024-12-12', '00:12', ''),
(6, 36, 0, 0, 'Pending', 'asd', '1', '2024-12-12', '11:11', ''),
(7, 39, 0, 0, 'Pending', 'dfgdfg', 'a', '2024-12-12', '00:12', ''),
(8, 40, 37, 0, 'Pending', 'sub', 'desc', '2024-12-12', '12:12', ''),
(9, 40, 37, 0, 'Pending', 'asd', '122', '2024-12-12', '00:12', ''),
(10, 40, 42, 0, 'Pending', '124', '1212', '2024-12-12', '00:12', ''),
(11, 40, 35, 0, 'Done', 'subject', 'GIATAY', '2024-12-12', '02:02', ''),
(12, 40, 41, 0, 'Approved', '123', 'asd', '2024-12-12', '00:12', ''),
(13, 40, 37, 0, 'Done', 'asd', 'asdasd', '2024-12-12', '00:12', ''),
(14, 40, 39, 0, 'Pending', 'asdasdasdasd', '123123', '2024-12-12', '00:31', '');

-- --------------------------------------------------------

--
-- Table structure for table `notification_tb`
--

CREATE TABLE `notification_tb` (
  `nt_id` int(11) NOT NULL,
  `u_id` int(11) DEFAULT NULL,
  `u_studentParentID` int(11) NOT NULL,
  `nt_description` varchar(50) DEFAULT NULL,
  `ts_clockedIn` int(11) DEFAULT NULL,
  `ts_clockedOut` int(11) DEFAULT NULL,
  `ts_date` int(11) DEFAULT NULL,
  `ts_status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification_tb`
--

INSERT INTO `notification_tb` (`nt_id`, `u_id`, `u_studentParentID`, `nt_description`, `ts_clockedIn`, `ts_clockedOut`, `ts_date`, `ts_status`) VALUES
(1, 41, 56, 'Your student has clocked in to No scheduled class', 1, 0, 1734326340, 4),
(2, 41, 56, 'Your student has clocked in to No scheduled class', 1, 0, 1734326378, 4),
(3, 41, 56, 'Your student has clocked in to No scheduled class', 1, 0, 1734326394, 4),
(4, 41, 56, 'Your student has clocked in to No scheduled class', 1, 0, 1734327017, 4),
(5, 41, 56, 'Your student has clocked in to No scheduled class', 13, NULL, 2024, 4),
(6, 41, 56, 'Your student has clocked in to No scheduled class', 13, NULL, 2024, 4),
(7, 41, 56, 'Your student has clocked in to No scheduled class', 13, NULL, 2024, 4),
(8, 41, 56, 'Your student has clocked in to No scheduled class', 13, NULL, 2024, 4),
(9, 41, 56, 'Your student has clocked in to No scheduled class', 13, NULL, 2024, 4),
(10, 41, 56, 'Your student has clocked in to No scheduled class', 13, NULL, 2024, 4),
(11, 41, 56, 'Your student has clocked in to No scheduled class', 13, NULL, 2024, 4);

-- --------------------------------------------------------

--
-- Table structure for table `schedule_tb`
--

CREATE TABLE `schedule_tb` (
  `sc_id` int(11) NOT NULL,
  `sc_subject` varchar(50) DEFAULT NULL,
  `sc_day` varchar(50) DEFAULT NULL,
  `sc_startTime` varchar(50) DEFAULT NULL,
  `sc_endTime` varchar(50) DEFAULT NULL,
  `u_id` int(11) NOT NULL,
  `sc_section` varchar(50) NOT NULL,
  `sc_room` varchar(50) NOT NULL,
  `sc_createdAt` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schedule_tb`
--

INSERT INTO `schedule_tb` (`sc_id`, `sc_subject`, `sc_day`, `sc_startTime`, `sc_endTime`, `u_id`, `sc_section`, `sc_room`, `sc_createdAt`) VALUES
(1, '123', 'Monday', '00:12', '00:31', 41, '123123', '123', '2024-12-13 01:32:31'),
(2, '123', 'Monday', '12:31', '12:31', 41, '1231', '123', '2024-12-13 01:34:49'),
(3, '123', 'Tuesday', '00:12', '12:12', 41, '1221', '21', '2024-12-13 01:38:07'),
(5, 'this is subject', 'Monday', '10:30', '12:00', 41, 'C', 'Room 1', '2024-12-13 03:08:38'),
(6, 'PT300', 'Friday', '10:30', '11:30', 41, 'C', '4th Floor Comlab', '2024-12-13 03:12:35'),
(7, 'SUBJECT', 'Saturday', '23:23', '12:31', 40, 'C', '305', '2024-12-14 08:52:08'),
(8, 'yawa', 'Wednesday', '00:31', '00:32', 41, 'B', 'asd', '2024-12-14 08:57:43'),
(9, 'new sched', 'Saturday', '08:30', '10:00', 41, 'C', '4th Floor', '2024-12-14 09:08:45'),
(15, 'ARES300', 'Sunday', '18:20', '19:30', 40, 'B', '301', '2024-12-15 18:21:01'),
(17, 'SPADE', 'Sunday', '20:10', '21:00', 40, 'B', '102', '2024-12-15 20:09:46'),
(19, 'JEMS', 'Monday', '12:50', '13:00', 41, 'C', 'test', '2024-12-16 12:50:03');

-- --------------------------------------------------------

--
-- Table structure for table `time_tb`
--

CREATE TABLE `time_tb` (
  `ts_id` int(11) NOT NULL,
  `u_id` int(11) DEFAULT NULL,
  `ts_subject` varchar(50) DEFAULT NULL,
  `ts_clockedIn` varchar(50) DEFAULT NULL,
  `ts_clockedOut` varchar(50) DEFAULT NULL,
  `ts_date` varchar(50) DEFAULT NULL,
  `ts_status` enum('On Time','Late','Very Late','Absent') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `time_tb`
--

INSERT INTO `time_tb` (`ts_id`, `u_id`, `ts_subject`, `ts_clockedIn`, `ts_clockedOut`, `ts_date`, `ts_status`) VALUES
(17, 40, 'No scheduled class', '20:07', '11:56', '12/15/2024, 8:07:23 PM', ''),
(18, 40, 'No scheduled class', '20:07', '12:16', '12/15/2024, 8:07:46 PM', ''),
(19, 40, 'No scheduled class', '20:08', NULL, '12/15/2024, 8:08:45 PM', ''),
(20, 40, 'No scheduled class', '20:09', NULL, '12/15/2024, 8:09:49 PM', ''),
(21, 40, 'SPADE', '20:10', '20:41', '12/15/2024, 8:10:17 PM', 'On Time'),
(22, 40, 'SPADE', '20:15', NULL, '12/15/2024, 8:15:03 PM', 'On Time'),
(23, 40, 'SPADE', '20:31', NULL, '12/15/2024, 8:31:10 PM', 'Very Late'),
(24, 40, 'SPADE', '20:36', NULL, '12/15/2024, 8:36:19 PM', 'Very Late'),
(25, 40, 'SPADE', '20:37', NULL, '12/15/2024, 8:37:47 PM', 'Very Late'),
(26, 41, 'No scheduled class', '21:28', '21:28', '12/15/2024, 9:28:28 PM', ''),
(27, 41, 'No scheduled class', '21:59', '21:59', '12/15/2024, 9:59:07 PM', ''),
(28, 41, 'No scheduled class', '22:00', '12:18', '12/15/2024, 10:00:10 PM', ''),
(29, 36, 'No scheduled class', '12:17', '12:17', '12/16/2024, 12:17:49 PM', ''),
(30, 41, 'No scheduled class', '12:18', '12:22', '12/16/2024, 12:18:47 PM', ''),
(31, 41, 'No scheduled class', '12:22', '12:22', '12/16/2024, 12:22:39 PM', ''),
(32, 41, 'No scheduled class', '12:23', '12:23', '12/16/2024, 12:23:15 PM', ''),
(33, 41, 'No scheduled class', '12:26', '12:26', '12/16/2024, 12:26:03 PM', ''),
(34, 41, 'No scheduled class', '12:26', '12:35', '12/16/2024, 12:26:31 PM', ''),
(35, 41, 'No scheduled class', '12:37', '12:38', '12/16/2024, 12:37:54 PM', 'Absent'),
(36, 41, 'No scheduled class', '12:38', '12:42', '12/16/2024, 12:38:14 PM', 'Absent'),
(37, 41, 'No scheduled class', '12:42', '13:19', '12/16/2024, 12:42:36 PM', 'Absent'),
(38, 41, 'Test', '12:47', '12:48', '12/16/2024, 12:47:38 PM', 'Late'),
(39, 41, 'Test', '12:48', '12:48', '12/16/2024, 12:48:15 PM', 'Late'),
(40, 41, 'Test', '12:48', '12:48', '12/16/2024, 12:48:37 PM', 'Late'),
(41, 41, 'JEMS', '12:50', NULL, '12/16/2024, 12:50:14 PM', 'On Time'),
(42, 41, 'No scheduled class', '13:19', '13:19', '12/16/2024, 1:19:38 PM', 'Absent'),
(43, 41, 'No scheduled class', '13:29', '13:29', '12/16/2024, 1:29:41 PM', 'Absent'),
(44, 41, 'No scheduled class', '13:30', '13:33', '12/16/2024, 1:30:17 PM', 'Absent'),
(45, 41, 'No scheduled class', '13:34', '13:48:48', '12/16/2024, 1:34:11 PM', 'Absent'),
(46, 41, 'No scheduled class', '13:49:09', '13:50', '12/16/2024, 1:49:09 PM', 'Absent'),
(47, 41, 'No scheduled class', '13:56', '13:56', '12/16/2024, 1:56:06 PM', 'Absent');

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
-- Indexes for table `notification_tb`
--
ALTER TABLE `notification_tb`
  ADD PRIMARY KEY (`nt_id`);

--
-- Indexes for table `schedule_tb`
--
ALTER TABLE `schedule_tb`
  ADD PRIMARY KEY (`sc_id`);

--
-- Indexes for table `time_tb`
--
ALTER TABLE `time_tb`
  ADD PRIMARY KEY (`ts_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `acc_tb`
--
ALTER TABLE `acc_tb`
  MODIFY `u_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

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
  MODIFY `a_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `events_tb`
--
ALTER TABLE `events_tb`
  MODIFY `e_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `meeting_tb`
--
ALTER TABLE `meeting_tb`
  MODIFY `mt_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `notification_tb`
--
ALTER TABLE `notification_tb`
  MODIFY `nt_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `schedule_tb`
--
ALTER TABLE `schedule_tb`
  MODIFY `sc_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `time_tb`
--
ALTER TABLE `time_tb`
  MODIFY `ts_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
