import { AppSidebar } from "@/components/app-sidebar"
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
import MyAvatar from './componentStyles/MyAvatar';
import { ChevronsDown, ChevronsLeftRightEllipsis, ChevronsUp, Download, LayoutGrid, List, Medal } from 'lucide-react'
import { Toaster } from 'sonner';
import { AttendanceRecorder } from '@/sections/componentStyles/AttendanceDialog';

import BadgeWorking from "./componentStyles/Badge-Working";
import BadgePunctual from "./componentStyles/Badge-Punctual";
import BadgeConsistent from "./componentStyles/Badge-Consistent"; 
import BadgeWHonor from "./componentStyles/Badge-WHonor";
import BadgeWHHonor from "./componentStyles/Badge-WHHonor";
import BadgeDeans from "./componentStyles/Badge-Deans";

const attendanceData = [
  { date: 'March 08, 2024', status: 'On Time', checkIn: '08:45', checkOut: '17:10' },
  { date: 'March 07, 2024', status: 'Late', checkIn: '09:15', checkOut: '17:25' },
  { date: 'March 06, 2024', status: 'On Time', checkIn: '08:30', checkOut: '17:05' },
  { date: 'March 05, 2024', status: 'Absent', checkIn: '-', checkOut: '-' },
  { date: 'March 04, 2024', status: 'On Time', checkIn: '08:40', checkOut: '17:20' },
  { date: 'March 03, 2024', status: 'Late', checkIn: '09:05', checkOut: '17:15' },
  { date: 'March 02, 2024', status: 'On Time', checkIn: '08:50', checkOut: '17:00' },
  { date: 'March 01, 2024', status: 'Absent', checkIn: '-', checkOut: '-' },
  { date: 'February 29, 2024', status: 'On Time', checkIn: '08:35', checkOut: '17:10' },
];

export default function Home() {
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
                    Edit Theme
                  </Button>
                  <Button className="gap-2 bg-transparent w-full sm:w-auto border-[1px]">
                    <Download size={16} />
                    View Badges
                  </Button>
                  <AttendanceRecorder />
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border-[1px] border-slate-700">
                <div className="flex flex-col md:flex-row gap-6 mb-8 items-center">
                  <MyAvatar />
                  <div className="flex-grow text-center md:text-left">
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-1">Lebrown Jems A.</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
                      <div className="mt-3 sm:mt-5">
                        <p className="text-zinc-400 text-sm mb-1">Role</p>
                        <p>Student</p>
                      </div>
                      <div className="mt-3 sm:mt-5">
                        <p className="text-zinc-400 text-sm mb-1">Department</p>
                        <p>BSIT</p>
                      </div>
                      <div className="mt-3 sm:mt-5">
                        <p className="text-zinc-400 text-sm mb-1">Year Level</p>
                        <p className="break-all">3rd Year</p>
                      </div>
                      <div className="mt-3 sm:mt-5">
                        <p className="text-zinc-400 text-sm mb-1">Email</p>
                        <p className="break-all">isthatlebrownjems@gmail.com</p>
                      </div>
                      <div className="mt-3 sm:mt-5">
                        <p className="text-zinc-400 text-sm mb-1">Contact Number</p>
                        <p className="break-all">(+63) 91 572 4533</p>
                      </div>
                      <div className="mt-3 sm:mt-5">
                        <p className="text-zinc-400 text-sm mb-1">Address</p>
                        <p className="break-all">Talisay City, Cebu</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-grow flex justify-center mt-4 md:mt-0">
                    <div className="flex flex-col items-center">
                      <p className="mb-3 text-yellow-500 text-center">TOP 1 AMONG SCC STUDENTS</p>
                      <Medal className="text-yellow-500" size={80} />
                      <p className="mt-2 text-yellow-500 text-center">"Keep It Up, Cecilian!"</p>
                      <div className="grid grid-cols-3 gap-4 mt-3">
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
                  <div className="bg-zinc-800 rounded-lg p-4 justify-center items-center flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <ChevronsUp className="text-green-400" />
                      <p className="text-xl sm:text-2xl font-semibold text-green-400">1,928,852</p>
                    </div>
                    <p className="text-zinc-400 text-sm text-center">Total Attendance</p>
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-4 justify-center items-center flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <ChevronsDown className="text-red-400" />
                      <p className="text-xl sm:text-2xl font-semibold text-red-400">237,002</p>
                    </div>
                    <p className="text-zinc-400 text-sm text-center">Late Clocked-In</p>
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-4 justify-center items-center flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <ChevronsLeftRightEllipsis className="text-yellow-400" />
                      <p className="text-xl sm:text-2xl font-semibold text-yellow-400">128,725</p>
                    </div>
                    <p className="text-zinc-400 text-sm text-center">Absent</p>
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-4 justify-center items-center flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xl sm:text-2xl font-semibold text-green-400">Batak Pagkatao</p>
                    </div>
                    <p className="text-zinc-400 text-sm text-center">Student Predicate</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
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
                  <div key={index} className="bg-zinc-800 rounded-lg p-4">
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

// FETCH

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

// const navigate = useNavigate();

// const fetchUser = async (): Promise<void> => {
//   try {
//     const token = localStorage.getItem('token');
//     const response = await axios.get('http://localhost:3000/auth/home', {
//       headers: {
//         "Authorization": `Bearer ${token}`
//       }
//     });
//     if (response.status !== 201) {
//       navigate('/login');
//     }
//   } catch (err) {
//     navigate('/login');
//     console.error(err);
//   }
// };

// useEffect(() => {
//   fetchUser();
// }, []);