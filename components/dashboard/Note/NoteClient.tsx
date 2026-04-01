"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Table }        from "@tiptap/extension-table"
import { TableRow }     from "@tiptap/extension-table-row"
import { TableCell }    from "@tiptap/extension-table-cell"
import { TableHeader }  from "@tiptap/extension-table-header"
import { TaskList }     from "@tiptap/extension-task-list"
import { TaskItem }     from "@tiptap/extension-task-item"
import { Placeholder }  from "@tiptap/extension-placeholder"
import { Link }         from "@tiptap/extension-link"
import { Underline }    from "@tiptap/extension-underline"
import { Color }        from "@tiptap/extension-color"
import { TextStyle }    from "@tiptap/extension-text-style"
import { Highlight }    from "@tiptap/extension-highlight"
import { TextAlign }    from "@tiptap/extension-text-align"
import { Image }        from "@tiptap/extension-image"
import { Subscript }    from "@tiptap/extension-subscript"
import { Superscript }  from "@tiptap/extension-superscript"
import { Typography }   from "@tiptap/extension-typography"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { createLowlight, common } from "lowlight"

import { useState, useEffect, useCallback, useRef } from "react"
import { NoteToolbar } from "./NoteToolbar"
import { Button }      from "@/components/ui/button"
import {
  Save, Plus, Loader2, StickyNote, History,
  ArrowLeft, Search, Trash2, Calendar,
  FileText,
} from "lucide-react"
import { toast }        from "sonner"
import "./editor-styles.css"
import { format }       from "date-fns"
import { bn }           from "date-fns/locale"
import { noteService, Note } from "@/lib/noteService"

/* ── lowlight setup ── */
const lowlight = createLowlight(common)

