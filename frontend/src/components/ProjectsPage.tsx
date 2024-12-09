"use client";

import React, { useState } from 'react';
import { useProjects } from '@/hooks/useProject';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Loader2, Plus, Trash } from 'lucide-react';
import { DeleteProjectInput, ProjectStatus, CreateProjectInput } from '@/types/ProjectTypes';
import { useAuth } from '@/hooks/useAuth';

const ProjectsPage = () => {
  const { deleteProject } = useProjects();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    dueDate: new Date()
  });
  const [formErrors, setFormErrors] = useState({
    projectName: '',
    description: '',
  });

  const { user } = useAuth();
  const { projects, isLoading, error, createProject, isCreating } = useProjects();

  const userProjects = projects?.filter(project => project.ownerId === user?.id);

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
      dueDate: formData.dueDate,
      tasks: [],
      notes: []
    };

    try {
      await createProject(newProject);
      setIsOpen(false);
      setFormData({
        projectName: '',
        description: '',
        dueDate: new Date()
      });
    } catch (error: any) {
      console.error('Failed to create project:', error);
      setFormErrors(prev => ({
        ...prev,
        projectName: error?.message || 'Failed to create project. Please try again.'
      }));
    }
  };

  const handleDeleteProject = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const deleteInput: DeleteProjectInput = { id };
      await deleteProject(deleteInput);
    } catch (error) {
      console.error('Failed to delete project:', error);
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
        <p className="text-red-500">Error loading projects: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Project
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userProjects?.length ? (
          userProjects.map((project) => (
            <Link
              key={project.id}
              to="/project/$id"
              params={{ id: project.id.toString() }}
              className="block hover:no-underline"
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No due date'}
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === ProjectStatus.COMPLETED
                        ? 'bg-green-100 text-green-800'
                        : project.status === ProjectStatus.ON_HOLD
                        ? 'bg-yellow-100 text-yellow-800'
                        : project.status === ProjectStatus.CANCELLED
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <Button
                    onClick={(e) => handleDeleteProject(project.id, e)}
                    className="mt-4 bg-red-500 hover:bg-red-600"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No projects yet. Create your first project to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
