// Placeholder data for Analytics mockups
// Will be replaced with real data from Supabase later

export const overviewKPIs = {
  totalPosts: { value: 47, change: 12.5 },
  totalImpressions: { value: 284500, change: 8.2 },
  activeContributors: { value: 12, change: 20 },
  avgPostsPerContributor: { value: 3.9, change: -5.1 },
  collectiveSupportRate: { value: 67, change: 4.3 },
  engagementRate: { value: 4.8, change: 6.7 },
};

// 12 months of trend data for month-over-month charts
export const trendData = [
  { month: 'Jan', posts: 28, impressions: 142000 },
  { month: 'Feb', posts: 31, impressions: 158000 },
  { month: 'Mar', posts: 35, impressions: 178000 },
  { month: 'Apr', posts: 33, impressions: 165000 },
  { month: 'May', posts: 38, impressions: 192000 },
  { month: 'Jun', posts: 40, impressions: 205000 },
  { month: 'Jul', posts: 36, impressions: 185000 },
  { month: 'Aug', posts: 32, impressions: 168000 },
  { month: 'Sep', posts: 38, impressions: 195000 },
  { month: 'Oct', posts: 42, impressions: 238000 },
  { month: 'Nov', posts: 45, impressions: 262000 },
  { month: 'Dec', posts: 47, impressions: 284500 },
];

export const activationData = [
  { month: 'Jan', activeContributors: 5, avgPosts: 2.8, supportRate: 48 },
  { month: 'Feb', activeContributors: 6, avgPosts: 2.9, supportRate: 50 },
  { month: 'Mar', activeContributors: 6, avgPosts: 3.0, supportRate: 52 },
  { month: 'Apr', activeContributors: 7, avgPosts: 3.1, supportRate: 54 },
  { month: 'May', activeContributors: 7, avgPosts: 3.2, supportRate: 55 },
  { month: 'Jun', activeContributors: 8, avgPosts: 3.3, supportRate: 56 },
  { month: 'Jul', activeContributors: 7, avgPosts: 3.2, supportRate: 55 },
  { month: 'Aug', activeContributors: 6, avgPosts: 3.0, supportRate: 52 },
  { month: 'Sep', activeContributors: 8, avgPosts: 3.2, supportRate: 58 },
  { month: 'Oct', activeContributors: 10, avgPosts: 3.6, supportRate: 62 },
  { month: 'Nov', activeContributors: 11, avgPosts: 3.8, supportRate: 65 },
  { month: 'Dec', activeContributors: 12, avgPosts: 3.9, supportRate: 67 },
];

export const activationKPIs = {
  contributorsActivePercent: { value: 75, change: 8.3 },
  avgInternalInteractions: { value: 4.2, change: 11.5 },
};

// Audience & Reach KPIs
export const reachKPIs = {
  totalImpressions: { value: 284500, change: 8.2 },
  avgImpressionsPerPost: { value: 6053, change: 15.2 },
  engagementRate: { value: 4.8, change: 6.7 },
  commentRate: { value: 12.3, change: 2.1 },
};

// 12 months of Reach & Engagement trend data
export const reachEngagementTrendData = [
  { month: 'Jan', impressions: 142000, engagementRate: 3.2 },
  { month: 'Feb', impressions: 158000, engagementRate: 3.4 },
  { month: 'Mar', impressions: 178000, engagementRate: 3.6 },
  { month: 'Apr', impressions: 165000, engagementRate: 3.5 },
  { month: 'May', impressions: 192000, engagementRate: 3.8 },
  { month: 'Jun', impressions: 205000, engagementRate: 4.0 },
  { month: 'Jul', impressions: 185000, engagementRate: 3.9 },
  { month: 'Aug', impressions: 168000, engagementRate: 3.6 },
  { month: 'Sep', impressions: 195000, engagementRate: 4.2 },
  { month: 'Oct', impressions: 238000, engagementRate: 4.5 },
  { month: 'Nov', impressions: 262000, engagementRate: 4.9 },
  { month: 'Dec', impressions: 284500, engagementRate: 5.2 },
];

// Posts distribution by impressions
export const impressionsDistribution = [
  { bucket: '0-2k', count: 12 },
  { bucket: '2k-5k', count: 18 },
  { bucket: '5k-10k', count: 10 },
  { bucket: '10k-20k', count: 5 },
  { bucket: '20k+', count: 2 },
];

