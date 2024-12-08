import { AppSidebar } from "@/components/app-sidebar-parent"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { Button } from '@/components/ui/button';
import { ChevronsDown, ChevronsLeftRightEllipsis, ChevronsUp, Download, LayoutGrid, List, Medal, Trophy, Crown, Award } from 'lucide-react'
import { Toaster } from 'sonner';
import { AttendanceRecorder } from '@/sections/componentStyles/AttendanceDialog';

import BadgeWorking from "./componentStyles/Badge-Working";
import BadgePunctual from "./componentStyles/Badge-Punctual";
import BadgeConsistent from "./componentStyles/Badge-Consistent"; 
import BadgeWHonor from "./componentStyles/Badge-WHonor";
import BadgeWHHonor from "./componentStyles/Badge-WHHonor";
import BadgeDeans from "./componentStyles/Badge-Deans";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { UserInfo } from "@/sections/componentStyles/UserInfo";

import av1 from '@/sections/assets/av3.jpg';

interface UserData {
  u_id: number;
  u_fullname: string;
  u_role: string;
  u_department: string;
  u_year: string;
  u_email: string;
  u_contact: string;
  u_address: string;
  u_profile: string;
}

interface LeaderboardPosition {
  rank: number;
  total: number;
}

const attendanceData = [
  { date: 'March 08, 2024', status: 'On Time', checkIn: '08:45', checkOut: '17:10', subject: 'Software Engineering' },
  { date: 'March 07, 2024', status: 'Late', checkIn: '09:15', checkOut: '17:25', subject: 'Database Management' },
  { date: 'March 06, 2024', status: 'On Time', checkIn: '08:30', checkOut: '17:05', subject: 'Web Development' },
  { date: 'March 05, 2024', status: 'Absent', checkIn: '-', checkOut: '-', subject: 'Computer Networks' },
  { date: 'March 04, 2024', status: 'On Time', checkIn: '08:40', checkOut: '17:20', subject: 'Data Structures' },
  { date: 'March 03, 2024', status: 'Late', checkIn: '09:05', checkOut: '17:15', subject: 'Operating Systems' },
  { date: 'March 02, 2024', status: 'On Time', checkIn: '08:50', checkOut: '17:00', subject: 'Software Engineering' },
  { date: 'March 01, 2024', status: 'Absent', checkIn: '-', checkOut: '-', subject: 'Database Management' },
  { date: 'February 29, 2024', status: 'On Time', checkIn: '08:35', checkOut: '17:10', subject: 'Web Development' },
];

