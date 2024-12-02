import { Calendar, UserPlus } from 'lucide-react';

interface MeetingHeaderProps {
  onRequestMeeting: () => void;
}

export const MeetingHeader = ({ onRequestMeeting }: MeetingHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center
                      animate-pulse">
          <Calendar className="w-6 h-6 text-primary-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Meeting Schedule</h1>
          <p className="text-gray-400">Manage your upcoming meetings</p>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={onRequestMeeting}
          className="px-6 py-2 flex items-center gap-1  bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20 transition-all duration-200"
        >
          <UserPlus className="w-4 h-4" />
          Request Meeting
        </button>
      </div>
    </div>
  );
};