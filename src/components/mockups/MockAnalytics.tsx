import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Eye, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const overviewData = [
  { month: 'Sep', impressions: 45000, reactions: 1200 },
  { month: 'Oct', impressions: 62000, reactions: 1800 },
  { month: 'Nov', impressions: 58000, reactions: 1650 },
  { month: 'Dec', impressions: 71000, reactions: 2100 },
  { month: 'Jan', impressions: 89000, reactions: 2800 },
  { month: 'Feb', impressions: 105000, reactions: 3400 },
];

const audienceData = [
  { name: 'Marketing', value: 28 },
  { name: 'Sales', value: 22 },
  { name: 'Engineering', value: 18 },
  { name: 'C-Suite', value: 15 },
  { name: 'Product', value: 10 },
  { name: 'Other', value: 7 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--destructive))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--muted-foreground))'];

const activationData = [
  { week: 'W1', active: 3, total: 8 },
  { week: 'W2', active: 5, total: 8 },
  { week: 'W3', active: 4, total: 8 },
  { week: 'W4', active: 7, total: 8 },
];

const heatmapData = [
  { day: 'Mon', h8: 0, h9: 1, h10: 2, h11: 3, h12: 1, h13: 0, h14: 2, h15: 1, h16: 0, h17: 1 },
  { day: 'Tue', h8: 1, h9: 2, h10: 3, h11: 2, h12: 0, h13: 1, h14: 1, h15: 2, h16: 1, h17: 0 },
  { day: 'Wed', h8: 0, h9: 1, h10: 1, h11: 4, h12: 2, h13: 0, h14: 3, h15: 1, h16: 0, h17: 0 },
  { day: 'Thu', h8: 1, h9: 0, h10: 2, h11: 2, h12: 1, h13: 1, h14: 2, h15: 3, h16: 1, h17: 0 },
  { day: 'Fri', h8: 0, h9: 2, h10: 3, h11: 1, h12: 0, h13: 0, h14: 1, h15: 0, h16: 0, h17: 0 },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

function KPICard({ label, value, change, icon: Icon }: { label: string; value: string; change: string; icon: React.ElementType }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
          <TrendingUp className="w-3 h-3" />{change}
        </p>
      </CardContent>
    </Card>
  );
}

function PostingHeatmap() {
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Posting Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {heatmapData.map(row => (
            <div key={row.day} className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground w-8">{row.day}</span>
              {hours.map(h => {
                const val = row[`h${h}` as keyof typeof row] as number;
                const opacity = val === 0 ? 'bg-muted' : val === 1 ? 'bg-primary/20' : val === 2 ? 'bg-primary/40' : val >= 3 ? 'bg-primary/70' : 'bg-primary';
                return <div key={h} className={`w-6 h-6 rounded-sm ${opacity}`} title={`${row.day} ${h}:00 — ${val} posts`} />;
              })}
            </div>
          ))}
          <div className="flex items-center gap-1 mt-1 ml-8">
            {hours.map(h => (
              <span key={h} className="w-6 text-center text-[10px] text-muted-foreground">{h}</span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MockAnalytics() {
  const [tab, setTab] = useState('overview');

  return (
    <div className="h-full overflow-y-auto p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-primary" />
            Analytics
          </h2>
          <p className="text-muted-foreground text-sm">Track your team's LinkedIn performance</p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">Last 6 months</Badge>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reach">Reach & Impact</TabsTrigger>
          <TabsTrigger value="activation">Team Activation</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPICard label="Total Impressions" value="430k" change="+18% vs last period" icon={Eye} />
            <KPICard label="Total Reactions" value="12.9k" change="+24% vs last period" icon={Heart} />
            <KPICard label="Active Members" value="7/8" change="88% activation" icon={Users} />
            <KPICard label="Avg Engagement" value="3.8%" change="+0.4pp vs last period" icon={TrendingUp} />
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Impressions & Reactions Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={overviewData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={formatNumber} />
                  <Tooltip formatter={(v: number) => formatNumber(v)} />
                  <Bar dataKey="impressions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reactions" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'reach' && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Impressions Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={overviewData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={formatNumber} />
                  <Tooltip formatter={(v: number) => formatNumber(v)} />
                  <Line type="monotone" dataKey="impressions" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Audience Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie data={audienceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name} ${value}%`}>
                      {audienceData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {audienceData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-foreground">{d.name}</span>
                      <span className="text-muted-foreground">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'activation' && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Weekly Active Posters</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={activationData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="week" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="active" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Active" />
                  <Bar dataKey="total" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <PostingHeatmap />
        </div>
      )}
    </div>
  );
}
