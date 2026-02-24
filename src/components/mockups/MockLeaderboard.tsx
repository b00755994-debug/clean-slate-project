import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import avatarMarie from '@/assets/mockup-avatars/marie.jpg';
import avatarThomas from '@/assets/mockup-avatars/thomas.jpg';
import avatarJulie from '@/assets/mockup-avatars/julie.jpg';
import avatarNicolas from '@/assets/mockup-avatars/nicolas.jpg';
import avatarSophie from '@/assets/mockup-avatars/sophie.jpg';
import avatarAlexandre from '@/assets/mockup-avatars/alexandre.jpg';
import avatarCamille from '@/assets/mockup-avatars/camille.jpg';
import avatarPierre from '@/assets/mockup-avatars/pierre.jpg';

const leaderboardData = [
  { rank: 1, name: 'Marie Dupont', title: 'Head of Marketing', followers: 12300, posts: 8, impressions: 45200, reactions: 1240, engagement: 5.2, change: 2, avatar: avatarMarie },
  { rank: 2, name: 'Thomas Martin', title: 'CEO & Co-founder', followers: 8700, posts: 6, impressions: 38500, reactions: 980, engagement: 4.8, change: -1, avatar: avatarThomas },
  { rank: 3, name: 'Julie Bernard', title: 'Sales Director', followers: 5400, posts: 7, impressions: 28300, reactions: 720, engagement: 4.5, change: 1, avatar: avatarJulie },
  { rank: 4, name: 'Nicolas Petit', title: 'Product Manager', followers: 3200, posts: 5, impressions: 18700, reactions: 450, engagement: 3.9, change: 0, avatar: avatarNicolas },
  { rank: 5, name: 'Sophie Laurent', title: 'HR Manager', followers: 2800, posts: 4, impressions: 12400, reactions: 310, engagement: 3.2, change: 3, avatar: avatarSophie },
  { rank: 6, name: 'Alexandre Moreau', title: 'CTO', followers: 6100, posts: 3, impressions: 15800, reactions: 280, engagement: 2.8, change: -2, avatar: avatarAlexandre },
  { rank: 7, name: 'Camille Leroy', title: 'Content Manager', followers: 1900, posts: 4, impressions: 9200, reactions: 210, engagement: 2.5, change: null, avatar: avatarCamille },
  { rank: 8, name: 'Pierre Dubois', title: 'Account Executive', followers: 1500, posts: 2, impressions: 5600, reactions: 120, engagement: 2.1, change: -1, avatar: avatarPierre },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function RankBadge({ rank }: { rank: number }) {
  const base = 'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold';
  if (rank === 1) return <div className={`${base} bg-amber-500/20 text-amber-600`}>1</div>;
  if (rank === 2) return <div className={`${base} bg-gray-400/20 text-gray-500`}>2</div>;
  if (rank === 3) return <div className={`${base} bg-orange-400/20 text-orange-500`}>3</div>;
  return <div className={`${base} bg-muted text-muted-foreground`}>{rank}</div>;
}

function RankProgression({ change }: { change: number | null }) {
  if (change === null) return <span className="text-muted-foreground text-xs">new</span>;
  if (change === 0) return <Minus className="w-4 h-4 text-muted-foreground mx-auto" />;
  if (change > 0) return (
    <span className="text-green-600 font-medium text-sm flex items-center justify-center gap-0.5">
      <TrendingUp className="w-3 h-3" />+{change}
    </span>
  );
  return (
    <span className="text-red-500 font-medium text-sm flex items-center justify-center gap-0.5">
      <TrendingDown className="w-3 h-3" />{change}
    </span>
  );
}

export function MockLeaderboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Trophy className="w-7 h-7 text-primary" />
            Leaderboard
          </h2>
          <p className="text-muted-foreground text-sm">Team member ranking by LinkedIn performance</p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">February 2026</Badge>
      </div>

      <div className="overflow-auto rounded-lg border border-border/50 bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wide">Member</TableHead>
              <TableHead className="hidden md:table-cell pl-1 text-xs uppercase tracking-wide">Title</TableHead>
              <TableHead className="w-20 px-4 text-right text-xs uppercase tracking-wide">Followers</TableHead>
              <TableHead className="w-16 px-4 text-right text-xs uppercase tracking-wide">Posts</TableHead>
              <TableHead className="w-20 px-4 text-right text-xs uppercase tracking-wide">Impressions</TableHead>
              <TableHead className="w-20 px-4 text-right text-xs uppercase tracking-wide">Reactions</TableHead>
              <TableHead className="w-20 px-4 text-right text-xs uppercase tracking-wide">Engagement</TableHead>
              <TableHead className="w-14 px-4 text-center text-xs uppercase tracking-wide">Rank</TableHead>
              <TableHead className="w-16 px-4 text-center text-xs uppercase tracking-wide">Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((entry) => (
              <TableRow key={entry.rank} className="group">
                <TableCell className="py-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={entry.avatar} alt={entry.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {getInitials(entry.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm text-foreground">{entry.name}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell pl-1 text-muted-foreground text-sm truncate max-w-[300px] py-2">
                  {entry.title}
                </TableCell>
                <TableCell className="w-20 px-4 text-right text-sm font-medium py-2">{formatNumber(entry.followers)}</TableCell>
                <TableCell className="w-16 px-4 text-right text-sm font-medium py-2">{entry.posts}</TableCell>
                <TableCell className="w-20 px-4 text-right text-sm font-medium py-2">{formatNumber(entry.impressions)}</TableCell>
                <TableCell className="w-20 px-4 text-right text-sm font-medium py-2">{formatNumber(entry.reactions)}</TableCell>
                <TableCell className="w-20 px-4 text-right text-sm font-medium py-2">{entry.engagement.toFixed(1)}%</TableCell>
                <TableCell className="w-14 px-4 text-center py-2">
                  <div className="flex justify-center"><RankBadge rank={entry.rank} /></div>
                </TableCell>
                <TableCell className="w-16 px-4 text-center py-2">
                  <RankProgression change={entry.change} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
