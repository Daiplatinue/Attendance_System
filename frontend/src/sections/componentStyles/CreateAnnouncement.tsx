import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Image as ImageIcon, X } from 'lucide-react'

interface CreateAnnouncementProps {
  onClose: () => void;
  onSubmit: (announcement: any) => void;
}

const CreateAnnouncement: React.FC<CreateAnnouncementProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      attachments,
      date: new Date().toISOString(),
    });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-modalColor rounded-xl shadow-2xl p-6 border border-white/10 backdrop-blur-lg w-full max-w-2xl'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-semibold text-white'>Create Announcement</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='flex items-center gap-4 mb-6'>
            <Avatar className='h-10 w-10'>
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=admin`} />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <input
                type="text"
                placeholder="Announcement title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full bg-white/5 rounded-lg px-4 py-2 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
            </div>
          </div>

          <textarea
            placeholder="What would you like to announce?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className='w-full h-32 bg-white/5 rounded-lg px-4 py-2 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4'
          />

          {attachments.length > 0 && (
            <div className='grid grid-cols-2 gap-4 mb-4'>
              {Array.from(attachments).map((file, index) => (
                <div key={index} className='flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10'>
                  {file.type.startsWith('image/') ? (
                    <ImageIcon className="w-5 h-5 text-blue-400" />
                  ) : (
                    <FileText className="w-5 h-5 text-blue-400" />
                  )}
                  <span className='text-sm text-gray-300 truncate'>{file.name}</span>
                </div>
              ))}
            </div>
          )}

          <div className='flex items-center justify-between'>
            <div className='flex gap-2'>
              <Button type="button" variant="ghost" size="icon" className='text-gray-400 hover:text-white' onClick={() => document.getElementById('file-upload')?.click()}>
                <FileText className="w-5 h-5" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className='text-gray-400 hover:text-white' onClick={() => document.getElementById('image-upload')?.click()}>
                <ImageIcon className="w-5 h-5" />
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                className='hidden'
                onChange={handleFileChange}
              />
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                className='hidden'
                onChange={handleFileChange}
              />
            </div>
            <div className='flex gap-2'>
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={!title || !content}>Post</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAnnouncement;