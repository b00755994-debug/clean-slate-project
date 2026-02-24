import { PostCard } from '@/components/content/PostCard';

const mockPosts = [
  {
    post: {
      id: 'mock-1',
      content: "🚀 Très fier d'annoncer le lancement de notre nouvelle fonctionnalité d'analytics LinkedIn pour les équipes !\n\nAprès 6 mois de développement, nous permettons enfin aux managers de suivre l'impact collectif de leur équipe sur LinkedIn.\n\nQuelques chiffres clés :\n→ +340% d'impressions moyennes par post\n→ 67% de taux de support interne\n→ 12 contributeurs actifs ce mois-ci\n\nMerci à toute l'équipe pour ce travail incroyable 🙏\n\n#LinkedInMarketing #EmployeeAdvocacy #Analytics",
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
      content: "J'ai passé 3 ans à construire une stratégie de personal branding pour notre équipe commerciale. Voici ce que j'ai appris :\n\n1️⃣ La régularité bat le talent. Poster 2x/semaine > 1 post viral/mois\n2️⃣ Le support interne est un game-changer. Quand vos collègues likent et commentent dans les 30 premières minutes, l'algo booste votre reach x3\n3️⃣ Les posts \"behind the scenes\" performent 2x mieux que les posts corporate\n\nRésultat : notre équipe de 8 personnes génère plus d'impressions que notre page entreprise 💪\n\nQui d'autre observe cette tendance ?",
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
      content: "💡 Conseil pour les Product Managers : arrêtez de poster uniquement des annonces produit.\n\nVos posts les plus engageants seront ceux où vous partagez :\n- Vos échecs et apprentissages\n- Les coulisses de vos décisions produit\n- Les retours utilisateurs qui vous ont surpris\n\nL'authenticité > la perfection.\n\nQuel type de contenu fonctionne le mieux pour vous ?",
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
        <p className="text-muted-foreground text-sm">Dernières publications LinkedIn de votre équipe</p>
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
