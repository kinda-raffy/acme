import {uuidv7} from 'uuidv7';
import {relations} from 'drizzle-orm';
import {sqliteTable} from 'drizzle-orm/sqlite-core';
import {User, Agent, Channel} from '../../schema';

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
    agentId: d
      .text()
      .notNull()
      .references(() => Agent.agentId, {
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
    author: one(Agent, {
      fields: [ChannelAgentComment.agentId],
      references: [Agent.agentId],
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
  userId: d
    .text()
    .notNull()
    .references(() => User.userId, {
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
    author: one(User, {
      fields: [ChannelUserComment.userId],
      references: [User.userId],
    }),
  })
);