/* ══════════════════════════════════════════
   Word / char counter helper
══════════════════════════════════════════ */
function countStats(html: string) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
  const words = text ? text.split(" ").length : 0
  return { words, chars: text.length }
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export function NoteClient() {
  const [view,         setView]         = useState<"list"|"edit">("list")
  const [notes,        setNotes]        = useState<Note[]>([])
  const [currentNote,  setCurrentNote]  = useState<Note|null>(null)
  const [isSaving,     setIsSaving]     = useState(false)
  const [isLoading,    setIsLoading]    = useState(false)
  const [title,        setTitle]        = useState("")
  const [searchQuery,  setSearchQuery]  = useState("")
  const [stats,        setStats]        = useState({ words:0, chars:0 })

  const lastSavedContent = useRef<string>("")
  const lastSavedTitle   = useRef<string>("")
  const autoSaveTimer    = useRef<ReturnType<typeof setTimeout>|undefined>(undefined)

  /* ── Editor ── */
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,          // replaced by lowlight version
        heading: { levels:[1,2,3,4,5,6] },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types:["heading","paragraph"] }),
      Image.configure({ inline:false, allowBase64:true }),
      Subscript,
      Superscript,
      Typography,
      Link.configure({ openOnClick:false, HTMLAttributes:{ class:"note-link" } }),
      Placeholder.configure({ placeholder:"আপনার নোট এখানে লিখুন..." }),
      Table.configure({ resizable:true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested:true }),
      CodeBlockLowlight.configure({ lowlight, HTMLAttributes:{ class:"tiptap-code-block" } }),
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: [
          "tiptap prose prose-invert max-w-none focus:outline-none",
          "min-h-[500px] p-5 md:p-8",
          "text-[15px] md:text-[16px] leading-relaxed",
        ].join(" "),
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML()
      setStats(countStats(html))
      // debounced auto-save
      clearTimeout(autoSaveTimer.current)
      autoSaveTimer.current = setTimeout(() => handleSave(true), 3000)
    },
  })

  /* ── Load notes ── */
  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const data = await noteService.getAllNotes()
        setNotes(data)
      } catch {
        toast.error("নোট লোড করতে সমস্যা হয়েছে")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  /* ── Sync editor when note changes ── */
  useEffect(() => {
    if (currentNote && editor) {
      editor.commands.setContent(currentNote.content, { emitUpdate: false })
      setTitle(currentNote.title)
      const html = editor.getHTML()
      setStats(countStats(html))
      lastSavedContent.current = JSON.stringify(currentNote.content)
      lastSavedTitle.current   = currentNote.title
    }
  }, [currentNote, editor])

  /* ── Save ── */
  const handleSave = useCallback(async (isAutoSave = false) => {
    if (!editor) return
    const content      = editor.getJSON()
    const trimmedTitle = title.trim()

    // Avoid creating an empty untitled note via autosave.
    if (isAutoSave && !currentNote && !trimmedTitle && editor.isEmpty) return

    // Keep existing title when title field is temporarily empty.
    const currentTitle = trimmedTitle || currentNote?.title || "শিরোনামহীন নোট"

    if (isAutoSave &&
        JSON.stringify(content) === lastSavedContent.current &&
        currentTitle === lastSavedTitle.current) return

    if (!isAutoSave) setIsSaving(true)
    try {
      if (currentNote) {
        const updated = await noteService.updateNote(currentNote.id, { title:currentTitle, content })
        setNotes(p => p.map(n => n.id===updated.id ? updated : n))
        setCurrentNote(updated)
      } else {
        const created = await noteService.createNote({ title:currentTitle, content })
        setNotes(p => [created, ...p])
        setCurrentNote(created)
      }
      lastSavedContent.current = JSON.stringify(content)
      lastSavedTitle.current   = currentTitle
      if (!isAutoSave) toast.success("নোটটি সেভ করা হয়েছে ✓")
    } catch {
      if (!isAutoSave) toast.error("সেভ করতে সমস্যা হয়েছে")
    } finally {
      if (!isAutoSave) setIsSaving(false)
    }
  }, [editor, title, currentNote])

  const handleNewNote = async () => {
    clearTimeout(autoSaveTimer.current)
    if (editor && !editor.isEmpty) await handleSave(true)
    setCurrentNote(null); setTitle("")
    editor?.commands.clearContent(false)
    lastSavedContent.current = ""; lastSavedTitle.current = ""
    setView("edit")
  }

  const handleBackToList = async () => {
    clearTimeout(autoSaveTimer.current)
    if (editor && !editor.isEmpty) await handleSave(true)
    setView("list")
  }

  const openNote = (note: Note) => { setCurrentNote(note); setView("edit") }

  const deleteNote = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      await noteService.deleteNote(id)
      setNotes(p => p.filter(n => n.id!==id))
      toast.success("নোট ডিলিট করা হয়েছে")
      if (currentNote?.id===id) { setCurrentNote(null); setView("list") }
    } catch {
      toast.error("ডিলিট করতে সমস্যা হয়েছে")
    }
  }

  /* ── Keyboard shortcut: Ctrl+S ── */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.ctrlKey||e.metaKey) && e.key==="s") { e.preventDefault(); handleSave() }
    }
    window.addEventListener("keydown", down)
    return () => window.removeEventListener("keydown", down)
  }, [handleSave])

  useEffect(() => {
    return () => clearTimeout(autoSaveTimer.current)
  }, [])

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  /* ══════════════════════════════════════════
     LIST VIEW
  ══════════════════════════════════════════ */
  if (view === "list") {
    return (
      <div className="flex flex-col min-h-[calc(100vh-120px)] w-full max-w-7xl mx-auto px-4 md:px-6 py-6 animate-in fade-in duration-400">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-400">
              <StickyNote size={24} strokeWidth={1.6}/>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-emerald-50">আমার নোট খাতা</h1>
              <p className="text-xs text-white/28 uppercase tracking-widest font-mono mt-0.5">
                {notes.length} টি নোট
              </p>
            </div>
          </div>
          <Button
            onClick={handleNewNote}
            className="bg-emerald-500 hover:bg-emerald-400 text-[#050f08] font-bold h-11 px-6 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all active:scale-95"
          >
            <Plus className="mr-2 h-5 w-5" strokeWidth={2.5}/>
            নতুন নোট যোগ করুন
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/22 h-4 w-4" strokeWidth={2}/>
          <input
            type="text"
            placeholder="নোটের নাম দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={e=>setSearchQuery(e.target.value)}
            className="w-full bg-[#071310] border border-white/6 rounded-2xl py-3.5 pl-11 pr-4 text-emerald-50 outline-none focus:border-emerald-500/30 transition-all text-[14px]"
          />
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-500/40"/>
            <p className="mt-4 text-white/20 animate-pulse font-mono text-sm">লোড হচ্ছে...</p>
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map(note=>(
              <div key={note.id} onClick={()=>openNote(note)}
                className="group relative flex flex-col p-5 rounded-2xl border border-white/5 bg-[#071310]/50 hover:bg-[#071310] hover:border-emerald-500/20 transition-all cursor-pointer overflow-hidden min-h-[140px]">

                {/* top accent */}
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>

                <div className="flex justify-between items-start mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/4 text-white/25 group-hover:bg-emerald-500/15 group-hover:text-emerald-400 transition-all">
                    <FileText size={16} strokeWidth={1.8}/>
                  </div>
                  <Button variant="ghost" size="icon"
                    onClick={e=>deleteNote(e,note.id)}
                    className="h-7 w-7 text-white/10 hover:text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={14}/>
                  </Button>
                </div>

                <h3 className="text-[15px] font-bold text-white/75 mb-2 truncate group-hover:text-emerald-50 transition-colors">
                  {note.title || "শিরোনামহীন নোট"}
                </h3>

                <div className="flex items-center gap-2 text-[11px] text-white/18 mt-auto font-mono">
                  <Calendar size={11} strokeWidth={1.8}/>
                  <span>{format(new Date(note.updatedAt), "dd MMM yyyy, p", { locale:bn })}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-[32px]">
            <div className="h-20 w-20 rounded-full bg-white/4 flex items-center justify-center mb-5">
              <StickyNote className="text-white/12" size={36} strokeWidth={1.4}/>
            </div>
            <h3 className="text-white/28 font-semibold text-[15px]">
              {searchQuery ? "কোনো নোট খুঁজে পাওয়া যায়নি" : "এখনো কোনো নোট নেই"}
            </h3>
            <p className="text-white/14 text-sm mt-1.5">আপনার প্রয়োজনীয় নোটগুলো এখানে গুছিয়ে রাখুন</p>
            {!searchQuery && (
              <Button onClick={handleNewNote}
                className="mt-5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/25 rounded-xl h-10 px-5">
                <Plus className="mr-2 h-4 w-4"/> প্রথম নোট তৈরি করুন
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }

  /* ══════════════════════════════════════════
     EDIT VIEW
  ══════════════════════════════════════════ */
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-56px)] animate-in slide-in-from-right-4 duration-300 ease-out">

      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-30 flex items-center justify-between gap-2 px-3 md:px-6 py-2.5 bg-[#030a08]/85 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2 md:gap-3 overflow-hidden flex-1 min-w-0">
          <Button variant="ghost" size="icon" onClick={handleBackToList}
            className="h-9 w-9 rounded-xl hover:bg-white/5 text-white/38 flex-shrink-0">
            <ArrowLeft size={18} strokeWidth={2}/>
          </Button>
          <div className="w-px h-5 bg-white/8 flex-shrink-0 hidden sm:block"/>
          <div className="flex flex-col overflow-hidden flex-1 min-w-0">
            <span className="text-[9px] uppercase tracking-widest text-emerald-500/45 font-bold font-mono hidden sm:block">
              {currentNote ? "নোট সম্পাদনা" : "নতুন নোট"}
            </span>
            <input
              type="text"
              value={title}
              onChange={e=>setTitle(e.target.value)}
              placeholder="শিরোনাম লিখুন..."
              className="bg-transparent text-[14px] md:text-[17px] font-bold text-emerald-50 outline-none placeholder-white/18 truncate w-full"
            />
          </div>
        </div>

        {/* Right: stats + save */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden md:flex items-center gap-3 text-[10px] font-mono text-white/22 border border-white/5 bg-white/2 rounded-lg px-3 py-1.5">
            <span>{stats.words} শব্দ</span>
            <span className="text-white/10">·</span>
            <span>{stats.chars} অক্ষর</span>
          </div>
          <Button
            onClick={()=>handleSave()}
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-9 px-4 rounded-xl text-[13px] transition-all"
          >
            {isSaving
              ? <Loader2 className="h-4 w-4 animate-spin"/>
              : <><Save className="h-3.5 w-3.5 mr-1.5" strokeWidth={2.5}/><span className="hidden sm:inline">সেভ</span></>
            }
          </Button>
        </div>
      </div>

      {/* ── Editor area ── */}
      <div className="flex-1 w-full bg-[#050f08]">
        <div className="max-w-4xl mx-auto w-full px-2 sm:px-4 py-4 md:py-6">

          <div className="rounded-2xl md:rounded-[28px] border border-white/8 bg-[#071310] overflow-hidden shadow-2xl">
            <NoteToolbar editor={editor}/>
            <div className="tiptap-scroll-area overflow-y-auto" style={{ maxHeight:"calc(100vh - 200px)" }}>
              <EditorContent editor={editor}/>
            </div>
          </div>

          {/* Footer bar */}
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-2">
            <div className="flex items-center gap-3 text-[11px] text-white/20 font-mono">
              <History size={12} strokeWidth={1.8}/>
              <span>
                {currentNote
                  ? `শেষ আপডেট: ${format(new Date(currentNote.updatedAt), "dd MMM, p", { locale:bn })}`
                  : "এখনো সেভ হয়নি"
                }
              </span>
              {/* mobile stats */}
              <span className="md:hidden text-white/10">·</span>
              <span className="md:hidden">{stats.words} শব্দ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-white/12 uppercase tracking-wider font-mono hidden sm:block">
                Ctrl+S দিয়ে সেভ করুন
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
