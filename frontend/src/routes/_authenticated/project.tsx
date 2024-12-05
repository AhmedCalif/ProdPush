import { Route } from '@tanstack/react-router'
import { authenticatedRoute } from "../_authenticated"
import ProjectDetailsPage from '@/components/ProjectsPage'

export const projectRoute = new Route({
  getParentRoute: () => authenticatedRoute,
  path: 'projects/$id',
  component: ProjectDetailsPage
})
