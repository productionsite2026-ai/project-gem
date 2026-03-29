# Dashboard Promeneur - Spécifications Complètes

## Principes UX/UI

- **Distinction visuelle** : Header vert émeraude foncé (`hsl(160,84%,25%)`) — reconnaissable instantanément
- **Accessibilité** : textes min 14px, contrastes élevés, boutons larges
- **Couleurs** : Tokens sémantiques, primary vert émeraude, accent bleu océan
- **Animations** : Fluides avec framer-motion, non distrayantes
- **Responsive** : Mobile-first avec tabs en bas sur mobile
- **Fond** : Clair uniquement (blanc), cartes blanches avec bordures

---

## Identification de l'Espace

- Badge "Espace Promeneur" dans le header émeraude
- Distinction immédiate avec le dashboard propriétaire (header bleu)

---

## Layout Dashboard (Style Airbnb)

### Structure visuelle (ordre d'affichage)
1. **Header émeraude foncé** — Avatar, nom, ville, expérience
2. **2 stat cards** chevauchant le header (Gains mensuels, Promenades total)
3. **Barre stats rapides** — Note, Avis, Acceptation, Clients
4. **Badges scrollables** — Certifié, Expérience, Réactif, Fidélisé
5. **Nouvelles demandes** — Accepter/Refuser (bordure latérale jaune)
6. **Résumé financier** — Gains mois, en attente, heures
7. **Derniers avis** — Avec avatars et étoiles
8. **CTA "Voir mes missions"**

---

## Onglets (via navigation)

### Accueil (home) — Layout ci-dessus
### Missions — Réservations par statut
### Messages — Conversations temps réel
### Profil — Informations, documents, paramètres

### Accessibles via menus internes
- Revenus (earnings)
- Disponibilités (availability)
- Performance (performance)
- Factures (invoices)

---

## Fonctionnalités clés

| Fonctionnalité | Description |
|---|---|
| Demandes entrantes | Accepter/Refuser avec détails chien + prix |
| Missions | En attente, confirmées, en cours, terminées |
| Revenus | Gains mois, en attente (48h), total, graphique |
| Disponibilités | Calendrier hebdomadaire, plages horaires |
| Performance | Note moyenne, taux complétion, badges |
| Documents | CNI, casier B2, assurance RC Pro |
| Tarifs | Configuration services et prix |

---

## Bouton GO — Cycle de Mission

| Phase | Écran | Obligations |
|---|---|---|
| Idle | Infos mission ou "Aucune mission" | — |
| Démarrage | Prise en charge | **Photo obligatoire** du chien |
| En cours | Chronomètre temps réel | Photos supplémentaires, signalement |
| Finalisation | Fin de mission | **Message obligatoire** + code unique |
| Terminée | Confirmation | Notification auto au propriétaire |

**Règles :**
- Sans photo de prise en charge → impossible de démarrer
- Sans message de compte-rendu → impossible de terminer
- Code unique généré automatiquement (6 caractères alphanumériques)
- Paiement libéré 48h après validation

---

## Finances

| Élément | Valeur |
|---|---|
| Commission plateforme | 13% |
| Libération paiement | 48h après mission |
| Délai retrait | 2-3 jours ouvrés |
| Gain net | Prix × 0.87 |

---

## Documents Obligatoires

| Document | Bucket Supabase |
|---|---|
| Carte d'identité | walker-documents |
| Casier judiciaire B2 | walker-documents |
| Assurance RC Pro | walker-documents |

---

## Mode Aperçu

Sans connexion ou sans données : données de démo réalistes
- Profil Lucas Bernard (éducateur canin, 4.9★, 156 promenades)
- Demandes en attente, avis clients
- Gains mensuels, badges
- Badge "Mode Aperçu" visible

---

## Navigation Mobile

Tab bar fixe : Accueil, Missions, [GO], Messages, Profil
- Badge compteur sur Missions (demandes en attente)
- Le bouton GO est central, pulsé si mission active

---

## Fichiers

- `src/pages/dashboard/WalkerDashboard.tsx`
- `src/data/demoData.ts` (données de démo)
- `src/components/dashboard/MobileBottomNav.tsx`
- `src/components/dashboard/shared/WalkManagementSheet.tsx`

---

*Mise à jour : Mars 2026*
