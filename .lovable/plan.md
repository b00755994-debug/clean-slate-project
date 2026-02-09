

## Refonte du modèle tarifaire - Prix par utilisateur

### Changement demande
Revenir a un modele simple de prix par utilisateur au lieu du systeme par paliers actuels :
- **Pro** : 4€/utilisateur/mois (3,20€ en annuel avec -20%)
- **Business** : 6€/utilisateur/mois (4,80€ en annuel avec -20%)
- Simulateur avec slider par increments de 10 utilisateurs (min 10, max 200)

### Modifications techniques (fichier `src/pages/Pricing.tsx`)

1. **Remplacer les constantes de prix** :
   - `PRO_PRICE_PER_USER = 4` (remplace `PRO_BASE_PRICE`, `PRO_EXTRA_PER_10`)
   - `BUSINESS_PRICE_PER_USER = 6` (remplace `BUSINESS_BASE_PRICE`, `BUSINESS_EXTRA_PER_10`)
   - Garder `ANNUAL_DISCOUNT = 0.20`

2. **Simplifier le calcul de prix** :
   - Prix mensuel = prix par utilisateur x nombre d'utilisateurs
   - Prix annuel = mensuel x 12 x 0.80
   - Supprimer `calculateTieredPrice` et remplacer par un calcul direct

3. **Mettre a jour l'affichage des cartes Pro et Business** :
   - Afficher le prix par utilisateur en principal (ex: "4,00€/user/month")
   - En annuel, afficher "3,20€/user/month" comme prix principal
   - Sous-titre : prix total mensuel selon le nombre d'utilisateurs selectionne (ex: "40,00€/month for 10 users")
   - Badge savings et billed annually restent inchanges dans leur logique

4. **Garder le simulateur** tel quel (slider par increments de 10, min 10, max 200) - il fonctionne deja correctement

5. **Mettre a jour les textes descriptifs** sous les prix : remplacer "10 users included, then +25€ per 10 users" par "4€ per user" / "6€ per user"

