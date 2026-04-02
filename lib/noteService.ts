import { JSONContent } from "@tiptap/react";

const BASE_URL = "/api/v1/notes";

export interface Note {
  id: string;
  title: string;
  content: JSONContent;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const parseJsonSafe = async <T>(response: Response): Promise<T | null> => {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

const getAllNotes = async (): Promise<Note[]> => {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    cache: 'no-store'
  });
  const data = await parseJsonSafe<ApiResponse<Note[]>>(response);
  if (!response.ok || !data?.success) throw new Error(data?.message || "Failed to fetch notes");
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
  const data = await parseJsonSafe<ApiResponse<Note>>(response);
  if (!response.ok || !data?.success) throw new Error(data?.message || "Failed to create note");
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
  const data = await parseJsonSafe<ApiResponse<Note>>(response);
  if (!response.ok || !data?.success) throw new Error(data?.message || "Failed to update note");
  return data.data;
};

const deleteNote = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: 'include',
  });
  const data = await parseJsonSafe<ApiResponse<null>>(response);
  if (!response.ok || !data?.success) throw new Error(data?.message || "Failed to delete note");
};

export const noteService = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
};
