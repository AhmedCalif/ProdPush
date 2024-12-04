'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Task, TaskStatus } from "../types/TasksType"
import { ArrowLeft, Bell, Calendar, FileText, Home, Plus, Users } from 'lucide-react'

const dummyTasks: Task[] = [
  {
    id: 1,
    title: "Market Research",
    description: "Grocery shopping app design",
    projectId: 1,
    assignedTo: null,
    status: TaskStatus.COMPLETED,
    priority: null,
    dueDate: "2023-05-25T10:00:00Z",
    createdAt: "2023-05-24T00:00:00Z"
  },
  {
    id: 2,
    title: "Competitive Analysis",
    description: "Grocery shopping app design",
    projectId: 1,
    assignedTo: null,
    status: TaskStatus.IN_PROGRESS,
    priority: null,
    dueDate: "2023-05-25T12:00:00Z",
    createdAt: "2023-05-24T00:00:00Z"
  },
  {
    id: 3,
    title: "Create Low-fidelity Wireframe",
    description: "Uber Eats redesign challenge",
    projectId: 2,
    assignedTo: null,
    status: TaskStatus.TODO,
    priority: null,
    dueDate: "2023-05-25T19:00:00Z",
    createdAt: "2023-05-24T00:00:00Z"
  },
  {
    id: 4,
    title: "How to pitch a Design Sprint",
    description: "About design sprint",
    projectId: 3,
    assignedTo: null,
    status: TaskStatus.TODO,
    priority: null,
    dueDate: "2023-05-25T21:00:00Z",
    createdAt: "2023-05-24T00:00:00Z"
  }
]

const dates = [
  { month: "May", day: 23, weekday: "Fri" },
  { month: "May", day: 24, weekday: "Sat" },
  { month: "May", day: 25, weekday: "Sun", isSelected: true },
  { month: "May", day: 26, weekday: "Mon" },
  { month: "May", day: 27, weekday: "Tue" },
]

function TaskManager() {
  const [tasks] = useState<Task[]>(dummyTasks)
  const [activeFilter, setActiveFilter] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all')

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'todo') return task.status === TaskStatus.TODO
    if (activeFilter === 'in-progress') return task.status === TaskStatus.IN_PROGRESS
    if (activeFilter === 'completed') return task.status === TaskStatus.COMPLETED
    return true
  })

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-white p-4 flex justify-between items-center">
        <Button variant="ghost" size="icon"><ArrowLeft /></Button>
        <h1 className="text-xl font-semibold">Today's Tasks</h1>
        <Button variant="ghost" size="icon"><Bell /></Button>
      </header>

      <div className="p-4 overflow-x-auto flex space-x-2">
        {dates.map((date, index) => (
          <Button
            key={index}
            variant={date.isSelected ? "default" : "outline"}
            className={`flex-shrink-0 w-16 h-20 flex flex-col items-center justify-center ${
              date.isSelected ? 'bg-purple-600 text-white' : 'bg-white'
            }`}
          >
            <div className="text-xs">{date.month}</div>
            <div className="text-xl font-bold">{date.day}</div>
            <div className="text-xs">{date.weekday}</div>
          </Button>
        ))}
      </div>

      <div className="p-4">
        <div className="flex space-x-2 mb-4">
          {['all', 'todo', 'in-progress', 'completed'].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => setActiveFilter(filter as any)}
              className={activeFilter === filter ? 'bg-purple-600 text-white' : ''}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="bg-white">
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">{task.description}</div>
                <div className="font-semibold">{task.title}</div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-600 mr-2"></div>
                    <span className="text-sm">
                      {new Date(task.dueDate!).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    task.status === TaskStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                    task.status === TaskStatus.IN_PROGRESS ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {task.status}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around p-4">
          <Button variant="ghost" size="icon"><Home className="h-6 w-6" /></Button>
          <Button variant="ghost" size="icon"><Calendar className="h-6 w-6" /></Button>
          <Button size="icon" className="bg-purple-600 text-white rounded-full -mt-8">
            <Plus className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon"><FileText className="h-6 w-6" /></Button>
          <Button variant="ghost" size="icon"><Users className="h-6 w-6" /></Button>
        </div>
      </footer>
    </div>
  )
}

export default TaskManager
