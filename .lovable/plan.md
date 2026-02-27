

## Add inline error messages for rejected LinkedIn URLs

### Changes

**`src/components/onboarding/OnboardingStepLinkedIn.tsx`:**
- Add `urlError` state (`useState<string | null>`)
- In `handleAdd`, catch the error and set `urlError` to the error message instead of relying only on toast
- Clear `urlError` when input changes (`onChange`)
- Display error message below the input as a small red text (`text-destructive text-xs`)

**`src/hooks/useLinkedInProfiles.ts`:**
- Improve Zod error messages to be more user-friendly and specific:
  - Empty → "Veuillez entrer une URL LinkedIn"
  - Not a URL → "Ce n'est pas une URL valide. Exemple : https://www.linkedin.com/in/nom"
  - Not linkedin.com → "L'URL doit provenir de linkedin.com (ex: https://www.linkedin.com/in/nom)"
- In the `onError` of `addProfileMutation`, re-throw the error so the caller can also catch it for inline display

