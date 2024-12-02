export interface AttendanceRecord {
  timestamp: string | number;
  name: string;
  status?: 'Present' | 'Late' | 'Very Late';
}

export interface SectionSchedule {
  startTime: string; // Format: "HH:mm AM/PM"
  endTime: string; // Format: "HH:mm AM/PM"
}

export interface Section {
  name: string;
  schedule: SectionSchedule;
}