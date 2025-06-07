import {uuidv7} from 'uuidv7';
import {relations} from 'drizzle-orm';
import {sqliteTable} from 'drizzle-orm/sqlite-core';
import {Channel} from '../channel/channel';
import {ThreadParticipant} from './participant';

export const Thread = sqliteTable('Thread', d => ({
  threadId: d
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  channelId: d
    .text()
    .notNull()
    .references(() => Channel.channelId, {
      onUpdate: 'cascade',
      onDelete: 'cascade',
    }),
  isPublic: d.integer({mode: 'boolean'}).notNull(),
}));

export const threadRelations = relations(Thread, ({one, many}) => ({
  channel: one(Channel, {
    fields: [Thread.channelId],
    references: [Channel.channelId],
  }),
  participants: many(ThreadParticipant),
}));
