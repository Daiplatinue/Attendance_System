import { useState } from 'react'
import { Plus } from 'lucide-react'
import { RichTextEditor } from './RichTextEditor'

interface TaskEditorProps {
    onSubmit: (task: {
        title: string;
        description: string;
        hasDeadline: boolean;
        deadline: string;
    }) => void;
    initialValues?: {
        title: string;
        description: string;
        hasDeadline: boolean;
        deadline: string;
    };
    submitLabel?: string;
}

export function TaskEditor({ onSubmit, initialValues, submitLabel = 'Add Task' }: TaskEditorProps) {
    const [task, setTask] = useState({
        title: initialValues?.title || '',
        description: initialValues?.description || '<p></p>',
        hasDeadline: initialValues?.hasDeadline || false,
        deadline: initialValues?.deadline || '',
    })

    const [key, setKey] = useState(0) // Add key for forcing re-render

    const handleSubmit = () => {
        if (!task.title.trim()) return
        onSubmit(task)
        // Only clear if we're not in edit mode (no initialValues)
        if (!initialValues) {
            setTask({
                title: '',
                description: '<p></p>',
                hasDeadline: false,
                deadline: '',
            })
            setKey(prev => prev + 1) // Force re-render of RichTextEditor
        }
    }

    return (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <input
                type="text"
                placeholder="Task title"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                className="w-full bg-transparent text-lg font-medium text-white placeholder-gray-400 focus:outline-none mb-4"
            />
            <div className="mb-4">
                <RichTextEditor
                    key={key}
                    content={task.description}
                    onChange={(content) => setTask({ ...task, description: content })}
                />
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="hasDeadline"
                        checked={task.hasDeadline}
                        onChange={(e) => setTask({ ...task, hasDeadline: e.target.checked })}
                        className="rounded border-gray-400"
                    />
                    <label htmlFor="hasDeadline" className="text-gray-300">Has Deadline</label>
                </div>
                {task.hasDeadline && (
                    <input
                        type="datetime-local"
                        value={task.deadline}
                        onChange={(e) => setTask({ ...task, deadline: e.target.value })}
                        className="bg-white/5 text-gray-300 rounded-lg px-3 py-1 border border-white/10"
                    />
                )}
                <div className="flex-1" />
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    {submitLabel}
                </button>
            </div>
        </div>
    )
}