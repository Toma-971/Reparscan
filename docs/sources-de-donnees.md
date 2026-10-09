# Sources de données pour la version réelle

État des recherches au 8 octobre 2026. Les points marqués *(à vérifier)* sont des déductions, pas des faits confirmés auprès des acteurs.

## Identifier l'appareil

- **Le code-barres EAN** est surtout imprimé sur l'emballage. Sur l'appareil lui-même, on trouve plutôt la **plaque signalétique** (modèle, E-Nr chez Bosch/Siemens, PNC chez Electrolux, 12NC chez Whirlpool, numéro de série). L'application doit donc accepter les deux, et la lecture de plaque par photo (OCR ou modèle de vision) est la voie la plus fiable.
- Bases EAN ouvertes (UPCitemdb, Open Products Facts) : couverture faible sur le gros électroménager *(à vérifier)*. GS1 France donne accès aux données de marque pour ses adhérents.

## Vues éclatées et nomenclatures

- Les fabricants réservent leurs vues éclatées officielles à leurs réparateurs agréés (portails SAV).
- Les distributeurs de pièces (Spareka, SOS Accessoire, et des grossistes B2B comme Astelav) les republient sur leurs sites, mais sans API publique connue *(à vérifier)*. Il faut donc négocier un flux catalogue (CSV/XML ou API) dans le cadre d'un partenariat.

### Ce que publient les fabricants (vérifié le 8 octobre 2026)

- **Makita** : vues éclatées publiques, un PDF par modèle sur [makita.fr/vues-eclatees.html](https://www.makita.fr/vues-eclatees.html), à l'adresse `https://www.icmsmakita.eu/CMS/custom/fi/attachments/part_drawings/FR/<MODELE>.pdf`. Le serveur des PDF interdit les robots (robots.txt) : l'application se contente d'y envoyer l'utilisateur, sans les télécharger.
- **Bosch / Siemens (BSH)** : boutique de pièces avec recherche par E-Nr ou photo de plaque, schémas de l'appareil affichés en ligne, pas de PDF constaté.
- **Whirlpool** : recherche par modèle sur [whirlpool-piecesdetachees.fr](https://www.whirlpool-piecesdetachees.fr/), vues éclatées non confirmées.
- **Samsung** : liste des pièces disponibles par catégorie uniquement, pas de vue éclatée publique.

L'application affiche ces liens sous la vue éclatée (`officialDocs` dans `js/app.js`). Avant d'afficher les schémas eux-mêmes dans l'application, vérifier les conditions d'utilisation de chaque fabricant.

## Vente des pièces

- **Affiliation** : les grands sites marchands passent par des plateformes comme Awin, Effiliation ou Kwanko, ou par Amazon Partenaires. Les programmes de Spareka, SOS Accessoire et ManoMano restent à confirmer *(à vérifier)*.
- En attendant, l'application génère des liens de recherche par revendeur (`shopUrl` dans `js/app.js`).

## Prochaines étapes proposées

1. Contacter un ou deux distributeurs pour un flux catalogue avec vues éclatées et liens d'affiliation.
2. Remplacer `js/catalogue.js` par un appel à ce flux (ou par une petite API qui le met en cache).
3. Ajouter la lecture de plaque signalétique hors Claude (OCR côté serveur ou service de vision).
