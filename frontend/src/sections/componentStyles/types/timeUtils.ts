import { SectionSchedule } from '../types/attendance';

export const DEFAULT_SCHEDULE: SectionSchedule = {
  startTime: "7:30 AM",
  endTime: "8:30 AM"
};

export function parseTime(timeStr: string): Date {
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  const date = new Date();
  let hour = hours;
  
  if (period === 'PM' && hours !== 12) {
    hour += 12;
  } else if (period === 'AM' && hours === 12) {
    hour = 0;
  }
  
  date.setHours(hour, minutes, 0, 0);
  return date;
}

export function getAttendanceStatus(timestamp: Date, schedule: SectionSchedule): 'Present' | 'Late' | 'Very Late' {
  const attendanceTime = timestamp;
  const startTime = parseTime(schedule.startTime);
  
  // Calculate time difference in minutes
  const diffInMinutes = Math.floor((attendanceTime.getTime() - startTime.getTime()) / (1000 * 60));
  
  if (diffInMinutes <= 0) {
    return 'Present';
  } else if (diffInMinutes <= 10) {
    return 'Late';
  } else if (diffInMinutes <= 30) {
    return 'Very Late';
  } else {
    return 'Very Late';
  }
}

export function convertTo12Hour(time24: string): string {
  const [hours, minutes] = time24.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function convertTo24Hour(time12: string): string {
  const [time, modifier] = time12.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  } else if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}