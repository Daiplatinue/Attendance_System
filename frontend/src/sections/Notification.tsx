import React, { useEffect, useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Bell, CheckCircle2, Clock } from 'lucide-react';
import axios from 'axios';

interface NotificationData {
  nt_id: number;
  u_fullname: string;
  nt_description: string;
  ts_date: string;
}

function Notification() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/notifications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-modalColor text-white border-b border-white/10 backdrop-blur-lg bg-opacity-80">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white">Notifications</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="p-4 sm:p-6">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold text-white">Notification Center</h1>
                <Bell className="text-zinc-400" />
              </div>

              <div className="bg-modalColor rounded-xl p-4 sm:p-6 border-[1px] border-gray-800">
                <div className="space-y-4">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.nt_id}
                        className="bg-container border border-gray-800 rounded-lg p-4 transition-all hover:border-gray-700"
                      >
                        <div className="flex items-start gap-4">
                          <div className="bg-blue-500/10 p-2 rounded-full">
                            <CheckCircle2 className="text-blue-500 h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium text-white">
                                {notification.u_fullname}
                              </h3>
                              <div className="flex items-center text-xs text-zinc-400">
                                <Clock className="mr-1 h-3 w-3" />
                                {formatDate(notification.ts_date)}
                              </div>
                            </div>
                            <p className="text-sm text-zinc-400">
                              {notification.nt_description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="mx-auto h-12 w-12 text-zinc-600 mb-3" />
                      <p className="text-zinc-400">No notifications yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default Notification

// 
// import React, { useEffect, useState } from 'react';
// import { AppSidebar } from "@/components/app-sidebar";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbList,
//   BreadcrumbPage,
// } from "@/components/ui/breadcrumb";
// import { Separator } from "@/components/ui/separator";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { Bell, CheckCircle2, Clock, X } from 'lucide-react';
// import axios from 'axios';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// interface NotificationData {
//   nt_id: number;
//   u_fullname: string;
//   nt_description: string;
//   ts_date: string;
//   ts_clockedIn: string;
//   ts_clockedOut: string | null;
//   ts_status: number;
// }

// export default function Notification() {
//   const [notifications, setNotifications] = useState<NotificationData[]>([]);
//   const [selectedNotification, setSelectedNotification] = useState<NotificationData | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('http://localhost:3000/api/notifications', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.status === 200) {
//           setNotifications(response.data);
//         }
//       } catch (error) {
//         console.error('Error fetching notifications:', error);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const handleNotificationClick = (notification: NotificationData) => {
//     setSelectedNotification(notification);
//     setIsModalOpen(true);
//   };

//   const getStatusColor = (status: number) => {
//     switch (status) {
//       case 1: return 'text-green-400';
//       case 2: return 'text-yellow-400';
//       case 3: return 'text-orange-400';
//       case 4: return 'text-red-400';
//       default: return 'text-gray-400';
//     }
//   };

//   const getStatusText = (status: number) => {
//     switch (status) {
//       case 1: return 'On Time';
//       case 2: return 'Late';
//       case 3: return 'Very Late';
//       case 4: return 'Absent';
//       default: return 'Unknown';
//     }
//   };

//   return (
//     <div>
//       <SidebarProvider>
//         <AppSidebar />
//         <SidebarInset>
//           <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-modalColor text-white border-b border-white/10 backdrop-blur-lg bg-opacity-80">
//             <div className="flex items-center gap-2 px-4">
//               <SidebarTrigger className="-ml-1" />
//               <Separator orientation="vertical" className="mr-2 h-4" />
//               <Breadcrumb>
//                 <BreadcrumbList>
//                   <BreadcrumbItem>
//                     <BreadcrumbPage className="text-white">Notifications</BreadcrumbPage>
//                   </BreadcrumbItem>
//                 </BreadcrumbList>
//               </Breadcrumb>
//             </div>
//           </header>

//           <div className="p-4 sm:p-6">
//             <div className="mb-6 sm:mb-8">
//               <div className="flex items-center justify-between mb-6">
//                 <h1 className="text-xl font-semibold text-white">Notification Center</h1>
//                 <Bell className="text-zinc-400" />
//               </div>

//               <div className="bg-modalColor rounded-xl p-4 sm:p-6 border-[1px] border-gray-800">
//                 <div className="space-y-4">
//                   {notifications.length > 0 ? (
//                     notifications.map((notification) => (
//                       <div
//                         key={notification.nt_id}
//                         className="bg-container border border-gray-800 rounded-lg p-4 transition-all hover:border-gray-700 cursor-pointer"
//                         onClick={() => handleNotificationClick(notification)}
//                       >
//                         <div className="flex items-start gap-4">
//                           <div className="bg-blue-500/10 p-2 rounded-full">
//                             <CheckCircle2 className="text-blue-500 h-5 w-5" />
//                           </div>
//                           <div className="flex-1">
//                             <div className="flex items-center justify-between mb-1">
//                               <h3 className="font-medium text-white">
//                                 {notification.u_fullname}
//                               </h3>
//                               <div className="flex items-center text-xs text-zinc-400">
//                                 <Clock className="mr-1 h-3 w-3" />
//                                 {formatDate(notification.ts_date)}
//                               </div>
//                             </div>
//                             <p className="text-sm text-zinc-400">
//                               {notification.nt_description}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-center py-8">
//                       <Bell className="mx-auto h-12 w-12 text-zinc-600 mb-3" />
//                       <p className="text-zinc-400">No notifications yet</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//             <DialogContent className="bg-modalColor text-white border-gray-800 sm:max-w-[425px]">
//               <DialogHeader>
//                 <DialogTitle className="text-lg font-semibold">
//                   Notification Details
//                 </DialogTitle>
//                 <button
//                   onClick={() => setIsModalOpen(false)}
//                   className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               </DialogHeader>
//               {selectedNotification && (
//                 <div className="mt-4 space-y-4">
//                   <div>
//                     <h4 className="text-sm font-medium text-gray-400">Student</h4>
//                     <p className="mt-1 text-white">{selectedNotification.u_fullname}</p>
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-medium text-gray-400">Status</h4>
//                     <p className={`mt-1 ${getStatusColor(selectedNotification.ts_status)}`}>
//                       {getStatusText(selectedNotification.ts_status)}
//                     </p>
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-medium text-gray-400">Description</h4>
//                     <p className="mt-1 text-white">{selectedNotification.nt_description}</p>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-400">Clocked In</h4>
//                       <p className="mt-1 text-white">{selectedNotification.ts_clockedIn || '-'}</p>
//                     </div>
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-400">Clocked Out</h4>
//                       <p className="mt-1 text-white">{selectedNotification.ts_clockedOut || '-'}</p>
//                     </div>
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-medium text-gray-400">Date & Time</h4>
//                     <p className="mt-1 text-white">{formatDate(selectedNotification.ts_date)}</p>
//                   </div>
//                 </div>
//               )}
//             </DialogContent>
//           </Dialog>
//         </SidebarInset>
//       </SidebarProvider>
//     </div>
//   );
// }