import { useState } from 'react';
import type { MeetingFormData } from '@/sections/componentStyles/types/meeting';

interface MeetingFormProps {
  onSubmit: (data: MeetingFormData) => void;
}

export const MeetingForm = ({ onSubmit }: MeetingFormProps) => {
  const [formData, setFormData] = useState<MeetingFormData>({
    subject: '',
    date: '',
    time: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4 transform transition-all duration-300">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 
                     bg-white/5 text-white placeholder-gray-400 border border-white/10
                     transition-all duration-200 hover:bg-white/10"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 
                     bg-white/5 text-white placeholder-gray-400 border border-white/10
                     transition-all duration-200 hover:bg-white/10"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Time</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 
                     bg-white/5 text-white placeholder-gray-400 border border-white/10
                     transition-all duration-200 hover:bg-white/10"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 
                     bg-white/5 text-white placeholder-gray-400 border border-white/10
                     transition-all duration-200 hover:bg-white/10"
            rows={4}
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 
                 hover:bg-blue-600 transition-all duration-200
                 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Submit Request
      </button>
    </form>
  );
};