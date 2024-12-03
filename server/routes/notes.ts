import { Hono } from "hono";
import { db } from "../db";
import { notes } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from '@hono/zod-validator';
import type { ApiResponse } from '@frontend/types/ApiTypes';
import type { Note } from "@frontend/types/NoteTypes";

const noteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  userId: z.string().nullable()
});

type DrizzleNote = typeof notes.$inferSelect;

const mapDrizzleToApiNote = (note: DrizzleNote): Note => ({
  id: note.id,
  title: note.title,
  content: note.content,
  userId: String(note.userId),
  createdAt: new Date(note.createdAt).toISOString(),
  updatedAt: new Date(note.updatedAt).toISOString()
});

export const notesRoute = new Hono()
  .get('/', async (c) => {
    try {
      const getNotes = await db
        .select()
        .from(notes)
        .orderBy(notes.updatedAt);

      const response: ApiResponse<Note[]> = {
        error: null,
        success: true,
        data: getNotes.map(mapDrizzleToApiNote)
      };

      return c.json(response);
    } catch (error) {
      console.error('Error fetching notes:', error);
      const response: ApiResponse<Note[]> = {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch notes'
      };
      return c.json(response, 500);
    }
  })
  .get('/:id', async (c) => {
    try {
      const id = Number(c.req.param('id'));
      const [getNotesById] = await db
        .select()
        .from(notes)
        .where(eq(notes.id, id));

      if (!getNotesById) {
        const response: ApiResponse<null> = {
         data: null,
          success: false,
          error: 'Note not found'
        };
        return c.json(response, 404);
      }

      const response: ApiResponse<Note> = {
        error: null,
        success: true,
        data: mapDrizzleToApiNote(getNotesById)
      };

      return c.json(response);
    } catch (error) {
      console.error('Error fetching note:', error);
      const response: ApiResponse<Note> = {
        data : null,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch note'
      };
      return c.json(response, 500);
    }
  })
  .post('/', zValidator('json', noteSchema), async (c) => {
    try {
      const data = await c.req.valid('json');
      const now = new Date();

      const [newNote] = await db
        .insert(notes)
        .values({
          title: data.title,
          content: JSON.stringify(data.content),
          userId: String(data.userId),
          createdAt: now,
          updatedAt: now
        })
        .returning();

      const response: ApiResponse<Note> = {
        error: null,
        success: true,
        data: mapDrizzleToApiNote(newNote)
      };

      return c.json(response, 201);
    } catch (error) {
      console.error('Error creating note:', error);
      const response: ApiResponse<Note> = {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create note'
      };
      return c.json(response, 400);
    }
  })
  .patch('/:id', zValidator('json', noteSchema.partial()), async (c) => {
    try {
      const id = Number(c.req.param('id'));
      const data = await c.req.valid('json');

      const [updatedNote] = await db
        .update(notes)
        .set({
          title: data.title,
          content: data.content ? JSON.stringify(data.content) : undefined,
          userId: String(data.userId),
          updatedAt: new Date()
        })
        .where(eq(notes.id, id))
        .returning();

      if (!updatedNote) {
        const response: ApiResponse<null> = {
         data: null,
          success: false,
          error: 'Note not found'
        };
        return c.json(response, 404);
      }

      const response: ApiResponse<Note> = {
        error: null,
        success: true,
        data: mapDrizzleToApiNote(updatedNote)
      };

      return c.json(response);
    } catch (error) {
      console.error('Error updating note:', error);
      const response: ApiResponse<Note> = {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update note'
      };
      return c.json(response, 500);
    }
  })
  .delete('/:id', async (c) => {
    try {
      const id = Number(c.req.param('id'));

      const [deletedNote] = await db
        .delete(notes)
        .where(eq(notes.id, id))
        .returning();

      if (!deletedNote) {
        const response: ApiResponse<null> = {
        data: null,
          success: false,
          error: 'Note not found'
        };
        return c.json(response, 404);
      }

      const response: ApiResponse<Note> = {
        error: null,
        data: mapDrizzleToApiNote(deletedNote),
        success: true
      };

      return c.json(response);
    } catch (error) {
      console.error('Error deleting note:', error);
      const response: ApiResponse<null> = {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete note'
      };
      return c.json(response, 500);
    }
  });
