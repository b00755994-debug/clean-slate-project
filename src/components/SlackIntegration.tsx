import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Hash, TrendingUp, Trophy, Share2, Bell, BarChart3, Users, MessageSquare, ThumbsUp, Eye, Smile, Repeat2, Bookmark, Zap, Slack, Home, MoreHorizontal } from "lucide-react";
import slackLogo from "@/assets/slack-logo.png";
const SlackIntegration = () => {
  const {
    language
  } = useLanguage();
  const [activeChannel, setActiveChannel] = useState("posts");
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);

  // Function to format Slack-like text with bold, mentions and links
  const formatSlackText = (text: string, baseKey: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let keyIndex = 0;
    const getKey = () => `${baseKey}-${keyIndex++}`;

    // First pass: handle bold text with mentions and links inside
    const boldRegex = /\*([^*]+)\*/g;
    let boldMatch;
    const processText = (str: string, isBold = false): React.ReactNode => {
      // Combined regex for mentions and links <url|text>
      const combinedRegex = /(@[A-Za-zÀ-ÿ\s]+)|(<([^|>]+)\|([^>]+)>)/g;
      const innerParts: React.ReactNode[] = [];
      let innerLastIndex = 0;
      let match;
      while ((match = combinedRegex.exec(str)) !== null) {
        if (match.index > innerLastIndex) {
          const textBefore = str.substring(innerLastIndex, match.index);
          innerParts.push(isBold ? <strong key={getKey()}>{textBefore}</strong> : <span key={getKey()}>{textBefore}</span>);
        }
        if (match[1]) {
          // It's a mention
          innerParts.push(<span key={getKey()} className="bg-[#E8F5FD] text-[#1264A3] px-1 py-0.5 rounded">
              {match[1]}
            </span>);
        } else if (match[3] && match[4]) {
          // It's a link <url|text>
          innerParts.push(<a key={getKey()} href={match[3]} target="_blank" rel="noopener noreferrer" className="text-[#1264A3] hover:underline font-medium">
              {match[4]}
            </a>);
        }
        innerLastIndex = combinedRegex.lastIndex;
      }
      if (innerLastIndex < str.length) {
        const textAfter = str.substring(innerLastIndex);
        innerParts.push(isBold ? <strong key={getKey()}>{textAfter}</strong> : <span key={getKey()}>{textAfter}</span>);
      }
      if (innerParts.length === 0) {
        return isBold ? <strong key={getKey()}>{str}</strong> : <span key={getKey()}>{str}</span>;
      }
      return <span key={getKey()}>{innerParts}</span>;
    };
    while ((boldMatch = boldRegex.exec(text)) !== null) {
      if (boldMatch.index > lastIndex) {
        parts.push(processText(text.substring(lastIndex, boldMatch.index)));
      }
      parts.push(processText(boldMatch[1], true));
      lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(processText(text.substring(lastIndex)));
    }
    return parts.length > 0 ? <>{parts}</> : text;
  };
  const translations = {
    fr: {
      badge: "Intégré avec Slack",
      title1: "Meilleure ",
      title2: "Application Slack",
      title3: "",
      subtitle1: "Alertes instantanées, Team Feed centralisé et analytics d'audience,",
      subtitleHighlight: "le tout dans vos canaux Slack préférés.",
      impressionsGenerated: "impressions générées",
      channels: {
        posts: {
          name: "#superpump-posts",
          description: "Recevez une alerte instantanée à chaque publication de l'équipe",
          messages: [{
            user: "superpump",
            avatar: "🚀",
            time: "il y a 2min",
            content: "⚡ *New post!* *@Sarah Martin* vient de publier un article sur comment réduire le temps d'onboarding client de 40%.\nAllez la soutenir ! <https://linkedin.com/post/...|→ Liker et commenter>",
            linkedinPreview: "Après 3 mois de travail acharné avec notre équipe, nous avons réussi à réduire le temps d'onboarding client de 40%.\n\nVoici les 3 leviers principaux qui ont fait la différence :\n➡️ Automatisation des workflows de...",
            ctaUrl: "https://linkedin.com/post/...",
            reactions: [{
              emoji: "🔥",
              count: 8,
              users: ["Marie L.", "Jean D.", "+6"]
            }, {
              emoji: "👏",
              count: 5,
              users: ["Pierre M.", "Sophie R.", "Claire B.", "+2"]
            }]
          }, {
            user: "Thomas Dubois",
            avatar: "TD",
            time: "il y a 1min",
            content: "Super article Sarah ! J'ai liké et commenté 👍",
            isReply: true
          }, {
            user: "superpump",
            avatar: "🚀",
            time: "il y a 25min",
            content: "⚡ *New post!* *@Marc Laurent* partage une success story : comment TechCorp a augmenté son taux de conversion de 156%.\nMontrez-lui votre soutien 💪 <https://linkedin.com/post/...|→ Liker et commenter>",
            linkedinPreview: "Retour d'expérience incroyable : TechCorp est passé de 50 à 500 clients en 18 mois.\n\n🎯 Le secret ? Une stratégie LinkedIn coordonnée avec toute l'équipe commerciale.\n\nLes 3 piliers de leur...",
            reactions: [{
              emoji: "🚀",
              count: 12,
              users: ["Marie L.", "Jean D.", "+10"]
            }, {
              emoji: "👍",
              count: 9,
              users: ["Pierre M.", "Sophie R.", "+7"]
            }]
          }, {
            user: "Marie Lambert",
            avatar: "ML",
            time: "il y a 20min",
            content: "Incroyable cette success story ! Je partage dans mon réseau 🎯",
            isReply: true
          }, {
            user: "Pierre Martin",
            avatar: "PM",
            time: "il y a 18min",
            content: "Done ✅",
            isReply: true
          }, {
            user: "superpump",
            avatar: "🚀",
            time: "il y a 1h",
            content: "⚡ *New post!* *@Julie Chen* lance un débat : l'IA va-t-elle remplacer les équipes commerciales d'ici 5 ans ?\nRejoignez la conversation ! <https://linkedin.com/post/...|→ Liker et commenter>",
            linkedinPreview: "L'IA va-t-elle remplacer les équipes commerciales d'ici 5 ans ? C'est la question que tout le monde se pose.\n\n🤖 Après avoir analysé 50+ entreprises SaaS, voici mon...",
            reactions: [{
              emoji: "🤔",
              count: 15,
              users: ["Marie L.", "Jean D.", "+13"]
            }, {
              emoji: "💯",
              count: 8,
              users: ["Pierre M.", "Sophie R.", "+6"]
            }]
          }, {
            user: "superpump",
            avatar: "🚀",
            time: "il y a 2h",
            content: "⚡ *New post!* *@Claire Bernard* détaille les 7 erreurs fatales à éviter en Product-Led Growth.\nUn petit like fait toujours plaisir 🙌 <https://linkedin.com/post/...|→ Liker et commenter>",
            linkedinPreview: "7 erreurs fatales qui tuent votre stratégie Product-Led Growth.\n\nAprès avoir accompagné 30+ startups, j'ai identifié les patterns récurrents d'échec :\n\n❌ Erreur #1 : Ne pas...",
            reactions: [{
              emoji: "💡",
              count: 11,
              users: ["Marie L.", "Jean D.", "+9"]
            }, {
              emoji: "🙌",
              count: 7,
              users: ["Pierre M.", "Sophie R.", "+5"]
            }]
          }]
        },
        analytics: {
          name: "#superpump-analytics",
          description: "Consultez les rapports de performance hebdomadaires et mensuels",
          messages: [{
            user: "superpump",
            avatar: "🚀",
            time: "Aujourd'hui à 9:00",
            content: "📊 *Rapport Mensuel* - Septembre 2025\n\n🎉 Excellente performance ce mois-ci ! Vos efforts collectifs portent leurs fruits.",
            stats: {
              impressions: "117,000",
              impressionsGrowth: "+23%",
              posts: "23",
              postsGrowth: "+6",
              comments: "156",
              commentsGrowth: "+18",
              likes: "892",
              likesGrowth: "+31%",
              engagement: "8.7%",
              engagementGrowth: "+1.2%",
              icpAudience: "76%",
              icpProgress: 76,
              leads: "242",
              leadsGrowth: "+4",
              topPerformers: [{
                name: "Sarah M.",
                impressions: "37.0K"
              }, {
                name: "Thomas D.",
                impressions: "24.2K"
              }, {
                name: "Julie C.",
                impressions: "11.7K"
              }]
            },
            reactions: [{
              emoji: "🎉",
              count: 7,
              users: ["Marie L.", "Jean D.", "+5"]
            }, {
              emoji: "🚀",
              count: 5,
              users: ["Pierre M.", "Sophie R.", "+3"]
            }]
          }]
        },
        leaderboard: {
          name: "#superpump-leaderboard",
          description: "Suivez les top performers et célébrez les succès de l'équipe",
          messages: [{
            user: "superpump",
            avatar: "🚀",
            time: "Aujourd'hui à 10:00",
            content: "🏆 *Classement du Mois* - Septembre 2025\n\n*🔥 TOP 3 - IMPRESSIONS GÉNÉRÉES*",
            rankings: [{
              rank: 1,
              name: "@Sarah Martin",
              score: "37,050",
              metric: "impressions",
              badge: "🥇",
              growth: "+34%"
            }, {
              rank: 2,
              name: "@Thomas Dubois",
              score: "24,200",
              metric: "impressions",
              badge: "🥈",
              growth: "+28%"
            }, {
              rank: 3,
              name: "@Julie Chen",
              score: "11,700",
              metric: "impressions",
              badge: "🥉",
              growth: "+42%"
            }],
            icpEngagement: "73%",
            secondaryStats: {
              mostPosts: [{
                name: "@Thomas Dubois",
                count: "8 posts"
              }, {
                name: "@Sarah Martin",
                count: "6 posts"
              }, {
                name: "@Claire Bernard",
                count: "5 posts"
              }],
              mostSupport: [{
                name: "@Marie Lambert",
                count: "47 interactions"
              }, {
                name: "@Pierre Martin",
                count: "39 interactions"
              }, {
                name: "@Alex Torres",
                count: "34 interactions"
              }],
              mvpSupporter: {
                name: "@Marie Lambert",
                comments: "23",
                likes: "24"
              }
            },
            reactions: [{
              emoji: "👏",
              count: 14,
              users: ["Marie L.", "Jean D.", "+12"]
            }, {
              emoji: "🎉",
              count: 8,
              users: ["Pierre M.", "Sophie R.", "+6"]
            }, {
              emoji: "🔥",
              count: 6,
              users: ["Alex T.", "Julie C.", "+4"]
            }]
          }]
        },
        share: {
          name: "#superpump-please-share",
          description: "Accédez au contenu pré-approuvé prêt à partager sur votre réseau",
          messages: [{
            user: "superpump",
            avatar: "🚀",
            time: "il y a 2h",
            content: "✅ *Nouveau contenu approuvé par l'équipe Marketing*\n\n🎯 Ce post sur notre nouvelle fonctionnalité est prêt à être partagé ! N'hésitez pas à l'adapter à votre voix.\n\n💡 *Pourquoi le partager ?* Aide à construire notre thought leadership sur l'innovation produit.",
            preview: "Nous venons de lancer une fonctionnalité qui va changer la donne pour nos clients : l'automatisation intelligente des workflows. Après 6 mois de développement, nous sommes fiers de vous présenter comment cette innovation va faire gagner 10h par semaine à nos utilisateurs...",
            cta: "🔄 Partager sur votre profil LinkedIn",
            approved: true,
            reactions: [{
              emoji: "👍",
              count: 9,
              users: ["Marie L.", "Jean D.", "+7"]
            }, {
              emoji: "🚀",
              count: 6,
              users: ["Pierre M.", "Sophie R.", "+4"]
            }],
            replies: 3
          }, {
            user: "Thomas Dubois",
            avatar: "TD",
            time: "il y a 1h",
            content: "Je partage tout de suite ! Parfait timing pour ma audience 👌",
            isReply: true
          }, {
            user: "superpump",
            avatar: "🚀",
            time: "Hier à 14:30",
            content: "✨ *Success Story Client - Validé pour partage*\n\n📢 Cette histoire résonne vraiment bien avec notre ICP. Parfait pour démontrer la valeur concrète de notre solution.\n\n🎁 *Suggestion :* Ajoutez votre propre expérience ou point de vue pour rendre le partage encore plus authentique !",
            preview: "Retour d'expérience inspirant : Comment l'équipe de TechCorp est passée de 50 à 500 clients en 18 mois grâce à une stratégie LinkedIn coordonnée. Les 3 piliers de leur succès et comment vous pouvez les reproduire...",
            cta: "📖 Lire et partager l'étude de cas",
            approved: true,
            reactions: [{
              emoji: "💯",
              count: 8,
              users: ["Marie L.", "Jean D.", "+6"]
            }, {
              emoji: "🔥",
              count: 5,
              users: ["Pierre M.", "Sophie R.", "+3"]
            }]
          }]
        },
        dm: {
          name: "superpump",
          description: "Votre rapport hebdomadaire",
          isDM: true,
          messages: [{
            user: "superpump",
            avatar: "🚀",
            time: "Aujourd'hui à 9:00",
            content: "💥 *Ton Rapport Hebdomadaire*\n\nHey ! Voici ton récap de la semaine. 🚀\n\n*📊 Tes performances cette semaine :*\n\n• *Impressions :* 2,340 (+18% vs semaine précédente)\n• *Taux d'engagement :* 6.2%\n• *Commentaires reçus :* 12\n• *Vues de profil :* 89\n\n🎉 Belle progression ! Tu es dans le top 20% de ton équipe cette semaine.\n\n*📈 Objectif semaine prochaine :* Atteindre 3,000 impressions",
            reactions: [{
              emoji: "🔥",
              count: 1,
              users: ["You"]
            }]
          }]
        }
      }
    },
    en: {
      badge: "Integrated with Slack",
      title1: "Best-in-class ",
      title2: "Slack",
      title3: " App",
      subtitle1: "Instant alerts, centralized Team Feed and audience analytics,",
      subtitleHighlight: "all in your favorite Slack channels.",
      impressionsGenerated: "impressions generated",
      channels: {
        posts: {
          name: "#superpump-posts",
          description: "Get instant alerts when your team posts on LinkedIn",
          messages: [{
            user: "superpump",
            avatar: "🚀",
            time: "2min ago",
            content: "⚡ *New post!* *@Sarah Martin* just published an article on reducing client onboarding time by 40%.\nGo support her! <https://linkedin.com/post/...|→ Like and comment>",
            linkedinPreview: "After 3 months of hard work with our team, we managed to reduce client onboarding time by 40%.\n\nHere are the 3 main levers that made the difference:\n➡️ Workflow automation...",
            reactions: [{
              emoji: "🔥",
              count: 8,
              users: ["Marie L.", "Jean D.", "+6"]
            }, {
              emoji: "👏",
              count: 5,
              users: ["Pierre M.", "Sophie R.", "Claire B.", "+2"]
            }]
          }, {
            user: "Thomas Dubois",
            avatar: "TD",
            time: "1min ago",
            content: "Great article Sarah! Liked and commented 👍",
            isReply: true
          }, {
            user: "superpump",
            avatar: "🚀",
            time: "25min ago",
            content: "⚡ *New post!* *@Marc Laurent* shares a success story: how TechCorp increased conversion by 156%.\nShow him some love 💪 <https://linkedin.com/post/...|→ Like and comment>",
            linkedinPreview: "Incredible feedback: TechCorp went from 50 to 500 clients in 18 months.\n\n🎯 The secret? A coordinated LinkedIn strategy with the entire sales team.\n\nThe 3 pillars of their...",
            reactions: [{
              emoji: "🚀",
              count: 12,
              users: ["Marie L.", "Jean D.", "+10"]
            }, {
              emoji: "👍",
              count: 9,
              users: ["Pierre M.", "Sophie R.", "+7"]
            }]
          }, {
            user: "Marie Lambert",
            avatar: "ML",
            time: "20min ago",
            content: "Amazing success story! Sharing with my network 🎯",
            isReply: true
          }, {
            user: "Pierre Martin",
            avatar: "PM",
            time: "18min ago",
            content: "Done ✅",
            isReply: true
          }, {
            user: "superpump",
            avatar: "🚀",
            time: "1h ago",
            content: "⚡ *New post!* *@Julie Chen* starts a debate: will AI replace sales teams within 5 years?\nJoin the conversation! <https://linkedin.com/post/...|→ Like and comment>",
            linkedinPreview: "Will AI replace sales teams within 5 years? That's the question everyone is asking.\n\n🤖 After analyzing 50+ SaaS companies, here's my...",
            reactions: [{
              emoji: "🤔",
              count: 15,
              users: ["Marie L.", "Jean D.", "+13"]
            }, {
              emoji: "💯",
              count: 8,
              users: ["Pierre M.", "Sophie R.", "+6"]
            }]
          }, {
            user: "superpump",
            avatar: "🚀",
            time: "2h ago",
            content: "⚡ *New post!* *@Claire Bernard* details the 7 fatal mistakes to avoid in Product-Led Growth.\nA quick like goes a long way 🙌 <https://linkedin.com/post/...|→ Like and comment>",
            linkedinPreview: "7 fatal mistakes that kill your Product-Led Growth strategy.\n\nAfter supporting 30+ startups, I've identified the recurring patterns of failure:\n\n❌ Mistake #1: Not...",
            reactions: [{
              emoji: "💡",
              count: 11,
              users: ["Marie L.", "Jean D.", "+9"]
            }, {
              emoji: "🙌",
              count: 7,
              users: ["Pierre M.", "Sophie R.", "+5"]
            }]
          }]
        },
        analytics: {
          name: "#superpump-analytics",
          description: "Access weekly and monthly performance reports on your team's reach",
          messages: [{
            user: "superpump",
            avatar: "🚀",
            time: "Today at 9:00 AM",
            content: "📊 *Monthly Report* - September 2025\n\n🎉 Excellent performance this month! Your collective efforts are paying off.",
            stats: {
              impressions: "117,000",
              impressionsGrowth: "+23%",
              posts: "23",
              postsGrowth: "+6",
              comments: "156",
              commentsGrowth: "+18",
              likes: "892",
              likesGrowth: "+31%",
              engagement: "8.7%",
              engagementGrowth: "+1.2%",
              icpAudience: "76%",
              icpProgress: 76,
              leads: "242",
              leadsGrowth: "+4",
              topPerformers: [{
                name: "Sarah M.",
                impressions: "37.0K"
              }, {
                name: "Thomas D.",
                impressions: "24.2K"
              }, {
                name: "Julie C.",
                impressions: "11.7K"
              }]
            },
            reactions: [{
              emoji: "🎉",
              count: 7,
              users: ["Marie L.", "Jean D.", "+5"]
            }, {
              emoji: "🚀",
              count: 5,
              users: ["Pierre M.", "Sophie R.", "+3"]
            }]
          }]
        },
        leaderboard: {
          name: "#superpump-leaderboard",
          description: "Track top performers and celebrate team achievements",
          messages: [{
            user: "superpump",
            avatar: "🚀",
            time: "Today at 10:00 AM",
            content: "🏆 *Monthly Leaderboard* - September 2025\n\n*🔥 TOP 3 - IMPRESSIONS GENERATED*",
            rankings: [{
              rank: 1,
              name: "@Sarah Martin",
              score: "37,050",
              metric: "impressions",
              badge: "🥇",
              growth: "+34%"
            }, {
              rank: 2,
              name: "@Thomas Dubois",
              score: "24,200",
              metric: "impressions",
              badge: "🥈",
              growth: "+28%"
            }, {
              rank: 3,
              name: "@Julie Chen",
              score: "11,700",
              metric: "impressions",
              badge: "🥉",
              growth: "+42%"
            }],
            icpEngagement: "73%",
            secondaryStats: {
              mostPosts: [{
                name: "@Thomas Dubois",
                count: "8 posts"
              }, {
                name: "@Sarah Martin",
                count: "6 posts"
              }, {
                name: "@Claire Bernard",
                count: "5 posts"
              }],
              mostSupport: [{
                name: "@Marie Lambert",
                count: "47 interactions"
              }, {
                name: "@Pierre Martin",
                count: "39 interactions"
              }, {
                name: "@Alex Torres",
                count: "34 interactions"
              }],
              mvpSupporter: {
                name: "@Marie Lambert",
                comments: "23",
                likes: "24"
              }
            },
            reactions: [{
              emoji: "👏",
              count: 14,
              users: ["Marie L.", "Jean D.", "+12"]
            }, {
              emoji: "🎉",
              count: 8,
              users: ["Pierre M.", "Sophie R.", "+6"]
            }, {
              emoji: "🔥",
              count: 6,
              users: ["Alex T.", "Julie C.", "+4"]
            }]
          }]
        },
        share: {
          name: "#superpump-please-share",
          description: "Access pre-approved content ready to share with your network",
          messages: [{
            user: "superpump",
            avatar: "🚀",
            time: "2h ago",
            content: "✅ *New content approved by the Marketing team*\n\n🎯 This post about our new feature is ready to be shared! Feel free to adapt it to your voice.\n\n💡 *Why share it?* Helps build our thought leadership on product innovation.",
            preview: "We just launched a game-changing feature for our clients: intelligent workflow automation. After 6 months of development, we're proud to present how this innovation will save our users 10 hours per week...",
            cta: "🔄 Share on your LinkedIn profile",
            approved: true,
            reactions: [{
              emoji: "👍",
              count: 9,
              users: ["Marie L.", "Jean D.", "+7"]
            }, {
              emoji: "🚀",
              count: 6,
              users: ["Pierre M.", "Sophie R.", "+4"]
            }],
            replies: 3
          }, {
            user: "Thomas Dubois",
            avatar: "TD",
            time: "1h ago",
            content: "Sharing right away! Perfect timing for my audience 👌",
            isReply: true
          }, {
            user: "superpump",
            avatar: "🚀",
            time: "Yesterday at 2:30 PM",
            content: "✨ *Client Success Story - Validated for sharing*\n\n📢 This story really resonates with our ICP. Perfect to demonstrate the concrete value of our solution.\n\n🎁 *Suggestion:* Add your own experience or perspective to make the share even more authentic!",
            preview: "Inspiring feedback: How TechCorp's team went from 50 to 500 clients in 18 months thanks to a coordinated LinkedIn strategy. The 3 pillars of their success and how you can replicate them...",
            cta: "📖 Read and share the case study",
            approved: true,
            reactions: [{
              emoji: "💯",
              count: 8,
              users: ["Marie L.", "Jean D.", "+6"]
            }, {
              emoji: "🔥",
              count: 5,
              users: ["Pierre M.", "Sophie R.", "+3"]
            }]
          }]
        },
        dm: {
          name: "superpump",
          description: "Your weekly report",
          isDM: true,
          messages: [{
            user: "superpump",
            avatar: "🚀",
            time: "Today at 9:00 AM",
            content: "💥 *Your Weekly Report*\n\nHey! Here's your weekly summary. 🚀\n\n*📊 Your performance this week:*\n\n• *Impressions:* 2,340 (+18% vs previous week)\n• *Engagement rate:* 6.2%\n• *Comments received:* 12\n• *Profile views:* 89\n\n🎉 Great progress! You're in the top 20% of your team this week.\n\n*📈 Next week goal:* Reach 3,000 impressions",
            reactions: [{
              emoji: "🔥",
              count: 1,
              users: ["You"]
            }]
          }]
        }
      }
    }
  };
  const t = translations[language];
  const channels = [{
    id: "posts",
    icon: Bell,
    data: t.channels.posts
  }, {
    id: "analytics",
    icon: BarChart3,
    data: t.channels.analytics
  }, {
    id: "dm",
    icon: MessageSquare,
    data: t.channels.dm,
    isDM: true
  }];

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoPlay) return;
    const channelIds = ["posts", "analytics", "dm"]; // Order specified
    const currentIndex = channelIds.indexOf(activeChannel);

    // Progress animation (0 to 100 over 7 seconds)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 100 / 70; // 70 steps over 7 seconds (100ms per step)

        // When reaching 100%, switch to next channel
        if (newProgress >= 100) {
          const nextIndex = (currentIndex + 1) % channelIds.length;
          setActiveChannel(channelIds[nextIndex]);
          return 0;
        }
        return newProgress;
      });
    }, 100);
    return () => {
      clearInterval(progressInterval);
    };
  }, [activeChannel, isAutoPlay]);
  const handleChannelClick = (channelId: string) => {
    setIsAutoPlay(false);
    setActiveChannel(channelId);
    setProgress(0);
  };
  return <section id="slack-integration" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t.title1}
            <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
              {t.title2}
            </span>
            {t.title3}
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: '#5A5A5A' }}>
            {t.subtitle1}
            <br />
            <span className="bg-primary/15 text-primary px-2 py-0.5 rounded-md font-medium">
              {t.subtitleHighlight}
            </span>
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="border-[3px] border-border/80 bg-card overflow-hidden shadow-2xl ring-1 ring-border/50">
            <div className="flex h-[650px]">
              {/* Left Sidebar - Slack Navigation */}
              <div className="w-16 bg-[#350D36] flex flex-col items-center py-4 gap-3 border-r border-white/10">
                <button className="flex flex-col items-center gap-1 px-1 py-2 rounded-lg hover:bg-white/10 transition-colors group w-full">
                  <Home className="h-5 w-5 text-white" />
                  <span className="text-[9px] text-white font-medium">Home</span>
                </button>
                <button className="flex flex-col items-center gap-1 px-1 py-2 rounded-lg hover:bg-white/10 transition-colors group w-full">
                  <MessageSquare className="h-5 w-5 text-white" />
                  <span className="text-[9px] text-white font-medium">DMs</span>
                </button>
                <button className="flex flex-col items-center gap-1 px-1 py-2 rounded-lg hover:bg-white/10 transition-colors group w-full">
                  <Bell className="h-5 w-5 text-white" />
                  <span className="text-[9px] text-white font-medium">Activity</span>
                </button>
                <button className="flex flex-col items-center gap-1 px-1 py-2 rounded-lg hover:bg-white/10 transition-colors group w-full">
                  <Bookmark className="h-5 w-5 text-white" />
                  <span className="text-[9px] text-white font-medium">Later</span>
                </button>
                <button className="flex flex-col items-center gap-1 px-1 py-2 rounded-lg hover:bg-white/10 transition-colors group w-full">
                  <MoreHorizontal className="h-5 w-5 text-white" />
                  <span className="text-[9px] text-white font-medium">More</span>
                </button>
              </div>

              {/* Sidebar - Channel List */}
              <div className="w-64 bg-[#3F0E40] text-white p-4 flex flex-col border-r border-white/10 font-lato">
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-1">superpump</h3>
                  <p className="text-sm text-white/70">Workspace</p>
                </div>

                <div className="flex-1 space-y-1 overflow-y-auto">
                  {/* Starred */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-white/50 mb-2 px-2 flex items-center justify-between">
                      <span>STARRED</span>
                    </div>
                    <button className="w-full text-left px-2 py-1.5 rounded flex items-center gap-2 text-white/70 hover:bg-white/10">
                      <Hash className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm truncate">general</span>
                    </button>
                  </div>

                  {/* Channels */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-white/50 mb-2 px-2 flex items-center justify-between">
                      <span>CHANNELS</span>
                      <button className="text-white/50 hover:text-white text-lg leading-none">+</button>
                    </div>
                    {channels.filter(c => !c.isDM).map(channel => {
                    const Icon = channel.icon;
                    const isActive = activeChannel === channel.id;
                    return <button key={channel.id} onClick={() => handleChannelClick(channel.id)} className={`relative w-full text-left px-2 py-1.5 rounded flex items-center gap-2 transition-all duration-300 overflow-hidden ${isActive ? "bg-primary/60 text-white shadow-sm" : "text-white/70 hover:bg-primary/40 hover:text-white"}`}>
                          {/* Progress bar - fills entire button */}
                          {isActive && isAutoPlay && <div className="absolute inset-0 bg-primary/40 transition-all duration-100 rounded" style={{
                        width: `${progress}%`
                      }} />}
                          <Hash className="h-4 w-4 flex-shrink-0 relative z-10" />
                          <span className="text-sm truncate flex-1 relative z-10">{channel.data.name.replace('#', '')}</span>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white relative z-10"></span>}
                        </button>;
                  })}
                    <button className="w-full text-left px-2 py-1.5 rounded flex items-center gap-2 text-white/70 hover:bg-white/10">
                      <Hash className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm truncate">general</span>
                    </button>
                  </div>

                  {/* Direct Messages */}
                  <div className="mt-12 mb-2">
                    <div className="text-xs font-semibold text-white/50 mb-1 px-2 flex items-center justify-between">
                      <span>APPS
                    </span>
                      <button className="text-white/50 hover:text-white text-lg leading-none">+</button>
                    </div>
                    {/* superpump DM - clickable */}
                    <button onClick={() => handleChannelClick("dm")} className={`relative w-full text-left px-2 py-1.5 rounded flex items-center gap-2 transition-all duration-300 overflow-hidden ${activeChannel === "dm" ? "bg-primary/60 text-white shadow-sm" : "text-white/70 hover:bg-primary/40 hover:text-white"}`}>
                      {activeChannel === "dm" && isAutoPlay && <div className="absolute inset-0 bg-primary/40 transition-all duration-100 rounded" style={{
                      width: `${progress}%`
                    }} />}
                      <div className="w-4 h-4 rounded bg-gradient-to-br from-primary to-destructive flex-shrink-0 flex items-center justify-center relative z-10">
                        <Zap className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="text-sm truncate flex-1 relative z-10">superpump</span>
                      <Badge variant="secondary" className="text-[8px] px-1 py-0 h-3.5 bg-[#F0F0F0] text-[#616061] border-none hover:bg-[#F0F0F0] relative z-10">APP</Badge>
                    </button>
                  </div>

                </div>

                {/* User profile at bottom */}
                <div className="mt-auto pt-2 border-t border-white/10">
                  <button className="w-full text-left px-2 py-2 rounded flex items-center gap-2 text-white/90 hover:bg-white/10">
                    <div className="w-8 h-8 rounded flex-shrink-0 bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-sm font-bold">
                      You
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">Your Name</div>
                      <div className="text-xs text-white/50 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Active
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col bg-background">
                {/* Channel Header */}
                <div className="border-b border-border p-4 font-lato flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      {activeChannel === "dm" ? <div className="w-5 h-5 rounded bg-gradient-to-br from-primary to-destructive flex items-center justify-center">
                          <Zap className="h-3 w-3 text-white" />
                        </div> : <Hash className="h-5 w-5" />}
                      {channels.find(c => c.id === activeChannel)?.data.name.replace('#', '')}
                      {activeChannel === "dm" && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-[#F0F0F0] text-[#616061] border-none hover:bg-[#F0F0F0]">APP</Badge>}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {channels.find(c => c.id === activeChannel)?.data.description}
                    </p>
                  </div>
                  <a href="/beta" className="flex items-center gap-2 px-4 py-2 bg-[#4A154B] hover:bg-[#4A154B]/90 border border-[#4A154B] rounded text-sm font-semibold text-white transition-colors shadow-sm">
                    <img src={slackLogo} alt="Slack" className="h-4 w-4" />
                    <span>Add to Slack</span>
                  </a>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-1 font-lato bg-white">
                  {activeChannel === "posts" && t.channels.posts.messages.map((msg, idx) => <div key={idx} className="group hover:bg-muted/30 -mx-4 px-4 py-2 transition-colors">
                      <div className={`flex gap-3 ${'isReply' in msg && msg.isReply ? 'ml-12' : ''}`}>
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0 text-sm font-semibold" style={{
                      backgroundColor: msg.avatar === "🚀" ? '#4A154B' : '#E01E5A',
                      color: 'white'
                    }}>
                          {msg.avatar === "🚀" ? <div className="w-full h-full rounded bg-gradient-to-br from-primary to-destructive flex items-center justify-center">
                              <Zap className="h-5 w-5 text-white" />
                            </div> : msg.avatar}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex items-baseline gap-2 mb-0.5">
                            <span className="font-bold text-[15px] text-[hsl(var(--slack-text-primary))] font-lato">{msg.user}</span>
                            {msg.user === "superpump" && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-[#F0F0F0] text-[#616061] border-none hover:bg-[#F0F0F0]">APP</Badge>}
                            <span className="text-[11px] text-[hsl(var(--slack-text-secondary))]">{msg.time}</span>
                          </div>

                          {/* Message Content */}
                          <div className="text-[15px] leading-[1.46] mb-1 font-lato text-[hsl(var(--slack-text-primary))]">
                            {formatSlackText(msg.content, `posts-${idx}`)}
                          </div>

                          {/* LinkedIn Preview (for messages with linkedinPreview) */}
                          {'linkedinPreview' in msg && msg.linkedinPreview && (
                            <div className="mt-2 pl-3 border-l-2 border-[#E0E0E0] text-[13px] text-[#616061]">
                              <span className="whitespace-pre-line">
                                {String(msg.linkedinPreview)}
                              </span>{' '}
                              <a href="#" className="text-[#1264A3] hover:underline text-[13px]">
                                {language === 'fr' ? 'Voir plus' : 'Show more'}
                              </a>
                            </div>
                          )}

                          {/* LinkedIn Preview Card (only for bot messages with preview) */}
                          {'preview' in msg && msg.preview && <Card className="mt-2 border border-border hover:border-primary/50 transition-colors cursor-pointer bg-background">
                              <div className="p-3">
                                {/* LinkedIn header */}
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-4 h-4 rounded bg-[#0A66C2] flex items-center justify-center">
                                    <span className="text-white text-[10px] font-bold">in</span>
                                  </div>
                                  <span className="text-[11px] font-medium text-muted-foreground">LinkedIn Post</span>
                                </div>

                                {/* Preview text */}
                                <p className="text-[13px] text-foreground/80 mb-3 line-clamp-2">{String(msg.preview)}</p>

                                {/* Stats */}
                                {'stats' in msg && msg.stats && <div className="flex items-center gap-4 text-[11px] text-muted-foreground mb-3 pb-3 border-b border-border">
                                  <span className="flex items-center gap-1.5">
                                    <Eye className="h-3.5 w-3.5" />
                                    <span className="font-medium">{(msg.stats as any).views}</span>
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <ThumbsUp className="h-3.5 w-3.5" />
                                    <span className="font-medium">{(msg.stats as any).likes}</span>
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    <span className="font-medium">{(msg.stats as any).comments}</span>
                                  </span>
                                </div>}

                                {/* CTA Button */}
                                <button className="text-[13px] font-semibold text-[#0A66C2] hover:underline flex items-center gap-1">
                                  {msg.cta}
                                </button>
                              </div>
                            </Card>}

                          {/* Reactions & Replies */}
                          {msg.reactions && <div className="flex items-center gap-3 mt-2">
                              {/* Reaction bubbles */}
                              <div className="flex items-center gap-1">
                                {msg.reactions.map((reaction, rIdx) => <div key={rIdx} className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-border bg-background hover:border-primary/50 cursor-pointer transition-all hover:scale-105" title={reaction.users.join(', ')}>
                                    <span className="text-[13px]">{reaction.emoji}</span>
                                    <span className="text-[11px] font-medium text-foreground">{reaction.count}</span>
                                  </div>)}

                                {/* Add reaction button */}
                                <button className="w-6 h-6 rounded-full border border-border hover:border-primary/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Smile className="h-3.5 w-3.5 text-muted-foreground" />
                                </button>
                              </div>

                              {/* Reply thread indicator */}
                              {'replies' in msg && (msg as any).replies > 0 && <button className="flex items-center gap-1.5 text-[11px] text-[#0A66C2] hover:underline font-medium">
                                  <MessageSquare className="h-3.5 w-3.5" />
                                  {(msg as any).replies} {(msg as any).replies === 1 ? 'reply' : 'replies'}
                                </button>}
                            </div>}

                          {/* Action buttons (visible on hover) */}
                          <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 hover:bg-muted rounded" title="Add reaction">
                              <Smile className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button className="p-1 hover:bg-muted rounded" title="Share">
                              <Repeat2 className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button className="p-1 hover:bg-muted rounded" title="Save">
                              <Bookmark className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>)}

                  {activeChannel === "analytics" && t.channels.analytics.messages.map((msg, idx) => <div key={idx} className="group hover:bg-muted/30 -mx-4 px-4 py-2">
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded bg-gradient-to-br from-primary to-destructive flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                          <Zap className="h-5 w-5 text-white" />
                        </div>
                          <div className="flex-1 min-w-0">
                           <div className="flex items-baseline gap-2 mb-0.5">
                             <span className="font-bold text-[15px] text-[hsl(var(--slack-text-primary))] font-lato">{msg.user}</span>
                             <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-[#F0F0F0] text-[#616061] border-none hover:bg-[#F0F0F0] font-lato">APP</Badge>
                             <span className="text-[11px] text-[hsl(var(--slack-text-secondary))]">{msg.time}</span>
                           </div>
                            <p className="text-[15px] leading-[1.46] mb-3 whitespace-pre-line font-lato text-[hsl(var(--slack-text-primary))]">{formatSlackText(msg.content, `analytics-${idx}`)}</p>

                          {/* Main Metrics Grid */}
                          <Card className="border border-border bg-background mb-3">
                            <div className="p-4">
                              {/* Row 1: Posts, Impressions, Engagement */}
                              <div className="grid grid-cols-3 gap-2 mb-2">
                                {/* Posts */}
                                <div className="p-2 rounded-lg bg-accent/5 border border-accent/10">
                                  <div className="flex items-center justify-between mb-1">
                                    <MessageSquare className="h-3.5 w-3.5 text-accent" />
                                    {msg.stats.postsGrowth && <span className="text-[10px] font-semibold text-green-600 dark:text-green-400">{msg.stats.postsGrowth}</span>}
                                  </div>
                                  <div className="text-xl font-bold text-accent">23</div>
                                  <div className="text-[10px] text-muted-foreground mt-0.5">Posts</div>
                                </div>

                                {/* Impressions */}
                                <div className="p-2 rounded-lg bg-primary/5 border border-primary/10">
                                  <div className="flex items-center justify-between mb-1">
                                    <Eye className="h-3.5 w-3.5 text-primary" />
                                    {msg.stats.impressionsGrowth && <span className="text-[10px] font-semibold text-green-600 dark:text-green-400">{msg.stats.impressionsGrowth}</span>}
                                  </div>
                                  <div className="text-xl font-bold text-primary">117K</div>
                                  <div className="text-[10px] text-muted-foreground mt-0.5">Impressions</div>
                                </div>

                                {/* Engagement Rate */}
                                <div className="p-2 rounded-lg bg-green-500/5 border border-green-500/10">
                                  <div className="flex items-center justify-between mb-1">
                                    <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                                    {msg.stats.engagementGrowth && <span className="text-[10px] font-semibold text-green-600 dark:text-green-400">{msg.stats.engagementGrowth}</span>}
                                  </div>
                                  <div className="text-xl font-bold text-green-600 dark:text-green-400">{msg.stats.engagement}</div>
                                  <div className="text-[10px] text-muted-foreground mt-0.5">Engagement Rate</div>
                                </div>
                              </div>

                              {/* Row 2: Comments, Likes, ICP */}
                              <div className="grid grid-cols-3 gap-2">
                                {/* Comments */}
                                <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
                                  <div className="flex items-center justify-between mb-1">
                                    <MessageSquare className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                    {msg.stats.commentsGrowth && <span className="text-[10px] font-semibold text-green-600 dark:text-green-400">{msg.stats.commentsGrowth}</span>}
                                  </div>
                                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{msg.stats.comments || 312}</div>
                                  <div className="text-[10px] text-muted-foreground mt-0.5">Comments</div>
                                </div>

                                {/* Likes */}
                                <div className="p-2 rounded-lg bg-pink-500/5 border border-pink-500/10">
                                  <div className="flex items-center justify-between mb-1">
                                    <ThumbsUp className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
                                    {msg.stats.likesGrowth && <span className="text-[10px] font-semibold text-green-600 dark:text-green-400">{msg.stats.likesGrowth}</span>}
                                  </div>
                                  <div className="text-xl font-bold text-pink-600 dark:text-pink-400">{msg.stats.likes || 1842}</div>
                                  <div className="text-[10px] text-muted-foreground mt-0.5">Likes</div>
                                </div>

                                {/* ICP Audience */}
                                <div className="p-2 rounded-lg bg-purple-500/5 border border-purple-500/10">
                                  <div className="flex items-center justify-between mb-1">
                                    <Users className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                                  </div>
                                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">67%</div>
                                  <div className="text-[10px] text-muted-foreground mt-0.5">ICP Audience Match</div>
                                </div>
                              </div>
                            </div>
                          </Card>

                          {msg.reactions && <div className="flex items-center gap-1 mt-2">
                              {msg.reactions.map((reaction, rIdx) => <div key={rIdx} className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-border bg-background hover:border-primary/50 cursor-pointer transition-all hover:scale-105" title={reaction.users.join(', ')}>
                                  <span className="text-[13px]">{reaction.emoji}</span>
                                  <span className="text-[11px] font-medium text-foreground">{reaction.count}</span>
                                </div>)}
                            </div>}
                        </div>
                      </div>
                    </div>)}

                  {activeChannel === "leaderboard" && t.channels.leaderboard.messages.map((msg, msgIdx) => <div key={msgIdx} className="group hover:bg-muted/30 -mx-4 px-4 py-2">
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded bg-gradient-to-br from-primary to-destructive flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                          <Zap className="h-5 w-5 text-white" />
                        </div>
                          <div className="flex-1">
                           <div className="flex items-baseline gap-2 mb-0.5">
                             <span className="font-bold text-[15px] text-[hsl(var(--slack-text-primary))] font-lato">{msg.user}</span>
                             <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-[#F0F0F0] text-[#616061] border-none hover:bg-[#F0F0F0] font-lato">APP</Badge>
                             <span className="text-[11px] text-[hsl(var(--slack-text-secondary))]">{msg.time}</span>
                           </div>
                           <p className="text-[15px] leading-[1.46] mb-3 whitespace-pre-line font-lato text-[hsl(var(--slack-text-primary))]">{formatSlackText(msg.content, `leaderboard-${msgIdx}`)}</p>

                          {/* Main Leaderboard - Top 3 Impressions */}
                          {msg.rankings && <Card className="border border-border bg-background mb-3">
                              <div className="p-3">
                                <div className="space-y-2">
                                  {msg.rankings.map((ranking, idx) => <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border bg-gradient-to-r from-transparent to-primary/5">
                                         <div className="flex items-center gap-3 flex-1 min-w-0">
                                           <span className="text-3xl flex-shrink-0">{ranking.badge}</span>
                                            <div className="flex-1 min-w-0">
                                              <div className="font-semibold text-[15px]">{formatSlackText(ranking.name, `ranking-${msgIdx}-${idx}`)}</div>
                                               <div className="text-[13px] text-muted-foreground">
                                                 <span className="font-semibold text-foreground">{ranking.score}</span> {t.impressionsGenerated}
                                               </div>
                                            </div>
                                         </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                          {ranking.growth && <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 text-[13px] font-semibold">
                                              {ranking.growth} {language === 'fr' ? 'vs mois dernier' : 'vs last month'}
                                            </Badge>}
                                        </div>
                                    </div>)}
                                </div>
                              </div>
                            </Card>}

                          {/* Secondary Stats - Text Format */}
                          {msg.secondaryStats && <div className="text-[15px] space-y-2 mb-2">
                              {/* ICP Engagement Metric */}
                              {msg.icpEngagement && <div className="p-2 rounded-lg bg-purple-500/5 border border-purple-500/20 mb-2">
                                  <span className="font-semibold text-purple-600 dark:text-purple-400">🎯 {msg.icpEngagement}</span>
                                  <span className="text-muted-foreground"> {language === 'fr' ? 'des impressions engagées proviennent de l\'ICP idéal de l\'entreprise' : 'of engaged impressions come from the company\'s ideal ICP'}</span>
                                </div>}

                              {/* Most Posts */}
                              <div className="leading-relaxed">
                                <span className="font-semibold">📝 {language === 'fr' ? 'Plus de posts publiés :' : 'Most posts published:'}</span>{" "}
                                {msg.secondaryStats.mostPosts.map((user, idx) => <span key={idx}>
                                    {formatSlackText(user.name, `mostposts-${msgIdx}-${idx}`)} ({user.count})
                                    {idx < msg.secondaryStats.mostPosts.length - 1 ? ", " : ""}
                                  </span>)}
                              </div>

                              {/* Most Support */}
                              <div className="leading-relaxed">
                                <span className="font-semibold">💙 {language === 'fr' ? 'Champions du support équipe :' : 'Team support champions:'}</span>{" "}
                                {msg.secondaryStats.mostSupport.map((user, idx) => <span key={idx}>
                                    {formatSlackText(user.name, `mostsupport-${msgIdx}-${idx}`)} ({user.count})
                                    {idx < msg.secondaryStats.mostSupport.length - 1 ? ", " : ""}
                                  </span>)}
                              </div>

                              {/* MVP Supporter Special Thanks */}
                               {msg.secondaryStats.mvpSupporter && <div className="p-3 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 mt-2">
                                   <div className="flex items-start gap-2">
                                     <span className="text-2xl">🫶</span>
                                     <div className="flex-1">
                                       <div className="font-semibold text-pink-600 dark:text-pink-400 mb-1 text-[15px]">
                                         {language === 'fr' ? <>Remerciements spéciaux à {formatSlackText(msg.secondaryStats.mvpSupporter.name, `mvp-fr-${msgIdx}`)} !</> : <>Special thanks to {formatSlackText(msg.secondaryStats.mvpSupporter.name, `mvp-en-${msgIdx}`)}!</>}
                                       </div>
                                       <div className="text-[13px] text-muted-foreground">
                                         <span className="font-medium text-foreground">{msg.secondaryStats.mvpSupporter.comments} {language === 'fr' ? 'commentaires' : 'comments'}</span> {language === 'fr' ? 'et' : 'and'}{" "}
                                         <span className="font-medium text-foreground">{msg.secondaryStats.mvpSupporter.likes} likes</span> {language === 'fr' ? 'donnés aux membres de l\'équipe cette semaine.' : 'given to team members this week.'}
                                         {language === 'fr' ? ' Votre soutien fait toute la différence ! 💝' : ' Your support makes all the difference! 💝'}
                                       </div>
                                     </div>
                                   </div>
                                 </div>}
                            </div>}

                          {msg.reactions && <div className="flex items-center gap-1 mt-2">
                              {msg.reactions.map((reaction, rIdx) => <div key={rIdx} className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-border bg-background hover:border-primary/50 cursor-pointer transition-all hover:scale-105" title={reaction.users.join(', ')}>
                                  <span className="text-[13px]">{reaction.emoji}</span>
                                  <span className="text-[11px] font-medium text-foreground">{reaction.count}</span>
                                </div>)}
                            </div>}
                        </div>
                      </div>
                    </div>)}

                  {activeChannel === "share" && t.channels.share.messages.map((msg, idx) => <div key={idx} className={`group hover:bg-muted/30 -mx-4 px-4 py-2 ${msg.isReply ? 'ml-8' : ''}`}>
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0 text-sm font-semibold" style={{
                      backgroundColor: msg.user === "superpump" ? '#4A154B' : '#E01E5A',
                      color: 'white'
                    }}>
                          {msg.user === "superpump" ? <div className="w-full h-full rounded bg-gradient-to-br from-primary to-destructive flex items-center justify-center">
                              <Zap className="h-5 w-5 text-white" />
                            </div> : msg.avatar}
                        </div>
                          <div className="flex-1">
                           <div className="flex items-baseline gap-2 mb-0.5">
                             <span className="font-bold text-[15px] text-[hsl(var(--slack-text-primary))] font-lato">{msg.user}</span>
                             {msg.user === "superpump" && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-[#F0F0F0] text-[#616061] border-none hover:bg-[#F0F0F0] font-lato">APP</Badge>}
                             <span className="text-[11px] text-[hsl(var(--slack-text-secondary))]">{msg.time}</span>
                           </div>
                           <p className="text-[15px] leading-[1.46] mb-2 whitespace-pre-line font-lato text-[hsl(var(--slack-text-primary))]">{formatSlackText(msg.content, `share-${idx}`)}</p>

                          {msg.preview && msg.approved && <Card className="border-l-4 border-green-500 bg-green-500/5 border-t border-r border-b border-green-500/20">
                              <div className="p-3">
                                <div className="flex items-center gap-2 mb-3">
                                  <Badge className="text-[10px] font-bold bg-green-600 text-white hover:bg-green-700">
                                    ✓ APPROVED
                                  </Badge>
                                </div>
                                <p className="text-[13px] text-foreground/90 mb-3 leading-relaxed">{msg.preview}</p>
                                <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-md hover:bg-[#004182] transition-colors text-[13px] font-semibold">
                                  <Share2 className="h-4 w-4" />
                                  {msg.cta}
                                </button>
                              </div>
                            </Card>}

                          {msg.reactions && <div className="flex items-center gap-1 mt-2">
                              {msg.reactions.map((reaction, rIdx) => <div key={rIdx} className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-border bg-background hover:border-primary/50 cursor-pointer transition-all hover:scale-105" title={reaction.users.join(', ')}>
                                  <span className="text-[13px]">{reaction.emoji}</span>
                                  <span className="text-[11px] font-medium text-foreground">{reaction.count}</span>
                                </div>)}
                            </div>}

                          {msg.replies > 0 && <button className="flex items-center gap-1.5 text-[11px] text-[#0A66C2] hover:underline font-medium mt-2">
                              <MessageSquare className="h-3.5 w-3.5" />
                              {msg.replies} {msg.replies === 1 ? 'reply' : 'replies'}
                            </button>}
                        </div>
                      </div>
                    </div>)}

                  {/* DM Channel */}
                  {activeChannel === "dm" && t.channels.dm.messages.map((msg, idx) => <div key={idx} className="group hover:bg-muted/30 -mx-4 px-4 py-2 transition-colors">
                      <div className="flex gap-3">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0 text-sm font-semibold" style={{
                      backgroundColor: '#4A154B',
                      color: 'white'
                    }}>
                          <div className="w-full h-full rounded bg-gradient-to-br from-primary to-destructive flex items-center justify-center">
                            <Zap className="h-5 w-5 text-white" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex items-baseline gap-2 mb-0.5">
                            <span className="font-bold text-[15px] text-[hsl(var(--slack-text-primary))] font-lato">{msg.user}</span>
                            {msg.user === "superpump" && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-[#F0F0F0] text-[#616061] border-none hover:bg-[#F0F0F0]">APP</Badge>}
                            <span className="text-[11px] text-[hsl(var(--slack-text-secondary))]">{msg.time}</span>
                          </div>

                          {/* Message Content */}
                          <div className="text-[15px] leading-[1.46] mb-1 font-lato text-[hsl(var(--slack-text-primary))] whitespace-pre-line">
                            {formatSlackText(msg.content, `dm-${idx}`)}
                          </div>

                          {/* Reactions */}
                          {msg.reactions && <div className="flex items-center gap-1 mt-2">
                              {msg.reactions.map((reaction, rIdx) => <div key={rIdx} className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-border bg-background hover:border-primary/50 cursor-pointer transition-all hover:scale-105" title={reaction.users.join(', ')}>
                                  <span className="text-[13px]">{reaction.emoji}</span>
                                  <span className="text-[11px] font-medium text-foreground">{reaction.count}</span>
                                </div>)}
                            </div>}
                        </div>
                      </div>
                    </div>)}

                  {/* Chat input for DM */}
                  {activeChannel === "dm" && <div className="mt-4 -mx-4 px-4 pt-3 border-t border-border">
                      <div className="flex items-center gap-2 p-2 rounded-lg border border-border bg-muted/30">
                        <input type="text" placeholder={language === 'fr' ? "Pose une question à superpump..." : "Ask superpump a question..."} className="flex-1 bg-transparent text-[14px] placeholder:text-muted-foreground focus:outline-none" readOnly />
                        <button className="p-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors">
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      </div>
                    </div>}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>;
};
export default SlackIntegration;