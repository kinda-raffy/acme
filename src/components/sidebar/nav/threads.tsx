'use client';

import {api} from '~/trpc/react';
import {MessageCircle} from 'lucide-react';
import {
  SidebarMenu,
  SidebarGroup,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarMenuButton,
} from '~/components/ui/sidebar';

export const NavThreads = () => {
  const [{threads}] = api.threads.allThreads.useSuspenseQuery();

  const items = threads.map(thread => ({
    title: thread.channelName,
    url: `/thread/${thread.threadId}`,
  }));

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Threads</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(item => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
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
