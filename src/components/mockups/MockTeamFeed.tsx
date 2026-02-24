import { useState } from 'react';
import { PostCard } from '@/components/content/PostCard';
import { TopPostsLeaderboard } from '@/components/content/TopPostsLeaderboard';
import { ActiveContributorsLeaderboard } from '@/components/content/ActiveContributorsLeaderboard';
import { Newspaper, Bookmark, Search, Calendar } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

import marieAvatar from '@/assets/mockup-avatars/marie.jpg';
import julieAvatar from '@/assets/mockup-avatars/julie.jpg';
import nicolasAvatar from '@/assets/mockup-avatars/nicolas.jpg';
import pierreAvatar from '@/assets/mockup-avatars/pierre.jpg';
import sophieAvatar from '@/assets/mockup-avatars/sophie.jpg';
import thomasAvatar from '@/assets/mockup-avatars/thomas.jpg';

const mockTopPosts = [
  {
    id: 'top-1',
    content: "🚀 Thrilled to announce the launch of our new LinkedIn analytics feature for teams! After 6 months of development...",
    url: null,
    authorName: 'Marie Dupont',
    authorAvatar: marieAvatar,
    interactions: 398,
    impressions: 45200,
  },
  {
    id: 'top-2',
    content: "I spent 3 years building a personal branding strategy for our sales team. Here's what I learned...",
    url: null,
    authorName: 'Julie Bernard',
    authorAvatar: julieAvatar,
    interactions: 276,
    impressions: 28300,
  },
  {
    id: 'top-3',
    content: "💡 Advice for Product Managers: stop posting only product announcements...",
    url: null,
    authorName: 'Nicolas Petit',
    authorAvatar: nicolasAvatar,
    interactions: 209,
    impressions: 18700,
  },
];

const mockContributors = [
  { id: 'c-1', name: 'Marie Dupont', avatarUrl: marieAvatar, postCount: 8 },
  { id: 'c-2', name: 'Julie Bernard', avatarUrl: julieAvatar, postCount: 6 },
  { id: 'c-3', name: 'Thomas Martin', avatarUrl: thomasAvatar, postCount: 5 },
  { id: 'c-4', name: 'Nicolas Petit', avatarUrl: nicolasAvatar, postCount: 4 },
  { id: 'c-5', name: 'Sophie Laurent', avatarUrl: sophieAvatar, postCount: 3 },
];

const mockPosts = [
  {
    post: {
      id: 'mock-1',
      content: "🚀 Thrilled to announce the launch of our new LinkedIn analytics feature for teams!\n\nAfter 6 months of development, we finally enable managers to track their team's collective impact on LinkedIn.\n\nKey metrics:\n→ +340% average impressions per post\n→ 67% internal support rate\n→ 12 active contributors this month\n\nHuge thanks to the entire team for this incredible work 🙏\n\n#LinkedInMarketing #EmployeeAdvocacy #Analytics",
      url: null, avatar_url: null,
      impressions: 45200, likes: 342, comments: 56, shares: 23, reactions: 890,
      linkedin_created_at: '2026-02-20T09:30:00Z',
      praise: 180, empathy: 45, appreciation: 120, interest: 203,
    },
    author: { profile_name: 'Marie Dupont', avatar_url: marieAvatar, profile_picture: marieAvatar, linkedin_url: '#', linkedin_title: 'Head of Marketing @ SuperPump' },
    isTopPerformer: true,
  },
  {
    post: {
      id: 'mock-2',
      content: "I spent 3 years building a personal branding strategy for our sales team. Here's what I learned:\n\n1️⃣ Consistency beats talent. Posting 2x/week > 1 viral post/month\n2️⃣ Internal support is a game-changer. When your colleagues like and comment in the first 30 minutes, the algorithm boosts your reach x3\n3️⃣ \"Behind the scenes\" posts perform 2x better than corporate posts\n\nResult: our team of 8 generates more impressions than our company page 💪\n\nWho else is seeing this trend?",
      url: null, avatar_url: null,
      impressions: 28300, likes: 234, comments: 42, shares: 15, reactions: 520,
      linkedin_created_at: '2026-02-18T08:15:00Z',
      praise: 95, empathy: 30, appreciation: 80, interest: 81,
    },
    author: { profile_name: 'Julie Bernard', avatar_url: julieAvatar, profile_picture: julieAvatar, linkedin_url: '#', linkedin_title: 'Sales Director @ SuperPump' },
    isTopPerformer: false,
  },
  {
    post: {
      id: 'mock-3',
      content: "💡 Advice for Product Managers: stop posting only product announcements.\n\nYour most engaging posts will be the ones where you share:\n- Your failures and lessons learned\n- The behind-the-scenes of your product decisions\n- User feedback that surprised you\n\nAuthenticity > perfection.\n\nWhat type of content works best for you?",
      url: null, avatar_url: null,
      impressions: 18700, likes: 178, comments: 31, shares: 8, reactions: 350,
      linkedin_created_at: '2026-02-15T10:00:00Z',
      praise: 60, empathy: 25, appreciation: 45, interest: 42,
    },
    author: { profile_name: 'Nicolas Petit', avatar_url: nicolasAvatar, profile_picture: nicolasAvatar, linkedin_url: '#', linkedin_title: 'Product Manager @ SuperPump' },
    isTopPerformer: false,
  },
  {
    post: {
      id: 'mock-4',
      content: "We just closed our biggest deal of Q1 — and it started with a LinkedIn post.\n\nHere's what happened:\n→ Pierre shared a case study about our onboarding process\n→ A VP of Sales at a Fortune 500 commented\n→ We jumped on a call the next day\n→ 3 weeks later: signed contract 🎉\n\nSocial selling isn't just a buzzword. It works.\n\n#SocialSelling #B2B #LinkedIn",
      url: null, avatar_url: null,
      impressions: 22100, likes: 198, comments: 38, shares: 12, reactions: 445,
      linkedin_created_at: '2026-02-12T14:00:00Z',
      praise: 85, empathy: 20, appreciation: 70, interest: 68,
    },
    author: { profile_name: 'Pierre Moreau', avatar_url: pierreAvatar, profile_picture: pierreAvatar, linkedin_url: '#', linkedin_title: 'Account Executive @ SuperPump' },
    isTopPerformer: false,
  },
  {
    post: {
      id: 'mock-5',
      content: "🎯 3 things I wish I knew before starting employee advocacy:\n\n1. You can't force people to post. You need to inspire them.\n2. Quality > Quantity. One thoughtful post beats five generic shares.\n3. Measure what matters: engagement rate, not vanity metrics.\n\nWe went from 2 active posters to 12 in 6 months by focusing on these principles.\n\nWhat's your #1 tip for employee advocacy programs?",
      url: null, avatar_url: null,
      impressions: 15800, likes: 156, comments: 28, shares: 9, reactions: 310,
      linkedin_created_at: '2026-02-10T11:30:00Z',
      praise: 55, empathy: 18, appreciation: 40, interest: 53,
    },
    author: { profile_name: 'Sophie Laurent', avatar_url: sophieAvatar, profile_picture: sophieAvatar, linkedin_url: '#', linkedin_title: 'HR Manager @ SuperPump' },
    isTopPerformer: false,
  },
  {
    post: {
      id: 'mock-6',
      content: "Hot take: your company page is NOT your best marketing asset on LinkedIn.\n\nYour employees are.\n\nHere's proof:\n• Average company page post reach: 2-5% of followers\n• Average employee post reach: 10-20% of connections\n• Employee posts get 8x more engagement\n\nStop investing everything in your company page. Empower your team instead. 📊",
      url: null, avatar_url: null,
      impressions: 31500, likes: 267, comments: 45, shares: 19, reactions: 620,
      linkedin_created_at: '2026-02-08T09:00:00Z',
      praise: 110, empathy: 35, appreciation: 95, interest: 112,
    },
    author: { profile_name: 'Thomas Martin', avatar_url: thomasAvatar, profile_picture: thomasAvatar, linkedin_url: '#', linkedin_title: 'CMO @ SuperPump' },
    isTopPerformer: true,
  },
];

