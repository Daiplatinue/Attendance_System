import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Event } from './types/events';
import axios from 'axios';
import { toast } from 'sonner';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: Omit<Event, 'id'>) => void;
}

export function CreateEventModal({ isOpen, onClose, onSubmit }: CreateEventModalProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    type: '',
    location: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    departments: [] as string[],
    organizer: '',
    description: '',
    avatarUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState('');
  const [isValidUrl, setIsValidUrl] = React.useState(true);

  const validateImageUrl = (url: string) => {
    if (!url) return true; // Empty URL is considered valid
    const pattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
    return pattern.test(url);
  };

  const handleAvatarUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({ ...formData, avatarUrl: url });
    setIsValidUrl(validateImageUrl(url));
    setPreviewUrl(url);
  };

  const handleImageError = () => {
    setIsValidUrl(false);
    toast.error('Invalid image URL. Please provide a valid image URL.');
  };

  const validateForm = () => {
    if (!formData.name) return 'Event name is required';
    if (!formData.type) return 'Event type is required';
    if (!formData.location) return 'Location is required';
    if (!formData.startDate) return 'Start date is required';
    if (!formData.endDate) return 'End date is required';
    if (!formData.startTime) return 'Start time is required';
    if (!formData.endTime) return 'End time is required';
    if (!formData.departments.length) return 'At least one department is required';
    if (!formData.organizer) return 'Organizer is required';
    if (!formData.description) return 'Description is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (formData.avatarUrl && !isValidUrl) {
      toast.error('Please provide a valid image URL');
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure departments is properly formatted
      const departmentsString = formData.departments.join(', ');

      const eventData = {
        ...formData,
        departments: departmentsString,
        status: 'Upcoming',
        avatarUrl: isValidUrl ? formData.avatarUrl : ''
      };

      const response = await axios.post('http://localhost:3000/api/createEvent', eventData);

      if (response.status === 201) {
        toast.success('Event created successfully!');
        onSubmit(response.data.event);
        onClose();
        setFormData({
          name: '',
          type: '',
          location: '',
          startDate: '',
          endDate: '',
          startTime: '',
          endTime: '',
          departments: [],
          organizer: '',
          description: '',
          avatarUrl: '',
        });
        setPreviewUrl('');
      }
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast.error(error.response?.data?.message || 'Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-modalColor text-white border border-white/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                required
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-modalColor border-white/10 text-white">
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                min={formData.startDate}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="departments">Departments (comma-separated)</Label>
            <Input
              id="departments"
              value={formData.departments.join(', ')}
              onChange={(e) => setFormData({ 
                ...formData, 
                departments: e.target.value.split(',').map(d => d.trim()).filter(Boolean)
              })}
              className="bg-white/5 border-white/10 text-white"
              placeholder="IT, CS, Engineering"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizer">Organizer</Label>
            <Input
              id="organizer"
              value={formData.organizer}
              onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Event Avatar URL (optional)</Label>
            <Input
              id="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleAvatarUrlChange}
              className={`bg-white/5 border-white/10 text-white ${!isValidUrl && formData.avatarUrl ? 'border-red-500' : ''}`}
              placeholder="https://example.com/image.jpg"
            />
            {!isValidUrl && formData.avatarUrl && (
              <p className="text-red-500 text-sm mt-1">Please enter a valid image URL (jpg, jpeg, png, gif, webp)</p>
            )}
            {isValidUrl && previewUrl && (
              <div className="mt-2">
                <p className="text-sm text-gray-400 mb-2">Preview:</p>
                <img
                  src={previewUrl}
                  alt="Avatar preview"
                  className="w-32 h-32 object-cover rounded-lg"
                  onError={handleImageError}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-white/5 border-white/10 text-white min-h-[100px]"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={isSubmitting}
              className="bg-white/5 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || (formData.avatarUrl !== '' && !isValidUrl)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}