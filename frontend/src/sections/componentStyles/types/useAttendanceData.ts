import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AttendanceRecord } from '@/sections/componentStyles/types/attendance';
import { fetchJSONP } from '@/sections/componentStyles/types/jsonp';

export function useAttendanceData(url: string | null) {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!url) return;
    
    setIsLoading(true);
    try {
      const data = await fetchJSONP(url);
      setAttendanceData(data as AttendanceRecord[]);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch attendance data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (url) {
      fetchData();
      // Poll for updates every 5 seconds
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [url]);

  return { attendanceData, isLoading, error, refetch: fetchData };
}