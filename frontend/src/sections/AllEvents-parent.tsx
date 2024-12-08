import { useState, useEffect } from 'react';
import { AppSidebar } from "@/components/app-sidebar-parent"
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
import axios from 'axios';
import { toast } from 'sonner';

export default function AllEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/fetchEvents');
      const formattedEvents = response.data.map((event: any) => ({
        id: event.id.toString(),
        name: event.name,
        type: event.type,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime,
        endTime: event.endTime,
        status: event.status,
        departments: Array.isArray(event.departments) ? event.departments : event.departments.split(',').map((d: string) => d.trim()),
        organizer: event.organizer,
        description: event.description,
        avatarUrl: event.avatarUrl
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCreateEvent = async (newEvent: Omit<Event, 'id'>) => {
    try {
      await fetchEvents(); // Refresh the events list after creating a new event
    } catch (error) {
      console.error('Error refreshing events:', error);
      toast.error('Failed to refresh events list');
    }
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
                    <BreadcrumbPage className='text-white'>Events</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className='max-w-7xl mx-auto p-4 md:p-6 lg:p-8'>
            <div className='bg-modalColor rounded-xl shadow-2xl p-6 border border-gray-800 backdrop-blur-lg mb-8'>
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
                      className='w-full md:w-auto pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/5 text-white placeholder-gray-400 h-[2.7rem]'
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                  <div className='flex gap-2'>
                    <button className='flex items-center gap-2 px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 border border-gray-800 transition-colors'>
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

            {isLoading ? (
              <div className="text-center text-white py-8">Loading events...</div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
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