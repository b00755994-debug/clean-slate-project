import { PostCard } from '@/components/content/PostCard';

const mockPosts = [
  {
    post: {
      id: 'mock-1',
      content: "🚀 Thrilled to announce the launch of our new LinkedIn analytics feature for teams!\n\nAfter 6 months of development, we finally enable managers to track their team's collective impact on LinkedIn.\n\nKey metrics:\n→ +340% average impressions per post\n→ 67% internal support rate\n→ 12 active contributors this month\n\nHuge thanks to the entire team for this incredible work 🙏\n\n#LinkedInMarketing #EmployeeAdvocacy #Analytics",
      url: null,
      avatar_url: null,
      impressions: 45200,
      likes: 342,
      comments: 56,
      shares: 23,
      reactions: 890,
      linkedin_created_at: '2026-02-20T09:30:00Z',
      praise: 180,
      empathy: 45,
      appreciation: 120,
      interest: 203,
    },
    author: {
      profile_name: 'Marie Dupont',
      avatar_url: null,
      profile_picture: null,
      linkedin_url: '#',
      linkedin_title: 'Head of Marketing @ SuperPump',
    },
    isTopPerformer: true,
  },
  {
    post: {
      id: 'mock-2',
      content: "I spent 3 years building a personal branding strategy for our sales team. Here's what I learned:\n\n1️⃣ Consistency beats talent. Posting 2x/week > 1 viral post/month\n2️⃣ Internal support is a game-changer. When your colleagues like and comment in the first 30 minutes, the algorithm boosts your reach x3\n3️⃣ \"Behind the scenes\" posts perform 2x better than corporate posts\n\nResult: our team of 8 generates more impressions than our company page 💪\n\nWho else is seeing this trend?",
      url: null,
      avatar_url: null,
      impressions: 28300,
      likes: 234,
      comments: 42,
      shares: 15,
      reactions: 520,
      linkedin_created_at: '2026-02-18T08:15:00Z',
      praise: 95,
      empathy: 30,
      appreciation: 80,
      interest: 81,
    },
    author: {
      profile_name: 'Julie Bernard',
      avatar_url: null,
      profile_picture: null,
      linkedin_url: '#',
      linkedin_title: 'Sales Director @ SuperPump',
    },
    isTopPerformer: false,
  },
  {
    post: {
      id: 'mock-3',
      content: "💡 Advice for Product Managers: stop posting only product announcements.\n\nYour most engaging posts will be the ones where you share:\n- Your failures and lessons learned\n- The behind-the-scenes of your product decisions\n- User feedback that surprised you\n\nAuthenticity > perfection.\n\nWhat type of content works best for you?",
      url: null,
      avatar_url: null,
      impressions: 18700,
      likes: 178,
      comments: 31,
      shares: 8,
      reactions: 350,
      linkedin_created_at: '2026-02-15T10:00:00Z',
      praise: 60,
      empathy: 25,
      appreciation: 45,
      interest: 42,
    },
    author: {
      profile_name: 'Nicolas Petit',
      avatar_url: null,
      profile_picture: null,
      linkedin_url: '#',
      linkedin_title: 'Product Manager @ SuperPump',
    },
    isTopPerformer: false,
  },
];

export function MockTeamFeed() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-foreground">Team Feed</h2>
        <p className="text-muted-foreground text-sm">Latest LinkedIn posts from your team</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
  );
}
