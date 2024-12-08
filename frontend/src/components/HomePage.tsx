'use client';

import { Calendar, MoreHorizontal, Pencil, Trash2, Plus } from 'lucide-react';
import { useTasksQuery, useUpdateTaskMutation, useCreateTaskMutation, useDeleteTaskMutation } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProject';
import { TaskPriority, TaskStatus, Task, CreateTaskInput } from '@/types/TasksType';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useState } from 'react';


function ProjectSelector({ onProjectSelect }: { onProjectSelect: (projectId: number | null) => void }) {
  const { projects } = useProjects();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  if (!projects?.length) return null;

  const handleProjectChange = (value: string) => {
    const projectId = Number(value);
    setSelectedProject(projectId);
    onProjectSelect(projectId);
  };

  return (
    <Select
      value={selectedProject?.toString()}
      onValueChange={handleProjectChange}
    >
      <SelectTrigger className="w-[200px] dark:bg-zinc-800 dark:border-gray-700">
        <SelectValue placeholder="Select project" />
      </SelectTrigger>
      <SelectContent>
        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id.toString()}>
            {project.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface Column {
  id: TaskStatus;
  title: string;
  color: string;
}

const columns: Column[] = [
  { id: TaskStatus.TODO, title: 'To Do', color: 'from-pink-500/20 to-purple-500/20' },
  { id: TaskStatus.IN_PROGRESS, title: 'In Progress', color: 'from-blue-500/20 to-cyan-500/20' },
  { id: TaskStatus.COMPLETED, title: 'Done', color: 'from-green-500/20 to-emerald-500/20' }
];


interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('taskId', task.id.toString());
    e.currentTarget.classList.add('opacity-50', 'scale-105');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50', 'scale-105');
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="group cursor-grab active:cursor-grabbing"
    >
      <Card className="bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700
                      transition-all duration-200 border border-gray-200/50 dark:border-gray-700
                      shadow-sm hover:shadow-md transform hover:-translate-y-1">
        <CardContent className="p-4">
          <div className="flex justify-between items-start gap-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{task.title}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 rounded-full p-1.5
                                            hover:bg-gray-100 dark:hover:bg-zinc-600 transition-all">
                <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={onEdit} className="gap-2 cursor-pointer">
                  <Pencil className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="gap-2 text-red-600 dark:text-red-400 cursor-pointer">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {task.description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center gap-3 mt-3">
            {task.priority && (
              <span className={`
                inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                ${task.priority === TaskPriority.HIGH ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-1 ring-red-600/10' :
                  task.priority === TaskPriority.MEDIUM ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 ring-1 ring-yellow-600/10' :
                  'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 ring-1 ring-green-600/10'}
              `}>
                {task.priority.toLowerCase()}
              </span>
            )}
            {task.createdAt && (
              <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="mr-1 h-3 w-3" />
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Task>) => void;
  initialData?: Partial<Task>;
  status: TaskStatus;
  isLoading?: boolean;
  title: string;
}

function TaskDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  status,
  isLoading,
  title
}: TaskDialogProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || TaskPriority.MEDIUM,
    status
  });

  const handleSubmit = () => {
    if (!formData.title.trim()) return;
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <Input
              placeholder="Task title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full dark:bg-zinc-800 dark:border-gray-700"
            />
          </div>
          <div>
            <Textarea
              placeholder="Add a description..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full resize-none dark:bg-zinc-800 dark:border-gray-700"
              rows={3}
            />
          </div>
          <div>
            <Select
              value={formData.priority}
              onValueChange={(value: TaskPriority) => setFormData(prev => ({ ...prev, priority: value }))}
            >
              <SelectTrigger className="w-full dark:bg-zinc-800 dark:border-gray-700">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ColumnProps {
  column: Column;
  tasks: Task[];
  onDrop: (taskId: number, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAdd: (status: TaskStatus) => void;
}

function Column({ column, tasks, onDrop, onEdit, onDelete, onAdd }: ColumnProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-gray-100', 'dark:bg-zinc-800');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('bg-gray-100', 'dark:bg-zinc-800');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-100', 'dark:bg-zinc-800');
    const taskId = e.dataTransfer.getData('taskId');
    onDrop(parseInt(taskId), column.id);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 min-w-[350px] rounded-lg flex flex-col h-full
                 border border-gray-200/50 dark:border-gray-700 shadow-sm
                 bg-gradient-to-b ${column.color} backdrop-blur-sm`}
    >
      <div className="p-4 flex justify-between items-center border-b dark:border-gray-700/50
                    backdrop-blur-sm rounded-t-lg bg-white/80 dark:bg-zinc-800/80">
        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          {column.title}
          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-zinc-700
                         text-gray-600 dark:text-gray-300 font-medium">
            {tasks.length}
          </span>
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 bg-white dark:bg-zinc-800"
          onClick={() => onAdd(column.id)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4 flex-1 overflow-y-auto space-y-3">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task)}
          />
        ))}
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const { user } = useAuth();
  const { projects } = useProjects();
  const { data: tasksResponse, isLoading } = useTasksQuery();
  const updateMutation = useUpdateTaskMutation();
  const createMutation = useCreateTaskMutation();
  const deleteMutation = useDeleteTaskMutation();

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [addingStatus, setAddingStatus] = useState<TaskStatus | null>(null);

  const selectedProject = projects?.find(p => p.id === selectedProjectId);

  const handleAddTask = async (data: Partial<Task>) => {
    if (!addingStatus || !data.title || !selectedProject) return;

    try {
      const newTask: CreateTaskInput = {
        title: data.title,
        description: data.description ?? null,
        status: addingStatus,
        priority: data.priority ?? TaskPriority.MEDIUM,
        projectId: selectedProject.id,
        assignedTo: null,
        dueDate: null
      };

      await createMutation.mutateAsync(newTask);
      setIsAddingTask(false);
      setAddingStatus(null);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleEditTask = async (data: Partial<Task>) => {
    if (!taskToEdit || !selectedProject) return;
    await updateMutation.mutateAsync({
      ...taskToEdit,
      ...data,
      projectId: selectedProject.id
    });
    setTaskToEdit(null);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    await deleteMutation.mutateAsync({ id: taskToDelete.id });
    setTaskToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800">
        <div className="text-lg text-gray-600 dark:text-gray-300 bg-white dark:bg-zinc-800 px-6 py-3 rounded-lg shadow-sm">
          Loading tasks...
        </div>
      </div>
    );
  }

  const tasks = tasksResponse?.data?.filter(task => task.projectId === selectedProjectId) || [];
  const groupedTasks: Record<TaskStatus, Task[]> = columns.reduce((acc, column) => {
    acc[column.id] = tasks.filter(task => task.status === column.id);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  const handleDrop = async (taskId: number, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus && selectedProject) {
      await updateMutation.mutateAsync({
        ...task,
        status: newStatus,
        projectId: selectedProject.id
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="max-w-[1800px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name}
            </h1>
            <div className="flex items-center gap-4">
              <ProjectSelector onProjectSelect={setSelectedProjectId} />
              {selectedProjectId && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {tasks.length} tasks
                </p>
              )}
            </div>
          </div>
        </div>

        {selectedProjectId ? (
          <div className="flex gap-6 overflow-x-auto pb-6">
            {columns.map(column => (
              <Column
                key={column.id}
                column={column}
                tasks={groupedTasks[column.id] || []}
                onDrop={handleDrop}
                onEdit={setTaskToEdit}
                onDelete={setTaskToDelete}
                onAdd={(status) => {
                  setAddingStatus(status);
                  setIsAddingTask(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center space-y-2">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Select a project to view its tasks
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose a project from the dropdown above to get started
              </p>
            </div>
          </div>
        )}

        <TaskDialog
          open={isAddingTask}
          onOpenChange={setIsAddingTask}
          onSubmit={handleAddTask}
          status={addingStatus || TaskStatus.TODO}
          isLoading={createMutation.isPending}
          title="Add Task"
        />

        <TaskDialog
          open={!!taskToEdit}
          onOpenChange={(open) => !open && setTaskToEdit(null)}
          onSubmit={handleEditTask}
          initialData={taskToEdit || undefined}
          status={taskToEdit?.status || TaskStatus.TODO}
          isLoading={updateMutation.isPending}
          title="Edit Task"
        />

        <Dialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
          <DialogContent className="sm:max-w-md dark:bg-zinc-900">
            <DialogHeader>
              <DialogTitle className="text-red-600 dark:text-red-400">Delete Task</DialogTitle>
            </DialogHeader>
            <div className="pt-4 space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setTaskToDelete(null)}
                  disabled={deleteMutation.isPending}
                  className="dark:bg-zinc-800 dark:hover:bg-zinc-700"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteTask}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
