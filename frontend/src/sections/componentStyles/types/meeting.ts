export interface MeetingFormData {
  subject: string;
  date: string;
  time: string;
  description: string;
  student_id: string;
}

export interface Meeting {
  id: string;
  teacher: string;
  subject: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'done';
  description: string;
  studentName: string;
}

export interface MeetingFilter {
  status: string;
  searchTerm: string;
}