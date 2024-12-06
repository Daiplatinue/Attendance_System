import React, { useState, useEffect } from 'react';
import { AppSidebar } from "@/components/app-sidebar-teacher";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset, SidebarProvider, SidebarTrigger
} from "@/components/ui/sidebar";
import type { Meeting, MeetingFilter } from '@/sections/componentStyles/types/meeting';
import { MeetingModal } from '@/sections/MeetingModal';
import { MeetingList } from '@/components/meeting/meeting-list';
import { MeetingHeader } from '@/components/meeting/meeting-header';
import { MeetingFilterComponent } from '@/components/meeting/meeting-filter';
import axios from 'axios';

const MeetingPage: React.FC = () => {
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [filter, setFilter] = useState<MeetingFilter>({
        status: 'All',
        searchTerm: ''
    });
    const [meetings, setMeetings] = useState<Meeting[]>([]);

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/meetings/list', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const formattedMeetings = response.data.map((meeting: any) => ({
                id: meeting.mt_id,
                teacher: meeting.requester_name,
                subject: meeting.mt_title,
                date: meeting.mt_date,
                time: meeting.mt_time,
                status: meeting.mt_status,
                description: meeting.mt_description,
                studentName: meeting.student_name
            }));
            setMeetings(formattedMeetings);
        } catch (error) {
            console.error('Error fetching meetings:', error);
        }
    };

    const handleStatusChange = async (id: string, newStatus: Meeting['status']) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/meetings/status/${id}`, 
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setMeetings(meetings.map(meeting => 
                meeting.id === id ? { ...meeting, status: newStatus } : meeting
            ));
        } catch (error) {
            console.error('Error updating meeting status:', error);
        }
    };

    const handleAddMeeting = (newMeeting: Meeting) => {
        setMeetings([newMeeting, ...meetings]);
    };

    const filteredMeetings = meetings.filter(meeting => {
        const matchesStatus = filter.status === 'All' || meeting.status === filter.status;
        const searchTerm = filter.searchTerm.toLowerCase();
        const matchesSearch = !filter.searchTerm || 
            meeting.subject.toLowerCase().includes(searchTerm) ||
            meeting.teacher.toLowerCase().includes(searchTerm) ||
            meeting.studentName.toLowerCase().includes(searchTerm) ||
            meeting.description.toLowerCase().includes(searchTerm);
        
        return matchesStatus && matchesSearch;
    });

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