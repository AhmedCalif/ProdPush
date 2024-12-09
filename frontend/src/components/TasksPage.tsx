'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DeleteTaskInput, Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from "../types/TasksType"
import { ArrowLeft, Plus, Pencil, X, Check, Trash2Icon } from 'lucide-react'
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation
} from '@/hooks/useTasks'
import { useAuth } from '@/hooks/useAuth'
import { useProjects } from '@/hooks/useProject'

interface EditingTask {
  id: number;
  title: string;
  description: string;
}

function TaskManager() {
  const { user } = useAuth();
  const {projects} = useProjects()
  const allTasks = projects?.reduce((tasks: Task[], project) => {
    return [...tasks, ...(project.tasks || [])]
  }, [])
  const createTask = useCreateTaskMutation()
  const updateTask = useUpdateTaskMutation()
  const deleteTask = useDeleteTaskMutation()
  const [activeFilter, setActiveFilter] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all')
  const [editingTask, setEditingTask] = useState<EditingTask | null>(null)

  const filteredTasks = allTasks?.filter((task: Task) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'todo') return task.status === TaskStatus.TODO
    if (activeFilter === 'in-progress') return task.status === TaskStatus.IN_PROGRESS
    if (activeFilter === 'completed') return task.status === TaskStatus.COMPLETED
    return true
  })

  const handleStatusUpdate = async (taskId: number, newStatus: TaskStatus) => {
    try {
      const updateInput: UpdateTaskInput = {
        id: taskId,
        status: newStatus
      }
      await updateTask.mutateAsync(updateInput)
    } catch (error) {
      console.error('Failed to update task status:', error)
    }
  }

  const handleDeleteTask = async (id: number) => {
    try {
      const deleteInput: DeleteTaskInput = { id }
      await deleteTask.mutateAsync(deleteInput)
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const handleCreateTask = async () => {
    if (!user?.id) return

    try {
      const createInput: CreateTaskInput = {
        title: "New Task",
        description: "Task description",
        status: TaskStatus.TODO,
        dueDate: new Date().toISOString(),
        assignedTo: user.id
      }
      await createTask.mutateAsync(createInput)
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const handleEditClick = (task: Task) => {
    setEditingTask({
      id: task.id,
      title: task.title,
      description: String(task.description)
    })
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
  }

  const handleSaveEdit = async () => {
    if (!editingTask) return

    try {
      const updateInput: UpdateTaskInput = {
        id: editingTask.id,
        title: editingTask.title,
        description: editingTask.description
      }
      await updateTask.mutateAsync(updateInput)
      setEditingTask(null)
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }
  return (
    <div className="max-w-lg mx-auto min-h-screen bg-white">
      <main className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" className="text-gray-600 bg-white hover:text-indigo-600">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-medium text-gray-800">My Tasks</h1>
          <div className="w-9" />
        </div>

        <div className="flex justify-between gap-2 mb-6">
          {[
            { month: 'Dec', day: '03', weekday: 'Tue', isSelected: false },
            { month: 'Dec', day: '04', weekday: 'Wed', isSelected: false },
            { month: 'Dec', day: '05', weekday: 'Thu', isSelected: true },
            { month: 'Dec', day: '06', weekday: 'Fri', isSelected: false },
            { month: 'Dec', day: '07', weekday: 'Sat', isSelected: false }
          ].map((date, index) => (
            <button
              key={index}
              className={`
                flex-1 p-2 rounded-xl flex flex-col items-center justify-center
                transition-all duration-200 border
                ${date.isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-100 hover:border-indigo-200'}
              `}
            >
              <span className="text-xs font-medium">{date.month}</span>
              <span className="text-lg font-bold">{date.day}</span>
              <span className="text-xs font-medium">{date.weekday}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {['all', 'todo', 'in-progress', 'completed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                ${activeFilter === filter
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
              `}
            >
              {filter === 'in-progress' ? 'In-progress' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredTasks?.map((task: Task) => (
            <Card key={task.id} className="bg-white border border-gray-100">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {editingTask?.id === task.id ? (
                      <div className="space-y-3">
                        <Input
                          value={editingTask.title}
                          onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                          className="font-medium"
                          placeholder="Task title"
                        />
                        <Textarea
                          value={editingTask.description}
                          onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                          className="text-sm"
                          placeholder="Task description"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCancelEdit}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            className="bg-indigo-600 text-white hover:bg-indigo-700"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-800 flex-1">{task.title}</h3>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(task)}
                              className="text-gray-400 bg-white hover:text-indigo-600 hover:bg-indigo-50"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-gray-400 bg-white hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2Icon className="w-4 h-4"/>
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm">{task.description}</p>
                      </>
                    )}

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                        <span className="text-xs text-gray-500">
                          {task.dueDate && new Date(task.dueDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <select
                        value={String(task.status)}
                        onChange={(e) => handleStatusUpdate(task.id, e.target.value as TaskStatus)}
                        className={`
                          text-xs px-3 py-1 rounded-full border-0 cursor-pointer transition-colors
                          ${task.status === TaskStatus.COMPLETED
                            ? 'bg-green-50 text-green-600'
                            : task.status === TaskStatus.IN_PROGRESS
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'bg-blue-50 text-blue-600'}
                        `}
                      >
                        <option value={TaskStatus.TODO}>Todo</option>
                        <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                        <option value={TaskStatus.COMPLETED}>Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2">
        <Button
          size="icon"
          onClick={handleCreateTask}
          className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

export default TaskManager
