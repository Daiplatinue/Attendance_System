import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from 'lucide-react';

interface AddSectionDialogProps {
  onAdd: (name: string, schedule: string) => void;
  buttonText?: string;
}

export function AddSectionDialog({ onAdd, buttonText = "Add Section" }: AddSectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [sectionName, setSectionName] = useState('');
  const [schedule, setSchedule] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (sectionName.trim() && schedule.trim()) {
      onAdd(sectionName.trim(), schedule.trim());
      setSectionName('');
      setSchedule('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <PlusCircle className="w-5 h-5 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-gray-900 text-white border border-gray-800'>
        <DialogHeader>
          <DialogTitle >Add New Section</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            placeholder="Enter section name"
            className="bg-gray-800 border-gray-800 text-white"
          />
          <Input
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            placeholder="Enter schedule (e.g., MWF 10:00-11:30)"
            className="bg-gray-800 border-gray-800 text-white"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className='bg-emerald-500 hover:bg-emerald-600 text-white'>Add Section</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}