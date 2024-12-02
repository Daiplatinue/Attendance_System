import { useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar-teacher"
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset, SidebarProvider, SidebarTrigger
} from "@/components/ui/sidebar"
import { Book, Users, Search, GraduationCap, Clock, School, Filter } from 'lucide-react'
import { Student, Section, Subject } from '@/sections/componentStyles/types/teacher';
import { AddSubjectDialog } from '@/sections/componentStyles/AddSubject';
import { AddSectionDialog } from '@/sections/componentStyles/AddSection';
import { ImportStudentsDialog } from '@/sections/componentStyles/Import';
import { StudentInfoDialog } from '@/sections/componentStyles/Student-Info-Dialog';
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ViewAttendanceDialog } from './componentStyles/ViewAttendanceDialog';

export default function Home() {
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedSection, setSelectedSection] = useState<Section | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [statusFilter, setStatusFilter] = useState<'all' | 'enrolled' | 'dropped'>('all');

    const handleAddSubject = (name: string) => {
        const newSubject: Subject = {
            id: subjects.length + 1,
            name,
            sections: []
        };
        setSubjects([...subjects, newSubject]);
    };

    const handleImportStudents = (importedStudents: Student[]) => {
        if (selectedSubject && selectedSection) {
            const existingIds = new Set(selectedSection.students.map(s => s.id));
            const newStudents = importedStudents.map(student => ({
                ...student,
                dropped: false
            })).filter(student => !existingIds.has(student.id));

            const updatedSection = {
                ...selectedSection,
                students: [...selectedSection.students, ...newStudents]
            };
            const updatedSubject = {
                ...selectedSubject,
                sections: selectedSubject.sections.map(s =>
                    s.id === selectedSection.id ? updatedSection : s
                )
            };
            setSubjects(subjects.map(s => s.id === selectedSubject.id ? updatedSubject : s));
            setSelectedSubject(updatedSubject);
            setSelectedSection(updatedSection);
        }
    };

    const handleAddSection = (name: string, schedule: string) => {
        if (selectedSubject) {
            const newSection: Section = {
                id: String.fromCharCode(65 + selectedSubject.sections.length),
                name,
                schedule,
                students: []
            };
            const updatedSubject = {
                ...selectedSubject,
                sections: [...selectedSubject.sections, newSection]
            };
            setSubjects(subjects.map(s => s.id === selectedSubject.id ? updatedSubject : s));
            setSelectedSubject(updatedSubject);
        }
    };

    const handleDropStudent = (studentId: string) => {
        if (selectedSection && selectedSubject) {
            const updatedStudents = selectedSection.students.map(student =>
                student.id === studentId ? { ...student, dropped: !student.dropped } : student
            );

            const updatedSection = {
                ...selectedSection,
                students: updatedStudents
            };

            const updatedSubject = {
                ...selectedSubject,
                sections: selectedSubject.sections.map(s =>
                    s.id === selectedSection.id ? updatedSection : s
                )
            };

            setSubjects(subjects.map(s => s.id === selectedSubject.id ? updatedSubject : s));
            setSelectedSubject(updatedSubject);
            setSelectedSection(updatedSection);
            setSelectedStudent(updatedStudents.find(s => s.id === studentId) || null);
        }
    };

    const renderBreadcrumbs = () => (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbPage
                        onClick={() => {
                            setSelectedSubject(null);
                            setSelectedSection(null);
                        }}
                        className="text-gray-400 hover:text-white cursor-pointer flex items-center gap-2"
                    >
                        <School className="w-4 h-4" />
                        Dashboard
                    </BreadcrumbPage>
                </BreadcrumbItem>
                {selectedSubject && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage
                                onClick={() => setSelectedSection(null)}
                                className={`${!selectedSection ? 'text-white' : 'text-gray-400 hover:text-white cursor-pointer'} flex items-center gap-2`}
                            >
                                <Book className="w-4 h-4" />
                                {selectedSubject.name}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
                {selectedSection && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-white flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                {selectedSection.name}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );

    const filteredStudents = (students: Student[]) => {
        return students.filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'enrolled' && !student.dropped) ||
                (statusFilter === 'dropped' && student.dropped);
            return matchesSearch && matchesStatus;
        });
    };

    const renderStudentTable = (students: Student[]) => {
        const filteredStudentList = filteredStudents(students);

        return (
            <div className='space-y-4'>
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                    <div className='relative flex-grow md:w-[300px]'>
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/5 text-white placeholder-gray-400 border border-white/10'
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                    <div className='flex gap-3'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="w-[180px] bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20 transition-all duration-200">
                                    <Filter className="mr-2 h-4 w-4" />
                                    {statusFilter === 'all' ? 'All Students' :
                                        statusFilter === 'enrolled' ? 'Enrolled' : 'Dropped'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter as (value: string) => void}>
                                    <DropdownMenuRadioItem value="all">All Students</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="enrolled">Enrolled</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="dropped">Dropped</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <ViewAttendanceDialog />    
                        <ImportStudentsDialog onImport={handleImportStudents} />
                    </div>
                </div>
                <div className='overflow-x-auto rounded-lg border border-white/10'>
                    {filteredStudentList.length > 0 ? (
                        <table className='w-full'>
                            <thead>
                                <tr className='bg-white/5'>
                                    <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Student ID</th>
                                    <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Name</th>
                                    <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Status</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-white/10'>
                                {filteredStudentList.map((student) => (
                                    <tr
                                        key={student.id}
                                        className='hover:bg-white/5 transition-colors cursor-pointer'
                                        onClick={() => setSelectedStudent(student)}
                                    >
                                        <td className='px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{student.id}</td>
                                        <td className='px-4 md:px-6 py-4 whitespace-nowrap'>
                                            <div className='flex items-center'>
                                                <div className={`text-sm font-medium ${student.dropped ? 'text-red-500' : 'text-white'}`}>
                                                    {student.name}
                                                </div>

                                            </div>
                                        </td>
                                        <td className='px-4 md:px-6 py-4 whitespace-nowrap'>
                                            <span className={`px-2 py-1 text-xs rounded-full ${student.dropped
                                                ? 'bg-red-500/20 text-red-400'
                                                : 'bg-green-500/20 text-green-400'
                                                }`}>
                                                {student.dropped ? 'Dropped' : 'Enrolled'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <Users className="w-12 h-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">No students found</h3>
                            <p className="text-gray-400 mb-4">
                                {students.length === 0
                                    ? "There are no students in this section yet."
                                    : "No students match your current search or filter criteria."}
                            </p>
                        </div>
                    )}
                </div>
                {selectedStudent && (
                    <StudentInfoDialog
                        student={selectedStudent}
                        isOpen={!!selectedStudent}
                        onClose={() => setSelectedStudent(null)}
                        onDrop={handleDropStudent}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-modalColor text-white border-b border-white/10 backdrop-blur-lg bg-opacity-80">
                        <div className="flex items-center gap-2 px-6">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            {renderBreadcrumbs()}
                        </div>
                    </header>

                    <div className='max-w-[1920px] mx-auto p-6 md:p-8 lg:p-10 space-y-8'>
                        {subjects.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-center">
                                <Book className="w-16 h-16 text-blue-400 mb-4" />
                                <h2 className="text-2xl font-semibold text-white mb-2">No Subjects Added Yet</h2>
                                <p className="text-gray-400 mb-6">Get started by adding your first subject.</p>
                                <AddSubjectDialog onAdd={handleAddSubject} buttonText="Add Your First Subject" />
                            </div>
                        ) : !selectedSubject ? (
                            <>
                                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                                    <h2 className='text-2xl font-semibold text-white flex items-center gap-3'>
                                        <Book className="w-6 h-6 text-blue-400" />
                                        My Subjects
                                    </h2>
                                    <div className='flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto'>
                                        <div className='relative flex-grow md:flex-grow-0'>
                                            <input
                                                type="text"
                                                placeholder="Search subjects"
                                                className='w-full md:w-[300px] pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/5 text-white placeholder-gray-400 border border-white/10'
                                            />
                                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                        </div>
                                        <AddSubjectDialog onAdd={handleAddSubject} />
                                    </div>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 min-h-[200px]'>
                                    {subjects.map((subject) => (
                                        <div
                                            key={subject.id}
                                            onClick={() => setSelectedSubject(subject)}
                                            className='bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl shadow-2xl p-8 border border-white/10 backdrop-blur-lg cursor-pointer hover:bg-white/5 transition-all hover:scale-105'
                                        >
                                            <div className='flex items-center gap-3 mb-4'>
                                                <div className='p-3 bg-blue-500/20 rounded-lg'>
                                                    <Book className="w-6 h-6 text-blue-400" />
                                                </div>
                                                <h3 className='text-xl font-semibold text-white'>{subject.name}</h3>
                                            </div>
                                            <div className='flex items-center gap-2 text-gray-400'>
                                                <Users className="w-5 h-5" />
                                                <span className="text-lg">{subject.sections.length} Sections</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className='bg-modalColor rounded-xl shadow-2xl p-8 border border-white/10 backdrop-blur-lg'>
                                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8'>
                                    <h2 className='text-2xl font-semibold text-white flex items-center gap-3'>
                                        <Book className="w-6 h-6 text-blue-400" />
                                        {selectedSubject.name}
                                    </h2>
                                    {!selectedSection && <AddSectionDialog onAdd={handleAddSection} />}
                                </div>

                                {selectedSubject.sections.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-64 text-center">
                                        <GraduationCap className="w-16 h-16 text-emerald-400 mb-4" />
                                        <h3 className="text-xl font-semibold text-white mb-2">No Sections Added Yet</h3>
                                        <p className="text-gray-400 mb-6">Start by adding a section to this subject.</p>
                                        <AddSectionDialog onAdd={handleAddSection} buttonText="Add Your First Section" />
                                    </div>
                                ) : !selectedSection ? (
                                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 min-h-[200px]'>
                                        {selectedSubject.sections.map((section) => (
                                            <div
                                                key={section.id}
                                                onClick={() => setSelectedSection(section)}
                                                className='bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-xl p-8 cursor-pointer hover:bg-white/5 transition-all hover:scale-105 border border-white/10'
                                            >
                                                <div className='flex items-center gap-3 mb-4'>
                                                    <div className='p-3 bg-emerald-500/20 rounded-lg'>
                                                        <GraduationCap className="w-6 h-6 text-emerald-400" />
                                                    </div>
                                                    <h3 className='text-xl font-semibold text-white'>{section.name}</h3>
                                                </div>
                                                <div className='flex items-center gap-2 text-gray-400 mb-4'>
                                                    <Clock className="w-5 h-5" />
                                                    <span className="text-lg">{section.schedule}</span>
                                                </div>
                                                <div className='flex items-center gap-2 text-gray-400'>
                                                    <Users className="w-5 h-5" />
                                                    <span className="text-lg">{section.students.length} Students</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    renderStudentTable(selectedSection.students)
                                )}
                            </div>
                        )}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}



// const navigate = useNavigate();

// const fetchUser = async (): Promise<void> => {
//   try {
//     const token = localStorage.getItem('token');
//     const response = await axios.get('http://localhost:3000/auth/home', {
//       headers: {
//         "Authorization": `Bearer ${token}`
//       }
//     });
//     if (response.status !== 201) {
//       navigate('/login');
//     }
//   } catch (err) {
//     navigate('/login');
//     console.error(err);
//   }
// };

// useEffect(() => {
//   fetchUser();
// }, []);