import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Pin, Calendar, Heart, FileText, ImageIcon } from 'lucide-react'

interface Reaction {
  count: number;
}

type AttachmentType = 'file' | 'image';

interface Attachment {
  type: AttachmentType;
  url: string;
  name: string;
}

interface AnnouncementProps {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  isPinned: boolean;
  initialReactions: Reaction;
  attachments: Attachment[];
}

const AnnouncementCard: React.FC<AnnouncementProps> = ({    
  title,
  content,
  author,
  date,
  isPinned,
  initialReactions,
  attachments
}) => {
  const [reactions, setReactions] = useState(initialReactions);
  const [hasReacted, setHasReacted] = useState(false);

  const handleReaction = () => {
    if (hasReacted) {
      setReactions(prev => ({ count: prev.count - 1 }));
    } else {
      setReactions(prev => ({ count: prev.count + 1 }));
    }
    setHasReacted(!hasReacted);
  };

  return (
    <div className='bg-modalColor rounded-xl shadow-2xl p-6 border border-gray-800'>
      {/* Header */}
      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-center gap-4'>
          <Avatar className='h-10 w-10 ring-2 ring-gray-700'>
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${author}`} alt={author} />
            <AvatarFallback>{author[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className='text-lg font-semibold text-white flex items-center gap-2'>
              {title}
              {isPinned && <Pin className="w-4 h-4 text-yellow-400" />}
            </h3>
            <div className='flex items-center gap-2 text-sm text-gray-400'>
              <span>{author}</span>
              <span>•</span>
              <span className='flex items-center gap-1'>
                <Calendar className="w-4 h-4" />
                {date}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <p className='text-gray-300 mb-4'>{content}</p>

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className='grid grid-cols-2 gap-4 mb-4'>
          {attachments.map((attachment, index) => (
            <a
              key={index}
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className='flex items-center gap-2 p-3 rounded-lg bg-modalColor hover:bg-gray-600 transition-colors border border-gray-700'
            >
              {attachment.type === 'image' ? (
                <ImageIcon className="w-5 h-5 text-blue-400" />
              ) : (
                <FileText className="w-5 h-5 text-blue-400" />
              )}
              <span className='text-sm text-gray-300 truncate'>{attachment.name}</span>
            </a>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className='flex items-center justify-between text-sm text-gray-400 mb-[-10px]'>
        <div className='flex items-center gap-2'>
          <Heart className="w-4 h-4 text-red-400" />
          <span>{reactions.count}</span>
        </div>
        <Button 
          variant="ghost" 
          className={`mr-4 ${hasReacted ? 'text-red-400' : 'text-gray-400'} hover:text-red-400`}
          onClick={handleReaction}
        >
          <Heart className="w-4 h-4 mr-2" />
          {hasReacted ? 'Liked' : 'Like'}
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementCard;