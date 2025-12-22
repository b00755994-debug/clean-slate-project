import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Zap, LogOut, Settings, ChevronDown, User } from 'lucide-react';

export function DashboardHeader() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-destructive flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">superpump</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{profile?.email || user?.email}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              {profile?.email || user?.email}
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem disabled className="text-xs">
                <Badge variant="outline" className="text-xs">Admin</Badge>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {isAdmin && (
              <DropdownMenuItem onClick={() => navigate('/admin')} className="gap-2 cursor-pointer">
                <Settings className="w-4 h-4" />
                Admin
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="gap-2 cursor-pointer text-destructive">
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
