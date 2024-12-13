import React, { useEffect, useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar-teacher";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset, SidebarProvider, SidebarTrigger
} from "@/components/ui/sidebar";
import { Link } from 'react-router-dom';

interface Schedule {
    sc_id: number;
    sc_subject: string;
    sc_day: string;
    sc_startTime: string;
    sc_endTime: string;
    sc_room: string;
    sc_section: string;
}

const Schedule: React.FC = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/api/section-schedule', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setSchedules(data.schedules);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch schedules');
                setLoading(false);
            }
        };

        fetchSchedules();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900">
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
                                        <BreadcrumbLink>
                                            <Link to={'/'}>Dashboard</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="text-white">Schedules</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>

                    <div className="p-6">
                        {loading ? (
                            <div className="text-center text-white">Loading schedules...</div>
                        ) : error ? (
                            <div className="text-center text-red-500">{error}</div>
                        ) : schedules.length === 0 ? (
                            <div className="text-center text-white">No schedules found for your section</div>
                        ) : (
                            <div className="bg-modalColor rounded-lg p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-white">
                                        <thead>
                                            <tr className="border-b border-gray-700">
                                                <th className="text-left py-3 px-4">Day</th>
                                                <th className="text-left py-3 px-4">Subject</th>
                                                <th className="text-left py-3 px-4">Start Time</th>
                                                <th className="text-left py-3 px-4">End Time</th>
                                                <th className="text-left py-3 px-4">Room</th>
                                                <th className="text-left py-3 px-4">Section</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schedules.map((schedule) => (
                                                <tr 
                                                    key={schedule.sc_id}
                                                    className="border-b border-gray-700 hover:bg-gray-800/50"
                                                >
                                                    <td className="py-3 px-4">{schedule.sc_day}</td>
                                                    <td className="py-3 px-4">{schedule.sc_subject}</td>
                                                    <td className="py-3 px-4">{schedule.sc_startTime}</td>
                                                    <td className="py-3 px-4">{schedule.sc_endTime}</td>
                                                    <td className="py-3 px-4">{schedule.sc_room}</td>
                                                    <td className="py-3 px-4">{schedule.sc_section}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
};

export default Schedule;