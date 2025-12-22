import { useAuthContext } from '@/contexts/AuthContext';

export type AppRole = 'admin' | 'user';

// Re-export the hook for backward compatibility
export function useAuth() {
  return useAuthContext();
}
