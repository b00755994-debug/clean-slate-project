// Placeholder data for Analytics mockups
// Will be replaced with real data from Supabase later

export const overviewKPIs = {
  totalPosts: { value: 47, change: 12.5 },
  totalImpressions: { value: 284500, change: 8.2 },
  activeContributors: { value: 12, change: 20 },
  avgPostsPerContributor: { value: 3.9, change: -5.1 },
  collectiveSupportRate: { value: 67, change: 4.3 },
};

export const trendData = [
  { week: 'S1', posts: 10, impressions: 58000 },
  { week: 'S2', posts: 12, impressions: 72000 },
  { week: 'S3', posts: 11, impressions: 68000 },
  { week: 'S4', posts: 14, impressions: 86500 },
];

export const activationData = [
  { week: 'S1', activeContributors: 8, avgPosts: 3.2, supportRate: 58 },
  { week: 'S2', activeContributors: 10, avgPosts: 3.6, supportRate: 62 },
  { week: 'S3', activeContributors: 9, avgPosts: 3.8, supportRate: 65 },
  { week: 'S4', activeContributors: 12, avgPosts: 3.9, supportRate: 67 },
];

export const activationKPIs = {
  contributorsActivePercent: { value: 75, change: 8.3 },
  avgInternalInteractions: { value: 4.2, change: 11.5 },
};

export const reachKPIs = {
  avgImpressionsPerPost: { value: 6053, change: 15.2 },
};

export const impressionsTrendData = [
  { week: 'S1', impressions: 58000, withSupport: 42000 },
  { week: 'S2', impressions: 72000, withSupport: 55000 },
  { week: 'S3', impressions: 68000, withSupport: 51000 },
  { week: 'S4', impressions: 86500, withSupport: 68000 },
];

export const impressionsDistribution = [
  { bucket: '0-1k', count: 8 },
  { bucket: '1k-5k', count: 22 },
  { bucket: '5k-10k', count: 12 },
  { bucket: '10k+', count: 5 },
];
