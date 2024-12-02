import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { useAttendanceData } from './types/useAttendanceData';
import { AttendanceTable } from './AttendanceTable';
import { UrlInput } from './UrlInput';
import { SectionSchedule } from './types/attendance';
import { DEFAULT_SCHEDULE, convertTo12Hour, convertTo24Hour } from '@/sections/componentStyles/types/timeUtils';

export function ViewAttendanceDialog() {
  const [attendanceUrl, setAttendanceUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [schedule, setSchedule] = useState<SectionSchedule>(DEFAULT_SCHEDULE);
  const [showScheduleInput, setShowScheduleInput] = useState(false);
  const [tempSchedule, setTempSchedule] = useState(DEFAULT_SCHEDULE);
  
  const { attendanceData, isLoading } = useAttendanceData(
    showUrlInput ? null : attendanceUrl
  );

  useEffect(() => {
    const savedUrl = localStorage.getItem('attendanceUrl');
    const savedSchedule = localStorage.getItem('sectionSchedule');
    
    if (savedUrl) {
      setAttendanceUrl(savedUrl);
    } else {
      setShowUrlInput(true);
    }

    if (savedSchedule) {
      try {
        const parsed = JSON.parse(savedSchedule);
        setSchedule(parsed);
        setTempSchedule(parsed);
      } catch (error) {
        console.error('Error parsing saved schedule:', error);
        setSchedule(DEFAULT_SCHEDULE);
        setTempSchedule(DEFAULT_SCHEDULE);
      }
    }
  }, []);

  const handleSaveUrl = () => {
    if (!attendanceUrl) {
      toast.error('Please enter a valid URL');
      return;
    }

    localStorage.setItem('attendanceUrl', attendanceUrl);
    setShowUrlInput(false);
    toast.success('Attendance URL saved successfully');
  };

  const handleScheduleChange = (newSchedule: SectionSchedule) => {
    setSchedule(newSchedule);
    setTempSchedule(newSchedule);
    localStorage.setItem('sectionSchedule', JSON.stringify(newSchedule));
    setShowScheduleInput(false);
    toast.success('Schedule updated successfully');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20 transition-all duration-200">
          <Eye size={16} />
          View Attendance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] bg-modalColor text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className='mb-[-17px]'>Attendance Records</DialogTitle>
        </DialogHeader>
        
        {showUrlInput ? (
          <UrlInput
            url={attendanceUrl}
            onUrlChange={setAttendanceUrl}
            onSave={handleSaveUrl}
            onCancel={() => setIsOpen(false)}
          />
        ) : showScheduleInput ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Start Time</label>
              <Input
                type="time"
                value={convertTo24Hour(tempSchedule.startTime)}
                onChange={(e) => setTempSchedule(prev => ({
                  ...prev,
                  startTime: convertTo12Hour(e.target.value)
                }))}
                className="bg-zinc-800/50 border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">End Time</label>
              <Input
                type="time"
                value={convertTo24Hour(tempSchedule.endTime)}
                onChange={(e) => setTempSchedule(prev => ({
                  ...prev,
                  endTime: convertTo12Hour(e.target.value)
                }))}
                className="bg-zinc-800/50 border-gray-700"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                className="bg-white-500/10 text-gray-300 rounded-lg hover:bg-blue-500/20 border border-gray-700"
                onClick={() => {
                  setTempSchedule(schedule);
                  setShowScheduleInput(false);
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20"
                onClick={() => handleScheduleChange(tempSchedule)}
              >
                Save Schedule
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <Button 
                size="sm" 
                className="bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all duration-200"
                onClick={() => setShowUrlInput(true)}
              >
                Change URL
              </Button>
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-gray-400">Schedule: </span>
                  <span>{schedule.startTime} - {schedule.endTime}</span>
                </div>
                <Button
                  size="sm"
                  className="bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-all duration-200"
                  onClick={() => setShowScheduleInput(true)}
                >
                  Change Schedule
                </Button>
              </div>
            </div>

            {isLoading && attendanceData.length === 0 ? (
              <div className="text-center py-8">Loading attendance data...</div>
            ) : (
              <AttendanceTable data={attendanceData} schedule={schedule} />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}