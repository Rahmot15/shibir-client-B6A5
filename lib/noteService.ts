import { JSONContent } from "@tiptap/react";

export interface Note {
  id: string;
  title: string;
  content: JSONContent; // TipTap JSON
  createdAt: string;
  updatedAt: string;
}

export const noteService = {
  async getAllNotes(): Promise<Note[]> {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("shibir_notes");
    return saved ? JSON.parse(saved) : [];
  },

  async saveNote(note: Partial<Note>): Promise<Note> {
    const notes = await this.getAllNotes();
    const now = new Date().toISOString();

    let updatedNote: Note;

    if (note.id) {
      const index = notes.findIndex(n => n.id === note.id);
      if (index !== -1) {
        updatedNote = {
          ...notes[index],
          ...note,
          updatedAt: now
        } as Note;
        notes[index] = updatedNote;
      } else {
        // Fallback if ID doesn't exist for some reason
        updatedNote = {
          id: note.id,
          title: note.title || "শিরোনামহীন নোট",
          content: note.content || {},
          createdAt: now,
          updatedAt: now,
        } as Note;
        notes.unshift(updatedNote);
      }
    } else {
      updatedNote = {
        id: Math.random().toString(36).substr(2, 9),
        title: note.title || "শিরোনামহীন নোট",
        content: note.content || {},
        createdAt: now,
        updatedAt: now,
      };
      notes.unshift(updatedNote);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("shibir_notes", JSON.stringify(notes));
    }
    return updatedNote;
  },

  async deleteNote(id: string): Promise<void> {
    const notes = await this.getAllNotes();
    const filtered = notes.filter(n => n.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem("shibir_notes", JSON.stringify(filtered));
    }
  }
};
