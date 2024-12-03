// projects.ts
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';
import type { ApiResponse } from "@frontend/types/ApiTypes";
import { type Project } from '@frontend/types/ProjectTypes';
import { db } from '../db';
import { projects, users, type Project as DrizzleProject } from '../db/schema';

const projectSchema = z.object({
    name: z.string().min(1),
    description: z.string().nullable(),
    ownerId: z.string(),
    status: z.enum(['ACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED']).nullable(),
    dueDate: z.coerce.date().nullable(),
});

const mapDrizzleToApiProject = (project: DrizzleProject): Project => ({
    id: project.id,
    name: project.name,
    description: project.description,
    ownerId: project.ownerId,
    status: project.status as Project['status'],
    dueDate: project.dueDate ? new Date(project.dueDate).toISOString() : null,
    createdAt: new Date(project.createdAt).toISOString(),
});

export const projectsRoute = new Hono()
    .get('/', async (c) => {
        try {
            const projectsList = await db.select().from(projects);
            const response: ApiResponse<Project[]> = {
                success: true,
                data: projectsList.map(mapDrizzleToApiProject),
            };

            return c.json(response);
        } catch (error) {
            console.error('Error selecting from db', error);
            const response: ApiResponse<Project[]> = {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch projects',
            };
            return c.json(response, 500);
        }
    })

    .get('/:id', async (c) => {
        try {
            const id = Number(c.req.param('id'));
            const [project] = await db.select().from(projects).where(eq(projects.id, id));

            if (!project) {
                const response: ApiResponse<null> = {
                    success: false,
                    error: 'Project not found',
                };
                return c.json(response, 404);
            }

            const response: ApiResponse<Project> = {
                success: true,
                data: mapDrizzleToApiProject(project),
            };

            return c.json(response);
        } catch (error) {
            console.error('Error getting project', error);
            const response: ApiResponse<Project> = {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch project',
            };
            return c.json(response, 500);
        }
    })

    .post('/', zValidator('json', projectSchema), async (c) => {
        try {
            const data = await c.req.valid('json');
            const userExists = await db.select({ id: users.id }).from(users).where(eq(users.id, data.ownerId)).get();

            if (!userExists) {
                return c.json(
                    {
                        success: false,
                        error: `User with ID ${data.ownerId} not found`,
                    },
                    400
                );
            }

            const [newProject] = await db
                .insert(projects)
                .values({
                    name: data.name,
                    description: data.description,
                    ownerId: data.ownerId,
                    status: data.status,
                    dueDate: data.dueDate,
                    createdAt: new Date(),
                })
                .returning();

            return c.json(
                {
                    success: true,
                    data: mapDrizzleToApiProject(newProject),
                },
                201
            );
        } catch (error) {
            console.error('Error creating project:', error);
            return c.json(
                {
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to create project',
                },
                500
            );
        }
    })

    .patch('/:id', zValidator('json', projectSchema.partial()), async (c) => {
        try {
            const id = Number(c.req.param('id'));
            const data = await c.req.valid('json');

            const [updatedProject] = await db
                .update(projects)
                .set({
                    name: data.name,
                    description: data.description,
                    ownerId: data.ownerId,
                    status: data.status,
                    dueDate: data.dueDate,
                })
                .where(eq(projects.id, id))
                .returning();

            if (!updatedProject) {
                const response: ApiResponse<null> = {
                    success: false,
                    error: 'Project not found',
                };
                return c.json(response, 404);
            }

            const response: ApiResponse<Project> = {
                success: true,
                data: mapDrizzleToApiProject(updatedProject),
            };

            return c.json(response);
        } catch (error) {
            console.error('Error updating project', error);
            const response: ApiResponse<Project> = {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update project',
            };
            return c.json(response, 500);
        }
    })

    .delete('/:id', async (c) => {
        try {
            const id = Number(c.req.param('id'));

            const [deletedProject] = await db.delete(projects).where(eq(projects.id, id)).returning();

            if (!deletedProject) {
                const response: ApiResponse<null> = {
                    success: false,
                    error: 'Project not found',
                };
                return c.json(response, 404);
            }

            const response: ApiResponse<null> = {
                success: true,
            };

            return c.json(response);
        } catch (error) {
            console.error('Error deleting project', error);
            const response: ApiResponse<null> = {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete project',
            };
            return c.json(response, 500);
        }
    });
