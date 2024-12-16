import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { useForm } from 'react-hook-form';

const API_URL = 'http://localhost:3000/auth';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface User {
  u_id: number;
  u_fullname: string;
  u_role: string;
}

export function CreateModal({ isOpen, onClose, onSuccess }: CreateModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState('parent');

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      u_fullname: '',
      u_role: 'parent',
      u_department: '',
      u_year: '',
      u_email: '',
      u_contact: '',
      u_address: '',
      u_password: '',
      u_section: '',
      u_studentParentID: ''
    }
  });

  const currentRole = watch('u_role');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const roleToFetch = currentRole === 'student' ? 'parent' : 'student';
        const response = await axios.get(`${API_URL}/users/${roleToFetch}`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
      }
    };

    if (currentRole === 'student' || currentRole === 'parent') {
      fetchUsers();
    }
  }, [currentRole]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);

      const response = await axios.post(`${API_URL}/createAdmin`, data);
      const userId = response.data.userId;
      setQrCode(response.data.qrCode);

      if (file) {
        const formData = new FormData();
        formData.append('profile', file);
        formData.append('userId', userId.toString());

        await axios.post(`${API_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      toast.success('Account created successfully!');
      reset();
      setFile(null);
      setPreviewImage('');
      onSuccess();
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-modalColor border border-white/10 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Account</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  {...register('u_fullname', { required: 'Full name is required' })}
                  className="bg-white/5 border-white/10 text-white"
                />
                {errors.u_fullname && (
                  <span className="text-red-500 text-sm">{errors.u_fullname.message}</span>
                )}
              </div>

              <div>
                <Label>Role</Label>
                <Select
                  onValueChange={(value) => {
                    setValue('u_role', value);
                    setSelectedRole(value);
                  }}
                  defaultValue="parent"
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-modalColor border-white/10 text-white">
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {currentRole === 'student' && (
                <div>
                  <Label>Parent</Label>
                  <Select
                    onValueChange={(value) => setValue('u_studentParentID', value)}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select parent" />
                    </SelectTrigger>
                    <SelectContent className="bg-modalColor border-white/10 text-white">
                      {users.map((user) => (
                        <SelectItem key={user.u_id} value={user.u_id.toString()}>
                          {user.u_fullname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {currentRole === 'parent' && (
                <div>
                  <Label>Student</Label>
                  <Select
                    onValueChange={(value) => setValue('u_studentParentID', value)}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent className="bg-modalColor border-white/10 text-white">
                      {users.map((user) => (
                        <SelectItem key={user.u_id} value={user.u_id.toString()}>
                          {user.u_fullname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label>Department</Label>
                <Input
                  {...register('u_department')}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <Label>Section</Label>
                <Input
                  {...register('u_section')}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <Label>Year</Label>
                <Input
                  {...register('u_year')}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  {...register('u_email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="bg-white/5 border-white/10 text-white"
                />
                {errors.u_email && (
                  <span className="text-red-500 text-sm">{errors.u_email.message}</span>
                )}
              </div>

              <div>
                <Label>Contact</Label>
                <Input
                  {...register('u_contact', { required: 'Contact is required' })}
                  className="bg-white/5 border-white/10 text-white"
                />
                {errors.u_contact && (
                  <span className="text-red-500 text-sm">{errors.u_contact.message}</span>
                )}
              </div>

              <div>
                <Label>Address</Label>
                <Input
                  {...register('u_address')}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  {...register('u_password', { required: 'Password is required' })}
                  type="password"
                  className="bg-white/5 border-white/10 text-white"
                />
                {errors.u_password && (
                  <span className="text-red-500 text-sm">{errors.u_password.message}</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-4">
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Profile preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-white/10"
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>QR Code</Label>
              <div className="flex flex-col items-center gap-4">
                {qrCode && (
                  <div className="bg-white p-2 rounded-lg">
                    <QRCodeSVG value={qrCode} size={100} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-white/5 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}