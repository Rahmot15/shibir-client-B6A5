"use client"

import { useEditor, EditorContent, JSONContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableCell } from "@tiptap/extension-table-cell"
import { TableHeader } from "@tiptap/extension-table-header"
import { TaskList } from "@tiptap/extension-task-list"
import { TaskItem } from "@tiptap/extension-task-item"
import { Placeholder } from "@tiptap/extension-placeholder"
import { Link } from "@tiptap/extension-link"
import { Underline } from "@tiptap/extension-underline"
import { useState, useEffect, useCallback, useRef } from "react"
import { NoteToolbar } from "./NoteToolbar"
import { Button } from "@/components/ui/button"
import {
  Save,
  Plus,
  Loader2,
  StickyNote,
  History,
  ArrowLeft,
  Search,
  MoreVertical,
  Trash2,
  Calendar,
  ChevronRight
} from "lucide-react"
import { toast } from "sonner"
import "./editor-styles.css"
import { format } from "date-fns"
import { bn } from "date-fns/locale"

// Mock Note Type
interface Note {
  id: string
  title: string
  content: JSONContent
  updatedAt: string
}

export function NoteClient() {
  const [view, setView] = useState<"list" | "edit">("list")
  const [notes, setNotes] = useState<Note[]>([])
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [title, setTitle] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Ref for auto-save prevention (if needed) and tracking current state
  const lastSavedContent = useRef<string>("")
  const lastSavedTitle = useRef<string>("")

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "আপনার নোট এখানে লিখুন..." }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[500px] p-6 text-[16px] leading-relaxed text-emerald-50/90",
      },
    },
  })

  // Load notes from local storage on mount
  useEffect(() => {
    const loadNotes = () => {
      const saved = localStorage.getItem("shibir_notes")
      if (saved) {
        setNotes(JSON.parse(saved))
      }
    }
    loadNotes()
  }, [])

  // Smart Sync: Re-sync editor when currentNote changes
  useEffect(() => {
    if (currentNote && editor) {
      const syncEditor = () => {
        editor.commands.setContent(currentNote.content)
        setTitle(currentNote.title)
        lastSavedContent.current = JSON.stringify(currentNote.content)
        lastSavedTitle.current = currentNote.title
      }
      syncEditor()
    }
  }, [currentNote, editor])

  const saveToStorage = (updatedNotes: Note[]) => {
    localStorage.setItem("shibir_notes", JSON.stringify(updatedNotes))
    setNotes(updatedNotes)
  }

  const handleSave = useCallback(async (isAutoSave = false) => {
    if (!editor) return null

    const content = editor.getJSON()
    const currentTitle = title.trim() || "শিরোনামহীন নোট"

    // Skip if nothing changed
    if (isAutoSave &&
        JSON.stringify(content) === lastSavedContent.current &&
        currentTitle === lastSavedTitle.current) {
      return null
    }

    if (!isAutoSave) setIsSaving(true)

    const now = new Date().toISOString()
    let updatedNotes: Note[] = []

    if (currentNote) {
      // Update existing
      updatedNotes = notes.map(n =>
        n.id === currentNote.id ? { ...n, title: currentTitle, content, updatedAt: now } : n
      )
      // Sort to top
      updatedNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    } else {
      // Create new
      const newNote: Note = {
        id: Math.random().toString(36).substr(2, 9),
        title: currentTitle,
        content,
        updatedAt: now
      }
      updatedNotes = [newNote, ...notes]
      setCurrentNote(newNote)
    }

    saveToStorage(updatedNotes)
    lastSavedContent.current = JSON.stringify(content)
    lastSavedTitle.current = currentTitle

    if (!isAutoSave) {
      toast.success("নোটটি সেভ করা হয়েছে")
      setIsSaving(false)
    }

    return updatedNotes
  }, [editor, title, currentNote, notes])

  const handleNewNote = async () => {
    // Smart Handle: Auto save current work before switching
    if (editor && !editor.isEmpty) {
      await handleSave(true)
    }

    setCurrentNote(null)
    setTitle("")
    editor?.commands.clearContent()
    lastSavedContent.current = ""
    lastSavedTitle.current = ""
    setView("edit")
  }

  const handleBackToList = async () => {
    if (editor && !editor.isEmpty) {
      await handleSave(true)
    }
    setView("list")
  }

  const openNote = (note: Note) => {
    setCurrentNote(note)
    setView("edit")
  }

  const deleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const updated = notes.filter(n => n.id !== id)
    saveToStorage(updated)
    toast.error("নোট ডিলিট করা হয়েছে")
  }

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] w-full">
      {view === "list" ? (
        /* --- LIST VIEW --- */
        <div className="flex flex-col w-full max-w-7xl mx-auto px-4 md:px-6 py-4 animate-in fade-in duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-400">
                <StickyNote size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-emerald-50">আমার নোট খাতা</h1>
                <p className="text-xs text-white/30 uppercase tracking-widest font-mono">Total {notes.length} Notes</p>
              </div>
            </div>

            <Button
              onClick={handleNewNote}
              className="bg-emerald-500 hover:bg-emerald-400 text-[#050f08] font-bold h-11 px-6 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all active:scale-95"
            >
              <Plus className="mr-2 h-5 w-5" />
              নতুন নোট যোগ করুন
            </Button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 h-5 w-5" />
            <input
              type="text"
              placeholder="নোট খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#071310] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-emerald-50 outline-none focus:border-emerald-500/30 transition-all font-medium"
            />
          </div>

          {filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => openNote(note)}
                  className="group relative flex flex-col p-5 rounded-3xl border border-white/5 bg-[#071310]/50 hover:bg-[#071310] hover:border-emerald-500/20 transition-all cursor-pointer overflow-hidden min-h-[160px]"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/30 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-all">
                      <History size={18} />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => deleteNote(e, note.id)}
                      className="h-8 w-8 text-white/10 hover:text-red-400 hover:bg-red-400/10 rounded-lg shrink-0 z-10"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <h3 className="text-lg font-bold text-emerald-50/80 mb-2 truncate group-hover:text-emerald-50 transition-colors pr-6">
                    {note.title}
                  </h3>

                  <div className="flex items-center gap-2 text-[11px] text-white/20 mt-auto font-medium">
                    <Calendar size={12} />
                    <span>{format(new Date(note.updatedAt), "dd MMMM, p", { locale: bn })}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01]">
               <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <StickyNote className="text-white/10" size={40} />
               </div>
               <h3 className="text-white/30 font-medium">কোনো নোট খুঁজে পাওয়া যায়নি</h3>
               <p className="text-white/10 text-sm mt-1">আপনার প্রয়োজনীয় নোটগুলো এখানে গুছিয়ে রাখুন</p>
            </div>
          )}
        </div>
      ) : (
        /* --- EDIT VIEW --- */
        <div className="flex flex-col w-full min-h-[calc(100vh-120px)] animate-in slide-in-from-right duration-500 ease-out overflow-x-hidden">
          <div className="sticky top-0 z-20 flex items-center justify-between gap-2 px-3 md:px-8 py-3 bg-[#030a08]/80 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToList}
                className="h-9 w-9 md:h-10 md:w-10 rounded-xl hover:bg-white/5 text-white/40 shrink-0"
              >
                <ArrowLeft size={18} className="md:hidden" />
                <ArrowLeft size={20} className="hidden md:block" />
              </Button>
              <div className="w-[1px] h-6 bg-white/10 hidden sm:block shrink-0" />
              <div className="flex flex-col overflow-hidden">
                 <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-emerald-500/50 font-bold mb-0.5 truncate">Editing Note</span>
                 <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="শিরোনাম লিখুন..."
                    className="bg-transparent text-sm md:text-lg font-bold text-emerald-50 outline-none placeholder-white/20 truncate"
                  />
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                onClick={() => handleSave()}
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-9 md:h-10 px-4 md:px-6 rounded-xl shadow-[0_0_20px_rgba(5,150,105,0.2)]"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 md:mr-2" />}
                <span className="hidden sm:inline">সেভ করুন</span>
              </Button>
            </div>
          </div>

          <div className="flex-1 w-full bg-[#050f08]">
            <div className="max-w-5xl mx-auto w-full px-2 md:px-4 py-4 md:py-8">
              <div className="rounded-2xl md:rounded-[32px] border border-white/10 bg-[#071310] overflow-hidden shadow-2xl flex flex-col min-h-[60vh] md:min-h-[70vh]">
                <NoteToolbar editor={editor} />
                <div className="flex-1 relative overflow-x-hidden">
                  <EditorContent editor={editor} />
                </div>
              </div>

              <div className="mt-4 md:mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-2 md:px-4">
                 <div className="flex items-center gap-2 text-white/20 text-[10px] md:text-xs">
                    <History size={14} />
                    <span>শেষ আপডেট: {currentNote ? format(new Date(currentNote.updatedAt), "p, dd MMM", { locale: bn }) : "এখনই"}</span>
                 </div>
                 <p className="text-[9px] md:text-[10px] text-white/10 uppercase tracking-tighter hidden sm:block">Powered by TipTap Writing Core v2.0</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

