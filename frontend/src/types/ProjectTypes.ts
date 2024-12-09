import type { User } from "./UserTypes";
import { Task } from "./TasksType";
import { Note } from "./NoteTypes";


export interface Project {
  id: number;
  name: string;
  description: string | null;
  ownerId: string | null;
  status: string | null;
  dueDate: string | null;
  createdAt: string;
  tasks: Task[]
}

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED'
}


export interface ProjectMember {
  projectId: number;
  userId: string;
  role: string | null;
}

export interface ProjectWithRelations extends Omit<Project, 'ownerId'> {
  owner: User | null;
  members: (ProjectMember & { user: User })[];
}




export interface CreateProjectInput {
  name: string;
  description: string | null;
  ownerId: string | null;
  status: ProjectStatus | null;
  dueDate: Date | null;
  tasks: Task[]
  notes: Note[]
}

export interface UpdateProjectInput {
  id: number;
  name?: string;
  description?: string | null;
  ownerId?: string | null;
  status?: ProjectStatus | null;
  dueDate?: Date | null;
  tasks: Task[]
  notes: Note[]
}
export interface DeleteProjectInput {
  id: number
}


export interface CreateProjectMemberInput {
  projectId: number;
  userId: string;
  role?: string | null;
}
