import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Trophy, Rss, Zap, Menu, LogOut, Settings, User, Check } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const translations = {
  fr: {
    signOut: 'Se déconnecter',
  },
  en: {
    signOut: 'Sign out',
  }
};

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Team Feed',
    url: '/dashboard/content',
    icon: Rss,
  },
  {
    title: 'Analytics',
    url: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    title: 'Leaderboard',
    url: '/dashboard/leaderboard',
    icon: Trophy,
  },
];

export function DashboardSidebar() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Sidebar 
      className="w-52 min-w-52 max-w-52 border-r border-border/30 bg-background"
      collapsible="none"
    >
      {/* Logo Header */}
      <SidebarHeader className="px-4 py-4 border-b border-border/30">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-destructive flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">superpump</span>
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/dashboard'}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
                      activeClassName="bg-primary/10 text-primary"
                    >
                      <item.icon className="w-3.5 h-3.5" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Menu Footer */}
      <SidebarFooter className="mt-auto border-t border-border/30 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 px-3 py-2 h-auto">
              <Menu className="w-4 h-4" />
              <span className="text-sm font-medium">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-56 bg-background">
            {/* User Info */}
            <div className="px-2 py-1.5 flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium truncate">{profile?.full_name || user?.email}</span>
            </div>
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              {profile?.email || user?.email}
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem disabled className="text-xs">
                <Badge variant="outline" className="text-xs">Admin</Badge>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            {/* Language Selection */}
            <DropdownMenuItem 
              onClick={() => setLanguage('en')} 
              className="cursor-pointer justify-between"
            >
              <span>🇬🇧 English</span>
              {language === 'en' && <Check className="w-4 h-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setLanguage('fr')} 
              className="cursor-pointer justify-between"
            >
              <span>🇫🇷 Français</span>
              {language === 'fr' && <Check className="w-4 h-4" />}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Admin Settings */}
            {isAdmin && (
              <DropdownMenuItem onClick={() => navigate('/admin')} className="gap-2 cursor-pointer">
                <Settings className="w-4 h-4" />
                Admin
              </DropdownMenuItem>
            )}
            
            {/* Sign Out */}
            <DropdownMenuItem onClick={handleLogout} className="gap-2 cursor-pointer text-destructive">
              <LogOut className="w-4 h-4" />
              {t.signOut}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
