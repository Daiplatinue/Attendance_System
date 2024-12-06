import { useState, useEffect } from 'react';
import type { MeetingFormData } from '@/sections/componentStyles/types/meeting';
import axios from 'axios';

interface Student {
  u_id: string;
  u_fullname: string;
}

interface MeetingFormProps {
  onSubmit: (data: MeetingFormData) => void;
}

// Configure axios base URL
const api = axios.create({
  baseURL: 'http://localhost:3000', // Update this with your actual API base URL
});

export const MeetingForm = ({ onSubmit }: MeetingFormProps) => {
  const [formData, setFormData] = useState<MeetingFormData>({
    subject: '',
    date: '',
    time: '',
    description: '',
    student_id: ''
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        console.log('Fetching students...');
        const response = await api.get('/api/meetings/students', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Students response:', response.data);
        
        if (Array.isArray(response.data)) {
          setStudents(response.data);
          console.log('Students set:', response.data);
        } else {
          console.error('Invalid students data format:', response.data);
          setError('Invalid data format received from server');
          setStudents([]);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Failed to fetch students');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Submitting form data:', formData);
      const response = await api.post(
        '/api/meetings/create',
        {
          mt_title: formData.subject,
          mt_description: formData.description,
          mt_date: formData.date,
          mt_time: formData.time,
          student_id: formData.student_id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 201) {
        console.log('Meeting created successfully');
        onSubmit(formData);
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  };

  if (loading) {
    return <div className="text-white">Loading students...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4 transform transition-all duration-300">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Student</label>
          <select
            value={formData.student_id}
            onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 
                     bg-white/5 text-white placeholder-gray-400 border border-white/10
                     transition-all duration-200 hover:bg-white/10"
            required
          >
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student.u_id} value={student.u_id}>
                {student.u_fullname}
              </option>
            ))}
          </select>
        </div>
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