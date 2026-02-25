

## Plan: Update Feature Descriptions

Update `src/components/Features.tsx` with the 3 new descriptions (EN + FR) and extend the highlight logic for all tabs.

### Changes to `src/components/Features.tsx`:

**English descriptions:**
- **Team Feed:** "One feed for your entire team's LinkedIn activity.\nSpot trends and **replicate what works**."
- **Analytics:** "Turn your team's LinkedIn activity into **actionable data**.\nTrack reach, activation & audience quality, at scale."
- **Leaderboard:** "See who's leading the charge on LinkedIn.\n**Gamify your advocacy program**."

**French descriptions (equivalent):**
- **Team Feed:** "Un seul flux pour toute l'activité LinkedIn de votre équipe.\nRepérez les tendances et **reproduisez ce qui marche**."
- **Analytics:** "Transformez l'activité LinkedIn de votre équipe en **données actionnables**.\nSuivez la portée, l'activation et la qualité de l'audience, à grande échelle."
- **Leaderboard:** "Voyez qui mène la charge sur LinkedIn.\n**Gamifiez votre programme d'advocacy**."

**Highlight logic:** Replace the current hardcoded check for `'fast, coordinated engagement'` with a generic approach — add a `highlight` field to each tab object containing the phrase to highlight. The render logic will use this field to wrap the matching text in the styled `<span>`.

### Technical detail

Each tab object gains an optional `highlight: string` property. The rendering becomes:

```tsx
{tab.highlight && tab.description.includes(tab.highlight) ? (
  <>
    {tab.description.split(tab.highlight)[0]}
    <span className="bg-primary/15 text-primary rounded-sm font-medium px-1">{tab.highlight}</span>
    {tab.description.split(tab.highlight)[1]}
  </>
) : tab.description}
```

