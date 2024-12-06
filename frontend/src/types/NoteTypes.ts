

export interface Note {
  id: number;
  title: string;
  content: string;
  projectId: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
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
