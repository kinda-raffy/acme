import {HydrateClient} from '~/trpc/server';
import {ThreadPanel} from '~/components/threads/panel';
import {AppSidebar} from '~/components/sidebar/app-sidebar';
import {
  SidebarInset,
  SidebarTrigger,
  SidebarProvider,
} from '~/components/ui/sidebar';

export default function Page() {
  return (
    <HydrateClient>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>
          <ThreadPanel />
        </SidebarInset>
      </SidebarProvider>
    </HydrateClient>
  );
}