export default function Home() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    u_id: 0,
    u_fullname: '',
    u_role: '',
    u_department: '',
    u_year: '',
    u_email: '',
    u_contact: '',
    u_address: '',
    u_profile: ''
  });
  const [leaderboardPosition, setLeaderboardPosition] = useState<LeaderboardPosition>({
    rank: 0,
    total: 0
  });

  const fetchAttendanceSummary = useCallback(async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/auth/attendanceSummary', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        setAttendanceSummary(response.data);
      }
    } catch (err) {
      console.error('Error fetching attendance summary:', err);
    }
  }, []);

  const fetchLeaderboardPosition = useCallback(async (): Promise<void> => {
    if (!userData.u_id) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/leaderboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const leaderboardData = response.data;
        const userIndex = leaderboardData.findIndex((user: any) => user.u_id === userData.u_id);
        setLeaderboardPosition({
          rank: userIndex + 1,
          total: leaderboardData.length
        });
      }
    } catch (err) {
      console.error('Error fetching leaderboard position:', err);
    }
  }, [userData.u_id]);
  
  const [attendanceSummary, setAttendanceSummary] = useState({
    totalAttendance: 0,
    lateClockedIn: 0,
    absent: 0,
    predicate: '',
  });

  const getTrophyDisplay = () => {
    if (leaderboardPosition.rank === 1) {
      return (
        <>
          <Crown className="text-yellow-500" size={80} />
          <p className="mt-2 text-yellow-500 text-center">"Outstanding Achievement!"</p>
        </>
      );
    } else if (leaderboardPosition.rank === 2) {
      return (
        <>
          <Trophy className="text-gray-300" size={80} />
          <p className="mt-2 text-gray-300 text-center">"Excellent Performance!"</p>
        </>
      );
    } else if (leaderboardPosition.rank === 3) {
      return (
        <>
          <Award className="text-amber-600" size={80} />
          <p className="mt-2 text-amber-600 text-center">"Keep Rising, Great Work!"</p>
        </>
      );
    }
    return null;
  };

  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/auth/home', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.status === 201) {
        setUserData(response.data.user);
      } else {
        navigate('/introduction');
      }
    } catch (err) {
      navigate('/introduction');
      console.error(err);
    }
  }, [navigate]);

  const fetchImage = useCallback(async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      await axios.get('http://localhost:3000/auth/fetchProfile', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchUser();
    fetchImage();
    fetchAttendanceSummary();
  }, [fetchUser, fetchImage, fetchAttendanceSummary]);

  useEffect(() => {
    if (userData.u_id) {
      fetchLeaderboardPosition();
    }
  }, [userData.u_id, fetchLeaderboardPosition]);

  return (
    <div>
      <Toaster
        theme="dark"
        position="top-center"
        closeButton
        toastOptions={{
          style: {
            background: '#18181b',
            border: '1px solid #3f3f46',
            color: '#fff',
          },
        }}
      />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-modalColor text-white border-b border-white/10 backdrop-blur-lg bg-opacity-80">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white">Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="p-4 sm:p-6">
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h1 className="text-xl font-semibold text-white">Attendance Overview</h1>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <Button className="gap-2 bg-transparent w-full sm:w-auto border-[1px]">
                    <Download size={16} />
                    View Badges
                  </Button>
                </div>
              </div>

              <div className="bg-modalColor rounded-xl p-4 sm:p-6 border-[1px] border-gray-800">
                <div className="flex flex-col md:flex-row gap-6 mb-8 items-center">
                  <img 
                    src={av1}
                    className="h-[15rem] w-[15rem] rounded-3xl"
                  />
                  <UserInfo userData={userData} />
                  <div className="flex-grow flex justify-center mt-4 md:mt-0">
                    <div className="flex flex-col items-center">
                      <p className="mb-3 text-center" style={{ color: leaderboardPosition.rank <= 3 ? '#FFD700' : '#4299E1' }}>
                        {leaderboardPosition.rank === 0 ? 'Loading...' : 
                         `Rank ${leaderboardPosition.rank} of ${leaderboardPosition.total} Students`}
                      </p>
                      {getTrophyDisplay()}
                      <div className={`grid grid-cols-3 gap-4 mt-3 ${!getTrophyDisplay() ? 'mt-8' : ''}`}>
                        <BadgeWorking />
                        <BadgePunctual />
                        <BadgeConsistent />
                        <BadgeWHonor />
                        <BadgeWHHonor />
                        <BadgeDeans />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-container border border-gray-800 rounded-lg p-4 justify-center items-center flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <ChevronsUp className="text-green-400" />
                      <p className="text-xl sm:text-2xl font-semibold text-green-400">{attendanceSummary.totalAttendance}</p>
                    </div>
                    <p className="text-zinc-400 text-sm text-center">Total Attendance</p>
                  </div>
                  <div className="bg-container border border-gray-800 rounded-lg p-4 justify-center items-center flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <ChevronsDown className="text-red-400" />
                      <p className="text-xl sm:text-2xl font-semibold text-red-400">{attendanceSummary.lateClockedIn}</p>
                    </div>
                    <p className="text-zinc-400 text-sm text-center">Late Clocked-In</p>
                  </div>
                  <div className="bg-container border border-gray-800 rounded-lg p-4 justify-center items-center flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <ChevronsLeftRightEllipsis className="text-yellow-400" />
                      <p className="text-xl sm:text-2xl font-semibold text-yellow-400">{attendanceSummary.absent}</p>
                    </div>
                    <p className="text-zinc-400 text-sm text-center">Absent</p>
                  </div>
                  <div className="bg-container border border-gray-800  rounded-lg p-4 justify-center items-center flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xl sm:text-2xl font-semibold text-green-400">{attendanceSummary.predicate}</p>
                    </div>
                    <p className="text-zinc-400 text-sm text-center">Student Predicate</p>
                  </div>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 mt-8">
                    <h2 className="text-xl font-semibold text-white">Attendance History</h2>
                    <div className="flex items-center gap-2">
                      <Button className="bg-transparent" size="icon">
                        <LayoutGrid size={16} />
                      </Button>
                      <Button className="bg-transparent" size="icon">
                        <List size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {attendanceData.map((item, index) => (
                  <div key={index} className="bg-container border border-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm">{item.date}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.status === 'On Time' ? 'bg-emerald-400/10 text-emerald-400' :
                        item.status === 'Late' ? 'bg-yellow-400/10 text-yellow-400' :
                        'bg-red-400/10 text-red-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="mb-4">
                      <p className="text-zinc-400 text-xs mb-1">Subject</p>
                      <p className="font-semibold text-white">{item.subject}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-zinc-400 text-xs mb-1">Time Clocked-In</p>
                        <p className="font-semibold">{item.checkIn}</p>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-xs mb-1">Time Clocked-Out</p>
                        <p className="font-semibold">{item.checkOut}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

// =======================================================================================================

// FOR INTEGRATING GOOGLE SHEET ATTENDANCE FEATURES

// POST

// function doPost(e) {
//   var headers = {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "POST",
//     "Access-Control-Allow-Headers": "Content-Type"
//   };
  
//   if (e.postData) {
//     try {
//       var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      
//       var data = JSON.parse(e.postData.contents);
      
//       sheet.appendRow([data.timestamp, data.name]);
      
//       return ContentService.createTextOutput(JSON.stringify({ success: true }))
//         .setMimeType(ContentService.MimeType.JSON)
//         .setHeaders(headers);
//     } catch (error) {
//       return ContentService.createTextOutput(JSON.stringify({ 
//         success: false, 
//         error: error.toString() 
//       }))
//         .setMimeType(ContentService.MimeType.JSON)
//         .setHeaders(headers);
//     }
//   }
  
//   return ContentService.createTextOutput("")
//     .setMimeType(ContentService.MimeType.TEXT)
//     .setHeaders(headers);
// }

// =======================================================================================================

// GET

// function doGet(e) {
//   var sheet = SpreadsheetApp.getActiveSheet();
//   var data = sheet.getDataRange().getValues();
  
//   var formattedData = data.map(function(row) {
//     return {
//       timestamp: row[0],
//       name: row[1]
//     };
//   });
  
//   var callback = e.parameter.callback;
  
//   var response = ContentService.createTextOutput(callback + '(' + JSON.stringify(formattedData) + ')')
//     .setMimeType(ContentService.MimeType.JAVASCRIPT);
    
//   return response;
// }

// =======================================================================================================