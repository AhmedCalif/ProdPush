import { createFileRoute } from '@tanstack/react-router'
import ProjectPage from "@/components/ProjectsPage"


export const Route = createFileRoute('/_authenticated/projects')({
  component: ProjectPage,
})
