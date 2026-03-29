# Cahier des Charges — Refonte Visuelle Dashboards DogWalking

> Document mis à jour le 22 Mars 2026  
> Projet : DogWalking Dashboard Redesign  
> Statut : Appliqué

---

## 1. CONTEXTE & OBJECTIF GÉNÉRAL

**Demande** : Deux dashboards visuellement distincts, professionnels, inspirés d'apps reconnues (Airbnb pour promeneur, Deliveroo pour propriétaire).

**Principe** : Chaque dashboard doit être identifiable **au premier coup d'œil** par sa couleur de header, son layout et son contenu prioritaire.

---

## 2. DISTINCTION VISUELLE ENTRE DASHBOARDS

### Dashboard Promeneur (Style Airbnb)
- **Header** : Dégradé vert émeraude foncé (`hsl(160,84%,25%)` → `hsl(180,60%,30%)`)
- **Identité** : "Espace Promeneur" visible dans le header
- **Focus** : Performance, revenus, avis clients, demandes entrantes
- **Badges** : Certifié, Expérience, Réactif, Fidélisé (pills colorées)
- **Bouton GO** : Central dans la barre de navigation

### Dashboard Propriétaire (Style Deliveroo)
- **Header** : Dégradé bleu océan (`hsl(200,80%,35%)` → `hsl(220,60%,40%)`)
- **Identité** : "Espace Propriétaire" avec icône patte
- **Focus** : Mes chiens (scroll horizontal), réservations, promeneurs favoris
- **CTA** : "Trouver un promeneur" en bleu accent

---

## 3. PALETTE DE COULEURS

| Élément | Couleur | Code HSL |
|---|---|---|
| **Primary** | Vert Émeraude | `hsl(160, 84%, 39%)` |
| **Accent** | Bleu Océan | `hsl(200, 80%, 45%)` |
| **Background** | Blanc pur | `hsl(0, 0%, 100%)` |
| **Foreground** | Gris foncé | `hsl(220, 13%, 18%)` |
| **Muted** | Gris très clair | `hsl(220, 14%, 96%)` |
| **Card** | Blanc | `hsl(0, 0%, 100%)` |
| **Border** | Gris léger | `hsl(220, 13%, 91%)` |

### Accents Fonctionnels (parcimonie)

| Usage | Code HSL | Utilisation |
|---|---|---|
| Succès | `hsl(160, 70%, 42%)` | Icônes + badges |
| Alerte | `hsl(38, 80%, 55%)` | Icônes + badges |
| Erreur | `hsl(0, 65%, 55%)` | Icônes + badges |
| Info | `hsl(200, 80%, 45%)` | Icônes + texte |
| Cœur/Favoris | `hsl(350, 70%, 55%)` | Icônes uniquement |

### ⚠️ RÈGLES COULEUR STRICTES
- Cartes stat sur fond **BLANC** (`bg-card`) avec bordure grise
- Couleurs d'accent UNIQUEMENT sur icônes (cercle `bg-couleur/10`) et valeurs KPI
- **INTERDIT** : `bg-primary`, `bg-emerald-500` comme fond de carte
- **INTERDIT** : gradients colorés sur les cartes de contenu
- Headers : seul endroit avec dégradé coloré (émeraude ou bleu selon rôle)

---

## 4. STRUCTURE DES DASHBOARDS

### Promeneur — Sections (ordre)
1. Header émeraude avec avatar + nom + ville + expérience
2. 2 cartes stat (Gains / Promenades) chevauchant le header
3. Barre de stats rapides (Note, Avis, Acceptation, Clients)
4. Badges scrollables (Certifié, Expérience, Réactif, Fidélisé)
5. Nouvelles demandes (Accept/Refus) avec bordure latérale jaune
6. Résumé financier
7. Derniers avis clients
8. CTA "Voir mes missions"

### Propriétaire — Sections (ordre)
1. Header bleu océan avec avatar + nom + nb chiens + ville
2. 3 cartes stat (Réservations, Compagnons, Dépensé)
3. Barre de complétion profil (si < 100%)
4. Mes compagnons (scroll horizontal avec cartes photos)
5. Prochaines réservations (liste avec prix et statut)
6. Promeneurs favoris (avatars scroll horizontal)
7. CTA "Trouver un promeneur"

---

## 5. MODE APERÇU (DEMO)

Quand l'utilisateur n'est pas connecté ou n'a pas de données :
- Affichage automatique de données de démo réalistes
- Badge "Mode Aperçu" visible dans le header
- Données : 5 profils promeneurs, 5 propriétaires, chiens, réservations, avis
- Fichier source : `src/data/demoData.ts`

---

## 6. BOUTON GO — Gestion de Promenade

| Phase | Action | Obligations |
|---|---|---|
| Idle | Affichage mission ou "Aucune mission" | - |
| Démarrage | Prise en charge | Photo obligatoire du chien |
| En cours | Chronomètre + actions | Photos supplémentaires possibles |
| Finalisation | Fin de mission | Message obligatoire + code unique |
| Terminée | Confirmation | Notification propriétaire |

- Le bouton GO est **central** dans la barre de navigation mobile
- Gradient `from-primary to-accent`, rond, `ring-4 ring-background`
- Pulse animation quand mission active
- Visible sur les DEUX dashboards

---

## 7. NAVIGATION MOBILE

### Tab bar (4 items + GO central)
**Promeneur** : Accueil, Missions, [GO], Messages, Profil
**Propriétaire** : Accueil, Favoris, [GO], Messages, Profil

- Position fixe en bas
- Active state : icône `text-primary` + fond `bg-primary/8`
- Badges sur Messages et Missions (compteur non lu)

---

## 8. TYPOGRAPHIE & ANIMATIONS

- Titres : système font, bold
- Corps : regular, min 14px
- Valeurs KPI : bold, 2xl minimum
- Animations : framer-motion, spring stiffness 300
- Transitions : 200-300ms, ease-out
- Hover cartes : scale 1.02, ombre accrue

---

## 9. COMPOSANTS PARTAGÉS

| Composant | Usage |
|---|---|
| `MobileBottomNav` | Barre navigation avec GO |
| `WalkManagementSheet` | Gestion complète de mission |
| `DashboardSkeleton` | Chargement |
| `StatCard` | Carte statistique (fond blanc) |
| `QuickActionCard` | Action rapide (fond blanc) |

---

*Mise à jour : Mars 2026*
