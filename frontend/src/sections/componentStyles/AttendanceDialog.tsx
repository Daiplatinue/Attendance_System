import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { recordAttendance } from '@/lib/sheets';
import { SheetUrlDialog } from '@/sections/componentStyles/UrlDialog';

export function AttendanceRecorder() {
  const [sheetUrl, setSheetUrl] = useState('');
  const [recording, setRecording] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRecordAttendance = async () => {
    if (!sheetUrl) {
      setDialogOpen(true);
      return;
    }

    setRecording(true);
    
    try {
      const result = await recordAttendance(sheetUrl);
      
      if (result.success) {
        toast.success('Success', {
          description: 'Attendance recorded successfully!',
          style: {
            background: '#18181b',
            border: '1px solid #22c55e',
            color: '#fff',
          },
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Failed to record attendance',
        style: {
          background: '#111827',
          border: 'border-gray-900',
          color: '#fff',
        },
      });
    } finally {
      setRecording(false);
    }
  };

  const handleUrlSubmit = (url: string) => {
    setSheetUrl(url);
    setDialogOpen(false);
    handleRecordAttendance();
  };

  return (
    <>
      <SheetUrlDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleUrlSubmit}
      />
      <Button 
        className="flex items-center h-[2.5rem] w-[13rem] gap-2 px-4 py-2.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20 transition-all duration-200"
        onClick={handleRecordAttendance}
        disabled={recording}
      >
        <Download size={16} />
        {recording ? 'Recording...' : 'Record Attendance'}
      </Button>
    </>
  );
}