import { useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { ListTodo, Search, Filter, Clock, Calendar } from 'lucide-react'
import { TaskEditor } from './componentStyles/TaskEditor'
import { TaskItem } from './componentStyles/TaskItem'

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  deadline?: Date;
  createdAt: Date;
  status: 'done' | 'ongoing' | 'late';
}

export default function TodoList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'done'>('all');

  const handleAddTask = (newTask: any) => {
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: 'medium',
      createdAt: new Date(),
      status: 'ongoing',
    };

    if (newTask.hasDeadline && newTask.deadline) {
      task.deadline = new Date(newTask.deadline);
    }

    setTasks([task, ...tasks]);
  };

  const handleTaskAction = (taskId: string, action: string, data?: any) => {
    switch (action) {
      case 'done':
        setTasks(tasks.map(task => 
          task.id === taskId 
            ? { ...task, status: task.status === 'done' ? 'ongoing' : 'done' }
            : task
        ));
        break;
      case 'update':
        setTasks(tasks.map(task =>
          task.id === taskId
            ? {
                ...task,
                title: data.title,
                description: data.description,
                deadline: data.hasDeadline ? new Date(data.deadline) : undefined,
              }
            : task
        ));
        break;
      case 'delete':
        setTasks(tasks.filter(task => task.id !== taskId));
        break;
      case 'share':
        console.log('Share task:', taskId);
        break;
    }
  };

  const filteredTasks = tasks
    .filter(task => 
      (task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filter === 'all' || 
       (filter === 'done' && task.status === 'done') ||
       (filter === 'ongoing' && task.status === 'ongoing'))
    );

  return (
    <div className="min-h-screen bg-gray-900">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-modalColor text-white border-b border-white/10 backdrop-blur-lg bg-opacity-80">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink>
                      <Link to={'/'}>Dashboard</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white">Todo List</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
            <div className="space-y-6">
              {/* Header with Search and Filters */}
              <div className="bg-modalColor rounded-xl p-4 border border-white/10 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                    <ListTodo className="w-6 h-6 text-blue-400" />
                    Tasks Feed
                  </h2>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                      <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-gray-400" />
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as 'all' | 'ongoing' | 'done')}
                        className="bg-white/5 text-gray-300 rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="all">All Tasks</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="done">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 text-blue-400">
                      <ListTodo className="w-4 h-4" />
                      <span className="text-sm">Total Tasks</span>
                    </div>
                    <p className="text-xl font-bold text-white mt-1">{tasks.length}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 text-green-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Ongoing</span>
                    </div>
                    <p className="text-xl font-bold text-white mt-1">
                      {tasks.filter(t => t.status === 'ongoing').length}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 text-purple-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">With Deadline</span>
                    </div>
                    <p className="text-xl font-bold text-white mt-1">
                      {tasks.filter(t => t.deadline).length}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Completed</span>
                    </div>
                    <p className="text-xl font-bold text-white mt-1">
                      {tasks.filter(t => t.status === 'done').length}
                    </p>
                  </div>
                </div>
              </div>

              {/* New Task Input */}
              <TaskEditor onSubmit={handleAddTask} />

              {/* Task List */}
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onAction={handleTaskAction}
                  />
                ))}
                {filteredTasks.length === 0 && (
                  <div className="text-center py-12 bg-modalColor rounded-xl border border-white/10">
                    <ListTodo className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-400 mb-2">
                      {searchQuery ? 'No tasks found matching your search' : 'No tasks yet'}
                    </p>
                    <p className="text-gray-500">
                      {searchQuery ? 'Try different search terms' : 'Create your first task to get started!'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}