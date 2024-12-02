import { useState } from 'react';
import { MoreVertical, Clock, Calendar, Trash2, Edit, Share2, CheckCircle } from 'lucide-react';
import { TaskEditor } from './TaskEditor';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  deadline?: Date;
  createdAt: Date;
  status: 'done' | 'ongoing' | 'late';
}

interface TaskItemProps {
  task: Task;
  onAction: (taskId: string, action: string, data?: any) => void;
}

export function TaskItem({ task, onAction }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleUpdate = (updatedTask: any) => {
    onAction(task.id, 'update', updatedTask);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <TaskEditor
        initialValues={{
          title: task.title,
          description: task.description,
          hasDeadline: !!task.deadline,
          deadline: task.deadline ? task.deadline.toISOString().slice(0, 16) : '',
        }}
        onSubmit={handleUpdate}
        submitLabel="Update Task"
      />
    );
  }

  return (
    <div className={`bg-modalColor rounded-xl border border-white/10 overflow-hidden transition-all duration-200 ${task.status === 'done' ? 'opacity-75' : ''}`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => onAction(task.id, 'done')}
                className={`rounded-full p-1 transition-colors ${
                  task.status === 'done'
                    ? 'text-green-400 bg-green-400/10'
                    : 'text-gray-400 hover:text-green-400 hover:bg-green-400/10'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
              </button>
              <h3 className={`text-lg font-semibold text-white ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
                {task.title}
              </h3>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(task.createdAt).toLocaleDateString()}
              </div>
              {task.deadline && (
                <div className="flex items-center gap-1 text-yellow-400">
                  <Calendar className="w-4 h-4" />
                  {new Date(task.deadline).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded hover:bg-white/10"
            >
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 rounded-lg bg-gray-800 border border-white/10 shadow-lg z-10">
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onAction(task.id, 'share');
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={() => {
                    onAction(task.id, 'delete');
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-400/10 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: task.description }}
        />
      </div>
    </div>
  );
}