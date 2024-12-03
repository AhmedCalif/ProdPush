import type { User } from "./UserTypes";
import type { Project } from "./ProjectTypes";


export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
} as const;

export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

export interface Task {
  id: number;
  title: string;
  description: string | null;
  projectId: number | null;
  assignedTo: string | null;
  status: TaskStatus | null;
  priority: TaskPriority | null;
  dueDate: string | null;
  createdAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  projectId?: number | null;
  assignedTo?: string | null;
  status?: TaskStatus | null;
  priority?: TaskPriority | null;
  dueDate?: string | null;
}

export interface UpdateTaskInput extends Partial<Omit<Task, 'createdAt'>> {
  id: number;
}

export interface DeleteTaskInput {
  id: number;
}

export interface TaskWithRelations extends Omit<Task, 'assignedTo'> {
  assignedTo: User | null;
  project: Project | null;
}


 export interface TasksResponse {
  success: boolean;
  data: Task[];
}
