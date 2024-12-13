export interface AttendanceRecord {
  timestamp: string | number;
  name: string;
  status?: 'Present' | 'Late' | 'Very Late';
  subject: string;
  section: string;
  day: string;
  time: string;
}

export interface SectionSchedule {
  startTime: string; // Format: "HH:mm AM/PM"
  endTime: string; // Format: "HH:mm AM/PM"
}

export interface Section {
  name: string;
  schedule: SectionSchedule;
}

export interface Schedule {
  currentSubject: string;
  startTime?: string;
  endTime?: string;
  room?: string;
  section: string;
  day: string;
}