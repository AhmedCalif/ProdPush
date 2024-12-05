import { createFileRoute } from '@tanstack/react-router'
import TaskManager from '@/components/TasksPage'

export const Route = createFileRoute('/_authenticated/tasks')({
  component: TaskManager,
})
