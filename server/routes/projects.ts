import { Hono } from "hono";
import { db } from "../db";
import { projects, users, tasks, notes } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from '@hono/zod-validator';
import type { ApiResponse } from '@frontend/types/ApiTypes';
import {
  type Project,
  type CreateProjectInput,
  ProjectStatus
} from  "@frontend/types/ProjectTypes"
import type { Task, TaskStatus } from "@frontend/types/TasksType"
import type { Note } from "@frontend/types/NoteTypes";

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  ownerId: z.string(),
  status: z.nativeEnum(ProjectStatus).nullable(),
  dueDate: z.coerce.date().nullable()
});



const mapDbTaskToApiTask = (dbTask: typeof tasks.$inferSelect): Task => ({
  id: dbTask.id,
  title: dbTask.title,
  description: dbTask.description,
  projectId: dbTask.projectId,
  assignedTo: dbTask.assignedTo,
  status: dbTask.status as TaskStatus | null,
  priority: dbTask.priority as Task['priority'],
  dueDate: dbTask.dueDate ? new Date(dbTask.dueDate).toISOString() : null,
  createdAt: new Date(dbTask.createdAt).toISOString()
});

const mapDbNoteToApiNote = (dbNote: typeof notes.$inferSelect): Note => ({
  id: dbNote.id,
  title: dbNote.title,
  content: dbNote.content,
  projectId: dbNote.projectId,
  userId: dbNote.userId,
  createdAt: new Date(dbNote.createdAt).toISOString(),
  updatedAt: new Date(dbNote.updatedAt).toISOString()
});

export const projectsRoute = new Hono()
  .get("/", async (c) => {
    try {
      const projectsList = await db
        .select()
        .from(projects);

      const projectsWithRelations = await Promise.all(
        projectsList.map(async (p) => {
          const projectTasks = await db
            .select()
            .from(tasks)
            .where(eq(tasks.projectId, p.id));

          const projectNotes = await db
            .select()
            .from(notes)
            .where(eq(notes.projectId, p.id));

          return {
            id: p.id,
            name: p.name,
            description: p.description,
            ownerId: p.ownerId,
            status: p.status as ProjectStatus | null,
            dueDate: p.dueDate ? new Date(p.dueDate).toISOString() : null,
            createdAt: new Date(p.createdAt).toISOString(),
            tasks: projectTasks.map(mapDbTaskToApiTask),
            notes: projectNotes.map(mapDbNoteToApiNote)
          };
        })
      );

      const response: ApiResponse<Project[]> = {
        success: true,
        data: projectsWithRelations,
        error: null
      };

      return c.json(response);
    } catch (error) {
      console.error("Error fetching projects:", error);
      return c.json({
        success: false,
        error: "Failed to fetch projects"
      }, 500);
    }
  })

  .get("/:id", async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const [project] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, id));

      if (!project) {
        return c.json({
          success: false,
          error: "Project not found"
        }, 404);
      }

      const projectTasks = await db
        .select()
        .from(tasks)
        .where(eq(tasks.projectId, project.id));

      const projectNotes = await db
        .select()
        .from(notes)
        .where(eq(notes.projectId, project.id));

      const response: ApiResponse<Project> = {
        success: true,
        data: {
          id: project.id,
          name: project.name,
          description: project.description,
          ownerId: project.ownerId,
          status: project.status as ProjectStatus | null,
          dueDate: project.dueDate ? new Date(project.dueDate).toISOString() : null,
          createdAt: new Date(project.createdAt).toISOString(),
          tasks: projectTasks.map(mapDbTaskToApiTask),
          notes: projectNotes.map(mapDbNoteToApiNote)
        }
      };

      return c.json(response);
    } catch (error) {
      console.error("Error fetching project:", error);
      return c.json({
        success: false,
        error: "Failed to fetch project"
      }, 500);
    }
  })

  .post("/", zValidator('json', projectSchema), async (c) => {
    try {
      const data = await c.req.valid('json') as CreateProjectInput;
      const userExists = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, data.ownerId!))
        .get();

      if (!userExists) {
        return c.json({
          success: false,
          error: `User with ID ${data.ownerId} not found`
        }, 400);
      }

      const [newProject] = await db
        .insert(projects)
        .values({
          name: data.name,
          description: data.description,
          ownerId: data.ownerId,
          status: data.status,
          dueDate: data.dueDate,
          createdAt: new Date()
        })
        .returning();

      return c.json({
        success: true,
        data: {
          id: newProject.id,
          name: newProject.name,
          description: newProject.description,
          ownerId: newProject.ownerId,
          status: newProject.status as ProjectStatus | null,
          dueDate: newProject.dueDate ? new Date(newProject.dueDate).toISOString() : null,
          createdAt: new Date(newProject.createdAt).toISOString()
        }
      }, 201);
    } catch (error) {
      console.error("Error creating project:", error);
      return c.json({
        success: false,
        error: "Failed to create project"
      }, 500);
    }
  })

  .patch("/:id", zValidator('json', projectSchema.partial()), async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const data = await c.req.valid('json');

      const [updatedProject] = await db
        .update(projects)
        .set({
          name: data.name,
          description: data.description,
          ownerId: data.ownerId,
          status: data.status,
          dueDate: data.dueDate
        })
        .where(eq(projects.id, id))
        .returning();

      if (!updatedProject) {
        return c.json({
          success: false,
          error: "Project not found"
        }, 404);
      }

      return c.json({
        success: true,
        data: {
          id: updatedProject.id,
          name: updatedProject.name,
          description: updatedProject.description,
          ownerId: updatedProject.ownerId,
          status: updatedProject.status as ProjectStatus | null,
          dueDate: updatedProject.dueDate ? new Date(updatedProject.dueDate).toISOString() : null,
          createdAt: new Date(updatedProject.createdAt).toISOString()
        }
      });
    } catch (error) {
      console.error("Error updating project:", error);
      return c.json({
        success: false,
        error: "Failed to update project"
      }, 500);
    }
  })

  .delete("/:id", async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const [deletedProject] = await db
        .delete(projects)
        .where(eq(projects.id, id))
        .returning();

      if (!deletedProject) {
        return c.json({
          success: false,
          error: "Project not found"
        }, 404);
      }

      return c.json({
        success: true,
        data: null
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      return c.json({
        success: false,
        error: "Failed to delete project"
      }, 500);
    }
  });
