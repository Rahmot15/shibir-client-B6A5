"use client"

import { Editor } from "@tiptap/react"
import {
  Bold, Italic, Underline, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, CheckSquare,
  Table as TableIcon, Link as LinkIcon, Quote,
  Undo, Redo, Trash2, Columns, Rows,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Highlighter, Palette, Code, Code2,
  Image as ImageIcon, Minus, Subscript, Superscript,
  Eraser, SplitSquareHorizontal, X, WrapText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"

interface NoteToolbarProps { editor: Editor | null }

/* ── colour swatches ── */
const TEXT_COLORS = [
  { label:"ডিফল্ট",   value:"" },
  { label:"সাদা",      value:"#f1f5f9" },
  { label:"লাল",       value:"#f87171" },
  { label:"কমলা",      value:"#fb923c" },
  { label:"হলুদ",      value:"#fbbf24" },
  { label:"সবুজ",      value:"#4ade80" },
  { label:"নীল",       value:"#60a5fa" },
  { label:"বেগুনী",   value:"#a78bfa" },
  { label:"গোলাপী",   value:"#f472b6" },
  { label:"ধূসর",     value:"#94a3b8" },
]

const HIGHLIGHT_COLORS = [
  { label:"ডিফল্ট",   value:"" },
  { label:"হলুদ",      value:"#fef08a" },
  { label:"সবুজ",      value:"#bbf7d0" },
  { label:"নীল",       value:"#bae6fd" },
  { label:"গোলাপী",   value:"#fbcfe8" },
  { label:"কমলা",      value:"#fed7aa" },
  { label:"বেগুনী",   value:"#ddd6fe" },
]

export function NoteToolbar({ editor }: NoteToolbarProps) {
  const [linkUrl,       setLinkUrl]       = useState("")
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [imageUrl,      setImageUrl]      = useState("")
  const [showImgInput,  setShowImgInput]  = useState(false)

  if (!editor) return null

  /* ── link helpers ── */
  const applyLink = () => {
    if (!linkUrl.trim()) { editor.chain().focus().unsetLink().run(); setShowLinkInput(false); return }
    editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl.trim(), target:"_blank" }).run()
    setLinkUrl(""); setShowLinkInput(false)
  }

  /* ── image helpers ── */
  const insertImage = () => {
    if (!imageUrl.trim()) return
    editor.chain().focus().setImage({ src: imageUrl.trim() }).run()
    setImageUrl(""); setShowImgInput(false)
  }

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => editor.chain().focus().setImage({ src: reader.result as string }).run()
    reader.readAsDataURL(file)
    setShowImgInput(false)
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="sticky top-0 z-20 flex flex-col border-b border-emerald-500/10 bg-[#071310]">

        {/* ── Row 1 ── */}
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 overflow-x-auto no-scrollbar">

          {/* Undo / Redo */}
          <Group>
            <TB onClick={()=>editor.chain().focus().undo().run()} tip="Undo (Ctrl+Z)"
              disabled={!editor.can().undo()}><Undo className="icon"/></TB>
            <TB onClick={()=>editor.chain().focus().redo().run()} tip="Redo (Ctrl+Y)"
              disabled={!editor.can().redo()}><Redo className="icon"/></TB>
          </Group>

          {/* Text style */}
          <Group>
            <TB onClick={()=>editor.chain().focus().toggleBold().run()}
              active={editor.isActive("bold")} tip="Bold (Ctrl+B)"><Bold className="icon"/></TB>
            <TB onClick={()=>editor.chain().focus().toggleItalic().run()}
              active={editor.isActive("italic")} tip="Italic (Ctrl+I)"><Italic className="icon"/></TB>
            <TB onClick={()=>editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive("underline")} tip="Underline (Ctrl+U)"><Underline className="icon"/></TB>
            <TB onClick={()=>editor.chain().focus().toggleStrike().run()}
              active={editor.isActive("strike")} tip="Strikethrough"><Strikethrough className="icon"/></TB>
            <TB onClick={()=>editor.chain().focus().toggleCode().run()}
              active={editor.isActive("code")} tip="Inline Code"><Code className="icon"/></TB>
            <TB onClick={()=>editor.chain().focus().toggleSubscript?.().run()}
              active={editor.isActive("subscript")} tip="Subscript"><Subscript className="icon"/></TB>
            <TB onClick={()=>editor.chain().focus().toggleSuperscript?.().run()}
              active={editor.isActive("superscript")} tip="Superscript"><Superscript className="icon"/></TB>
          </Group>

          {/* Headings */}
          <Group>
            <TB onClick={()=>editor.chain().focus().toggleHeading({level:1}).run()}
              active={editor.isActive("heading",{level:1})} tip="Heading 1"><Heading1 className="icon"/></TB>
            <TB onClick={()=>editor.chain().focus().toggleHeading({level:2}).run()}
              active={editor.isActive("heading",{level:2})} tip="Heading 2"><Heading2 className="icon"/></TB>
            <TB onClick={()=>editor.chain().focus().toggleHeading({level:3}).run()}
              active={editor.isActive("heading",{level:3})} tip="Heading 3"><Heading3 className="icon"/></TB>
          </Group>

          {/* Lists */}
          <Group>
            <TB onClick={()=>editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive("bulletList")} tip="Bullet List"><List className="icon"/></TB>
            <TB onClick={()=>editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive("orderedList")} tip="Numbered List"><ListOrdered className="icon"/></TB>
            <TB onClick={()=>editor.chain().focus().toggleTaskList().run()}
              active={editor.isActive("taskList")} tip="Task List (☑)"><CheckSquare className="icon"/></TB>
          </Group>

          {/* Align */}
          <Group>
            <TB onClick={()=>editor.chain().focus().setTextAlign?.("left").run()}
              active={editor.isActive({textAlign:"left"})} tip="Align Left"><AlignLeft className="icon"/></TB>
            <TB onClick={()=>editor.chain().focus().setTextAlign?.("center").run()}
              active={editor.isActive({textAlign:"center"})} tip="Align Center"><AlignCenter className="icon"/></TB>
            <TB onClick={()=>editor.chain().focus().setTextAlign?.("right").run()}
              active={editor.isActive({textAlign:"right"})} tip="Align Right"><AlignRight className="icon"/></TB>
            <TB onClick={()=>editor.chain().focus().setTextAlign?.("justify").run()}
              active={editor.isActive({textAlign:"justify"})} tip="Justify"><AlignJustify className="icon"/></TB>
          </Group>

          {/* Color & Highlight */}
          <Group>
            {/* Text color */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="toolbar-icon-btn group relative"
                  title="Text Color"
                  onMouseDown={e => e.preventDefault()}
                >
                  <Palette className="icon"/>
                  <span className="absolute bottom-0.5 left-1/2 h-1 w-3.5 -translate-x-1/2 rounded-full transition-all"
                    style={{ background: editor.getAttributes("textStyle")?.color || "#f1f5f9" }}/>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 border-white/10 bg-[#0a1810] p-2" side="bottom">
                <p className="mb-2 font-mono text-[9px] tracking-widest text-white/25 uppercase">টেক্সট রং</p>
                <div className="grid grid-cols-5 gap-1">
                  {TEXT_COLORS.map(c=>(
                    <button key={c.value} title={c.label}
                      onMouseDown={e => e.preventDefault()}
                      onClick={()=> c.value
                        ? editor.chain().focus().setColor?.(c.value).run()
                        : editor.chain().focus().unsetColor?.().run()}
                      className="h-6 w-6 rounded-md border border-white/10 transition-all hover:scale-110 hover:border-white/30"
                      style={{ background: c.value || "transparent" }}>
                      {!c.value && <span className="text-[9px] text-white/40">A</span>}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Highlight */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="toolbar-icon-btn group relative"
                  title="Highlight"
                  onMouseDown={e => e.preventDefault()}
                >
                  <Highlighter className="icon"/>
                  <span className="absolute bottom-0.5 left-1/2 h-1 w-3.5 -translate-x-1/2 rounded-full transition-all"
                    style={{ background: editor.getAttributes("highlight")?.color || "#fef08a33" }}/>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 border-white/10 bg-[#0a1810] p-2" side="bottom">
                <p className="mb-2 font-mono text-[9px] tracking-widest text-white/25 uppercase">হাইলাইট</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {HIGHLIGHT_COLORS.map(c=>(
                    <button key={c.value} title={c.label}
                      onMouseDown={e => e.preventDefault()}
                      onClick={()=> c.value
                        ? editor.chain().focus().toggleHighlight?.({ color:c.value }).run()
                        : editor.chain().focus().unsetHighlight?.().run()}
                      className="h-7 w-full rounded-md border border-white/10 text-[9px] font-medium transition-all hover:scale-105 hover:border-white/25"
                      style={{ background: c.value || "rgba(255,255,255,0.05)", color: c.value ? "#1a1a1a" : "rgba(255,255,255,0.35)" }}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <TB onClick={()=>editor.chain().focus().unsetAllMarks().run()} tip="마크 모두 제거 / Clear Formatting">
              <Eraser className="icon"/>
            </TB>
          </Group>

          {/* Block */}
          <Group>
            <TB onClick={()=>editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive("blockquote")} tip="Blockquote"><Quote className="icon"/></TB>
            <TB onClick={()=>editor.chain().focus().toggleCodeBlock().run()}
              active={editor.isActive("codeBlock")} tip="Code Block"><Code2 className="icon"/></TB>
            <TB onClick={()=>editor.chain().focus().setHorizontalRule().run()} tip="Divider Line"><Minus className="icon"/></TB>
          </Group>

          {/* Link */}
          <Group>
            <TB onClick={()=>setShowLinkInput(p=>!p)} active={editor.isActive("link")||showLinkInput} tip="Link (Ctrl+K)">
              <LinkIcon className="icon"/>
            </TB>
            {editor.isActive("link") && (
              <TB onClick={()=>editor.chain().focus().unsetLink().run()} tip="Remove Link">
                <X className="icon text-red-400/70"/>
              </TB>
            )}
          </Group>

          {/* Image */}
          <Group>
            <TB onClick={()=>setShowImgInput(p=>!p)} tip="Image">
              <ImageIcon className="icon"/>
            </TB>
          </Group>

          {/* Table */}
          <Group>
            <TB onClick={()=>editor.chain().focus().insertTable({rows:3,cols:3,withHeaderRow:true}).run()} tip="Insert Table (3×3)">
              <TableIcon className="icon"/>
            </TB>
          </Group>

        </div>

        {/* ── Row 2: Table controls (only when inside table) ── */}
        {editor.isActive("table") && (
          <div className="flex flex-wrap items-center gap-0.5 border-t border-white/5 bg-[#060e0a] px-2 py-1 overflow-x-auto no-scrollbar">
            <span className="mr-1.5 font-mono text-[9px] tracking-[2px] text-amber-400/50 uppercase flex-shrink-0">테이블 / Table</span>

            <Group>
              <TB onClick={()=>editor.chain().focus().addColumnBefore().run()} tip="열 앞에 추가 / Add Column Before">
                <span className="flex items-center gap-1 text-[9px] font-mono text-white/45">+<Columns className="h-3 w-3"/></span>
              </TB>
              <TB onClick={()=>editor.chain().focus().addColumnAfter().run()} tip="Add Column After">
                <span className="flex items-center gap-1 text-[9px] font-mono text-white/45"><Columns className="h-3 w-3"/>+</span>
              </TB>
              <TB onClick={()=>editor.chain().focus().deleteColumn().run()} tip="Delete Column">
                <span className="flex items-center gap-1 text-[9px] font-mono text-red-400/60">-<Columns className="h-3 w-3"/></span>
              </TB>
            </Group>

            <Group>
              <TB onClick={()=>editor.chain().focus().addRowBefore().run()} tip="Add Row Before">
                <span className="flex items-center gap-1 text-[9px] font-mono text-white/45">+<Rows className="h-3 w-3"/></span>
              </TB>
              <TB onClick={()=>editor.chain().focus().addRowAfter().run()} tip="Add Row After">
                <span className="flex items-center gap-1 text-[9px] font-mono text-white/45"><Rows className="h-3 w-3"/>+</span>
              </TB>
              <TB onClick={()=>editor.chain().focus().deleteRow().run()} tip="Delete Row">
                <span className="flex items-center gap-1 text-[9px] font-mono text-red-400/60">-<Rows className="h-3 w-3"/></span>
              </TB>
            </Group>

            <Group>
              <TB onClick={()=>editor.chain().focus().mergeOrSplit().run()} tip="Merge/Split Cells">
                <SplitSquareHorizontal className="icon"/>
              </TB>
              <TB onClick={()=>editor.chain().focus().toggleHeaderRow?.().run()} tip="Toggle Header Row">
                <WrapText className="icon"/>
              </TB>
              <TB onClick={()=>editor.chain().focus().toggleHeaderColumn?.().run()} tip="Toggle Header Column">
                <WrapText className="icon rotate-90"/>
              </TB>
            </Group>

            <Group>
              <TB onClick={()=>editor.chain().focus().deleteTable().run()} tip="Delete Table">
                <span className="flex items-center gap-1 text-[9px] font-mono text-red-400/70">
                  <Trash2 className="h-3 w-3"/> টেবিল
                </span>
              </TB>
            </Group>
          </div>
        )}

        {/* ── Link input bar ── */}
        {showLinkInput && (
          <div className="flex items-center gap-2 border-t border-white/5 bg-[#060e0a] px-3 py-2">
            <LinkIcon className="h-3.5 w-3.5 flex-shrink-0 text-blue-400/50" strokeWidth={1.8}/>
            <input
              autoFocus
              type="url"
              value={linkUrl}
              onChange={e=>setLinkUrl(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter") applyLink(); if(e.key==="Escape") setShowLinkInput(false) }}
              placeholder="https://example.com"
              className="flex-1 bg-transparent text-[12px] font-mono text-blue-100/70 placeholder-white/18 outline-none"
            />
            <button onClick={applyLink}
              className="rounded-lg border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-[10px] font-mono text-blue-400 hover:bg-blue-500/18 transition-all">
              যোগ
            </button>
            <button onClick={()=>setShowLinkInput(false)}
              className="rounded-lg border border-white/8 px-2 py-1 text-[10px] font-mono text-white/30 hover:text-white/55 transition-all">
              বাতিল
            </button>
          </div>
        )}

        {/* ── Image input bar ── */}
        {showImgInput && (
          <div className="flex flex-col gap-2 border-t border-white/5 bg-[#060e0a] px-3 py-2.5">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-3.5 w-3.5 flex-shrink-0 text-purple-400/50" strokeWidth={1.8}/>
              <input
                autoFocus
                type="url"
                value={imageUrl}
                onChange={e=>setImageUrl(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Enter") insertImage(); if(e.key==="Escape") setShowImgInput(false) }}
                placeholder="Image URL দিন অথবা ফাইল আপলোড করুন..."
                className="flex-1 bg-transparent text-[12px] font-mono text-purple-100/70 placeholder-white/18 outline-none"
              />
              <button onClick={insertImage}
                className="rounded-lg border border-purple-500/25 bg-purple-500/10 px-3 py-1 text-[10px] font-mono text-purple-400 hover:bg-purple-500/18 transition-all">
                যোগ
              </button>
            </div>
            <div className="flex items-center gap-2 pl-5">
              <span className="text-[10px] text-white/20">অথবা</span>
              <label className="cursor-pointer rounded-lg border border-white/8 px-3 py-1 text-[10px] font-mono text-white/35 hover:border-white/18 hover:text-white/60 transition-all">
                📁 ডিভাইস থেকে বেছে নিন
                <input type="file" accept="image/*" className="hidden" onChange={handleImageFile}/>
              </label>
              <button onClick={()=>setShowImgInput(false)}
                className="ml-auto rounded-lg border border-white/8 px-2 py-1 text-[10px] font-mono text-white/28 hover:text-white/55 transition-all">
                বাতিল
              </button>
            </div>
          </div>
        )}

        <style>{`
          .icon { width: 14px; height: 14px; }
          @media (min-width: 768px) { .icon { width: 15px; height: 15px; } }
          .toolbar-icon-btn {
            display: flex; align-items: center; justify-content: center;
            height: 28px; width: 28px; border-radius: 6px;
            border: 1px solid transparent; color: rgba(255,255,255,0.38);
            transition: all 0.15s; cursor: pointer; background: transparent;
            position: relative; flex-shrink: 0;
          }
          .toolbar-icon-btn:hover {
            border-color: rgba(255,255,255,0.1);
            background: rgba(255,255,255,0.05);
            color: rgba(255,255,255,0.7);
          }
          @media(min-width:768px){ .toolbar-icon-btn { height:30px; width:30px; } }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </TooltipProvider>
  )
}

/* ── Shared sub-components ── */
function Group({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-0.5 border-r border-white/5 pr-1 mr-0.5 last:border-0 last:pr-0 last:mr-0 flex-shrink-0">
      {children}
    </div>
  )
}

function TB({
  children, onClick, active = false, tip, disabled = false,
}: {
  children: React.ReactNode; onClick: () => void; active?: boolean; tip: string; disabled?: boolean
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost" size="icon" type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClick} disabled={disabled}
          className={[
            "h-7 w-7 md:h-[30px] md:w-[30px] rounded-md transition-all duration-150 flex-shrink-0",
            active
              ? "bg-emerald-500/18 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/28"
              : "text-white/38 hover:bg-white/5 hover:text-white/70 border border-transparent",
            disabled ? "opacity-25 cursor-not-allowed" : "",
          ].join(" ")}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom"
        className="hidden md:block bg-[#050f08] border-white/10 text-emerald-50/80 text-[10px] py-0.5 px-2">
        {tip}
      </TooltipContent>
    </Tooltip>
  )
}
