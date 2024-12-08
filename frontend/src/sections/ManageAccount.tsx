import React, { useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar-admin"
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset, SidebarProvider, SidebarTrigger
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Search, Download, UserPlus } from 'lucide-react'
import { EmployeeModal } from "./componentStyles/Employee-Modal"
import { CreateModal } from "@/sections/componentStyles/CreateModal"

const ManageAccounts: React.FC = () => {


    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);


    const handleCreateSuccess = () => {
        // Refresh your employee list here
        // You might want to add a fetchEmployees function
    };

    

    const employees = [
        {
            id: "SAMS-0-000001",
            name: "Bagus Fikri",
            role: "Parent",
            department: "Lebrown Jems A.",
            status: "Pending",
            email: "bagusfikri@gmail.com",
            phone: "(+63) 248 042 319",
            joined: "29 Oct, 2018",
            image: ""
        },
        {
            id: "SCC-0-000021",
            name: "Ihdzain",
            role: "Teacher",
            department: "BS - Accountancy",
            status: "Retired",
            email: "ihdzain@gmail.com",
            phone: "(+63) 768 082 716",
            joined: "1 Feb, 2019",
            image: ""
        },
        {
            id: "SCC-0-012456",
            name: "Multi Hidayat",
            role: "Student",
            department: "BS - Criminology",
            status: "Active",
            email: "multih@gmail.com",
            phone: "(+63) 130 689 256",
            joined: "1 Feb, 2021",
            image: ""
        },
    ];

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-400/20 text-green-400';
            case 'pending':
                return 'bg-yellow-400/20 text-yellow-400';
            case 'retired':
                return 'bg-red-400/20 text-red-400';
            default:
                return 'bg-gray-400/20 text-gray-400';
        }
    };

    const handleEmployeeClick = (employee: any) => {
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 bg-modalColor text-white border-b border-white/10">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                    </BreadcrumbItem>
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="text-white">Manage Accounts</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>

                    <div className='max-w-7xl mx-auto p-4 md:p-6 lg:p-8'>
                        <div className='bg-modalColor rounded-xl shadow-2xl p-6 border border-white/10 backdrop-blur-lg'>
                            <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
                                <h2 className='text-xl font-semibold flex items-center gap-2 text-white'>
                                    <Users className="w-5 h-5 text-blue-400" />
                                    Manage Accounts
                                </h2>
                                <div className='flex flex-wrap gap-4'>
                                    <div className='relative flex-grow md:flex-grow-0'>
                                        <input
                                            type="text"
                                            placeholder="Search accounts..."
                                            className='w-full md:w-auto pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/5 text-white placeholder-gray-400 border border-white/10'
                                        />
                                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                    </div>
                                    <div className='flex gap-2'>
                                        <button className='flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20 transition-all duration-200'>
                                            <Download className="w-4 h-4" />
                                            <span className='hidden md:inline'>Export</span>
                                        </button>
                                        <button
                                            onClick={() => setIsCreateModalOpen(true)}
                                            className='flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20 transition-all duration-200'
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            <span className='hidden md:inline'>Add New Account</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className='overflow-x-auto'>
                                <table className='w-full'>
                                    <thead>
                                        <tr className='bg-white/5'>
                                            <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Account name</th>
                                            <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Role</th>
                                            <th className='hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Dept | Student</th>
                                            <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Status</th>
                                            <th className='hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Information</th>
                                            <th className='hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-white/10'>
                                        {employees.map((employee) => (
                                            <tr
                                                key={employee.id}
                                                className='hover:bg-white/5 transition-colors cursor-pointer'
                                                onClick={() => handleEmployeeClick(employee)}
                                            >
                                                <td className='px-4 md:px-6 py-4 whitespace-nowrap'>
                                                    <div className='flex items-center'>
                                                        <Avatar className='h-8 w-8 md:h-10 md:w-10 ring-2 ring-white/10'>
                                                            <AvatarImage
                                                                src={employee.image}
                                                                alt={employee.name}
                                                            />
                                                            <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className='ml-4'>
                                                            <div className='text-sm font-medium text-white'>{employee.name}</div>
                                                            <div className='text-sm text-gray-400'>{employee.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{employee.role}</td>
                                                <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{employee.department}</td>
                                                <td className='px-4 md:px-6 py-4 whitespace-nowrap'>
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(employee.status)}`}>
                                                        {employee.status}
                                                    </span>
                                                </td>
                                                <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                                    <div>{employee.email}</div>
                                                    <div className='text-gray-400'>{employee.phone}</div>
                                                </td>
                                                <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{employee.joined}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <EmployeeModal
                        employee={selectedEmployee}
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                </SidebarInset>
            </SidebarProvider>


            <EmployeeModal
                employee={selectedEmployee}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <CreateModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />


        </div>
    );
};

export default ManageAccounts;