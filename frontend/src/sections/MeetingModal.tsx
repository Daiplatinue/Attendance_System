import { Modal } from '@/components/ui/modal';
import { MeetingForm } from '@/components/meeting/meeting-form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Meeting, MeetingFormData } from '@/sections/componentStyles/types/meeting';

interface User {
  u_id: number;
  u_fullname: string;
}

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (meeting: Meeting) => void;
  meetings: Meeting[];
}

export const MeetingModal = ({ isOpen, onClose, onSubmit, meetings }: MeetingModalProps) => {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [teachersRes, studentsRes] = await Promise.all([
          axios.get('/api/meetings/teachers', { headers }),
          axios.get('/api/meetings/students', { headers })
        ]);

        setTeachers(teachersRes.data);
        setStudents(studentsRes.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const handleSubmit = async (formData: MeetingFormData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/meetings/create', 
        {
          mt_title: formData.subject,
          mt_description: formData.description,
          mt_date: formData.date,
          mt_time: formData.time,
          teacher_id: formData.teacherId,
          student_id: formData.studentId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const selectedTeacher = teachers.find(t => t.u_id === formData.teacherId);
      const selectedStudent = students.find(s => s.u_id === formData.studentId);

      const newMeeting: Meeting = {
        id: response.data.meetingId,
        teacher: selectedTeacher?.u_fullname || '',
        studentName: selectedStudent?.u_fullname || '',
        subject: formData.subject,
        date: formData.date,
        time: formData.time,
        status: 'pending',
        description: formData.description
      };
      
      onSubmit(newMeeting);
      onClose();
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Meeting"
    >
      <MeetingForm 
        onSubmit={handleSubmit}
        teachers={teachers}
        students={students}
      />
    </Modal>
  );
};