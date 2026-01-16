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

export const trendData = [
  { month: 'Sep', posts: 38, impressions: 195000 },
  { month: 'Oct', posts: 42, impressions: 238000 },
  { month: 'Nov', posts: 45, impressions: 262000 },
  { month: 'Déc', posts: 47, impressions: 284500 },
];

export const activationData = [
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
  icpEngagementRate: { value: 2.1, change: 12.3 },
};

// Reach & Engagement trend (weekly)
export const reachEngagementTrendData = [
  { week: 'S1', impressions: 48000, engagementRate: 3.8 },
  { week: 'S2', impressions: 52000, engagementRate: 4.1 },
  { week: 'S3', impressions: 61000, engagementRate: 4.5 },
  { week: 'S4', impressions: 58000, engagementRate: 4.2 },
  { week: 'S5', impressions: 72000, engagementRate: 5.1 },
  { week: 'S6', impressions: 68000, engagementRate: 4.9 },
  { week: 'S7', impressions: 75000, engagementRate: 5.3 },
  { week: 'S8', impressions: 78500, engagementRate: 5.6 },
];

// Posts distribution by impressions
export const impressionsDistribution = [
  { bucket: '0-1k', count: 8 },
  { bucket: '1k-5k', count: 24 },
  { bucket: '5k+', count: 15 },
];
