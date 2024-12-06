export interface MeetingFormData {
  subject: string;
  date: string;
  time: string;
  description: string;
  teacherId: number;
  studentId: number;
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
  status: 'All' | 'pending' | 'approved' | 'done';
  searchTerm: string;
}

export interface User {
  u_id: number;
  u_fullname: string;
}

export interface MeetingFormProps {
  onSubmit: (data: MeetingFormData) => void;
  teachers: User[];
  students: User[];
}