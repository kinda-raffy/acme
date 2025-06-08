import {uuidv7} from 'uuidv7';
import {relations} from 'drizzle-orm';
import {sqliteTable} from 'drizzle-orm/sqlite-core';
import {Channel} from '../../schema';

export const ChannelAgentComment = sqliteTable(
  'ChannelAgentComment',
  d => ({
    channelAgentCommentId: d
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
    text: d.text().notNull(),
  })
);

export const channelAgentCommentRelations = relations(
  ChannelAgentComment,
  ({one}) => ({
    channel: one(Channel, {
      fields: [ChannelAgentComment.channelId],
      references: [Channel.channelId],
    }),
  })
);

export const ChannelUserComment = sqliteTable('ChannelUserComment', d => ({
  channelUserCommentId: d
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
  text: d.text().notNull(),
}));

export const channelUserCommentRelations = relations(
  ChannelUserComment,
  ({one}) => ({
    channel: one(Channel, {
      fields: [ChannelUserComment.channelId],
      references: [Channel.channelId],
    }),
  })
);
