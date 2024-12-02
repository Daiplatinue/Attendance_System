import { useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset, SidebarProvider, SidebarTrigger
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { Calendar, Search, Download, Plus } from 'lucide-react'
import { EventCard } from '@/sections/componentStyles/EventCard'
import { EventModal } from '@/sections/componentStyles/EventModal'
import { CreateEventModal } from '@/sections/componentStyles/CreateEvent'
import { Event } from '@/sections/componentStyles/types/events'

export default function AllEvents() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "EVT-001",
      name: "Intramurals 2024",
      type: "Sports",
      location: "Main Campus Ground",
      startDate: "2024-01-15",
      endDate: "2024-01-31",
      startTime: "08:00",
      endTime: "17:00",
      status: "Ongoing",
      departments: ["Physical Education", "All Departments"],
      organizer: "Student Affairs Office",
      description: "Annual sports competition between departments featuring various athletic events including basketball, volleyball, football, and track and field. Join us for two weeks of exciting competitions and show your department spirit!",
      avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=sports"
    },
    {
      id: "EVT-002",
      name: "SCC Fiesta 2024",
      type: "Cultural",
      location: "University Auditorium",
      startDate: "2024-02-15",
      endDate: "2024-02-17",
      startTime: "09:00",
      endTime: "22:00",
      status: "Upcoming",
      departments: ["All Departments"],
      organizer: "Cultural Committee",
      description: "Annual university festival celebration showcasing cultural performances, food stalls, and various entertainment activities. Don't miss the grand cultural night and fireworks display!",
      avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=cultural"
    },
    {
      id: "EVT-003",
      name: "Tech Summit 2024",
      type: "Academic",
      location: "IT Building",
      startDate: "2024-03-10",
      endDate: "2024-03-11",
      startTime: "10:00",
      endTime: "16:00",
      status: "Upcoming",
      departments: ["IT", "Computer Science", "Engineering"],
      organizer: "IT Department",
      description: "Technology conference and workshops featuring industry experts, hands-on coding sessions, and the latest trends in technology. Perfect for students interested in tech innovation.",
      avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=tech"
    }
  ]);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCreateEvent = (newEvent: Omit<Event, 'id'>) => {
    const event: Event = {
      ...newEvent,
      id: `EVT-${String(events.length + 1).padStart(3, '0')}`,
    };
    setEvents([...events, event]);
  };

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.departments.some(dept => dept.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
                    <BreadcrumbLink>
                      <Link to={'/'}>Dashboard</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Events</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className='max-w-7xl mx-auto p-4 md:p-6 lg:p-8'>
            <div className='bg-modalColor rounded-xl shadow-2xl p-6 border border-white/10 backdrop-blur-lg mb-8'>
              <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2 text-white'>
                  <Calendar className="w-5 h-5 text-blue-400" />
                  All Events
                </h2>
                <div className='flex flex-wrap gap-4'>
                  <div className='relative flex-grow md:flex-grow-0'>
                    <input
                      type="text"
                      placeholder="Search events"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-full md:w-auto pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/5 text-white placeholder-gray-400 border border-white/10'
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                  <div className='flex gap-2'>
                    <button className='flex items-center gap-2 px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 border border-white/10 transition-colors'>
                      <Download className="w-4 h-4" />
                      <span className='hidden md:inline'>Export</span>
                    </button>
                    <button 
                      onClick={() => setIsCreateModalOpen(true)}
                      className='flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20 transition-all duration-200'
                    >
                      <Plus className="w-4 h-4" />
                      <span className='hidden md:inline'>Create Event</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </div>

          {selectedEvent && (
            <EventModal
              event={selectedEvent}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          )}

          <CreateEventModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateEvent}
          />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}