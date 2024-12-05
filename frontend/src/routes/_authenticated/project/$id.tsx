import { createFileRoute } from '@tanstack/react-router'
import ProjectDetailPage from '@/components/ProjectsDetailsPage'

export const Route = createFileRoute('/_authenticated/project/$id')({
  component: ProjectDetailPage,
})
