import React, { useState, useEffect } from 'react';
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
  avatar?: string;
}

const AnnouncementCard: React.FC<AnnouncementProps> = ({    
  id,
  title,
  content,
  author,
  date,
  isPinned,
  initialReactions,
  attachments,
  avatar = 'default-avatar.png'
}) => {
  const [reactions, setReactions] = useState(initialReactions);
  const [hasReacted, setHasReacted] = useState(false);

  const handleReaction = async () => {
    try {
      const response = await fetch(`http://localhost:3000/announcements/${id}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: !hasReacted }),
      });

      if (!response.ok) throw new Error('Failed to update reaction');

      const data = await response.json();
      setReactions({ count: data.reactions });
      setHasReacted(!hasReacted);
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  const handleAttachmentClick = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  useEffect(() => {
    const fetchReactionState = async () => {
      try {
        const response = await fetch(`http://localhost:3000/announcements/${id}/reactions`);
        if (response.ok) {
          const data = await response.json();
          setReactions({ count: data.reactions });
          setHasReacted(data.hasReacted);
        }
      } catch (error) {
        console.error('Error fetching reactions:', error);
      }
    };

    fetchReactionState();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  return (
    <div className='bg-modalColor rounded-xl shadow-2xl p-6 border border-gray-800'>
      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-center gap-4'>
          <Avatar className='h-10 w-10 ring-2 ring-gray-700'>
            <AvatarImage src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author}`} alt={author} />
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
                {formatDate(date)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className='text-gray-300 mb-4 whitespace-pre-wrap'>{content}</p>

      {attachments && attachments.length > 0 && (
        <div className='flex flex-wrap gap-4 mb-4'>
          {attachments.map((attachment, index) => (
            <button
              key={index}
              onClick={() => handleAttachmentClick(attachment.url, attachment.name)}
              className='flex items-center gap-2 p-3 rounded-lg bg-modalColor hover:bg-gray-600 transition-colors border border-gray-700'
            >
              {attachment.type === 'image' ? (
                <ImageIcon className="w-5 h-5 text-blue-400" />
              ) : (
                <FileText className="w-5 h-5 text-blue-400" />
              )}
              <span className='text-sm text-gray-300 truncate max-w-[150px]'>{attachment.name}</span>
            </button>
          ))}
        </div>
      )}

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