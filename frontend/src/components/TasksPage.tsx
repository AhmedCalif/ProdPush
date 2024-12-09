'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Task, TaskStatus } from "../types/TasksType"
import { Pencil, X, Check, Trash2Icon, Clock } from 'lucide-react'
import {
  useUpdateTaskMutation,
  useDeleteTaskMutation
} from '@/hooks/useTasks'
import { useProjects } from '@/hooks/useProject'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, addDays, startOfDay } from 'date-fns'

interface EditingTask {
  id: number;
  title: string;
  description: string;
}

 export function TaskManager() {
  const { projects } = useProjects()
  const updateTask = useUpdateTaskMutation()
  const deleteTask = useDeleteTaskMutation()
  const [activeFilter, setActiveFilter] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all')
  const [editingTask, setEditingTask] = useState<EditingTask | null>(null)
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()))

  const allTasks = useMemo(() => {
    if (!projects || !Array.isArray(projects)) return []

    return projects.reduce((tasks: Task[], project) => {
      if (project.tasks && Array.isArray(project.tasks)) {
        return [...tasks, ...project.tasks]
      }
      return tasks
    }, [])
  }, [projects])

  const filteredTasks = useMemo(() => {
    if (!allTasks || !Array.isArray(allTasks)) return []

    return allTasks.filter((task: Task) => {
      if (!task) return false

      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'todo' && task.status === TaskStatus.TODO) ||
        (activeFilter === 'in-progress' && task.status === TaskStatus.IN_PROGRESS) ||
        (activeFilter === 'completed' && task.status === TaskStatus.COMPLETED)

      const taskDate = task.dueDate ? startOfDay(new Date(task.dueDate)) : null
      const matchesDate = taskDate ?
        taskDate.getTime() === selectedDate.getTime() : true

      return matchesFilter && matchesDate
    })
  }, [allTasks, activeFilter, selectedDate])

  const handleStatusUpdate = async (taskId: number, newStatus: TaskStatus) => {
    try {
      await updateTask.mutateAsync({
        id: taskId,
        status: newStatus
      })
    } catch (error) {
      console.error('Failed to update task status:', error)
    }
  }

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask.mutateAsync({ id })
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const handleEditClick = (task: Task) => {
    setEditingTask({
      id: task.id,
      title: task.title,
      description: task.description || ''
    })
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
  }

  const handleSaveEdit = async () => {
    if (!editingTask) return

    try {
      await updateTask.mutateAsync({
        id: editingTask.id,
        title: editingTask.title,
        description: editingTask.description
      })
      setEditingTask(null)
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'bg-blue-100 text-blue-800'
      case TaskStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800'
      case TaskStatus.COMPLETED:
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="mx-auto min-h-screen bg-gray-50">
      <main className="p-6">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        </header>

        <div className="grid grid-cols-7 gap-4 mb-8">
          {[...Array(7)].map((_, index) => {
            const date = addDays(selectedDate, index - 3)
            const isSelected = startOfDay(date).getTime() === selectedDate.getTime()

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(startOfDay(date))}
                className={`
                  p-3 rounded-xl flex flex-col items-center justify-center
                  transition-all duration-200 border
                  ${isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}
                `}
              >
                <span className="text-xs font-medium">{format(date, 'MMM')}</span>
                <span className="text-lg font-bold">{format(date, 'd')}</span>
                <span className="text-xs font-medium">{format(date, 'EEE')}</span>
              </button>
            )
          })}
        </div>

        <div className="flex gap-2 mb-8">
          {['all', 'todo', 'in-progress', 'completed'].map((filter) => (
            <Button
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              variant={activeFilter === filter ? 'default' : 'outline'}
              className="capitalize"
            >
              {filter === 'in-progress' ? 'In Progress' : filter}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {!filteredTasks?.length ? (
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6 text-center text-gray-500">
                No tasks found for the selected date and filter
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task: Task) => (
              <Card key={task.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {editingTask?.id === task.id ? (
                        <div className="space-y-4">
                          <Input
                            value={editingTask.title}
                            onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                            className="font-medium text-lg"
                            placeholder="Task title"
                          />
                          <Textarea
                            value={editingTask.description}
                            onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                            className="text-sm"
                            placeholder="Task description"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={handleCancelEdit}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSaveEdit}
                              className="bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="font-semibold text-lg text-gray-800">{task.title}</h3>
                            <Badge variant="secondary" className={getStatusColor(task.status as TaskStatus)}>
                              {task.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-4">{task.description}</p>
                          <div className="flex items-center gap-6">
                            {task.dueDate && (
                              <div className="flex items-center text-gray-500">
                                <Clock className="w-4 h-4 mr-2" />
                                <span className="text-sm">
                                  {format(new Date(task.dueDate), 'PPp')}
                                </span>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    {!editingTask && (
                      <div className="flex items-center gap-4">
                        <Select
                          value={task.status as TaskStatus}
                          onValueChange={(value) => {
                            if (Object.values(TaskStatus).includes(value as TaskStatus)) {
                              handleStatusUpdate(task.id, value as TaskStatus)
                            }
                          }}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                            <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                            <SelectItem value={TaskStatus.COMPLETED}>Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(task)}
                          className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                        >
                          <Pencil className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2Icon className="w-5 h-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
