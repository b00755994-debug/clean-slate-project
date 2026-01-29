

# Plan: Palette de Gris Modernisée

## Analyse du problème

### Gris actuels (trop mous)
| Usage | Variable | Valeur HSL | Hex approximatif |
|-------|----------|------------|------------------|
| Texte secondaire | `--muted-foreground` | `215 16% 47%` | #6B7280 (clair, bleuté) |
| Fond muted | `--muted` | `220 14% 96%` | #F3F4F6 (quasi blanc) |
| Fond sidebar | `--sidebar-background` | `340 100% 99%` | Rosé très clair |
| Bordures | `--border` | `220 13% 91%` | #E5E7EB |

## Nouvelle palette proposée

### Comparaison

| Usage | Avant | Apres | Description |
|-------|-------|-------|-------------|
| **Texte secondaire** | `215 16% 47%` | `220 9% 36%` (**#525866**) | Plus fonce, meilleure lisibilite |
| **Fond filtres/sidebar** | `220 14% 96%` | `220 10% 95%` (**#F1F2F4**) | Gris neutre subtil |
| **Bordures** | `220 13% 91%` | `220 10% 88%` (**#DCDFE4**) | Legerement plus visible |
| **Sidebar background** | `340 100% 99%` (rose) | `220 10% 95%` (**#F1F2F4**) | Meme gris que muted |

### Apercu des changements

```text
Texte secondaire:
  Avant: #6B7280 (gris clair bluete, mou)
  Apres: #525866 (gris fonce neutre, net)

Fonds sidebar/filtres:
  Avant: quasi blanc / rose pale
  Apres: #F1F2F4 (gris neutre leger, pro)
```

## Modification technique

### Fichier: `src/index.css`

Variables a mettre a jour dans `:root` :

```css
/* Texte secondaire - plus fonce et net */
--muted-foreground: 220 9% 36%;     /* Etait: 215 16% 47% */

/* Fonds - gris neutre subtil */
--muted: 220 10% 95%;               /* Etait: 220 14% 96% */

/* Sidebar - meme gris que muted (etait rose) */
--sidebar-background: 220 10% 95%;  /* Etait: 340 100% 99% */
--sidebar-foreground: 220 9% 36%;   /* Aligne avec muted-foreground */

/* Bordures legerement plus marquees */
--border: 220 10% 88%;              /* Etait: 220 13% 91% */
--input: 220 10% 88%;
--sidebar-border: 220 10% 88%;
```

## Fichier a modifier

| Fichier | Changement |
|---------|------------|
| `src/index.css` | Mettre a jour les variables de gris (light mode) |

## Resultat attendu

- **Texte** : Plus lisible, meilleur contraste, aspect plus pro
- **Fonds** : Gris neutre coherent pour sidebar et filtres
- **Bordures** : Plus nettes, plus visibles
- **Coherence** : Palette unifiee sans teintes parasites (rose, bleu)