// Posting heatmap data - distribution by day and hour with impressions
export const postingHeatmapData = [
  // Monday
  { day: 'Mon', hour: '6h', count: 1, impressions: 3200 },
  { day: 'Mon', hour: '8h', count: 6, impressions: 28500 },
  { day: 'Mon', hour: '10h', count: 8, impressions: 42000 },
  { day: 'Mon', hour: '12h', count: 4, impressions: 18500 },
  { day: 'Mon', hour: '14h', count: 3, impressions: 12000 },
  { day: 'Mon', hour: '16h', count: 2, impressions: 8500 },
  { day: 'Mon', hour: '18h', count: 1, impressions: 4200 },
  { day: 'Mon', hour: '20h', count: 0, impressions: 0 },
  // Tuesday
  { day: 'Tue', hour: '6h', count: 2, impressions: 8800 },
  { day: 'Tue', hour: '8h', count: 9, impressions: 52000 },
  { day: 'Tue', hour: '10h', count: 12, impressions: 68000 },
  { day: 'Tue', hour: '12h', count: 5, impressions: 22000 },
  { day: 'Tue', hour: '14h', count: 4, impressions: 15500 },
  { day: 'Tue', hour: '16h', count: 3, impressions: 11200 },
  { day: 'Tue', hour: '18h', count: 1, impressions: 3800 },
  { day: 'Tue', hour: '20h', count: 0, impressions: 0 },
  // Wednesday
  { day: 'Wed', hour: '6h', count: 1, impressions: 4500 },
  { day: 'Wed', hour: '8h', count: 7, impressions: 38000 },
  { day: 'Wed', hour: '10h', count: 10, impressions: 55000 },
  { day: 'Wed', hour: '12h', count: 6, impressions: 28000 },
  { day: 'Wed', hour: '14h', count: 5, impressions: 21000 },
  { day: 'Wed', hour: '16h', count: 2, impressions: 9500 },
  { day: 'Wed', hour: '18h', count: 1, impressions: 4000 },
  { day: 'Wed', hour: '20h', count: 0, impressions: 0 },
  // Thursday
  { day: 'Thu', hour: '6h', count: 2, impressions: 9200 },
  { day: 'Thu', hour: '8h', count: 11, impressions: 62000 },
  { day: 'Thu', hour: '10h', count: 14, impressions: 78000 },
  { day: 'Thu', hour: '12h', count: 7, impressions: 32000 },
  { day: 'Thu', hour: '14h', count: 5, impressions: 19500 },
  { day: 'Thu', hour: '16h', count: 3, impressions: 12500 },
  { day: 'Thu', hour: '18h', count: 2, impressions: 7800 },
  { day: 'Thu', hour: '20h', count: 1, impressions: 3500 },
  // Friday
  { day: 'Fri', hour: '6h', count: 1, impressions: 3800 },
  { day: 'Fri', hour: '8h', count: 5, impressions: 24000 },
  { day: 'Fri', hour: '10h', count: 7, impressions: 35000 },
  { day: 'Fri', hour: '12h', count: 3, impressions: 14500 },
  { day: 'Fri', hour: '14h', count: 2, impressions: 8200 },
  { day: 'Fri', hour: '16h', count: 1, impressions: 4500 },
  { day: 'Fri', hour: '18h', count: 0, impressions: 0 },
  { day: 'Fri', hour: '20h', count: 0, impressions: 0 },
  // Saturday
  { day: 'Sat', hour: '6h', count: 0, impressions: 0 },
  { day: 'Sat', hour: '8h', count: 1, impressions: 5200 },
  { day: 'Sat', hour: '10h', count: 2, impressions: 11000 },
  { day: 'Sat', hour: '12h', count: 1, impressions: 4800 },
  { day: 'Sat', hour: '14h', count: 0, impressions: 0 },
  { day: 'Sat', hour: '16h', count: 0, impressions: 0 },
  { day: 'Sat', hour: '18h', count: 0, impressions: 0 },
  { day: 'Sat', hour: '20h', count: 0, impressions: 0 },
  // Sunday
  { day: 'Sun', hour: '6h', count: 0, impressions: 0 },
  { day: 'Sun', hour: '8h', count: 0, impressions: 0 },
  { day: 'Sun', hour: '10h', count: 1, impressions: 6200 },
  { day: 'Sun', hour: '12h', count: 0, impressions: 0 },
  { day: 'Sun', hour: '14h', count: 1, impressions: 5500 },
  { day: 'Sun', hour: '16h', count: 0, impressions: 0 },
  { day: 'Sun', hour: '18h', count: 1, impressions: 4200 },
  { day: 'Sun', hour: '20h', count: 0, impressions: 0 },
];
