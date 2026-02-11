import { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from './DashboardSidebar';


interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {


  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-background overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden px-4 py-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
