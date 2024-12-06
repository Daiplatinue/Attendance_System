import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateAnnouncementProps {
  onClose: () => void;
  onSubmit: (announcement: any) => void;
}

const DEPARTMENT_TYPES = [
  'ADMIN OFFICE',
  'SAO OFFICE',
  'REGISTRAR OFFICE',
  'GUIDANCE OFFICE',
  'ACADEMIC OFFICE'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

const CreateAnnouncement: React.FC<CreateAnnouncementProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [department, setDepartment] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File ${file.name} is too large. Maximum size is 5MB.`;
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (attachments.length + files.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    let errorMessage: string | null = null;
    files.some(file => {
      errorMessage = validateFile(file);
      return errorMessage !== null;
    });

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setAttachments(prev => [...prev, ...files]);
    setError(null);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('am_title', title);
    formData.append('am_desc', content);
    formData.append('am_department', department);
    
    attachments.forEach(file => {
      formData.append('attachments', file);
    });

    try {
      const response = await fetch('http://localhost:3000/announcements', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to create announcement');
      }

      const result = await response.json();
      onSubmit({
        title,
        content,
        department,
        attachments,
        date: new Date().toISOString(),
        id: result.id
      });
      onClose();
    } catch (error) {
      console.error('Error creating announcement:', error);
      setError(error instanceof Error ? error.message : 'Failed to create announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4'>
      <div className='bg-modalColor rounded-2xl shadow-2xl border border-white/10 backdrop-blur-lg w-full max-w-2xl overflow-hidden'>
        {/* Header */}
        <div className='bg-gray-800/50 px-6 py-4 border-b border-gray-700 flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-white flex items-center gap-2'>
            Create Announcement
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-700/50">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {error && (
          <div className="mx-6 mt-4 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className='space-y-6'>
            {/* Title and Avatar Section */}
            <div className='flex items-start gap-4'>
              <Avatar className='h-12 w-12 ring-2 ring-gray-700'>
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=admin`} />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div className='flex-1 space-y-4'>
                <input
                  type="text"
                  placeholder="Announcement title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className='w-full bg-gray-800/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                />
                
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="w-full bg-gray-800/30 border-gray-700 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent className='bg-modalColor text-gray-200 border border-gray-800 '>
                    {DEPARTMENT_TYPES.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Content Section */}
            <textarea
              placeholder="What would you like to announce?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className='w-full h-40 bg-gray-800/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none'
            />

            {/* Attachments Display */}
            {attachments.length > 0 && (
              <div className='grid grid-cols-2 gap-3'>
                {attachments.map((file, index) => (
                  <div 
                    key={index} 
                    className='flex items-center gap-2 p-3 rounded-lg bg-gray-800/30 border border-gray-700 group hover:border-gray-600 transition-all duration-200'
                  >
                    {file.type.startsWith('image/') ? (
                      <ImageIcon className="w-5 h-5 text-blue-400 shrink-0" />
                    ) : (
                      <FileText className="w-5 h-5 text-blue-400 shrink-0" />
                    )}
                    <span className='text-sm text-gray-300 truncate'>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className='ml-auto text-gray-500 hover:text-red-400 transition-colors'
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className='flex items-center justify-between mt-6 pt-6 border-t border-gray-700'>
            <div className='flex items-center gap-3'>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className='text-gray-400 hover:text-white hover:bg-gray-700/50'
                disabled={attachments.length >= MAX_FILES}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <FileText className="w-5 h-5" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className='text-gray-400 hover:text-white hover:bg-gray-700/50'
                disabled={attachments.length >= MAX_FILES}
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <ImageIcon className="w-5 h-5" />
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                className='hidden'
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
              />
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                className='hidden'
                onChange={handleFileChange}
              />
              {attachments.length > 0 && (
                <span className="text-sm text-gray-400">
                  {attachments.length}/{MAX_FILES} files
                </span>
              )}
            </div>
            <div className='flex gap-3'>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose}
                className="hover:bg-gray-700/50"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!title || !content || !department || isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isSubmitting ? 'Posting...' : 'Post Announcement'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAnnouncement;