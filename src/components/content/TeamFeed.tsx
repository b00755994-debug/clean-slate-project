import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PostCard } from './PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface Post {
  id: string;
  content: string | null;
  url: string | null;
  impressions: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  reactions: number | null;
  created_at: string;
  linkedin_profiles: string | null;
}

interface BillableUser {
  id: string;
  profile_name: string;
  avatar_url: string | null;
  linkedin_url: string;
}

interface TeamFeedProps {
  showBookmarksOnly?: boolean;
  sortBy?: 'recent' | 'impressions' | 'reactions';
  authorFilter?: string;
}

export function TeamFeed({ 
  showBookmarksOnly = false,
  sortBy = 'recent',
  authorFilter = 'all'
}: TeamFeedProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<Record<string, BillableUser>>({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch billable users (linkedin profiles)
      const { data: billableUsers, error: usersError } = await supabase
        .from('billable_users')
        .select('id, profile_name, avatar_url, linkedin_url');

      if (usersError) throw usersError;

      const profilesMap: Record<string, BillableUser> = {};
      billableUsers?.forEach(u => {
        profilesMap[u.id] = u;
      });
      setProfiles(profilesMap);

      // Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;
      setPosts(postsData || []);

      // Fetch user's bookmarks for posts
      const { data: bookmarks, error: bookmarksError } = await supabase
        .from('bookmarks')
        .select('post_id')
        .eq('user_id', user.id)
        .not('post_id', 'is', null);

      if (bookmarksError) throw bookmarksError;
      setBookmarkedPosts(new Set(bookmarks?.map(b => b.post_id!) || []));

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des posts');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async (postId: string) => {
    if (!user) return;

    const isCurrentlyBookmarked = bookmarkedPosts.has(postId);

    try {
      if (isCurrentlyBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);

        if (error) throw error;
        setBookmarkedPosts(prev => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
        toast.success('Retiré des favoris');
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({ user_id: user.id, post_id: postId });

        if (error) throw error;
        setBookmarkedPosts(prev => new Set([...prev, postId]));
        toast.success('Ajouté aux favoris');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Erreur lors de la mise à jour des favoris');
    }
  };

  const filteredAndSortedPosts = posts
    .filter(post => authorFilter === 'all' || post.linkedin_profiles === authorFilter)
    .filter(post => !showBookmarksOnly || bookmarkedPosts.has(post.id))
    .sort((a, b) => {
      switch (sortBy) {
        case 'impressions':
          return (b.impressions || 0) - (a.impressions || 0);
        case 'reactions':
          return (b.reactions || b.likes || 0) - (a.reactions || a.likes || 0);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Posts */}
      {filteredAndSortedPosts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Aucun post trouvé</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              author={post.linkedin_profiles ? profiles[post.linkedin_profiles] : undefined}
              isBookmarked={bookmarkedPosts.has(post.id)}
              onToggleBookmark={handleToggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
}
