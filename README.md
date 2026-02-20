# Crosstraning V2

Carnet Cross Training hors-ligne optimisé iPad. Tout fonctionne localement : aucune requête réseau, QRs ScanProf compatibles et état sauvegardé dans `localStorage` (`CT_APP_STATE_V1`).

## Périmètre fonctionnel
- Saisie identités (élèves A/B), mode solo/alterné, observateur.
- Historique entraînements (tests 1').
- Historique runs « skill » (durée / blocs).
- Évaluation rapide + notes élèves & prof.
- Boutons export :
  - **QR bilan** → 1 QR JSON plat par élève avec sections sélectionnées (identité, training, skill, niveau, notes).
  - **QR entraînement** → version allégée (training only).
- **Finaliser / archiver** ajoute un snapshot dans la liste locale.
- **Reset carnet** nettoie `localStorage`.

## Structure fichiers
```
index.html        # UI principale
styles.css        # Style light responsive
script.js         # Persistance + logique QR
qrcode.min.js     # Librairie QR locale
jspdf.umd.min.js  # Inclus (utilisable plus tard)
```

## QR ScanProf
- Objet plat JSON UTF‑8 (< 2800 octets). Champs obligatoires : `nom`, `prenom`, `classe`, `groupe`.
- Sections facultatives (`ct_t*`, `ct_s*`, `ct_lvl`, `ct_note`) pilotées par les cases à cocher.
- Trim automatique (ordre : notes → evaluation → skill → training) si la taille dépasse la limite. Les clés supprimées sont signalées dans la carte QR.
- `__labels` décrit chaque colonne pour faciliter l’import ScanProf.

## Persistance
- `saveState()` écrit un snapshot complet sous `CT_APP_STATE_V1` (clé JSON). Tout changement (inputs, formulaires, etc.) déclenche une sauvegarde et met à jour le badge « Sauvegarde ».

## Test rapide
1. Renseigner prénom + classe pour A/B, ajouter au moins un test 1'.
2. Cliquer « QR bilan » → vérifier l’affichage des deux QR.
3. Cliquer « Finaliser / archiver » → voir l’entrée dans la liste.
4. Cliquer « Reset carnet » → retour état vierge (confirmer la boîte de dialogue).
