/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthenicatedImport } from './routes/_authenicated'
import { Route as AuthenicatedTasksImport } from './routes/_authenicated/tasks'
import { Route as AuthenicatedProfileImport } from './routes/_authenicated/profile'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const AuthenicatedRoute = AuthenicatedImport.update({
  id: '/_authenicated',
  getParentRoute: () => rootRoute,
} as any)

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const AuthenicatedTasksRoute = AuthenicatedTasksImport.update({
  id: '/tasks',
  path: '/tasks',
  getParentRoute: () => AuthenicatedRoute,
} as any)

const AuthenicatedProfileRoute = AuthenicatedProfileImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => AuthenicatedRoute,
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
    '/_authenicated': {
      id: '/_authenicated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenicatedImport
      parentRoute: typeof rootRoute
    }
    '/_authenicated/profile': {
      id: '/_authenicated/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof AuthenicatedProfileImport
      parentRoute: typeof AuthenicatedImport
    }
    '/_authenicated/tasks': {
      id: '/_authenicated/tasks'
      path: '/tasks'
      fullPath: '/tasks'
      preLoaderRoute: typeof AuthenicatedTasksImport
      parentRoute: typeof AuthenicatedImport
    }
  }
}

// Create and export the route tree

interface AuthenicatedRouteChildren {
  AuthenicatedProfileRoute: typeof AuthenicatedProfileRoute
  AuthenicatedTasksRoute: typeof AuthenicatedTasksRoute
}

const AuthenicatedRouteChildren: AuthenicatedRouteChildren = {
  AuthenicatedProfileRoute: AuthenicatedProfileRoute,
  AuthenicatedTasksRoute: AuthenicatedTasksRoute,
}

const AuthenicatedRouteWithChildren = AuthenicatedRoute._addFileChildren(
  AuthenicatedRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '': typeof AuthenicatedRouteWithChildren
  '/profile': typeof AuthenicatedProfileRoute
  '/tasks': typeof AuthenicatedTasksRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '': typeof AuthenicatedRouteWithChildren
  '/profile': typeof AuthenicatedProfileRoute
  '/tasks': typeof AuthenicatedTasksRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/_authenicated': typeof AuthenicatedRouteWithChildren
  '/_authenicated/profile': typeof AuthenicatedProfileRoute
  '/_authenicated/tasks': typeof AuthenicatedTasksRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '' | '/profile' | '/tasks'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '' | '/profile' | '/tasks'
  id:
    | '__root__'
    | '/'
    | '/_authenicated'
    | '/_authenicated/profile'
    | '/_authenicated/tasks'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  AuthenicatedRoute: typeof AuthenicatedRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  AuthenicatedRoute: AuthenicatedRouteWithChildren,
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
        "/_authenicated"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/_authenicated": {
      "filePath": "_authenicated.tsx",
      "children": [
        "/_authenicated/profile",
        "/_authenicated/tasks"
      ]
    },
    "/_authenicated/profile": {
      "filePath": "_authenicated/profile.tsx",
      "parent": "/_authenicated"
    },
    "/_authenicated/tasks": {
      "filePath": "_authenicated/tasks.tsx",
      "parent": "/_authenicated"
    }
  }
}
ROUTE_MANIFEST_END */