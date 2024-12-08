import React, { useEffect, useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar-parent"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset, SidebarProvider, SidebarTrigger
} from "@/components/ui/sidebar"
import { Bell, Search, Plus } from 'lucide-react'
import AnnouncementCard from '@/sections/componentStyles/AnnouncementCard'
import CreateAnnouncement from '@/sections/componentStyles/CreateAnnouncement'
import { Link } from 'react-router-dom';

interface Announcement {
  am_id: number;
  am_title: string;
  am_desc: string;
  am_department: string;
  am_date: string;
  am_react: number;
  am_avatar: string;
  attachments: Array<{
    att_id: number;
    att_fileName: string;
    att_filePath: string;
  }>;
}

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('http://localhost:3000/announcements');
      if (!response.ok) {
        throw new Error('Failed to fetch announcements');
      }
      const data = await response.json();

      // Sort announcements by date in descending order (newest first)
      const sortedAnnouncements = data.sort((a: Announcement, b: Announcement) => b.am_id - a.am_id);

      setAnnouncements(data);
      setAnnouncements(sortedAnnouncements);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleAnnouncementSubmit = async (newAnnouncement: any) => {
    await fetchAnnouncements();
    setIsCreateModalOpen(false);
  };

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.am_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.am_desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.am_department.toLowerCase().includes(searchQuery.toLowerCase())
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
                    <BreadcrumbPage className="text-white">Announcements</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className='max-w-3xl mx-auto p-4 md:p-6 lg:p-8'>
            {/* Header Section */}
            <div className='bg-modalColor rounded-xl shadow-2xl p-6 border border-gray-800 mb-8'>
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
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-full md:w-auto pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/5 text-white placeholder-gray-400'
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className='flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20 transition-all duration-200'
                  >
                    <Plus className="w-4 h-4" />
                    <span className='hidden md:inline'>New Announcement</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Announcements List */}
            <div className="space-y-6">
              {filteredAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.am_id}
                  id={announcement.am_id}
                  title={announcement.am_title}
                  content={announcement.am_desc}
                  author={announcement.am_department}
                  date={announcement.am_date}
                  isPinned={false}
                  initialReactions={{ count: announcement.am_react }}
                  avatar={announcement.am_avatar}
                  attachments={announcement.attachments.map(att => ({
                    type: att.att_fileName.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image' : 'file',
                    url: `/uploads/announcements/${att.att_filePath}`,
                    name: att.att_fileName
                  }))}
                />
              ))}
            </div>

          </div>

          {isCreateModalOpen && (
            <CreateAnnouncement
              onClose={() => setIsCreateModalOpen(false)}
              onSubmit={handleAnnouncementSubmit}
            />
          )}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default Announcements;