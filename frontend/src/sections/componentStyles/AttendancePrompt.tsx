import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, LogOut } from 'lucide-react';

interface AttendanceData {
  attendanceId: number;
  currentTime: string;
  userData: {
    user: {
      u_fullname: string;
    };
  };
  scheduleData: {
    section: string;
    room: string;
    startTime: string;
    endTime: string;
  };
  currentSubject: string;
  sheetUrl: string;
}

interface AttendancePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onClockIn: () => Promise<void>;
  onClockOut: (data: AttendanceData) => Promise<void>;
  promptData: AttendanceData;
}

export function AttendancePrompt({ 
  isOpen, 
  onClose, 
  onClockIn, 
  onClockOut,
  promptData 
}: AttendancePromptProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-modalColor border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Attendance Options
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-4 py-4">
          <div className="flex flex-col items-center gap-6">
            <div className="w-full space-y-4">
              <Button
                onClick={onClockIn}
                className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-3 text-lg"
              >
                <Clock className="h-6 w-6" />
                Take New Attendance
              </Button>

              <Button
                onClick={() => onClockOut(promptData)}
                className="w-full h-16 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-3 text-lg"
              >
                <LogOut className="h-6 w-6" />
                Clock Out
              </Button>
            </div>

            <div className="text-center text-sm text-gray-400">
              <p>Choose whether to record a new attendance</p>
              <p>or clock out from your current session.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}