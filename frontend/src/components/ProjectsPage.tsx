"use client";

import { useState } from 'react';
import { useProject, useProjects } from '@/hooks/useProject';
import { useParams } from "@tanstack/react-router";
import { useRouter } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, CheckSquare, FileText, Loader2 } from 'lucide-react';
import {type CreateProjectInput, ProjectStatus } from '@/types/ProjectTypes';
import { TaskStatus } from '@/types/TasksType';
import { useAuth } from '@/hooks/useAuth';

const ProjectDetailsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({
    projectName: '',
    description: '',
  });

  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams({ from: '/_authenticated/project' });

  const { createProject, isCreating, createError } = useProjects();
  const {
    project,
    isLoading,
    error
  } = useProject(parseInt(id || '0'));

  const validateForm = () => {
    let isValid = true;
    const errors = {
      projectName: '',
      description: '',
    };

    if (!formData.projectName.trim()) {
      errors.projectName = 'Project name is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setFormErrors(prev => ({
      ...prev,
      [id]: ''
    }));
  };

const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user) {
      setFormErrors(prev => ({
        ...prev,
        projectName: 'User must be logged in to create a project'
      }));
      return;
    }

    const newProject: CreateProjectInput = {
      name: formData.projectName.trim(),
      description: formData.description.trim(),
      ownerId: user.id,
      status: ProjectStatus.ACTIVE,
      dueDate: null,
      tasks: [],
      notes: []
    };

    try {
      const res = await createProject(newProject);
      console.log("Create Project Response", res)
      router.navigate({ to: '/projects' });
      setIsOpen(false);
      setFormData({
        projectName: '',
        description: ''
      });
    } catch (error) {
      console.error('Failed to create project:', error);
      setFormErrors(prev => ({
        ...prev,
        projectName: 'Failed to create project. Please try again.'
      }));
    }
};
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

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    placeholder="Enter project name"
                    required
                    className={formErrors.projectName ? 'border-red-500' : ''}
                  />
                  {formErrors.projectName && (
                    <p className="text-sm text-red-500">{formErrors.projectName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter project description"
                    required
                    className={formErrors.description ? 'border-red-500' : ''}
                  />
                  {formErrors.description && (
                    <p className="text-sm text-red-500">{formErrors.description}</p>
                  )}
                </div>
                {createError && (
                  <p className="text-sm text-red-500">
                    Failed to create project: {createError.message}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    'Create Project'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="tasks" className="w-full">
          <TabsList>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Project Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500">
                  Create a project to start adding tasks
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Project Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500">
                  Create a project to start adding notes
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
        <p className="text-gray-600">{project.description}</p>
        <div className="flex items-center gap-4 mt-4">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No due date'}
          </span>
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
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Project Tasks
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Add Task
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.tasks?.length ? (
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
                          : 'bg-yellow-100 text-yellow-800'
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

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Project Notes
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Add Note
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.notes?.length ? (
                  project.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{note.title}</h3>
                        <span className="text-sm text-gray-500">
                          {note.createdAt}
                        </span>
                      </div>
                      <p className="text-gray-600">{note.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No notes yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetailsPage;
