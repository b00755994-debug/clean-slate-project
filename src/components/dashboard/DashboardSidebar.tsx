import { LayoutDashboard, Trophy, BarChart3, Library, Users } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar 
      className="border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out"
      collapsible="icon"
    >
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end={item.url === '/dashboard'}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-primary/5 hover:text-foreground transition-all duration-200"
                          activeClassName="bg-primary/10 text-primary font-medium"
                        >
                          <item.icon className="w-5 h-5 shrink-0" />
                          <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">
                            {item.title}
                          </span>
                          {!item.available && !isCollapsed && (
                            <Badge 
                              variant="secondary" 
                              className="text-[10px] px-1.5 py-0 h-5 bg-muted text-muted-foreground group-data-[collapsible=icon]:hidden"
                            >
                              Bientôt
                            </Badge>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" className="flex items-center gap-2">
                        {item.title}
                        {!item.available && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            Bientôt
                          </Badge>
                        )}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