export function MockTeamFeed() {
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Sticky Header */}
      <div className="flex-shrink-0 space-y-4 p-4 pb-4 border-b border-border shadow-sm bg-background">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-primary" />
            Team Feed
          </h1>
          <p className="text-muted-foreground">Explore your team's LinkedIn posts</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Select defaultValue="recent">
            <SelectTrigger className="w-[150px] h-8 text-sm bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent" className="text-sm">Most recent</SelectItem>
              <SelectItem value="impressions" className="text-sm">Most viewed</SelectItem>
              <SelectItem value="reactions" className="text-sm">Most reactions</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-[160px] h-8 text-sm bg-card">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-sm">All time</SelectItem>
              <SelectItem value="today" className="text-sm">Today</SelectItem>
              <SelectItem value="week" className="text-sm">This week</SelectItem>
              <SelectItem value="month" className="text-sm">Last 30 days</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-authors">
            <SelectTrigger className="w-[200px] h-8 text-sm bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-authors" className="text-sm">All authors</SelectItem>
            </SelectContent>
          </Select>

          <Toggle
            pressed={showBookmarksOnly}
            onPressedChange={setShowBookmarksOnly}
            className="flex items-center gap-1.5 h-8 text-sm px-2"
            aria-label="Favorites"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Favorites</span>
          </Toggle>

          <div className="relative w-[240px] ml-auto">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 h-8 text-sm bg-card"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Three-Column Layout */}
      <div className="flex-1 flex gap-0 pt-4 overflow-hidden px-4">
        {/* Left Column - Top Posts */}
        <div className="hidden xl:block w-[300px] flex-shrink-0 overflow-y-auto pr-2">
          <div className="sticky top-0">
            <TopPostsLeaderboard posts={mockTopPosts} />
          </div>
        </div>

        {/* Left Separator */}
        <div className="hidden xl:block w-px bg-border mx-2 flex-shrink-0" />

        {/* Center Column - Feed */}
        <div className="flex-1 xl:max-w-[552px] mx-auto overflow-y-auto pl-2 pr-4">
          <div className="space-y-2">
            {mockPosts.map(({ post, author, isTopPerformer }) => (
              <PostCard
                key={post.id}
                post={post}
                author={author}
                isTopPerformer={isTopPerformer}
              />
            ))}
          </div>
        </div>

        {/* Right Separator */}
        <div className="hidden xl:block w-px bg-border mx-2 flex-shrink-0" />

        {/* Right Column - Active Contributors */}
        <div className="hidden xl:block w-[300px] flex-shrink-0 overflow-y-auto pl-2">
          <div className="sticky top-0">
            <ActiveContributorsLeaderboard contributors={mockContributors} />
          </div>
        </div>
      </div>
    </div>
  );
}
