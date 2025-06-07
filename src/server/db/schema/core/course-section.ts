import {uuidv7} from 'uuidv7';
import {sqliteTable} from 'drizzle-orm/sqlite-core';
import {Agent} from './agent';
import {Course} from './course';

export const CourseSection = sqliteTable('CourseSection', d => ({
  courseSectionId: d
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  courseId: d
    .text()
    .notNull()
    .references(() => Course.courseId, {
      onUpdate: 'cascade',
      onDelete: 'cascade',
    }),
  name: d.text().notNull(),
  description: d.text(),
  agentId: d
    .text()
    .notNull()
    .references(() => Agent.agentId, {
      onUpdate: 'cascade',
      onDelete: 'cascade',
    }),
}));
