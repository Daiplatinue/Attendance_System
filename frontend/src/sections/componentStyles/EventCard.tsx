import { Calendar, Clock, MapPin, Tag, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Event } from './types/events';

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
}

export function EventCard({ event, onViewDetails }: EventCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ongoing':
        return 'bg-green-400/20 text-green-400';
      case 'upcoming':
        return 'bg-yellow-400/20 text-yellow-400';
      case 'completed':
        return 'bg-gray-400/20 text-gray-400';
      default:
        return 'bg-blue-400/20 text-blue-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateDescription = (text: string | undefined, maxLength: number) => {
    if (!text) return '';
    return text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='bg-modalColor rounded-xl shadow-2xl p-6 border border-gray-800 backdrop-blur-lg h-full flex flex-col'
    >
      <div className='flex justify-between items-start mb-4'>
        <div className='flex-1 min-w-0 mr-3'>
          <h3 className='text-lg font-semibold text-white mb-1 truncate'>{event.name}</h3>
          {event.status.toLowerCase() === 'ongoing' ? (
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(event.status)}`}
            >
              {event.status}
            </motion.span>
          ) : (
            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(event.status)}`}>
              {event.status}
            </span>
          )}
        </div>
        <Avatar className='h-10 w-10 ring-2 ring-white/10 flex-shrink-0'>
          <AvatarImage src={event.avatarUrl} alt={event.name} />
          <AvatarFallback>{event.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>

      <div className='space-y-3 text-sm flex-grow'>
        <div className='flex items-center gap-2 text-gray-400'>
          <Tag className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{event.type}</span>
        </div>
        <div className='flex items-center gap-2 text-gray-400'>
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
        <div className='flex items-center gap-2 text-gray-400'>
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">
            {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </span>
        </div>
        <div className='flex items-center gap-2 text-gray-400'>
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">
            {formatTime(event.startTime)} - {formatTime(event.endTime)}
          </span>
        </div>
        <div className='flex items-center gap-2 text-gray-400'>
          <Users className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{event.departments.join(', ')}</span>
        </div>
      </div>

      <div className='mt-4 pt-4 border-t border-white/10'>
        <p className='text-sm text-gray-400 line-clamp-3'>
          {event.description ? truncateDescription(event.description, 150) : 'No description available'}
        </p>
      </div>

      <div className='mt-4 flex justify-end'>
        <button 
          onClick={() => onViewDetails(event)}
          className='text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors'
        >
          View Details →
        </button>
      </div>
    </motion.div>
  );
}