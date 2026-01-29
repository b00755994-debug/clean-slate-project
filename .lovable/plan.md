

# Plan: Restructurer la Sidebar avec Navigation Complete

## Vue d'ensemble
Transformer la sidebar icon-only en une sidebar complete avec:
- Logo Superpump en haut
- 4 pages de navigation avec icones + titres
- Menu utilisateur en bas

## Nouvelle Structure de la Sidebar

```text
+----------------------+
| [Zap] superpump      |  <- Logo + nom (en haut)
|----------------------|
| [icon] Dashboard     |  <- /dashboard
| [icon] Team Feed     |  <- /dashboard/content (existant)
| [icon] Analytics     |  <- /dashboard/analytics
| [icon] Leaderboard   |  <- /dashboard/leaderboard
|                      |
|                      |
|----------------------|
| [Menu] Menu          |  <- Menu utilisateur (en bas)
+----------------------+
```

## Pages de Navigation (toutes existantes)

| Page | Route | Icone |
|------|-------|-------|
| Dashboard | `/dashboard` | LayoutDashboard |
| Team Feed | `/dashboard/content` | Rss |
| Analytics | `/dashboard/analytics` | BarChart3 |
| Leaderboard | `/dashboard/leaderboard` | Trophy |

## Modifications

### 1. Refonte de DashboardSidebar
**Fichier: `src/components/dashboard/DashboardSidebar.tsx`**

- Elargir la sidebar: `w-16` devient `w-52` (208px)
- Ajouter 3 sections:
  - **SidebarHeader**: Logo Superpump (Zap icon + "superpump")
  - **SidebarContent**: 4 pages avec icones reduites (-30%) + titres
  - **SidebarFooter**: Dropdown "Menu" avec profil, langues, logout

**Dimensions:**
- Icones navigation: `w-5 h-5` devient `w-3.5 h-3.5` (-30%)
- Logo Zap: `w-4 h-4` dans container `w-8 h-8`

### 2. Mettre a jour DashboardLayout
**Fichier: `src/components/dashboard/DashboardLayout.tsx`**
- Supprimer `<DashboardHeader />`
- La sidebar devient l'element de navigation principal

### 3. Menu utilisateur dans la sidebar
Deplacer le contenu du DashboardHeader vers le SidebarFooter:
- Bouton "Menu" avec icone
- Dropdown avec: profil utilisateur, selection langue (EN/FR), admin (si admin), logout

## Structure de Code - Nouvelle Sidebar

```tsx
const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Team Feed', url: '/dashboard/content', icon: Rss },
  { title: 'Analytics', url: '/dashboard/analytics', icon: BarChart3 },
  { title: 'Leaderboard', url: '/dashboard/leaderboard', icon: Trophy },
];

<Sidebar className="w-52 border-r border-border/30 bg-background">
  {/* Logo en haut */}
  <SidebarHeader className="px-4 py-4 border-b border-border/30">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-destructive">
        <Zap className="w-4 h-4 text-white" />
      </div>
      <span className="text-lg font-bold">superpump</span>
    </div>
  </SidebarHeader>

  {/* Navigation */}
  <SidebarContent className="py-4">
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem>
          <NavLink to={item.url}>
            <item.icon className="w-3.5 h-3.5" />
            <span>{item.title}</span>
          </NavLink>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  </SidebarContent>

  {/* Menu utilisateur en bas */}
  <SidebarFooter className="mt-auto border-t p-4">
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Menu /> Menu
      </DropdownMenuTrigger>
      {/* Profil, langues, admin, logout */}
    </DropdownMenu>
  </SidebarFooter>
</Sidebar>
```

## Fichiers a modifier

| Fichier | Action |
|---------|--------|
| `src/components/dashboard/DashboardSidebar.tsx` | Refonte complete avec header, nav, footer |
| `src/components/dashboard/DashboardLayout.tsx` | Supprimer DashboardHeader, ajuster layout |

## Note
Aucune nouvelle page a creer - toutes les routes existent deja.

