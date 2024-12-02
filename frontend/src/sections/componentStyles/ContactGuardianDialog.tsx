import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Mail, Send, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'sonner';
import { sendEmail } from '@/sections/componentStyles/services/emailService';

interface ContactGuardianDialogProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
}

type ContactMethod = 'email' | 'meeting';

export function ContactGuardianDialog({ isOpen, onClose, studentName }: ContactGuardianDialogProps) {
  const [contactMethod, setContactMethod] = useState<ContactMethod>('email');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (contactMethod === 'email') {
      if (!recipientEmail.trim()) {
        toast.error('Please enter recipient email');
        return;
      }
      if (!message.trim()) {
        toast.error('Please enter a message');
        return;
      }

      try {
        setIsLoading(true);
        await sendEmail(recipientEmail, message);
        toast.success('Email sent to guardian successfully');
        setRecipientEmail('');
        setMessage('');
        onClose();
      } catch (error) {
        toast.error('Failed to send email. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!meetingDate || !meetingTime) {
        toast.error('Please select both date and time for the meeting');
        return;
      }

      setIsLoading(true);
      // Simulate meeting scheduling
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Meeting request sent to guardian successfully');
      setIsLoading(false);
      setMeetingDate('');
      setMeetingTime('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-white/10 text-white max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Phone className="w-6 h-6 text-blue-400" />
            Contact Guardian
          </DialogTitle>
        </DialogHeader>
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-2">
            <p className="text-gray-400">Regarding student:</p>
            <p className="text-lg font-semibold text-white">{studentName}</p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant={contactMethod === 'email' ? 'default' : 'secondary'}
              onClick={() => setContactMethod('email')}
              className="flex-1"
            >
              <Mail className="w-5 h-5 mr-2" />
              Send Email
            </Button>
            <Button
              type="button"
              variant={contactMethod === 'meeting' ? 'default' : 'secondary'}
              onClick={() => setContactMethod('meeting')}
              className="flex-1"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Arrange Meeting
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {contactMethod === 'email' ? (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Guardian's Email
                    </label>
                    <Input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="guardian@example.com"
                      className="bg-gray-800/50 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Email Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter your message..."
                      className="w-full h-32 px-3 py-2 bg-gray-800/50 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500 resize-none"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="meeting"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Meeting Date
                    </label>
                    <Input
                      type="date"
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="bg-gray-800/50 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Meeting Time
                    </label>
                    <Input
                      type="time"
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                      className="bg-gray-800/50 border-white/10 text-white"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-t-2 border-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : contactMethod === 'email' ? (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Email
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5 mr-2" />
                    Schedule Meeting
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}