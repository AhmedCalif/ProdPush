import { closestCorners, DndContext, DragOverlay, useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar,  MoreHorizontal, Pencil, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';
import { useTasksQuery } from '../hooks/useTasks';
import { createTask, updateTask } from '../lib/tasks';
import { TaskPriority, TaskStatus, type CreateTaskInput, type Task } from '@/types/TasksType';
import { Button } from "./ui/button";
import { useDeleteTaskMutation, useUpdateTaskMutation } from '../hooks/useTasks';
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
import { useAuth } from '@/hooks/useAuth';


type Column = {
  id: TaskStatus;
  title: string;
};

const columns: Column[] = [
  { id: TaskStatus.TODO, title: 'To Do' },
  { id: TaskStatus.IN_PROGRESS, title: 'In Progress' },
  { id: TaskStatus.COMPLETED, title: 'Done' }
];

function TaskCard({ task, onEdit, onDelete }: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Card className="bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all duration-200 border border-gray-200/50 dark:border-gray-700 shadow-sm hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{task.title}</h3>
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger className="rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-600 transition-colors">
              <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onClick={() => {
                  setMenuOpen(false);
                  onEdit();
                }}
                className="gap-2 cursor-pointer"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                className="gap-2 text-red-600 dark:text-red-400 cursor-pointer"
              >
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
            <div className={`
              inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
              ${task.priority === TaskPriority.HIGH ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-1 ring-red-600/10' :
                task.priority === TaskPriority.MEDIUM ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 ring-1 ring-yellow-600/10' :
                'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 ring-1 ring-green-600/10'}
            `}>
              {task.priority.toLowerCase()}
            </div>
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
  );
}
function TaskEditDialog({
  task,
  open,
  onOpenChange,
  onSave,
  isLoading
}: {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Task) => void;
  isLoading: boolean;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<TaskPriority | null>(task.priority);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      ...task,
      title,
      description: description || null,
      priority,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold dark:text-white">Edit Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full dark:bg-zinc-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a more detailed description..."
              rows={3}
              className="w-full resize-none dark:bg-zinc-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
            <Select
              value={priority || undefined}
              onValueChange={(value: TaskPriority) => setPriority(value)}
            >
              <SelectTrigger className="w-full dark:bg-zinc-800 dark:border-gray-700 dark:text-white">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="dark:bg-zinc-800">
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
              className="dark:bg-zinc-800 dark:border-gray-700 dark:text-white dark:hover:bg-zinc-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="min-w-[100px] dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddTaskCard({ status, onCancel }: { status: TaskStatus; onCancel: () => void }) {
  const defaultTask: CreateTaskInput = {
    title: '',
    description: null,
    status,
    priority: TaskPriority.MEDIUM,
    projectId: 1 ,
    assignedTo: null,
    dueDate: null
  };

  const [formData, setFormData] = useState<CreateTaskInput>(defaultTask);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onCancel();
    }
  });

  const handleCreate = () => {
    if (!formData.title.trim()) return;
    createMutation.mutate(formData);
  };

  return (
    <Card className="bg-white dark:bg-zinc-800 shadow-sm border border-gray-200/50 dark:border-gray-700">
      <CardContent className="p-4 space-y-4">
        <Input
          placeholder="Task title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full dark:bg-zinc-900 dark:border-gray-700 dark:text-white"
          autoFocus
        />
        <Textarea
          placeholder="Add a description..."
          value={formData.description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value || null }))}
          rows={2}
          className="w-full resize-none dark:bg-zinc-900 dark:border-gray-700 dark:text-white"
        />
        <Select
          value={formData.priority || undefined}
          onValueChange={(value: TaskPriority) => setFormData(prev => ({ ...prev, priority: value }))}
        >
          <SelectTrigger className="w-full dark:bg-zinc-900 dark:border-gray-700 dark:text-white">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent className="dark:bg-zinc-800">
            <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
            <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
            <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2 pt-2">
          <Button
            className="w-full dark:bg-white dark:text-black dark:hover:bg-gray-200"
            onClick={handleCreate}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Adding...' : 'Add Task'}
          </Button>
          <Button
            variant="outline"
            className="w-full dark:bg-zinc-800 dark:border-gray-700 dark:text-white dark:hover:bg-zinc-700"
            onClick={onCancel}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DroppableColumn({ column, tasks }: { column: Column; tasks: Task[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    }
  });

  return (
    <div
      ref={setNodeRef}
      className="flex-1 min-w-[350px] bg-gray-50/50 dark:bg-zinc-900/50 rounded-lg flex flex-col h-full border border-gray-200/50 dark:border-gray-700 shadow-sm"
    >
      <div className="p-4 flex justify-between items-center border-b dark:border-gray-700 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-t-lg">
        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          {column.title}
          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 font-medium">
            {tasks.length}
          </span>
        </h2>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-3">
          <SortableContext
            items={tasks.map(task => task.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map(task => (
              <SortableItem key={task.id} task={task} />
            ))}
          </SortableContext>

          {isAdding ? (
            <AddTaskCard
              status={column.id}
              onCancel={() => setIsAdding(false)}
            />
          ) : (
            <button
              className="w-full px-4 py-3 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700
                       rounded-lg border border-gray-200/75 dark:border-gray-700 shadow-sm transition-all duration-200
                       flex items-center gap-2 justify-center font-medium hover:border-gray-300 dark:hover:border-gray-600"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4" />
              Add a task
            </button>
          )}
        </div>
        </div>
      </div>
  );
}

