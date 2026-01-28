
# Plan : Message neutre pour l'inscription

## Contexte

Supabase ne renvoie pas d'erreur quand un utilisateur essaie de s'inscrire avec un email déjà utilisé (pour des raisons de sécurité anti-énumération). Le code actuel affiche donc "Inscription réussie" même si l'email existe déjà, ce qui peut être trompeur.

---

## Solution

Modifier le message de succès à l'inscription pour utiliser une formulation neutre qui ne révèle pas si l'email existe ou non dans la base de données.

---

## Changement à effectuer

### Fichier : `src/pages/Auth.tsx`

**Ligne 111-114 - Avant :**
```typescript
toast({
  title: 'Inscription réussie',
  description: 'Un email de confirmation vous a été envoyé. Vérifiez votre boîte de réception (et vos spams si besoin).',
});
```

**Après :**
```typescript
toast({
  title: 'Vérifiez votre email',
  description: 'Si cette adresse n\'est pas déjà enregistrée, vous recevrez un lien de confirmation. Pensez à vérifier vos spams.',
});
```

---

## Pourquoi ce changement ?

| Aspect | Avant | Après |
|--------|-------|-------|
| Sécurité | Indique implicitement que l'email n'existe pas | Ne révèle rien sur l'existence du compte |
| UX | Peut être trompeur si l'email existe déjà | Message honnête et clair |
| Anti-énumération | Partiellement conforme | Totalement conforme |

---

## Résultat attendu

Quand un utilisateur soumet le formulaire d'inscription :
- **Nouvel email** → Reçoit l'email de confirmation + voit le message neutre
- **Email existant** → Ne reçoit pas d'email + voit le même message neutre (pas de fuite d'information)
