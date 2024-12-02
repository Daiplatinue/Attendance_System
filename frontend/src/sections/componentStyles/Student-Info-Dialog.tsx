import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Student } from "@/sections/componentStyles/types/teacher";
import { motion } from "framer-motion";
import { UserCircle, GraduationCap, AlertCircle, CheckCircle, Phone } from "lucide-react";
import { ContactGuardianDialog } from './ContactGuardianDialog';

interface StudentInfoDialogProps {
    student: Student;
    isOpen: boolean;
    onClose: () => void;
    onDrop: (studentId: string) => void;
}

export function StudentInfoDialog({ student, isOpen, onClose, onDrop }: StudentInfoDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showContactDialog, setShowContactDialog] = useState(false);

    const handleDrop = async () => {
        setIsLoading(true);
        await onDrop(student.id);
        setIsLoading(false);
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="bg-gray-900 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <UserCircle className="w-6 h-6 text-blue-400" />
                            Student Information
                        </DialogTitle>
                    </DialogHeader>
                    <motion.div 
                        className="space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center gap-3">
                            <GraduationCap className="w-5 h-5 text-purple-400" />
                            <div>
                                <p className="text-gray-400 text-sm">Student ID</p>
                                <p className="text-lg font-semibold">{student.id}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <UserCircle className="w-5 h-5 text-green-400" />
                            <div>
                                <p className="text-gray-400 text-sm">Name</p>
                                <p className="text-lg font-semibold">{student.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {student.dropped ? (
                                <AlertCircle className="w-5 h-5 text-red-400" />
                            ) : (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                            )}
                            <div>
                                <p className="text-gray-400 text-sm">Status</p>
                                <p className={`text-lg font-semibold ${student.dropped ? 'text-red-400' : 'text-green-400'}`}>
                                    {student.dropped ? 'Dropped' : 'Enrolled'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={handleDrop}
                                disabled={isLoading}
                                className={`flex-1 transition-all duration-300 ${
                                    student.dropped 
                                        ? 'bg-green-600 hover:bg-green-700' 
                                        : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                {isLoading ? (
                                    <motion.div
                                        className="w-5 h-5 border-t-2 border-white rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                ) : student.dropped ? (
                                    <>
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Restore Student
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="w-5 h-5 mr-2" />
                                        Drop Student
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={() => setShowContactDialog(true)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                                <Phone className="w-5 h-5 mr-2" />
                                Contact Guardian
                            </Button>
                        </div>
                    </motion.div>
                </DialogContent>
            </Dialog>
            <ContactGuardianDialog
                isOpen={showContactDialog}
                onClose={() => setShowContactDialog(false)}
                studentName={student.name}
            />
        </>
    );
}