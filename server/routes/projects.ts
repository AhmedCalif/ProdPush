import { Hono } from "hono";
import { db } from "../db";
import { projects, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from '@hono/zod-validator';
import type { ApiResponse } from '@frontend/types/ApiTypes';
import {
  type Project,
  type CreateProjectInput,
  ProjectStatus
} from  "@frontend/types/ProjectTypes"

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  ownerId: z.string(),
  status: z.nativeEnum(ProjectStatus).nullable(),
  dueDate: z.coerce.date().nullable()
});

export const projectsRoute = new Hono()
  .get("/", async (c) => {
    try {
      const projectsList = await db
        .select()
        .from(projects);

      const response: ApiResponse<Project[]> = {
        success: true,
        data: projectsList.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          ownerId: p.ownerId,
          status: p.status as ProjectStatus | null,
          dueDate: p.dueDate ? new Date(p.dueDate).toISOString() : null,
          createdAt: new Date(p.createdAt).toISOString(),
          tasks: [],
          notes: []
        })),
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
          tasks: [],
          notes: []
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
