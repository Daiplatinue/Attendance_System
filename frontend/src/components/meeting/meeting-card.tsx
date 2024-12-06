import { Meeting } from '@/sections/componentStyles/types/meeting';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle2, Clock, X, Calendar, User } from 'lucide-react';

interface MeetingCardProps {
  meeting: Meeting;
  onStatusChange: (id: string, status: Meeting['status']) => void;
}

export const MeetingCard = ({ meeting, onStatusChange }: MeetingCardProps) => {
  const getStatusConfig = (status: Meeting['status']) => {
    const configs = {
      approved: {
        color: 'bg-green-400/20 text-green-400',
        icon: <CheckCircle2 className="w-4 h-4" />,
        borderColor: 'border-green-400/20',
        label: 'Approved'
      },
      pending: {
        color: 'bg-yellow-400/20 text-yellow-400',
        icon: <Clock className="w-4 h-4" />,
        borderColor: 'border-yellow-400/20',
        label: 'Pending'
      },
      done: {
        color: 'bg-blue-400/20 text-blue-400',
        icon: <CheckCircle2 className="w-4 h-4" />,
        borderColor: 'border-blue-400/20',
        label: 'Done'
      }
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(meeting.status);

  return (
    <div className="gradient-border rounded-xl overflow-hidden animate-scale-in">
      <div className="bg-modalColor p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 ring-2 ring-white/10">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${meeting.teacher}`} />
              <AvatarFallback>{meeting.teacher}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-white">{meeting.teacher}</h3>
              <p className="text-sm text-gray-400 flex items-center gap-1">
                <User className="w-3 h-3" />
                {meeting.studentName}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 inline-flex items-center gap-2 text-xs font-semibold 
                          rounded-full ${statusConfig.color} border ${statusConfig.borderColor}`}>
            {statusConfig.icon}
            {statusConfig.label}
          </span>
        </div>

        <div className="space-y-4 flex-grow">
          <div className="glass-effect rounded-lg p-4">
            <h4 className="font-medium text-primary-300 mb-2">{meeting.subject}</h4>
            <p className="text-sm text-gray-400">{meeting.description}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4 text-primary-400" />
            <span>{new Date(meeting.date).toLocaleDateString()} at {meeting.time}</span>
          </div>
        </div>

        {meeting.status === 'pending' && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => onStatusChange(meeting.id, 'approved')}
              className="flex-1 bg-green-500/10 text-green-400 rounded-lg px-4 py-2.5
                         transition-colors duration-200 border border-green-500/20 hover:bg-green-500/20"
            >
              Accept
            </button>
            <button
              onClick={() => onStatusChange(meeting.id, 'done')}
              className="flex-1 bg-red-500/10 text-red-400 rounded-lg px-4 py-2.5
                         transition-colors duration-200 border border-red-500/20 hover:bg-red-500/20"
            >
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );
};