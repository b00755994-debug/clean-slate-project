import { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';

import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader />
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
