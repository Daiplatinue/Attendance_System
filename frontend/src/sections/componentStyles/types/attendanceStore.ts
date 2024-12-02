import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AttendanceStore {
  attendanceUrl: string;
  students: Student[];
  setAttendanceUrl: (url: string) => void;
  setStudents: (students: Student[]) => void;
}

interface Student {
  id: string;
  name: string;
  dropped: boolean;
}

export const useAttendanceStore = create<AttendanceStore>()(
  persist(
    (set) => ({
      attendanceUrl: '',
      students: [],
      setAttendanceUrl: (url) => set({ attendanceUrl: url }),
      setStudents: (students) => set({ students }),
    }),
    {
      name: 'attendance-store',
    }
  )
);