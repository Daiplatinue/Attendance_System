import { MeetingCard } from "./meeting-card";
import type { Meeting } from "@/sections/componentStyles/types/meeting";

interface MeetingListProps {
  meetings: Meeting[];
  onStatusChange: (id: string, status: Meeting['status']) => void;
}

export const MeetingList = ({ meetings, onStatusChange }: MeetingListProps) => {
  if (!meetings || meetings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No meetings found.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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