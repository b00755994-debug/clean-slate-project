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

export const reachKPIs = {
  avgImpressionsPerPost: { value: 6053, change: 15.2 },
};

export const impressionsTrendData = [
  { month: 'Sep', impressions: 195000, withSupport: 142000 },
  { month: 'Oct', impressions: 238000, withSupport: 185000 },
  { month: 'Nov', impressions: 262000, withSupport: 198000 },
  { month: 'Déc', impressions: 284500, withSupport: 218000 },
];

export const impressionsDistribution = [
  { bucket: '0-1k', count: 8 },
  { bucket: '1k-5k', count: 22 },
  { bucket: '5k-10k', count: 12 },
  { bucket: '10k+', count: 5 },
];
