import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Event } from './types/events';
import { Calendar, Clock, MapPin, Tag, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventModal({ event, isOpen, onClose }: EventModalProps) {
  if (!event) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-modalColor text-white border border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-white/10">
              <AvatarImage src={event.avatarUrl} alt={event.name} />
              <AvatarFallback>{event.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl font-semibold mb-2">{event.name}</DialogTitle>
              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                event.status.toLowerCase() === 'ongoing' 
                  ? 'bg-green-400/20 text-green-400'
                  : event.status.toLowerCase() === 'upcoming'
                  ? 'bg-yellow-400/20 text-yellow-400'
                  : 'bg-gray-400/20 text-gray-400'
              }`}>
                {event.status}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Tag className="w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-400">Event Type</p>
                  <p className="font-medium">{event.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Calendar className="w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-400">Date</p>
                  <p className="font-medium">
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Clock className="w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-400">Time</p>
                  <p className="font-medium">
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center gap-3 text-gray-300 mb-4">
              <Users className="w-5 h-5" />
              <div>
                <p className="text-sm text-gray-400">Departments</p>
                <p className="font-medium">{event.departments.join(', ')}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-400 whitespace-pre-wrap">
              {event.description || 'No description available'}
            </p>
          </div>

          <div className="border-t border-white/10 pt-4">
            <h3 className="font-semibold mb-2">Organizer</h3>
            <p className="text-gray-400">{event.organizer}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}