import { useState } from 'react';
import { Rss, Eye, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import avatarMarie from '@/assets/mockup-avatars/marie.jpg';
import avatarThomas from '@/assets/mockup-avatars/thomas.jpg';
import avatarJulie from '@/assets/mockup-avatars/julie.jpg';
import avatarNicolas from '@/assets/mockup-avatars/nicolas.jpg';
import avatarSophie from '@/assets/mockup-avatars/sophie.jpg';
import avatarAlexandre from '@/assets/mockup-avatars/alexandre.jpg';

import likeReaction from '@/assets/linkedin-reactions/like.png';
import loveReaction from '@/assets/linkedin-reactions/love.png';
import celebrateReaction from '@/assets/linkedin-reactions/celebrate.png';
import insightfulReaction from '@/assets/linkedin-reactions/insightful.png';

const feedPosts = [
  {
    id: '1',
    author: 'Marie Dupont',
    title: 'Head of Marketing',
    avatar: avatarMarie,
    content: "🚀 Thrilled to announce that our team just launched our new employee advocacy program! In just 2 weeks, we've seen a 340% increase in LinkedIn engagement across the team.\n\nThe secret? Making it easy and fun for everyone to share authentic content.\n\n#EmployeeAdvocacy #LinkedInMarketing #B2B",
    impressions: 12400,
    reactions: 287,
    comments: 42,
    shares: 18,
    postedAt: '2h ago',
    topReactions: [likeReaction, loveReaction, celebrateReaction],
  },
  {
    id: '2',
    author: 'Thomas Martin',
    title: 'CEO & Co-founder',
    avatar: avatarThomas,
    content: "I've been thinking about why most B2B content fails on LinkedIn.\n\nIt's not about algorithms. It's about authenticity.\n\nPeople connect with people, not brands. When your team shares genuine insights from their daily work, magic happens.\n\nHere's what I learned after 6 months of building in public 👇",
    impressions: 8700,
    reactions: 195,
    comments: 31,
    shares: 12,
    postedAt: '5h ago',
    topReactions: [likeReaction, insightfulReaction, loveReaction],
  },
  {
    id: '3',
    author: 'Julie Bernard',
    title: 'Sales Director',
    avatar: avatarJulie,
    content: "Just closed our biggest deal of Q1 — and it all started with a LinkedIn post from our CTO about our tech stack.\n\nThe prospect reached out saying \"I loved the transparency in that post.\"\n\nSocial selling isn't about pitching. It's about building trust at scale.",
    impressions: 6200,
    reactions: 156,
    comments: 28,
    shares: 9,
    postedAt: '1d ago',
    topReactions: [celebrateReaction, likeReaction, loveReaction],
  },
  {
    id: '4',
    author: 'Nicolas Petit',
    title: 'Product Manager',
    avatar: avatarNicolas,
    content: "We shipped 3 features this week based entirely on user feedback from LinkedIn comments.\n\nYour audience IS your product advisory board. You just need to listen.",
    impressions: 4500,
    reactions: 98,
    comments: 15,
    shares: 6,
    postedAt: '1d ago',
    topReactions: [likeReaction, insightfulReaction],
  },
  {
    id: '5',
    author: 'Sophie Laurent',
    title: 'HR Manager',
    avatar: avatarSophie,
    content: "We received 47 inbound applications last month — 60% mentioned our team's LinkedIn presence as the reason they applied.\n\nEmployer branding isn't a campaign. It's what your team shares every day.",
    impressions: 3800,
    reactions: 112,
    comments: 19,
    shares: 7,
    postedAt: '2d ago',
    topReactions: [loveReaction, celebrateReaction, likeReaction],
  },
  {
    id: '6',
    author: 'Alexandre Moreau',
    title: 'CTO',
    avatar: avatarAlexandre,
    content: "Hot take: The best developer marketing is your engineers talking about what they actually build.\n\nNo jargon. No corporate speak. Just real problems and real solutions.",
    impressions: 5100,
    reactions: 134,
    comments: 22,
    shares: 11,
    postedAt: '2d ago',
    topReactions: [insightfulReaction, likeReaction, celebrateReaction],
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

function PostCard({ post }: { post: typeof feedPosts[0] }) {
  return (
    <div className="border border-border/50 rounded-lg p-4 bg-card hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={post.avatar} alt={post.author} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {post.author.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground">{post.author}</p>
          <p className="text-xs text-muted-foreground">{post.title}</p>
          <p className="text-xs text-muted-foreground">{post.postedAt}</p>
        </div>
        <Bookmark className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
      </div>

      <p className="text-sm text-foreground leading-relaxed whitespace-pre-line mb-4 line-clamp-4">
        {post.content}
      </p>

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/30">
        <div className="flex items-center gap-1">
          {post.topReactions.map((r, i) => (
            <img key={i} src={r} alt="" className="w-4 h-4" />
          ))}
          <span className="ml-1">{formatNumber(post.reactions)}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{formatNumber(post.impressions)}</span>
          <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{post.comments}</span>
          <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" />{post.shares}</span>
        </div>
      </div>
    </div>
  );
}

export function MockTeamFeed() {
  const [tab, setTab] = useState('all');
  
  return (
    <div className="h-full overflow-y-auto p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Rss className="w-7 h-7 text-primary" />
            Team Feed
          </h2>
          <p className="text-muted-foreground text-sm">All LinkedIn activity from your team in one place</p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">Last 7 days</Badge>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="recent">Most Recent</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {feedPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
