import { createLazyFileRoute } from '@tanstack/react-router'
import { KanbanBoard } from '@/components/HomePage'

export const Route = createLazyFileRoute('/_authenticated/')({
  component: KanbanBoard,
})
