"use client"

import { Editor } from "@tiptap/react"
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  CheckSquare,
  Table as TableIcon,
  Link as LinkIcon,
  Quote,
  Undo,
  Redo,
  Plus,
  Trash2,
  Columns,
  Rows,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface NoteToolbarProps {
  editor: Editor | null
}

export function NoteToolbar({ editor }: NoteToolbarProps) {
  if (!editor) return null

  const addLink = () => {
    const url = window.prompt("URL লিখুন:")
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-wrap items-center gap-1 border-b border-emerald-500/10 bg-[#071310] p-1.5 sticky top-0 z-20 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 border-r border-white/5 pr-1 mr-1 shrink-0">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            tooltip="Bold (Ctrl+B)"
          >
            <Bold className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            tooltip="Italic (Ctrl+I)"
          >
            <Italic className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            tooltip="Underline (Ctrl+U)"
          >
            <Underline className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-1 border-r border-white/5 pr-1 mr-1 shrink-0">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive("heading", { level: 1 })}
            tooltip="Heading 1"
          >
            <Heading1 className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
            tooltip="Heading 2"
          >
            <Heading2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-1 border-r border-white/5 pr-1 mr-1 shrink-0">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            tooltip="Bullet List"
          >
            <List className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            tooltip="Ordered List"
          >
            <ListOrdered className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            active={editor.isActive("taskList")}
            tooltip="Task List"
          >
            <CheckSquare className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-1 border-r border-white/5 pr-1 mr-1 shrink-0">
          <ToolbarButton
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            tooltip="Insert Table"
          >
            <TableIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </ToolbarButton>
          {editor.isActive("table") && (
            <div className="flex items-center gap-0.5">
              <ToolbarButton onClick={() => editor.chain().focus().addColumnBefore().run()} tooltip="Add Column">
                <Columns className="h-3.5 w-3.5 md:h-4 md:w-4 rotate-180" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().addRowBefore().run()} tooltip="Add Row">
                <Rows className="h-3.5 w-3.5 md:h-4 md:w-4 rotate-180" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().deleteTable().run()} tooltip="Delete Table">
                <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-400" />
              </ToolbarButton>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <ToolbarButton onClick={addLink} active={editor.isActive("link")} tooltip="Add Link">
            <LinkIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            tooltip="Quote"
          >
            <Quote className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </ToolbarButton>
          <div className="w-[1px] h-4 bg-white/10 mx-1" />
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} tooltip="Undo">
            <Undo className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </ToolbarButton>
        </div>
      </div>
    </TooltipProvider>
  )
}

function ToolbarButton({
  children,
  onClick,
  active = false,
  tooltip,
}: {
  children: React.ReactNode
  onClick: () => void
  active?: boolean
  tooltip: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          className={`h-7 w-7 md:h-8 md:w-8 rounded-md transition-all duration-200 ${
            active
              ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 hover:text-emerald-300"
              : "text-white/40 hover:bg-white/5 hover:text-white/70"
          }`}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="hidden md:block bg-[#050f08] border-emerald-500/20 text-emerald-50 text-[11px]">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}
