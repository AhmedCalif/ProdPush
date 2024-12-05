"use client"
import { useProject } from '@/hooks/useProject';
import { useParams } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from "@/components/ui/button";
import { Calendar, CheckSquare, FileText, Loader2 } from 'lucide-react';
import { TaskStatus } from '@/types/TasksType';

const ProjectDetailPage = () => {
  const { id } = useParams({ from: '/_authenticated/project/$id' });
  const { project, isLoading, error } = useProject(parseInt(id));

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

export default ProjectDetailPage;
