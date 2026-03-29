# Cahier des Charges Final — DogWalking 2026

> Dernière mise à jour : 27 Mars 2026  
> Statut : En cours de finalisation

---

## 1. ÉTAT ACTUEL DU PROJET

### ✅ Fonctionnalités TERMINÉES

| Module | Description | Fichiers |
|---|---|---|
| **Page d'accueil** | Hero, services, FAQ, avis, SEO | `src/pages/Index.tsx` |
| **Authentification** | Choix rôle (Propriétaire/Promeneur), Email, Google, Apple | `src/pages/Auth.tsx`, `src/pages/AuthCallback.tsx` |
| **Dashboard Propriétaire** | Header bleu océan, chiens, réservations, favoris, promeneurs | `src/pages/dashboard/OwnerDashboard.tsx` |
| **Dashboard Promeneur** | Header émeraude, revenus, stats, badges, disponibilité | `src/pages/dashboard/WalkerDashboard.tsx` |
| **Onglets Dashboard** | Accueil, Favoris, Profil, Réservations, Chiens, Revenus, Avis | `src/components/dashboard-v2/tabs/` |
| **Bouton GO** | Cycle complet : photo → chrono → message → code fin | `src/components/dashboard/shared/WalkManagementSheet.tsx` |
| **Navigation Mobile** | BottomNav avec GO central, 4 onglets par rôle | `src/components/dashboard-v2/BottomNav.tsx` |
| **Messagerie** | Conversations temps réel via Supabase | `src/pages/Messages.tsx` |
| **Recherche Promeneurs** | Filtres, cartes, matching | `src/pages/FindWalkers.tsx` |
| **SEO Local** | Pages zones, villes, départements | `src/pages/LocalZone.tsx`, `src/pages/NosZones.tsx` |
| **Blog** | Articles SEO avec routes dynamiques | `src/pages/Blog.tsx`, `src/pages/BlogArticle.tsx` |
| **Pages Services** | 6 pages piliers (promenade, garde, visite, etc.) | `src/pages/services/` |
| **Pages Légales** | CGU, mentions légales, confidentialité | `src/pages/CGU.tsx`, etc. |
| **Mode Démo** | Données réalistes sans connexion | `src/data/demoData.ts` |
| **PWA** | Service worker, manifest, install prompt | `public/sw.js`, `public/manifest.json` |
| **Design System** | Palette émeraude, tokens CSS, gradients, shadows | `src/index.css`, `tailwind.config.ts` |

### 🔧 Base de Données Supabase (Tables existantes)

| Table | Usage |
|---|---|
| `profiles` | Profils utilisateurs (nom, email, ville, type) |
| `walker_profiles` | Profils promeneur (tarif, note, expérience, services) |
| `dogs` | Chiens des propriétaires |
| `bookings` | Réservations (statut, date, prix, type de service) |
| `reviews` | Avis clients |
| `messages` | Messagerie anonymisée |
| `notifications` | Alertes push/in-app |
| `favorites` | Promeneurs favoris |
| `walk_proofs` | Preuves photo/vidéo de promenade |
| `walker_badges` | Badges de compétence |
| `walker_documents` | Documents de vérification (CNI, casier) |
| `walker_earnings` | Revenus et commissions |
| `referrals` | Système de parrainage |
| `disputes` | Litiges et réclamations |
| `incident_reports` | Signalement d'incidents |
| `user_roles` | Rôles admin/modérateur/utilisateur |

---

## 2. DISTINCTION VISUELLE DES DASHBOARDS

### Dashboard Promeneur (Style Airbnb)
- **Header** : Dégradé vert émeraude (`hsl(160,84%,25%)` → `hsl(180,60%,30%)`)
- **Identité** : "Espace Promeneur" dans le header
- **Onglets BottomNav** : Accueil, Missions, [GO], Messages, Profil
- **Focus** : Performance, revenus, avis, disponibilité

### Dashboard Propriétaire (Style Deliveroo)
- **Header** : Dégradé bleu océan (`hsl(200,80%,35%)` → `hsl(220,60%,40%)`)
- **Identité** : "Espace Propriétaire" avec icône patte
- **Onglets BottomNav** : Accueil, Favoris, [GO], Messages, Profil
- **Focus** : Chiens, réservations, promeneurs à proximité

---

## 3. CE QUI RESTE À FAIRE

### 🔴 Priorité Haute (Indispensable pour le lancement)

| # | Tâche | Description | Complexité |
|---|---|---|---|
| 1 | **Intégration Stripe** | Paiement sécurisé, escrow, versement promeneur | Haute |
| 2 | **Validation admin des promeneurs** | Interface admin pour vérifier CNI, casier, documents | Haute |
| 3 | **Upload documents promeneur** | Page upload CNI, attestation, casier judiciaire | Moyenne |
| 4 | **Notifications push réelles** | Intégration Web Push API / Firebase FCM | Moyenne |
| 5 | **Réservation complète** | Flux calendrier → choix créneau → confirmation → paiement | Haute |
| 6 | **Système d'escrow** | Blocage paiement → validation propriétaire → libération | Haute |
| 7 | **Edge Functions Supabase** | Logique serveur : calcul commissions, notifications auto | Moyenne |

### 🟡 Priorité Moyenne (Post-lancement v1)

| # | Tâche | Description | Complexité |
|---|---|---|---|
| 8 | **Module de formation / Quiz** | Modules e-learning, quiz validation, badges auto | Haute |
| 9 | **Interface Admin complète** | Gestion utilisateurs, litiges, statistiques globales | Haute |
| 10 | **Factures PDF** | Génération automatique de factures pour chaque mission | Moyenne |
| 11 | **Système d'avis bidirectionnel** | Promeneur note le propriétaire et inversement | Faible |
| 12 | **Calendrier de disponibilité** | Promeneur définit ses créneaux via calendrier visuel | Moyenne |
| 13 | **Upload avatar / photo chien** | Upload direct vers Supabase Storage avec crop | Faible |
| 14 | **Statistiques avancées promeneur** | Graphiques revenus, historique, prédictions | Moyenne |

