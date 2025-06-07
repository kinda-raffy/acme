import {uuidv7} from 'uuidv7';
import {sqliteTable} from 'drizzle-orm/sqlite-core';

export const Agent = sqliteTable('Agent', d => ({
  agentId: d
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  model: d.text().notNull(),
  modelType: d.text().$type<'llm' | 'rag' | 'embedding'>(),
}));
