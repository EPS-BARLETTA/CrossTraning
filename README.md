# Carnet Cross Training – Persistant & QR

## Mode hors-ligne et stockage local
- L’application fonctionne 100 % hors-ligne (aucun `fetch`/XHR).
- Toutes les données sont sauvegardées dans `localStorage` (ou `sessionStorage` si `STORAGE_MODE` est modifié) sous la clé `CT_APP_STATE_V1`.
- Le payload stocké contient `v`, `updatedAt`, `students`, `mode`, `training`, `skills`, `evaluation`, `notes`, `archives` ainsi qu’un `snapshot` complet de l’état courant pour reprise fidèle.
- Le bouton **Réinitialiser carnet** appelle `resetState()` : suppression de la clé `CT_APP_STATE_V1`, réinitialisation de l’état par défaut puis rechargement de la page.

## Export ScanProf (QR JSON UTF‑8 plat)
- Chaque QR encode **un seul élève** dans un objet JSON plat : `nom`, `prenom`, `classe`, `groupe`, puis des champs compacts `ct_*`.
- Les cases à cocher `data-qr-option` (Identité/Skill/Training/Evaluation/Notes) pilotent les sections optionnelles. Identité reste toujours présente (ScanProf exige nom/prénom/classe).
- Les champs ajoutés respectent la limite de ~2800 octets (`QR_PAYLOAD_LIMIT`). Si la taille dépasse, le script supprime dans cet ordre : `notes` → `evaluation` → `skill` → `training`. Chaque retrait écrit un `console.warn`.
- Le payload inclut un éventuel objet `__labels` pour fournir les libellés lisibles côté ScanProf.
- `renderQr()` s’appuie sur `qrcode.min.js` déjà présent et injecte les QR dans `#qr-output` (bilan) et `#training-qr-output` (bouton Tests 1’). Duo alterné : deux QRs générés à la suite.

## Stratégie de limitation
- Historique entraînement : seules les 3 dernières mesures (`ct_t1..ct_t3`) par élève sont exportées.
- Skill : nom, parcours, focus (4 exercices max) + nombre de tranches complétées (`ct_cycles`).
- Évaluation : champs `ct_lvl_cardio`, `ct_lvl_lower`, `ct_lvl_upper`, `ct_lvl_core` lorsque renseignés.
- Notes : `ct_note` limité à 280 caractères. Supprimé en premier lors d’un dépassement.

## Procédure de test rapide
1. Renseigner les identités (prénom + classe) des élèves A/B puis choisir le mode (solo/alterné).
2. Lancer un test entraînement, saisir des répétitions et sauvegarder.
3. Aller dans **Bilan**, cocher/décocher les options QR puis cliquer sur **QR ScanPro** : vérifier qu’un QR par élève apparaît dans `#qr-output`.
4. Sur la page entraînement, cliquer sur **QR tests 1’** pour afficher les QRs dédiés (`#training-qr-output`).
5. Utiliser **Enregistrer** pour ajouter un snapshot dans l’onglet Archives, puis **Réinitialiser carnet** pour vérifier que le stockage est bien vidé.

## Fiches pédagogiques
- La page `fiches.html` reprend les visuels façon plaquette (schéma, critères, sécurité, muscles, étirements, niveaux).
- Accessible depuis l’accueil (bouton « Fiches exercices ») ou directement via GitHub Pages.
- `sheets.js` génère les blocs à partir d’un jeu de données statique, `sheets.css` applique le style Apple‑like.

## Bibliothèque Cross Training (CSV Numbers)
- Le fichier `data/skills.csv` (UTF‑8) contient les challenges exportés depuis Numbers avec `name,difficulty,points`.
- Au chargement, l’app essaie de lire ce CSV (aucune requête réseau). En cas d’erreur, un fallback codé en dur prend le relais.
- La page **Mode skill** affiche cette bibliothèque : on y assigne les challenges aux élèves A/B, les sélections sont sauvegardées en local (`assignedChallenges`).
- Les challenges associés apparaissent dans le roster, se retrouvent dans le QR ScanProf (`ct_challenge*`) et sont persistés dans `localStorage`.
