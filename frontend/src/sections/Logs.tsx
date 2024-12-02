import React, { useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar-admin"
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset, SidebarProvider, SidebarTrigger
} from "@/components/ui/sidebar"
import { ClipboardList, Search, Download, Filter, ChevronDown, Clock } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

const Logs: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

    const logs = [
        {
            id: "LOG-001",
            action: "Login",
            user: "Bagus Fikri",
            userType: "Parent",
            timestamp: "2024-01-20 08:30:15",
        },
        {
            id: "LOG-002",
            action: "Update Profile",
            user: "Ihdzain",
            userType: "Teacher",
            timestamp: "2024-01-20 09:15:22",
        },
        {
            id: "LOG-003",
            action: "Failed Login",
            user: "Multi Hidayat",
            userType: "Student",
            timestamp: "2024-01-20 10:45:33",
        },
    ];

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const getUserTypeColor = (userType: string) => {
        switch (userType.toLowerCase()) {
            case 'student':
                return 'text-blue-400';
            case 'teacher':
                return 'text-purple-400';
            case 'parent':
                return 'text-green-400';
            default:
                return 'text-gray-400';
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = 
            log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.action.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = !selectedFilter || log.userType === selectedFilter;

        return matchesSearch && matchesFilter;
    });

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
                                        <BreadcrumbPage className="text-white">System Logs</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>

                    <div className='max-w-7xl mx-auto p-4 md:p-6 lg:p-8'>
                        <div className='bg-modalColor rounded-xl shadow-2xl p-6 border border-white/10 backdrop-blur-lg'>
                            <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
                                <div>
                                    <h2 className='text-2xl font-bold flex items-center gap-2 text-white mb-2'>
                                        <ClipboardList className="w-6 h-6 text-blue-400" />
                                        System Logs
                                    </h2>
                                    <p className="text-gray-400 text-sm">Track and monitor system activities</p>
                                </div>
                                <div className='flex flex-wrap gap-4'>
                                    <div className='relative flex-grow md:flex-grow-0'>
                                        <input
                                            type="text"
                                            placeholder="Search logs..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className='w-full md:w-[300px] pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/5 text-white placeholder-gray-400 border border-white/10 transition-all duration-200'
                                        />
                                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                    </div>
                                    <div className='flex gap-3'>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className='flex items-center gap-2 px-4 py-2.5 bg-white/5 text-white rounded-lg hover:bg-white/10 border border-white/10 transition-all duration-200'>
                                                <Filter className="w-4 h-4" />
                                                <span className='hidden md:inline'>
                                                    {selectedFilter || 'Filter'}
                                                </span>
                                                <ChevronDown className="w-4 h-4" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="bg-modalColor border border-white/10 text-white">
                                                <DropdownMenuItem 
                                                    className="hover:bg-white/5"
                                                    onClick={() => setSelectedFilter(null)}
                                                >
                                                    All Users
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="hover:bg-white/5"
                                                    onClick={() => setSelectedFilter('Student')}
                                                >
                                                    Student
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="hover:bg-white/5"
                                                    onClick={() => setSelectedFilter('Teacher')}
                                                >
                                                    Teacher
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="hover:bg-white/5"
                                                    onClick={() => setSelectedFilter('Parent')}
                                                >
                                                    Parent
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <button className='flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20 transition-all duration-200'>
                                            <Download className="w-4 h-4" />
                                            <span className='hidden md:inline'>Export</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className='overflow-x-auto rounded-lg border border-white/10'
                            >
                                <table className='w-full'>
                                    <thead>
                                        <tr className='bg-white/5'>
                                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>Log ID</th>
                                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>User</th>
                                            <th className='hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>User Type</th>
                                            <th className='hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>Timestamp</th>
                                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-white/10'>
                                        {filteredLogs.map((log) => (
                                            <tr 
                                                key={log.id} 
                                                className='hover:bg-white/5 transition-all duration-200'
                                            >
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <span className="text-sm font-medium text-white">{log.id}</span>
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <span className="text-sm text-gray-300">{log.user}</span>
                                                </td>
                                                <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap'>
                                                    <span className={`text-sm ${getUserTypeColor(log.userType)}`}>
                                                        {log.userType}
                                                    </span>
                                                </td>
                                                <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap'>
                                                    <div className="flex items-center text-sm text-gray-300">
                                                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                                        {formatTimestamp(log.timestamp)}
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <span className="text-sm text-gray-300">{log.action}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
};

export default Logs;