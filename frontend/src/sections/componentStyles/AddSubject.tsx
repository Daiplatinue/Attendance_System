import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle } from 'lucide-react'

interface AddSubjectDialogProps {
  onAdd: (name: string) => void
  buttonText?: string
}

export function AddSubjectDialog({ onAdd, buttonText = "Add Subject" }: AddSubjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [subjectName, setSubjectName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (subjectName.trim()) {
      onAdd(subjectName.trim())
      setSubjectName('')
      setOpen(false)
    }
  }

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
          <Button type="submit">Add Subject</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}