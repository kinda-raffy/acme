import {uuidv7} from 'uuidv7';
import {relations} from 'drizzle-orm';
import {sqliteTable} from 'drizzle-orm/sqlite-core';
import {Thread} from '../thread/thread';
import {ChannelUserComment, ChannelAgentComment} from './comment';

export const Channel = sqliteTable('Channel', d => ({
  channelId: d
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: d
    .text()
    .notNull()
    .$defaultFn(() => 'New Channel'),
}));

export const channelRelations = relations(Channel, ({one, many}) => ({
  threads: one(Thread),
  userComments: many(ChannelUserComment),
  agentComments: many(ChannelAgentComment),
}));
