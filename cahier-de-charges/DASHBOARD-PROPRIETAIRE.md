# Dashboard Propriétaire - Spécifications Complètes

## Principes UX/UI

- **Distinction visuelle** : Header bleu océan (`hsl(200,80%,35%)`) — reconnaissable instantanément
- **Accessibilité** : textes min 14px, contrastes élevés, boutons larges
- **Couleurs** : Tokens sémantiques, accent bleu océan, primary vert émeraude
- **Animations** : Fluides avec framer-motion, non distrayantes
- **Responsive** : Mobile-first avec tabs en bas sur mobile
- **Fond** : Clair uniquement (blanc), cartes blanches avec bordures

---

## Identification de l'Espace

- Badge "Espace Propriétaire" avec icône patte dans le header bleu
- Distinction immédiate avec le dashboard promeneur (header vert)

---

## Layout Dashboard (Style Deliveroo)

### Structure visuelle (ordre d'affichage)
1. **Header bleu océan** — Avatar, nom, nb chiens, ville
2. **3 stat cards** chevauchant le header (Réservations, Compagnons, Dépensé)
3. **Barre complétion profil** (si < 100%)
4. **Mes compagnons** — Scroll horizontal, cartes photo
5. **Prochaines réservations** — Liste avec prix, statut, détails
6. **Promeneurs favoris** — Avatars scroll horizontal avec note
7. **CTA "Trouver un promeneur"** — Bouton bleu accent plein

---

## Onglets (via navigation)

### Accueil (home) — Layout ci-dessus
### Favoris — Liste des promeneurs favoris
### Messages — Conversations temps réel
### Profil — Informations, documents, paramètres

### Accessibles via menus internes
- Mes chiens (dogs)
- Réservations (bookings)
- Factures (invoices)
- Parrainage (referral)

---

## Fonctionnalités clés

| Fonctionnalité | Description |
|---|---|
| Ajout de chiens | Photo, nom, race, âge, poids, tempérament, vaccins |
| Réservations | À venir, passées, annulées, avec détails complets |
| Messages | Temps réel via Supabase, anonymat préservé |
| Factures | Historique des paiements |
| Parrainage | Code unique, 15€ parrain / 10€ filleul |
| Profil | Photo, infos, documents CNI, paramètres |

---

## Mode Aperçu

Sans connexion ou sans données : données de démo réalistes
- 2 chiens (Max, Bella) avec photos
- Réservations confirmées et passées
- Promeneurs favoris avec notes
- Badge "Mode Aperçu" visible

---

## Navigation Mobile

Tab bar fixe : Accueil, Favoris, [GO], Messages, Profil
- Le bouton GO ouvre WalkManagementSheet (suivi de mission)

---

## Fichiers

- `src/pages/dashboard/OwnerDashboard.tsx`
- `src/data/demoData.ts` (données de démo)
- `src/components/dashboard/MobileBottomNav.tsx`
- `src/components/dashboard/shared/WalkManagementSheet.tsx`

---

*Mise à jour : Mars 2026*
