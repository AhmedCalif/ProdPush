import { text, sqliteTable, primaryKey, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  sub: text('sub').notNull(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  picture: text('picture'),
  given_name: text('given_name').notNull(),
  family_name: text('family_name').notNull(),
  updated_at: integer('updated_at').notNull(),
  email_verified: integer('email_verified', { mode: 'boolean' }).notNull(),
  preferred_username: text('preferred_username'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  ownerId: text('owner_id').references(() => users.id),
  status: text('status'),
  dueDate: integer('due_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  projectId: integer('project_id')
    .references(() => projects.id)
    .notNull(),  // Made required since tasks must belong to a project
  assignedTo: text('assigned_to').references(() => users.id),
  status: text('status'),
  priority: text('priority'),
  dueDate: integer('due_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const notes = sqliteTable('notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  projectId: integer('project_id')
    .references(() => projects.id)
    .notNull(),  // Added projectId reference
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const projectMembers = sqliteTable('project_members', {
  projectId: integer('project_id').references(() => projects.id).notNull(),
  userId: text('user_id').references(() => users.id).notNull(),
  role: text('role'),
}, (table) => ({
  pk: primaryKey(table.projectId, table.userId),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type ProjectMember = typeof projectMembers.$inferSelect;
export type NewProjectMember = typeof projectMembers.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
