'use client';

import {api} from '~/trpc/react';
import {MessageCircle} from 'lucide-react';
import {useActiveThreadId} from '~/state/session';
import {
  SidebarMenu,
  SidebarGroup,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarMenuButton,
} from '~/components/ui/sidebar';

export const NavThreads = () => {
  const activeThreadId = useActiveThreadId();
  const [{threads}] = api.threads.allThreads.useSuspenseQuery();

  const items = threads.map(thread => ({
    title: thread.channelName,
    url: `/thread/${thread.threadId}`,
    threadId: thread.threadId,
  }));

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Threads</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={activeThreadId === item.threadId}
            >
              <a href={item.url}>
                <MessageCircle />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
