export interface Meeting {
    id: string;
    teacher: string;
    subject: string;
    date: string;
    time: string;
    status: 'Approved' | 'Pending' | 'Rejected';
    studentName: string;
    description: string;
  }
  
  export interface MeetingFormData {
    subject: string;
    date: string;
    time: string;
    description: string;
  }
  
  export type MeetingStatus = Meeting['status'] | 'All';
  
  export interface MeetingFilter {
    status: MeetingStatus;
    searchTerm: string;
  }