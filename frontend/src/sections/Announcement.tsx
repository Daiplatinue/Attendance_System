import React, { useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset, SidebarProvider, SidebarTrigger
} from "@/components/ui/sidebar"
import { Bell, Search, Plus } from 'lucide-react'
import AnnouncementCard from '@/sections/componentStyles/AnnouncementCard' 
import CreateAnnouncement from '@/sections/componentStyles/CreateAnnouncement'

const Announcements: React.FC = () => {
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Intramurals 2024 Schedule Update",
      content: "Please be informed that the Intramurals 2024 schedule has been updated. All sports events will now start at 8:00 AM.",
      author: "Admin Office",
      date: "Jan 15, 2024",
      isPinned: true,
      initialReactions: { count: 80 },
      attachments: [
        { type: 'file' as const, url: 'https://docs.google.com/spreadsheets/d/1z2liYRjQTtqwBG4y84Di4I2CItUwKKNIg1CpQqMv_J8/edit?gid=0#gid=0', name: 'schedule.xls' },
        { type: 'image' as const, url: 'https://www.google.com/maps/place/St.+Cecilias+College+-+Cebu,+Inc./@10.2445161,123.7934703,18.5z/data=!4m15!1m8!3m7!1s0x33a977e4598c638d:0xd2016057b1f9cd28!2sMinglanilla,+Cebu!3b1!8m2!3d10.2454075!4d123.7959226!16zL20vMDZoNGhs!3m5!1s0x33a977e250bd286d:0x377f6ed9ed966fe7!8m2!3d10.2446906!4d123.7944106!16s%2Fg%2F1tfksvw4?entry=ttu&g_ep=EgoyMDI0MTExOS4yIKXMDSoASAFQAw%3D%3D', name: 'Google-map.gmap' },
      ],
    },
    {
      id: 2,
      title: "Online Class Advisory",
      content: "Due to the incoming typhoon, all classes will be conducted online from January 20-21, 2024.",
      author: "Academic Affairs",
      date: "Jan 14, 2024",
      isPinned: true,
      initialReactions: { count: 82 },
      attachments: [],
    },
  ]);

  const handleCreateAnnouncement = (newAnnouncement: any) => {
    setAnnouncements([
      {
        id: announcements.length + 1,
        ...newAnnouncement,
        author: "Admin Office",
        isPinned: false,
        initialReactions: { count: 0 },
        attachments: [],
      },
      ...announcements,
    ]);
    setShowCreateAnnouncement(false);
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
                    <BreadcrumbPage className="text-white">Announcements</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className='max-w-3xl mx-auto p-4 md:p-6 lg:p-8'>
            {/* Header Section */}
            <div className='bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 mb-8'>
              <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2 text-white'>
                  <Bell className="w-5 h-5 text-blue-400" />
                  Announcements
                </h2>
                <div className='flex flex-wrap gap-4'>
                  <div className='relative flex-grow md:flex-grow-0'>
                    <input
                      type="text"
                      placeholder="Search announcements"
                      className='w-full md:w-auto pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-white placeholder-gray-400 border border-gray-600'
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                  <button
                    onClick={() => setShowCreateAnnouncement(true)}
                    className='flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20 transition-all duration-200'
                  >
                    <Plus className="w-4 h-4" />
                    <span className='hidden md:inline'>New Announcement</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Announcements List */}
            <div className='space-y-4'>
              {announcements.map((announcement) => (
                <AnnouncementCard key={announcement.id} {...announcement} />
              ))}
            </div>
          </div>

          {showCreateAnnouncement && (
            <CreateAnnouncement
              onClose={() => setShowCreateAnnouncement(false)}
              onSubmit={handleCreateAnnouncement}
            />
          )}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default Announcements;

