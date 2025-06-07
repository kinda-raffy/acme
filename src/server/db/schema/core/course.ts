import {uuidv7} from 'uuidv7';
import {sqliteTable} from 'drizzle-orm/sqlite-core';

export const Course = sqliteTable('Course', d => ({
  courseId: d
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: d.text().notNull(),
  description: d.text().notNull(),
}));
