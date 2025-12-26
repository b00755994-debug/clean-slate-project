import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PostCard } from './PostCard';
import { VettedContentCard } from './VettedContentCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type BookmarkType = 'all' | 'posts' | 'vetted';

interface Bookmark {
  id: string;
  post_id: string | null;
  vetted_content_id: string | null;
  created_at: string;
}

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

interface VettedContent {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  category: string | null;
  created_at: string;
}

interface BillableUser {
  id: string;
  profile_name: string;
  avatar_url: string | null;
  linkedin_url: string;
}

export function BookmarksList() {
  const { user, isAdmin } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [posts, setPosts] = useState<Record<string, Post>>({});
  const [vettedContents, setVettedContents] = useState<Record<string, VettedContent>>({});
  const [profiles, setProfiles] = useState<Record<string, BillableUser>>({});
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<BookmarkType>('all');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch all bookmarks
      const { data: bookmarksData, error: bookmarksError } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (bookmarksError) throw bookmarksError;
      setBookmarks(bookmarksData || []);

      // Get unique post IDs and vetted content IDs
      const postIds = bookmarksData?.filter(b => b.post_id).map(b => b.post_id!) || [];
      const vettedIds = bookmarksData?.filter(b => b.vetted_content_id).map(b => b.vetted_content_id!) || [];

      // Fetch posts
      if (postIds.length > 0) {
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .in('id', postIds);

        if (postsError) throw postsError;
        const postsMap: Record<string, Post> = {};
        postsData?.forEach(p => { postsMap[p.id] = p; });
        setPosts(postsMap);
      }

      // Fetch vetted contents
      if (vettedIds.length > 0) {
        const { data: vettedData, error: vettedError } = await supabase
          .from('vetted_content')
          .select('*')
          .in('id', vettedIds);

        if (vettedError) throw vettedError;
        const vettedMap: Record<string, VettedContent> = {};
        vettedData?.forEach(v => { vettedMap[v.id] = v; });
        setVettedContents(vettedMap);
      }

      // Fetch profiles for posts
      const { data: billableUsers, error: usersError } = await supabase
        .from('billable_users')
        .select('id, profile_name, avatar_url, linkedin_url');

      if (usersError) throw usersError;
      const profilesMap: Record<string, BillableUser> = {};
      billableUsers?.forEach(u => { profilesMap[u.id] = u; });
      setProfiles(profilesMap);

    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      toast.error('Erreur lors du chargement des favoris');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (bookmarkId: string, type: 'post' | 'vetted') => {
    try {
      const bookmark = bookmarks.find(b => 
        (type === 'post' && b.post_id === bookmarkId) ||
        (type === 'vetted' && b.vetted_content_id === bookmarkId)
      );

      if (!bookmark) return;

      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmark.id);

      if (error) throw error;

      setBookmarks(prev => prev.filter(b => b.id !== bookmark.id));
      toast.success('Retiré des favoris');
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const filteredBookmarks = bookmarks.filter(b => {
    if (filterType === 'posts') return b.post_id !== null;
    if (filterType === 'vetted') return b.vetted_content_id !== null;
    return true;
  });

  const postBookmarksCount = bookmarks.filter(b => b.post_id).length;
  const vettedBookmarksCount = bookmarks.filter(b => b.vetted_content_id).length;

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-4 border rounded-lg">
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter and stats */}
      <div className="flex items-center gap-4 flex-wrap">
        <Select value={filterType} onValueChange={(v: BookmarkType) => setFilterType(v)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Type de contenu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous ({bookmarks.length})</SelectItem>
            <SelectItem value="posts">Posts d'équipe ({postBookmarksCount})</SelectItem>
            <SelectItem value="vetted">Contenus validés ({vettedBookmarksCount})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookmarks list */}
      {filteredBookmarks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Aucun favori</p>
          <p className="text-sm mt-2">
            Ajoutez des posts ou contenus à vos favoris pour les retrouver ici
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookmarks.map(bookmark => {
            if (bookmark.post_id && posts[bookmark.post_id]) {
              const post = posts[bookmark.post_id];
              return (
                <div key={bookmark.id} className="relative">
                  <Badge className="absolute -top-2 left-4 z-10 bg-primary/10 text-primary text-xs">
                    Post d'équipe
                  </Badge>
                  <PostCard
                    post={post}
                    author={post.linkedin_profiles ? profiles[post.linkedin_profiles] : undefined}
                    isBookmarked={true}
                    onToggleBookmark={() => handleRemoveBookmark(bookmark.post_id!, 'post')}
                  />
                </div>
              );
            }

            if (bookmark.vetted_content_id && vettedContents[bookmark.vetted_content_id]) {
              const content = vettedContents[bookmark.vetted_content_id];
              return (
                <div key={bookmark.id} className="relative">
                  <Badge className="absolute -top-2 left-4 z-10 bg-secondary text-secondary-foreground text-xs">
                    Contenu validé
                  </Badge>
                  <VettedContentCard
                    content={content}
                    isBookmarked={true}
                    isAdmin={isAdmin}
                    onToggleBookmark={() => handleRemoveBookmark(bookmark.vetted_content_id!, 'vetted')}
                  />
                </div>
              );
            }

            return null;
          })}
        </div>
      )}
    </div>
  );
}
