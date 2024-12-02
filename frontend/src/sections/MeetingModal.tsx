import { Modal } from '@/components/ui/modal';
import { MeetingForm } from '@/components/meeting/meeting-form';
import type { Meeting, MeetingFormData } from '@/sections/componentStyles/types/meeting';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (meeting: Meeting) => void;
  meetings: Meeting[];
}

export const MeetingModal = ({ isOpen, onClose, onSubmit, meetings }: MeetingModalProps) => {
  const handleSubmit = (formData: MeetingFormData) => {
    const newMeeting: Meeting = {
      id: `MTG-${String(meetings.length + 1).padStart(3, '0')}`,
      teacher: "Teacher Name",
      studentName: "Student Name",
      status: "Pending",
      ...formData
    };
    
    onSubmit(newMeeting);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Meeting"
    >
      <MeetingForm onSubmit={handleSubmit} />
    </Modal>
  );
};