function SortableItem({ task }: { task: Task }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteMutation = useDeleteTaskMutation();
  const updateMutation = useUpdateTaskMutation();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id.toString(),
    data: { type: 'Task', task }
  });

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await updateMutation.mutateAsync(updatedTask);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteMutation.mutateAsync({ id: task.id });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <>
      <div ref={setNodeRef} style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : undefined,
      }} {...attributes} {...listeners} className="touch-none">
        <TaskCard
          task={task}
          onEdit={() => setIsEditDialogOpen(true)}
          onDelete={() => setIsDeleteDialogOpen(true)}
        />
      </div>

      <TaskEditDialog
        task={task}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleUpdateTask}
        isLoading={updateMutation.isPending}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-red-600">Delete Task</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 dark:text-gray-300 py-4">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="dark:bg-zinc-800 dark:border-gray-700 dark:text-white dark:hover:bg-zinc-700"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTask}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Task'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function KanbanBoard() {
const {user} = useAuth()
  const { data: tasksResponse, isLoading, isError } = useTasksQuery();
  const queryClient = useQueryClient();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const handleDragStart = (event: any) => {
    const { active } = event;
    const foundTask = tasksResponse?.data?.find(task => task.id.toString() === active.id);
    if (foundTask) {
      setActiveTask(foundTask);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || !tasksResponse?.data) return;

    const activeTask = tasksResponse.data.find(task => task.id.toString() === active.id);
    if (!activeTask) return;

    const overTask = tasksResponse.data.find(task => task.id.toString() === over.id);
    if (overTask) {
      if (activeTask.status !== overTask.status) {
        updateMutation.mutate({
          ...activeTask,
          status: overTask.status,
        });
      }
    } else {
      const newStatus = over.id as TaskStatus;
      if (activeTask.status !== newStatus) {
        updateMutation.mutate({
          ...activeTask,
          status: newStatus,
        });
      }
    }

    setActiveTask(null);
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800">
        <div className="text-lg text-gray-600 dark:text-gray-300 bg-white dark:bg-zinc-800 px-6 py-3 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700">
          Loading tasks...
        </div>
      </div>
    );
  }

  if (isError || !tasksResponse?.success) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800">
        <div className="text-red-600 dark:text-red-400 bg-white dark:bg-zinc-800 px-6 py-3 rounded-lg shadow-sm border border-red-200/50 dark:border-red-900/50">
          Error loading tasks: {tasksResponse?.error || 'Unknown error'}
        </div>
      </div>
    );
  }

  const tasks = tasksResponse.data || [];
  const groupedTasks = columns.reduce((acc, column) => {
    acc[column.id] = tasks.filter(task => task.status === column.id);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  return (
    <div className="h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 w-screen">
      <div className="max-w-[1800px] mx-auto px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name}</h1>
      </div>

      <div className="h-[calc(100vh-73px)]">
        <div className="h-full max-w-[1800px] mx-auto px-6 py-6">
          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            collisionDetection={closestCorners}
          >
            <div className="h-full flex gap-6 overflow-x-auto pb-6">
              {columns.map((column) => (
                <DroppableColumn
                  key={column.id}
                  column={column}
                  tasks={groupedTasks[column.id] || []}
                />
              ))}
            </div>
              <DragOverlay>
                {activeTask ? (
                <div className="w-[350px]">
              <TaskCard
              task={activeTask}
              onEdit={() => {}}
              onDelete={() => {}}
                />
                  </div>
                 ) : null}
              </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
