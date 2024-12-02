import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Mail,
  Phone,
  Calendar,
  Building2,
  UserRound,
  CheckCircle2,
  XCircle,
  BadgeCheck,
  Clock,
  Ban,
  Briefcase,
  MapPin,
  Shield,
  Dna
} from 'lucide-react'
import { cn } from "@/lib/utils"

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: string;
  email: string;
  phone: string;
  joined: string;
  image?: string;
}

interface EmployeeModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  employee,
  isOpen,
  onClose,
}) => {
  if (!employee) return null;

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <BadgeCheck className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'retired':
        return <Ban className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';
      case 'pending':
        return 'bg-amber-400/10 text-amber-400 border-amber-400/20';
      case 'retired':
        return 'bg-rose-400/10 text-rose-400 border-rose-400/20';
      default:
        return 'bg-slate-400/10 text-slate-400 border-slate-400/20';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-modalColor text-white border border-white/10 shadow-2xl max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            <UserRound className="w-6 h-6 text-blue-400" />
            Account Details
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-8 py-6">
          {/* Left Column - Large Avatar */}
          <div className="w-full md:w-1/3 flex">
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <Avatar className="w-full h-full">
                <AvatarImage
                  src={employee.image || `/avatars/${employee.id}.jpg`}
                  className="object-cover w-full h-full"
                  alt={employee.name}
                />
                <AvatarFallback className="text-6xl bg-blue-500/10">
                  {employee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                "absolute bottom-4 left-4 right-4 px-4 py-2 rounded-lg backdrop-blur-md border",
                getStatusStyle(employee.status)
              )}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    {getStatusIcon(employee.status)}
                    {employee.status}
                  </span>
                  <span className="text-sm opacity-75">{employee.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Employee Information */}
          <div className="flex-1 flex flex-col">
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-white mb-2">{employee.name}</h3>
              <div className="flex items-center gap-2 text-lg text-blue-400">
                <Briefcase className="w-5 h-5" />
                {employee.role}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-400/10 rounded-lg">
                      <Building2 className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Dept | Student</p>
                      <p className="text-lg font-medium">{employee.department}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-violet-400/10 rounded-lg">
                      <Mail className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-lg font-medium">{employee.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-pink-400/10 rounded-lg">
                      <Calendar className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Join Date</p>
                      <p className="text-lg font-medium">{employee.joined}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-400/10 rounded-lg">
                      <Phone className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p className="text-lg font-medium">{employee.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-rose-400/10 rounded-lg">
                      <MapPin className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Location</p>
                      <p className="text-lg font-medium">Main Office</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-rose-400/10 rounded-lg">
                      <Dna className="w-5 h-5 text-sky-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Gender</p>
                      <p className="text-lg font-medium">Female</p>
                    </div>
                  </div>
                </div>


              </div>
            </div>

            <DialogFooter className="mt-auto pt-6 border-t border-white/10">
              <div className="flex gap-4 w-full">
                <Button
                  variant="outline"
                  className="flex-1 bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20 hover:text-rose-300 h-12"
                  onClick={onClose}
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Decline Application
                </Button>
                <Button
                  className="flex-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 hover:text-emerald-300 h-12"
                  onClick={onClose}
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Accept Application
                </Button>
              </div>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};