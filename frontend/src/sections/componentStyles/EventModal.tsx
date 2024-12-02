import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Event } from '@/sections/componentStyles/types/events';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventModal({ event, isOpen, onClose }: EventModalProps) {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-modalColor text-white border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{event.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Tag className="w-4 h-4" />
                <span>{event.type}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{event.startDate} - {event.endDate}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{event.departments.join(', ')}</span>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-400">{event.description}</p>
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