### 🟢 Priorité Basse (Évolutions futures)

| # | Tâche | Description | Complexité |
|---|---|---|---|
| 15 | **Chat en temps réel amélioré** | Indicateurs de lecture, pièces jointes, réactions | Moyenne |
| 16 | **Programme de fidélité** | Points, récompenses, badges propriétaire | Faible |
| 17 | **Multi-langue** | Support EN/ES en plus du FR | Moyenne |
| 18 | **App native (Capacitor)** | Packaging PWA → APK/IPA | Moyenne |
| 19 | **Analytics dashboard** | Métriques business, taux conversion, rétention | Haute |
| 20 | **API publique** | Endpoints pour partenaires/intégrations | Haute |

---

## 4. ARCHITECTURE TECHNIQUE

### Frontend
- **Framework** : React 18 + Vite + TypeScript
- **Styles** : Tailwind CSS + tokens sémantiques HSL
- **UI** : shadcn/ui + composants custom dashboard-v2
- **Animations** : Framer Motion (spring stiffness 300)
- **État** : TanStack React Query + Context API
- **Routing** : React Router v6 (SPA)
- **Police** : Nunito (400-900)

### Backend
- **BaaS** : Supabase (PostgreSQL + Auth + Storage + Realtime)
- **RLS** : Row Level Security sur toutes les tables
- **Storage** : Bucket `walk-proofs` pour photos de mission
- **Auth** : Email + Google + Apple (via Supabase Auth)

### Sécurité
- Rôles via table `user_roles` (jamais sur `profiles`)
- Fonction `has_role()` SECURITY DEFINER pour vérifier les rôles
- RLS strictes sur chaque table
- Pas de clés privées dans le code client

---

## 5. STRUCTURE DES FICHIERS DASHBOARDS

```
src/
├── pages/dashboard/
│   ├── OwnerDashboard.tsx      # Dashboard propriétaire principal
│   └── WalkerDashboard.tsx     # Dashboard promeneur principal
├── components/dashboard-v2/
│   ├── ActiveMissionCard.tsx   # Carte mission active
│   ├── AvailabilityToggle.tsx  # Toggle disponibilité
│   ├── BadgeGrid.tsx           # Grille de badges
│   ├── BottomNav.tsx           # Navigation mobile + GO
│   ├── DashboardHeader.tsx     # Header avec notifications
│   ├── DogCard.tsx             # Carte chien
│   ├── EarningsCard.tsx        # Carte revenus
│   ├── NearbyWalkerCard.tsx    # Carte promeneur à proximité
│   ├── QuickActions.tsx        # Actions rapides (4 boutons)
│   ├── ReviewCard.tsx          # Carte avis
│   ├── StarRating.tsx          # Étoiles notation
│   ├── StatsRow.tsx            # Barre de stats
│   ├── UpcomingBookings.tsx    # Prochaines réservations
│   ├── WeatherWidget.tsx       # Widget météo
│   └── tabs/
│       ├── BookingsTab.tsx     # Onglet réservations
│       ├── DogsTab.tsx         # Onglet mes chiens
│       ├── EarningsTab.tsx     # Onglet revenus
│       ├── FavoritesTab.tsx    # Onglet favoris
│       ├── ProfileTab.tsx      # Onglet profil
│       └── ReviewsTab.tsx      # Onglet avis
├── components/dashboard/shared/
│   └── WalkManagementSheet.tsx # Gestion mission (bouton GO)
├── data/
│   └── demoData.ts             # Données de démo
├── hooks/
│   ├── useProfile.ts           # Profil utilisateur
│   ├── useNewBookings.ts       # Réservations
│   ├── useNewDogs.ts           # Chiens
│   ├── useEarnings.ts          # Revenus
│   ├── useNearbyWalkers.ts     # Promeneurs proches
│   └── useNewNotifications.ts  # Notifications
└── contexts/
    └── AuthContext.tsx          # Session & profil auth
```

---

## 6. PALETTE DE COULEURS (RÉFÉRENCE)

| Élément | Code HSL | Usage |
|---|---|---|
| Primary (Émeraude) | `hsl(160, 84%, 39%)` | Boutons, accents, header promeneur |
| Accent (Bleu Océan) | `hsl(200, 80%, 45%)` | Header propriétaire, liens, CTA |
| Background | `hsl(0, 0%, 100%)` | Fond de page |
| Foreground | `hsl(220, 13%, 18%)` | Texte principal |
| Muted | `hsl(220, 14%, 96%)` | Fonds légers |
| Destructive | `hsl(0, 65%, 55%)` | Erreurs, annulations |
| Star | `hsl(45, 95%, 52%)` | Étoiles notation |
| Heart | `hsl(350, 70%, 55%)` | Favoris |

### Règles strictes
- Cartes sur fond **BLANC** avec bordure grise
- Couleurs d'accent sur icônes uniquement (cercle `bg-couleur/10`)
- Headers = seul endroit avec dégradé coloré
- Pas de fond coloré sur les cartes de contenu

---

## 7. FLUX BOUTON GO (GESTION DE MISSION)

```
[IDLE] → Sélection mission → [STARTING]
   → Photo obligatoire du chien → [IN_PROGRESS]
   → Chronomètre + photos supplémentaires → [ENDING]
   → Message obligatoire + Code unique → [COMPLETED]
   → Notification propriétaire → Paiement (post-validation)
```

---

*Document généré le 27 Mars 2026 — DogWalking v2*
