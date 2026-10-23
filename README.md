# Répar'Scan

Application web mobile (PWA) pour réparer soi-même son électroménager ou son outillage électroportatif :

1. **Identifier l'appareil** : saisie de l'EAN ou de la référence (modèle, E-Nr, PNC, 12NC…), ou photo du code-barres.
2. **Diagnostiquer la panne** : choix d'un symptôme courant, avec cause probable, pièces à contrôler et étapes de vérification.
3. **Vue éclatée** : schéma numéroté de l'appareil, les pièces suspectées sont mises en évidence.
4. **Pièces détachées** : nomenclature avec prix indicatifs et liens vers les revendeurs (Spareka, SOS Accessoire, ManoMano, Amazon).

> **Prototype.** Le catalogue (3 appareils) est fictif : codes EAN en préfixe `200`, références `DEMO-*`, prix inventés. Les liens revendeurs lancent une recherche ; ils deviendront des liens d'affiliation directs une fois un catalogue partenaire branché. Voir [docs/sources-de-donnees.md](docs/sources-de-donnees.md).

## Installer sur le téléphone

**Version web (Android et iPhone).** Une fois `main` publié, l'application est en ligne sur https://toma-971.github.io/reparscan/ (mise en ligne automatique par `.github/workflows/pages.yml`). À activer une seule fois : *Settings → Pages → Source : GitHub Actions*.
- Android (Chrome) : menu ⋮ → *Installer l'application*.
- iPhone (Safari) : bouton Partager → *Sur l'écran d'accueil*.

**Application Android (APK).** `.github/workflows/android.yml` emballe la même application avec [Capacitor](https://capacitorjs.com/) et construit un APK à chaque push. Sur `main`, l'APK est publié dans la release `apk` du dépôt : le télécharger sur le téléphone, l'ouvrir et autoriser l'installation depuis cette source. Pour le construire soi-même : `npm ci && npm run android`, puis `./gradlew assembleDebug` dans `android/` (Java 17 et SDK Android requis).

## Lancer en local

Aucune dépendance ni étape de build : c'est du HTML, CSS et JavaScript.

```sh
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Codes de démo à saisir : `2000000000011` (lave-linge Bosch), `2000000000028` (perceuse Makita), `2000000000035` (lave-vaisselle Whirlpool).

Sur téléphone, le bouton « Scanner un code-barres » ouvre l'appareil photo ; le code est lu avec l'API `BarcodeDetector` quand le navigateur la propose, sinon avec [ZXing](https://github.com/zxing-js/library).

## Structure

| Fichier | Rôle |
| --- | --- |
| `index.html` | Page unique de l'application |
| `css/app.css` | Styles (thème clair et sombre) |
| `js/catalogue.js` | Données de démo : appareils, pièces, formes de la vue éclatée, symptômes |
| `js/app.js` | Recherche, diagnostic, rendu SVG de la vue éclatée, liste des pièces, scan |
| `sw.js`, `manifest.webmanifest` | Installation sur l'écran d'accueil et ouverture hors connexion |
| `scripts/build-web.sh` | Copie l'application dans `www/` pour GitHub Pages et Capacitor |
| `capacitor.config.json`, `package.json` | Emballage Android avec Capacitor |

## Ajouter un appareil au catalogue

Dans `js/catalogue.js`, chaque appareil décrit ses codes d'identification, ses revendeurs, ses pièces (numéro, nom, référence, prix, formes SVG `R`/`O`/`P`/`E` dans un repère 400 × 510, position de la pastille `t`) et ses symptômes (pièces suspectées par ordre de probabilité, explication, étapes de contrôle).

## Fonctions Claude (version Artifact)

La version publiée en Artifact sur claude.ai peut aussi lire la plaque signalétique en photo et analyser une panne décrite librement. Ces fonctions passent par `window.claude` et restent masquées quand l'application tourne ailleurs.
