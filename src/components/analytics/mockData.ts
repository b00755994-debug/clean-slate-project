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
  { month: 'Fév', posts: 31, impressions: 158000 },
  { month: 'Mar', posts: 35, impressions: 178000 },
  { month: 'Avr', posts: 33, impressions: 165000 },
  { month: 'Mai', posts: 38, impressions: 192000 },
  { month: 'Juin', posts: 40, impressions: 205000 },
  { month: 'Juil', posts: 36, impressions: 185000 },
  { month: 'Août', posts: 32, impressions: 168000 },
  { month: 'Sep', posts: 38, impressions: 195000 },
  { month: 'Oct', posts: 42, impressions: 238000 },
  { month: 'Nov', posts: 45, impressions: 262000 },
  { month: 'Déc', posts: 47, impressions: 284500 },
];

export const activationData = [
  { month: 'Jan', activeContributors: 5, avgPosts: 2.8, supportRate: 48 },
  { month: 'Fév', activeContributors: 6, avgPosts: 2.9, supportRate: 50 },
  { month: 'Mar', activeContributors: 6, avgPosts: 3.0, supportRate: 52 },
  { month: 'Avr', activeContributors: 7, avgPosts: 3.1, supportRate: 54 },
  { month: 'Mai', activeContributors: 7, avgPosts: 3.2, supportRate: 55 },
  { month: 'Juin', activeContributors: 8, avgPosts: 3.3, supportRate: 56 },
  { month: 'Juil', activeContributors: 7, avgPosts: 3.2, supportRate: 55 },
  { month: 'Août', activeContributors: 6, avgPosts: 3.0, supportRate: 52 },
  { month: 'Sep', activeContributors: 8, avgPosts: 3.2, supportRate: 58 },
  { month: 'Oct', activeContributors: 10, avgPosts: 3.6, supportRate: 62 },
  { month: 'Nov', activeContributors: 11, avgPosts: 3.8, supportRate: 65 },
  { month: 'Déc', activeContributors: 12, avgPosts: 3.9, supportRate: 67 },
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
  { month: 'Fév', impressions: 158000, engagementRate: 3.4 },
  { month: 'Mar', impressions: 178000, engagementRate: 3.6 },
  { month: 'Avr', impressions: 165000, engagementRate: 3.5 },
  { month: 'Mai', impressions: 192000, engagementRate: 3.8 },
  { month: 'Juin', impressions: 205000, engagementRate: 4.0 },
  { month: 'Juil', impressions: 185000, engagementRate: 3.9 },
  { month: 'Août', impressions: 168000, engagementRate: 3.6 },
  { month: 'Sep', impressions: 195000, engagementRate: 4.2 },
  { month: 'Oct', impressions: 238000, engagementRate: 4.5 },
  { month: 'Nov', impressions: 262000, engagementRate: 4.9 },
  { month: 'Déc', impressions: 284500, engagementRate: 5.2 },
];

// Posts distribution by impressions
export const impressionsDistribution = [
  { bucket: '0-2k', count: 12 },
  { bucket: '2k-5k', count: 18 },
  { bucket: '5k-10k', count: 10 },
  { bucket: '10k-20k', count: 5 },
  { bucket: '20k+', count: 2 },
];
