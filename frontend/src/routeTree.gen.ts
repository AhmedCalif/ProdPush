/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthenticatedImport } from "./routes/_authenticated"
import { Route as AuthenticatedTasksImport } from './routes/_authenticated/tasks'
import { Route as AuthenticatedProfileImport } from './routes/_authenticated/profile'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const AuthenticatedRoute = AuthenticatedImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const AuthenticatedTasksRoute = AuthenticatedTasksImport.update({
  id: '/tasks',
  path: '/tasks',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedProfileRoute = AuthenticatedProfileImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => AuthenticatedRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/profile': {
      id: '/_authenticated/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof AuthenticatedProfileImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/tasks': {
      id: '/_authenticated/tasks'
      path: '/tasks'
      fullPath: '/tasks'
      preLoaderRoute: typeof AuthenticatedTasksImport
      parentRoute: typeof AuthenticatedImport
    }
  }
}

// Create and export the route tree

interface AuthenticatedRouteChildren {
  AuthenticatedProfileRoute: typeof AuthenticatedProfileRoute
  AuthenticatedTasksRoute: typeof AuthenticatedTasksRoute
}

const AuthenticatedRouteChildren: AuthenticatedRouteChildren = {
  AuthenticatedProfileRoute: AuthenticatedProfileRoute,
  AuthenticatedTasksRoute: AuthenticatedTasksRoute,
}

const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '': typeof AuthenticatedRouteWithChildren
  '/profile': typeof AuthenticatedProfileRoute
  '/tasks': typeof AuthenticatedTasksRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '': typeof AuthenticatedRouteWithChildren
  '/profile': typeof AuthenticatedProfileRoute
  '/tasks': typeof AuthenticatedTasksRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/_authenticated': typeof AuthenticatedRouteWithChildren
  '/_authenticated/profile': typeof AuthenticatedProfileRoute
  '/_authenticated/tasks': typeof AuthenticatedTasksRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '' | '/profile' | '/tasks'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '' | '/profile' | '/tasks'
  id:
    | '__root__'
    | '/'
    | '/_authenticated'
    | '/_authenticated/profile'
    | '/_authenticated/tasks'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  AuthenticatedRoute: typeof AuthenticatedRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_authenticated"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/_authenticated": {
      "filePath": "_authenticated.tsx",
      "children": [
        "/_authenticated/profile",
        "/_authenticated/tasks"
      ]
    },
    "/_authenticated/profile": {
      "filePath": "_authenticated/profile.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/tasks": {
      "filePath": "_authenticated/tasks.tsx",
      "parent": "/_authenticated"
    }
  }
}
ROUTE_MANIFEST_END */
