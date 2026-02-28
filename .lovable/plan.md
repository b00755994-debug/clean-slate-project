

## Probleme identifie

`window.open(data.url, "_blank")` est bloque par les navigateurs dans un contexte iframe/preview. Le checkout Stripe s'ouvre dans un nouvel onglet qui est silencieusement bloque.

## Solution

Remplacer `window.open` par `window.location.href` pour rediriger dans le meme onglet au lieu d'ouvrir un nouvel onglet. Cela contourne les bloqueurs de popups.

### Modification

**Fichier** : `src/pages/Pricing.tsx`, ligne 192

Remplacer :
```typescript
window.open(data.url, "_blank");
```

Par :
```typescript
window.location.href = data.url;
```

Cela redirigera l'utilisateur directement vers le checkout Stripe dans le meme onglet. Les URL `success_url` et `cancel_url` configurees dans la fonction `create-checkout` rameneront l'utilisateur sur l'app apres le paiement.

