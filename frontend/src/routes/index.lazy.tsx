import { createLazyFileRoute } from '@tanstack/react-router'
import { KanbanBoard } from '@/components/HomePage'

export const Route = createLazyFileRoute('/')({
  component: KanbanBoard,
})


