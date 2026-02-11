

## Ajuster les largeurs de colonnes du tableau LinkedIn

### Changements sur `src/pages/Dashboard.tsx`

Modifier les `w-[XX%]` dans les `TableHead` et `TableCell` correspondantes :

| Colonne | Avant | Apres |
|---------|-------|-------|
| Name | 18% | 18% (inchange) |
| LinkedIn URL | 26% | 30% |
| Slack User | 16% | 14% |
| Followers | 14% | 14% (inchange) |
| Posts | 14% | 14% (inchange) |
| Actions | 12% | 12% (inchange) |

### Details techniques

- LinkedIn URL : `w-[26%]` -> `w-[30%]` (headers + cells)
- Slack User : `w-[16%]` -> `w-[14%]` (headers + cells)
- Les autres colonnes restent inchangees

