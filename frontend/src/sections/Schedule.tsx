import React from 'react';
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
import { ScheduleForm } from '@/sections/componentStyles/ScheduleForm';

const Schedule: React.FC = () => {
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
                        <div className="max-w-7xl mx-auto">
                            <h1 className="text-2xl font-bold text-white mb-6">Create Schedule</h1>
                            <div className="bg-gray-800 rounded-lg shadow-lg">
                                <ScheduleForm />
                            </div>
                        </div>
                    </div>

                </SidebarInset>
            </SidebarProvider>
        </div>
    );
};

export default Schedule;