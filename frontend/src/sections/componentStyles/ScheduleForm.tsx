import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ScheduleFormData {
  sc_subject: string;
  sc_day: string;
  sc_startTime: string;
  sc_endTime: string;
  sc_section: string;
  sc_room: string;
}

const initialFormData: ScheduleFormData = {
  sc_subject: '',
  sc_day: '',
  sc_startTime: '',
  sc_endTime: '',
  sc_section: '',
  sc_room: ''
};

const daysOfWeek = [
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
  { value: 'Sunday', label: 'Sunday' }
];


export function ScheduleForm() {
  const [formData, setFormData] = useState<ScheduleFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/create-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject_name: formData.sc_subject,
          day_of_week: formData.sc_day,
          start_time: formData.sc_startTime,
          end_time: formData.sc_endTime,
          section: formData.sc_section,
          room: formData.sc_room
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create schedule');
      }

      toast.success('Success', {
        description: 'Schedule created successfully!',
        style: {
          background: '#18181b',
          border: '1px solid #22c55e',
          color: '#fff',
        },
      });

      setFormData(initialFormData);
    } catch (error) {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Failed to create schedule',
        style: {
          background: '#111827',
          border: 'border-gray-900',
          color: '#fff',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-200">Subject</label>
          <Input
            name="sc_subject"
            value={formData.sc_subject}
            onChange={handleChange}
            required
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Enter subject name"
            maxLength={50}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-200">Day</label>
          <select
            name="sc_day"
            value={formData.sc_day}
            onChange={handleChange}
            required
            className="w-full rounded-md bg-gray-800 border-gray-700 text-white p-2"
          >
            <option value="">Select day</option>
            {daysOfWeek.map(day => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-200">Start Time</label>
          <Input
            type="time"
            name="sc_startTime"
            value={formData.sc_startTime}
            onChange={handleChange}
            required
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-200">End Time</label>
          <Input
            type="time"
            name="sc_endTime"
            value={formData.sc_endTime}
            onChange={handleChange}
            required
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-200">Section</label>
          <Input
            name="sc_section"
            value={formData.sc_section}
            onChange={handleChange}
            required
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Enter section"
            maxLength={50}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-200">Room</label>
          <Input
            name="sc_room"
            value={formData.sc_room}
            onChange={handleChange}
            required
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Enter room number"
            maxLength={50}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isSubmitting ? 'Creating Schedule...' : 'Create Schedule'}
      </Button>
    </form>
  );
}