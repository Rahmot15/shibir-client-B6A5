import { JSONContent } from "@tiptap/react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const BASE_URL = `${BACKEND_URL}/api/v1/notes`;

export interface Note {
  id: string;
  title: string;
  content: JSONContent;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const getAllNotes = async (): Promise<Note[]> => {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    cache: 'no-store'
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

const createNote = async (payload: { title: string; content: JSONContent }): Promise<Note> => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

const updateNote = async (id: string, payload: { title?: string; content?: JSONContent }): Promise<Note> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

const deleteNote = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: 'include',
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
};

export const noteService = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
};
