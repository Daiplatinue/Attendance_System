import React, { useState, useMemo } from 'react';
import { AppSidebar } from "@/components/app-sidebar-parent";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset, SidebarProvider, SidebarTrigger
} from "@/components/ui/sidebar";
import type { Meeting, MeetingFilter } from '@/sections/componentStyles/types/meeting';
import { MeetingModal } from '@/sections/MeetingModal-Parent';
import { MeetingList } from '@/components/meeting/meeting-list';
import { MeetingHeader } from '@/components/meeting/meeting-header';
import { MeetingFilterComponent } from '@/components/meeting/meeting-filter';

const MeetingPage: React.FC = () => {
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [filter, setFilter] = useState<MeetingFilter>({
        status: 'All',
        searchTerm: ''
    });
    const [meetings, setMeetings] = useState<Meeting[]>([
        {
            id: "MTG-001",
            teacher: "Ms. Sarah Johnson",
            subject: "Academic Progress Discussion",
            date: "2024-03-15",
            time: "14:00",
            status: "Pending",
            studentName: "John Smith",
            description: "Discuss first quarter academic performance and areas for improvement"
        },
        {
            id: "MTG-002",
            teacher: "Mr. David Wilson",
            subject: "Behavioral Consultation",
            date: "2024-03-16",
            time: "15:30",
            status: "Approved",
            studentName: "Emma Davis",
            description: "Address recent classroom behavior concerns"
        },
        {
            id: "MTG-003",
            teacher: "Dr. Maria Garcia",
            subject: "Special Education Planning",
            date: "2024-03-17",
            time: "13:00",
            status: "Rejected",
            studentName: "Michael Brown",
            description: "Review and update IEP goals and accommodations"
        }
    ]);

    const filteredMeetings = useMemo(() => {
        return meetings.filter(meeting => {
            const matchesStatus = filter.status === 'All' || meeting.status === filter.status;
            const searchTerm = filter.searchTerm.toLowerCase();
            const matchesSearch = !filter.searchTerm || 
                meeting.subject.toLowerCase().includes(searchTerm) ||
                meeting.teacher.toLowerCase().includes(searchTerm) ||
                meeting.studentName.toLowerCase().includes(searchTerm) ||
                meeting.description.toLowerCase().includes(searchTerm);
            
            return matchesStatus && matchesSearch;
        });
    }, [meetings, filter]);

    const handleStatusChange = (id: string, newStatus: Meeting['status']) => {
        setMeetings(meetings.map(meeting => 
            meeting.id === id ? { ...meeting, status: newStatus } : meeting
        ));
    };

    const handleAddMeeting = (newMeeting: Meeting) => {
        setMeetings([newMeeting, ...meetings]);
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 bg-gray-800 text-white border-b border-gray-700">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                    </BreadcrumbItem>
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="text-white">Meetings</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>

                    <div className='max-w-7xl mx-auto p-4 md:p-6 lg:p-8'>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <MeetingHeader onRequestMeeting={() => setShowRequestForm(true)} />
                            <MeetingFilterComponent onFilterChange={setFilter} />
                        </div>
                        <MeetingList meetings={filteredMeetings} onStatusChange={handleStatusChange} />
                        <MeetingModal
                            isOpen={showRequestForm}
                            onClose={() => setShowRequestForm(false)}
                            onSubmit={handleAddMeeting}
                            meetings={meetings}
                        />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
};

export default MeetingPage;