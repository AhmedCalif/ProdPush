

export interface Note {
  id: number;
  title: string;
  userId: string;
  content: string
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  userId: string;
}
export interface UpdateNoteInput {
  id: number;
  title?: string | null;
  content?: string;
  userId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

export type NotesResponse = ApiResponse<Note[]>;
export type NoteResponse = ApiResponse<Note>;
