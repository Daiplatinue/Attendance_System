import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Bold, Italic, List, ImageIcon } from 'lucide-react'

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    editable?: boolean;
}

export function RichTextEditor({ content, onChange, editable = true }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'max-w-full rounded-lg',
                },
            })
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    const addImage = (file: File) => {
        if (file && editor) {
            const reader = new FileReader()
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    editor
                        .chain()
                        .focus()
                        .setImage({ src: reader.result })
                        .run()
                }
            }
            reader.readAsDataURL(file)
        }
    }

    if (!editor) {
        return null
    }

    return (
        <div className="rich-text-editor">
            {editable && (
                <div className="flex items-center gap-2 mb-2 p-1 border-b border-white/10">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-1 rounded hover:bg-white/10 ${editor.isActive('bold') ? 'bg-white/10' : ''}`}
                    >
                        <Bold className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-1 rounded hover:bg-white/10 ${editor.isActive('italic') ? 'bg-white/10' : ''}`}
                    >
                        <Italic className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-1 rounded hover:bg-white/10 ${editor.isActive('bulletList') ? 'bg-white/10' : ''}`}
                    >
                        <List className="w-4 h-4 text-gray-400" />
                    </button>
                    <label className="p-1 rounded hover:bg-white/10 cursor-pointer">
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    addImage(file)
                                }
                            }}
                        />
                        <ImageIcon className="w-4 h-4 text-gray-400" />
                    </label>
                </div>
            )}
            <EditorContent
                editor={editor}
                className="prose prose-invert max-w-none focus:outline-none min-h-[100px] border border-white/10 rounded-lg p-3"
            />
            <style>{`
                .ProseMirror {
                    min-height: 100px;
                    outline: none;
                }
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #64748b;
                    pointer-events: none;
                    height: 0;
                }
                .ProseMirror img {
                    max-width: 100%;
                    height: auto;
                    margin: 1rem 0;
                    border-radius: 0.5rem;
                    display: block;
                }
                .ProseMirror:focus {
                    outline: none;
                }
            `}</style>
        </div>
    )
}