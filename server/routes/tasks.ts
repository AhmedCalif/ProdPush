import { zValidator } from '@hono/zod-validator';
import { asc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';
import type { ApiResponse } from '@frontend/types/ApiTypes';
import type { Task } from '@frontend/types/TasksType';
import { db } from '../db';
import { tasks } from '../db/schema';

const taskSchema = z.object({
    title: z.string().min(1),
    description: z.string().nullable(),
    projectId: z.number(),
    assignedTo: z.string().nullable(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).nullable(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).nullable(),
    dueDate: z.string().nullable(),
});

type DrizzleTask = typeof tasks.$inferSelect;

const mapDrizzleToApiTask = (task: DrizzleTask): Task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    projectId: task.projectId,
    assignedTo: task.assignedTo,
    status: task.status as Task['status'],
    priority: task.priority as Task['priority'],
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
    createdAt: new Date(task.createdAt).toISOString(),
});

export const tasksRoute = new Hono()
    .get('/', async (c) => {
        try {
            const projectId = c.req.query('projectId');
            const baseQuery = db.select().from(tasks);

            const query = projectId ? baseQuery.where(eq(tasks.projectId, parseInt(projectId, 10))) : baseQuery;

            const taskList = await query.orderBy(asc(tasks.createdAt));

            const response: ApiResponse<Task[]> = {
                success: true,
                data: taskList.map(mapDrizzleToApiTask),
            };

            return c.json(response);
        } catch (error) {
            console.error('Error getting tasks:', error);
            const response: ApiResponse<Task[]> = {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch tasks',
            };
            return c.json(response, 500);
        }
    })

      .post('/', zValidator('json', taskSchema), async (c) => {
        try {
            const data = await c.req.valid('json');

            const [newTask] = await db
                .insert(tasks)
                .values({
                    title: data.title,
                    description: data.description ?? undefined,
                    projectId: data.projectId,
                    assignedTo: data.assignedTo ?? undefined,
                    status: data.status ?? undefined,
                    priority: data.priority ?? undefined,
                    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
                    createdAt: new Date(),
                })
                .returning();

            const response: ApiResponse<Task> = {
                success: true,
                data: mapDrizzleToApiTask(newTask),
            };

            return c.json(response, 201);
        } catch (error) {
            console.error('Error creating task:', error);
            const response: ApiResponse<Task> = {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create task',
            };
            return c.json(response, 400);
        }
    })

    .patch('/:id', zValidator('json', taskSchema.partial()), async (c) => {
        try {
            const id = parseInt(c.req.param('id'), 10);
            const data = await c.req.valid('json');

            const updateData = {
                ...(data.title !== undefined && { title: data.title }),
                ...(data.description !== undefined && { description: data.description ?? undefined }),
                ...(data.projectId !== undefined && { projectId: data.projectId ?? undefined }),
                ...(data.assignedTo !== undefined && { assignedTo: data.assignedTo ?? undefined }),
                ...(data.status !== undefined && { status: data.status ?? undefined }),
                ...(data.priority !== undefined && { priority: data.priority ?? undefined }),
                ...(data.dueDate !== undefined && { dueDate: data.dueDate ? new Date(data.dueDate) : undefined }),
            };

            const [updatedTask] = await db
                .update(tasks)
                .set(updateData)
                .where(eq(tasks.id, id))
                .returning();

            if (!updatedTask) {
                const response: ApiResponse<null> = {
                    success: false,
                    error: 'Task not found',
                };
                return c.json(response, 404);
            }

            const response: ApiResponse<Task> = {
                success: true,
                data: mapDrizzleToApiTask(updatedTask),
            };

            return c.json(response);
        } catch (error) {
            console.error('Error updating task:', error);
            const response: ApiResponse<Task> = {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update task',
            };
            return c.json(response, 500);
        }
    })


    .delete('/:id', async (c) => {
        try {
            const id = parseInt(c.req.param('id'), 10);

            const [deletedTask] = await db.delete(tasks).where(eq(tasks.id, id)).returning();

            if (!deletedTask) {
                const response: ApiResponse<null> = {
                    success: false,
                    error: 'Task not found',
                };
                return c.json(response, 404);
            }

            const response: ApiResponse<null> = {
                success: true,
            };

            return c.json(response);
        } catch (error) {
            console.error('Error deleting task:', error);
            const response: ApiResponse<null> = {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete task',
            };
            return c.json(response, 500);
        }
    });
