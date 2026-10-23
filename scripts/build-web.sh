#!/bin/sh
# Copie les fichiers de l'application web dans www/ (utilisé par GitHub Pages et par Capacitor).
set -e
cd "$(dirname "$0")/.."
rm -rf www
mkdir -p www
cp -R index.html manifest.webmanifest sw.js css js icons www/
echo "www/ prêt"
