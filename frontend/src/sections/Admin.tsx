// import axios from 'axios';
// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import React from 'react';
import { AppSidebar } from "@/components/app-sidebar-admin"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset, SidebarProvider, SidebarTrigger
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Clock, Calendar, Search, Download, UserPlus, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Timer, UserX, BarChart2 } from 'lucide-react'
import clsx from 'clsx';
import MyChart from './componentStyles/MyChart';

const Admin: React.FC = () => {
  const employees = [
    { id: "SCC-0-002456", name: "Bagus Fikri B.", role: "Student", department: "BS - Information Technology", status: "Active", email: "bagusfikri@gmail.com", phone: "(+63) 248 042 319", joined: "29 Oct, 2018" },
    { id: "SCC-0-000953", name: "Ihdzain A.", role: "Teacher", department: "BS - Hospitality Management", status: "Active", email: "ihdzain@gmail.com", phone: "(+63) 768 082 716", joined: "1 Feb, 2019" },
    { id: "SCC-0-010534", name: "Multi Hidayat Y.", role: "Student", department: "BS - Tourism Management", status: "Active", email: "multih@gmail.com", phone: "(+63) 130 689 256", joined: "1 Feb, 2021" },
  ];

  const getStatusColor = (value: number, threshold: { low: number, high: number }) => {
    if (value >= threshold.high) return 'text-green-400';
    if (value >= threshold.low) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 bg-modalColor text-white border-b border-white/10">
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

          <div className='max-w-7xl mx-auto p-4 md:p-6 lg:p-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
              {/* Attendance Summary */}
              <div className='bg-modalColor rounded-xl shadow-2xl p-6 border border-white/10 backdrop-blur-lg'>
                <h2 className='text-xl font-semibold mb-6 flex items-center gap-2 text-white'>
                  <Clock className="w-5 h-5 text-blue-400" />
                  Attendance Summary
                </h2>
                <div className='grid grid-cols-2 gap-6'>
                  <div className='flex items-center gap-3 bg-white/5 p-4 rounded-lg'>
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                    <div>
                      <p className='text-gray-400 text-sm'>On time</p>
                      <p className={clsx('text-xl font-bold', getStatusColor(265, { low: 200, high: 250 }))}>1,265</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3 bg-white/5 p-4 rounded-lg'>
                    <Timer className="w-8 h-8 text-yellow-400" />
                    <div>
                      <p className='text-gray-400 text-sm'>Late</p>
                      <p className={clsx('text-xl font-bold', getStatusColor(85, { low: 50, high: 100 }))}>9,285</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3 bg-white/5 p-4 rounded-lg'>
                    <TrendingUp className="w-8 h-8 text-green-400" />
                    <div>
                      <p className='text-gray-400 text-sm'>Early</p>
                      <p className={clsx('text-xl font-bold', getStatusColor(120, { low: 100, high: 150 }))}>925</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3 bg-white/5 p-4 rounded-lg'>
                    <UserX className="w-8 h-8 text-red-400" />
                    <div>
                      <p className='text-gray-400 text-sm'>Absent</p>
                      <p className={clsx('text-xl font-bold', getStatusColor(15, { low: 20, high: 30 }))}>15,926  </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Attendance */}
              <div className='bg-modalColor rounded-xl shadow-2xl p-6 border border-white/10 backdrop-blur-lg'>
                <h2 className='text-xl font-semibold mb-6 flex items-center gap-2 text-white'>
                  <Users className="w-5 h-5 text-purple-400" />
                  Number of Students
                </h2>
                <div className='space-y-6'>
                  <div className='bg-white/5 p-4 rounded-lg'>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center gap-3'>
                        <TrendingUp className="w-8 h-8 text-green-400" />
                        <div>
                          <p className='text-gray-400 text-sm'>Students</p>
                          <p className='text-xl font-bold text-green-400'>10,985,789</p>
                        </div>
                      </div>
                      <div className='text-green-400 text-sm font-semibold'>+12.5%</div>
                    </div>
                    <div className='w-full bg-green-400/20 rounded-full h-1.5'>
                      <div className='bg-green-400 h-1.5 rounded-full' style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className='bg-white/5 p-4 rounded-lg'>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center gap-3'>
                        <TrendingDown className="w-8 h-8 text-yellow-400" />
                        <div>
                          <p className='text-gray-400 text-sm'>Graduated</p>
                          <p className='text-xl font-bold text-yellow-400'>1,785,233</p>
                        </div>
                      </div>
                      <div className='text-yellow-400 text-sm font-semibold'>+3.2%</div>
                    </div>
                    <div className='w-full bg-yellow-400/20 rounded-full h-1.5'>
                      <div className='bg-yellow-400 h-1.5 rounded-full' style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Events */}
              <div className='bg-modalColor rounded-xl shadow-2xl p-6 border border-white/10 backdrop-blur-lg'>
                <h2 className='text-xl font-semibold mb-6 flex items-center gap-2 text-white'>
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  Events
                </h2>
                <div className='space-y-6'>
                  <div className='bg-white/5 p-4 rounded-lg flex items-center gap-4'>
                    <div className='w-12 h-12 rounded-full bg-green-400/20 flex items-center justify-center'>
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    <div className='flex-1'>
                      <p className='text-green-400 font-semibold'>Ongoing</p>
                      <p className='text-white font-medium'>Intramurals 2024</p>
                      <p className='text-gray-400 text-sm'>Until Jan 31</p>
                    </div>
                    <div className='w-2 h-2 rounded-full bg-green-400 animate-pulse'></div>
                  </div>
                  <div className='bg-white/5 p-4 rounded-lg flex items-center gap-4'>
                    <div className='w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center'>
                      <AlertCircle className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className='flex-1'>
                      <p className='text-yellow-400 font-semibold'>Upcoming</p>
                      <p className='text-white font-medium'>Scc Fiesta 2024</p>
                      <p className='text-gray-400 text-sm'>Starts Feb 15</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-modalColor rounded-xl shadow-2xl p-6 border border-white/10 backdrop-blur-lg mb-8'>
              <div className='flex items-center gap-2 mb-6'>
                <BarChart2 className="w-5 h-5 text-blue-400" />
                <h2 className='text-xl font-semibold text-white'>Analytics Overview</h2>
              </div>
              <MyChart />
            </div>

            {/* Employees Table */}
            <div className='bg-modalColor rounded-xl shadow-2xl p-6 border border-white/10 backdrop-blur-lg'>
              <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2 text-white'>
                  <Users className="w-5 h-5 text-blue-400" />
                  All Accounts
                </h2>
                <div className='flex flex-wrap gap-4'>
                  <div className='relative flex-grow md:flex-grow-0'>
                    <input
                      type="text"
                      placeholder="Search accounts"
                      className='w-full md:w-auto pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/5 text-white placeholder-gray-400 border border-white/10'
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                  <div className='flex gap-2'>
                    <button className='flex items-center gap-2 px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 border border-white/10 transition-colors'>
                      <Download className="w-4 h-4" />
                      <span className='hidden md:inline'>Export</span>
                    </button>
                    <button className='flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20 transition-all duration-200'>
                      <UserPlus className="w-4 h-4" />
                      <span className='hidden md:inline'>Add Account</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-white/5'>
                      <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Account name</th>
                      <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Role</th>
                      <th className='hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Department</th>
                      <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Status</th>
                      <th className='hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Action</th>
                      <th className='hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Joined</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-white/10'>
                    {employees.map((employee) => (
                      <tr key={employee.id} className='hover:bg-white/5 transition-colors'>
                        <td className='px-4 md:px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <Avatar className='h-8 w-8 md:h-10 md:w-10 ring-2 ring-white/10'>
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`} />
                              <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className='ml-4'>
                              <div className='text-sm font-medium text-white'>{employee.name}</div>
                              <div className='text-sm text-gray-400'>{employee.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className='px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{employee.role}</td>
                        <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{employee.department}</td>
                        <td className='px-4 md:px-6 py-4 whitespace-nowrap'>
                          <span className='px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-400/20 text-green-400'>
                            {employee.status}
                          </span>
                        </td>
                        <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                          <div>{employee.email}</div>
                          <div className='text-gray-400'>{employee.phone}</div>
                        </td>
                        <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{employee.joined}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default Admin;

// const navigate = useNavigate();

//   const fetchUser = async (): Promise<void> => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get('http://localhost:3000/auth/admin', {
//         headers: {
//           "Authorization": `Bearer ${token}`
//         }
//       });

//       if (response.status !== 201) {
//         navigate('/login');
//       }
//     } catch (err) {
//       navigate('/login');
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);