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

// Posting heatmap data - distribution by day and hour with impressions
export const postingHeatmapData = [
  // Lundi
  { day: 'Lun', hour: '6h', count: 1, impressions: 3200 },
  { day: 'Lun', hour: '8h', count: 6, impressions: 28500 },
  { day: 'Lun', hour: '10h', count: 8, impressions: 42000 },
  { day: 'Lun', hour: '12h', count: 4, impressions: 18500 },
  { day: 'Lun', hour: '14h', count: 3, impressions: 12000 },
  { day: 'Lun', hour: '16h', count: 2, impressions: 8500 },
  { day: 'Lun', hour: '18h', count: 1, impressions: 4200 },
  { day: 'Lun', hour: '20h', count: 0, impressions: 0 },
  // Mardi
  { day: 'Mar', hour: '6h', count: 2, impressions: 8800 },
  { day: 'Mar', hour: '8h', count: 9, impressions: 52000 },
  { day: 'Mar', hour: '10h', count: 12, impressions: 68000 },
  { day: 'Mar', hour: '12h', count: 5, impressions: 22000 },
  { day: 'Mar', hour: '14h', count: 4, impressions: 15500 },
  { day: 'Mar', hour: '16h', count: 3, impressions: 11200 },
  { day: 'Mar', hour: '18h', count: 1, impressions: 3800 },
  { day: 'Mar', hour: '20h', count: 0, impressions: 0 },
  // Mercredi
  { day: 'Mer', hour: '6h', count: 1, impressions: 4500 },
  { day: 'Mer', hour: '8h', count: 7, impressions: 38000 },
  { day: 'Mer', hour: '10h', count: 10, impressions: 55000 },
  { day: 'Mer', hour: '12h', count: 6, impressions: 28000 },
  { day: 'Mer', hour: '14h', count: 5, impressions: 21000 },
  { day: 'Mer', hour: '16h', count: 2, impressions: 9500 },
  { day: 'Mer', hour: '18h', count: 1, impressions: 4000 },
  { day: 'Mer', hour: '20h', count: 0, impressions: 0 },
  // Jeudi
  { day: 'Jeu', hour: '6h', count: 2, impressions: 9200 },
  { day: 'Jeu', hour: '8h', count: 11, impressions: 62000 },
  { day: 'Jeu', hour: '10h', count: 14, impressions: 78000 },
  { day: 'Jeu', hour: '12h', count: 7, impressions: 32000 },
  { day: 'Jeu', hour: '14h', count: 5, impressions: 19500 },
  { day: 'Jeu', hour: '16h', count: 3, impressions: 12500 },
  { day: 'Jeu', hour: '18h', count: 2, impressions: 7800 },
  { day: 'Jeu', hour: '20h', count: 1, impressions: 3500 },
  // Vendredi
  { day: 'Ven', hour: '6h', count: 1, impressions: 3800 },
  { day: 'Ven', hour: '8h', count: 5, impressions: 24000 },
  { day: 'Ven', hour: '10h', count: 7, impressions: 35000 },
  { day: 'Ven', hour: '12h', count: 3, impressions: 14500 },
  { day: 'Ven', hour: '14h', count: 2, impressions: 8200 },
  { day: 'Ven', hour: '16h', count: 1, impressions: 4500 },
  { day: 'Ven', hour: '18h', count: 0, impressions: 0 },
  { day: 'Ven', hour: '20h', count: 0, impressions: 0 },
  // Samedi
  { day: 'Sam', hour: '6h', count: 0, impressions: 0 },
  { day: 'Sam', hour: '8h', count: 1, impressions: 5200 },
  { day: 'Sam', hour: '10h', count: 2, impressions: 11000 },
  { day: 'Sam', hour: '12h', count: 1, impressions: 4800 },
  { day: 'Sam', hour: '14h', count: 0, impressions: 0 },
  { day: 'Sam', hour: '16h', count: 0, impressions: 0 },
  { day: 'Sam', hour: '18h', count: 0, impressions: 0 },
  { day: 'Sam', hour: '20h', count: 0, impressions: 0 },
  // Dimanche
  { day: 'Dim', hour: '6h', count: 0, impressions: 0 },
  { day: 'Dim', hour: '8h', count: 0, impressions: 0 },
  { day: 'Dim', hour: '10h', count: 1, impressions: 6200 },
  { day: 'Dim', hour: '12h', count: 0, impressions: 0 },
  { day: 'Dim', hour: '14h', count: 1, impressions: 5500 },
  { day: 'Dim', hour: '16h', count: 0, impressions: 0 },
  { day: 'Dim', hour: '18h', count: 1, impressions: 4200 },
  { day: 'Dim', hour: '20h', count: 0, impressions: 0 },
];
