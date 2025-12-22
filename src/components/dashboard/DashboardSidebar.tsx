import { LayoutDashboard, Trophy, BarChart3, Library, Users } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    available: true,
  },
  {
    title: 'Leaderboard',
    url: '/dashboard/leaderboard',
    icon: Trophy,
    available: false,
  },
  {
    title: 'Analytics',
    url: '/dashboard/analytics',
    icon: BarChart3,
    available: false,
  },
  {
    title: 'Content Library',
    url: '/dashboard/content',
    icon: Library,
    available: false,
  },
  {
    title: 'Interactions',
    url: '/dashboard/interactions',
    icon: Users,
    available: false,
  },
];

export function DashboardSidebar() {
  return (
    <Sidebar 
      className="w-16 min-w-16 max-w-16 border-r border-border/30 bg-background"
      collapsible="none"
    >
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/dashboard'}
                      className="flex items-center justify-center w-10 h-10 mx-auto rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
                      activeClassName="bg-primary/10 text-primary"
                    >
                      <item.icon className="w-5 h-5" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
