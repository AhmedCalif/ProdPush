import React, { useState, useEffect } from 'react';
import { useProject } from '@/hooks/useProject';
import { useParams } from "@tanstack/react-router";
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from "@/components/ui/button";
import { CheckSquare, Loader2 } from 'lucide-react';
import { TaskStatus } from '@/types/TasksType';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { projectKeys } from '@/hooks/useProject';

interface AddTaskDialogProps {
  projectId: number;
  onTaskAdded: () => void;
}

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({ projectId, onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const taskData = {
        title,
        description: description || null,
        projectId: Number(projectId),
        status: status || TaskStatus.TODO,
        priority: null,
        assignedTo: null,
        dueDate: null
      };

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create task');
      }


      await queryClient.invalidateQueries({
        queryKey: projectKeys.detail(projectId)
      });
      await queryClient.invalidateQueries({
        queryKey: projectKeys.lists()
      });

      setTitle('');
      setDescription('');
      setStatus(TaskStatus.TODO);
      setIsOpen(false);
      onTaskAdded();

      await queryClient.refetchQueries({
        queryKey: projectKeys.detail(projectId)
      });
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">Add Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TaskStatus).map((statusValue) => (
                  <SelectItem key={statusValue} value={statusValue}>
                    {statusValue.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};



const ProjectDetailPage: React.FC = () => {
  const { id } = useParams({ from: '/_authenticated/project/$id' });
  const { project, isLoading, error } = useProject(parseInt(id));
  const queryClient = useQueryClient();

  const handleTaskAdded = async () => {
    await queryClient.refetchQueries({
      queryKey: projectKeys.detail(parseInt(id))
    });
  };



  useEffect(() => {
    queryClient.refetchQueries({
      queryKey: projectKeys.detail(parseInt(id))
    });
  }, [id, queryClient]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error loading project: {error.message}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Project Details</h1>
          <p className="text-gray-600 mb-4">No project found with the specified ID.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Projects
          </Button>
        </div>
        <p className="text-gray-600">{project.description}</p>
        <div className="flex items-center gap-4 mt-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {project.status || 'No status'}
          </span>
        </div>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            Tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Project Tasks
                <AddTaskDialog projectId={parseInt(id)} onTaskAdded={handleTaskAdded} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.tasks && project.tasks.length > 0 ? (
                  project.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        task.status === TaskStatus.COMPLETED
                          ? 'bg-green-100 text-green-800'
                          : task.status === TaskStatus.IN_PROGRESS
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No tasks yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetailPage;
