'use client';

import {Suspense} from 'react';
import type * as React from 'react';
import {Command} from 'lucide-react';
import {NavUser} from '~/components/sidebar/nav/user';
import {
  Sidebar,
  SidebarMenu,
  SidebarFooter,
  SidebarHeader,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenuButton,
} from '~/components/ui/sidebar';
import {NavThreads} from './nav/threads';
import {NavSecondary} from './nav/secondary';

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {"DCNC '25"}
                  </span>
                  <span className="truncate text-xs">RMIT University</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavThreads />
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={null}>
          <NavUser />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
};
