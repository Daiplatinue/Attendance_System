import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from 'lucide-react';
import axios from 'axios';

interface AddSubjectDialogProps {
  onAdd: (name: string) => void;
  buttonText?: string;
}

export function AddSubjectDialog({ onAdd, buttonText = "Add Subject" }: AddSubjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (subjectName.trim()) {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        const response = await axios.post('http://localhost:3000/api/teacher/subject', {
          u_id: userId,
          t_subject: subjectName.trim()
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        onAdd(subjectName.trim());
        setSubjectName('');
        setOpen(false);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to add subject. Please try again.');
        console.error('Error adding subject:', error);
      }
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="Enter subject name"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit">Add Subject</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}