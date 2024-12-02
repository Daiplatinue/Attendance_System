import { MeetingCard } from './meeting-card';
import type { Meeting } from '@/sections/componentStyles/types/meeting';

interface MeetingListProps {
  meetings: Meeting[];
  onStatusChange: (id: string, status: Meeting['status']) => void;
}

export const MeetingList = ({ meetings, onStatusChange }: MeetingListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {meetings.map((meeting) => (
        <MeetingCard
          key={meeting.id}
          meeting={meeting}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};