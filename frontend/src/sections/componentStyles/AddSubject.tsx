import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from 'lucide-react';

interface AddSubjectDialogProps {
  onAdd: (name: string) => void;
  buttonText?: string;
}

export function AddSubjectDialog({ onAdd, buttonText = "Add Subject" }: AddSubjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (subjectName.trim()) {
      onAdd(subjectName.trim());
      setSubjectName('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <PlusCircle className="w-5 h-5 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-gray-900 text-white border border-gray-800'>
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="Enter subject name"
            className="bg-gray-800 border-gray-800 text-white"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Add Subject</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}