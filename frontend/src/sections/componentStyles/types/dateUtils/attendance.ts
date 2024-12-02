import { SectionSchedule } from '@/sections/componentStyles/types/attendance';

function parseTime(timeStr: string): Date {
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
  } else {
    return 'Very Late';
  }
}