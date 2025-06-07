import {uuidv7} from 'uuidv7';
import {sqliteTable} from 'drizzle-orm/sqlite-core';

export const User = sqliteTable('User', d => ({
  userId: d
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  username: d.text().notNull(),
}));
