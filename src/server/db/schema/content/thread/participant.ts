import {relations} from 'drizzle-orm';
import {sqliteTable} from 'drizzle-orm/sqlite-core';
import {Thread} from './thread';
import {User} from '../../core/user';

export const ThreadParticipant = sqliteTable('ThreadParticipant', d => ({
  threadId: d
    .text()
    .notNull()
    .references(() => Thread.threadId, {
      onUpdate: 'cascade',
      onDelete: 'cascade',
    }),
  userId: d
    .text()
    .notNull()
    .references(() => User.userId, {
      onUpdate: 'cascade',
      onDelete: 'cascade',
    }),
}));

export const threadParticipantRelations = relations(
  ThreadParticipant,
  ({one}) => ({
    thread: one(Thread, {
      fields: [ThreadParticipant.threadId],
      references: [Thread.threadId],
    }),
  })
);
