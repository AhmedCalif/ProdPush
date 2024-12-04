import { createFileRoute } from '@tanstack/react-router'
import TaskManager from '@/components/Tasks'

export const Route = createFileRoute('/_authenticated/tasks')({
  component: TaskManager,
})
