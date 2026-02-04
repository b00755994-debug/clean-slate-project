

# Plan : Deplacer le badge "30 derniers jours" dans les KPI Cards

## Objectif

Retirer le badge "Last 30 days" / "30 derniers jours" du header de la page Analytics et l'afficher directement dans chaque carte KPI pour bien indiquer que les metriques concernent les 30 derniers jours roulants.

## Fichiers a modifier

### 1. `src/pages/DashboardAnalytics.tsx`

**Supprimer le badge du header** (lignes 52-56) :

```typescript
// AVANT
<div className="flex items-center">
  <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
    {t.periodBadge}
  </span>
</div>

// APRES
// Supprimer entierement ce bloc
```

On garde les traductions `periodBadge` car elles seront utilisees dans le KPICard.

---

### 2. `src/components/analytics/KPICard.tsx`

**Ajouter une prop optionnelle `periodLabel`** et l'afficher en petit sous le label :

```typescript
interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: number;
  tooltip: string;
  color?: 'blue' | 'violet' | 'emerald' | 'amber' | 'rose';
  suffix?: string;
  periodLabel?: string;  // NOUVEAU
}

// Dans le composant, ajouter apres le label :
<div className="flex items-center gap-1 mt-1">
  <span className="text-sm text-muted-foreground">{label}</span>
  <TooltipProvider>
    ...
  </TooltipProvider>
</div>
{periodLabel && (
  <span className="text-[10px] text-muted-foreground/70 mt-0.5">
    {periodLabel}
  </span>
)}
```

---

### 3. `src/components/analytics/AnalyticsOverview.tsx`

**Passer `periodLabel` a chaque KPICard** :

```typescript
// Ajouter dans les traductions
periodLabel: '30 derniers jours',  // FR
periodLabel: 'Last 30 days',       // EN

// Puis sur chaque KPICard :
<KPICard
  icon={FileText}
  label={t.totalPosts}
  value={overviewKPIs.totalPosts.value}
  change={overviewKPIs.totalPosts.change}
  tooltip={t.tooltips.totalPosts}
  color="blue"
  periodLabel={t.periodLabel}  // AJOUTER
/>
```

---

### 4. `src/components/analytics/AnalyticsTeamActivation.tsx`

**Meme modification** - ajouter `periodLabel` aux 4 KPICards.

---

### 5. `src/components/analytics/AnalyticsReachImpact.tsx`

**Meme modification** - ajouter `periodLabel` aux 4 KPICards.

---

## Resultat visuel

| Avant | Apres |
|-------|-------|
| Badge "Last 30 days" en haut a droite de la page | Badge absent du header |
| KPI Cards sans indication de periode | Chaque KPI Card affiche "Last 30 days" en petit sous le label |

## Avantages

- L'utilisateur voit immediatement que chaque metrique concerne les 30 derniers jours
- Plus clair sur mobile ou le badge en haut pouvait passer inapercu
- Coherent avec le design des cards

