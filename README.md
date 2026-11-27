###### README.md >> markdown 
<a id="top"></a>

# SG@Art
### Portfolio créatif & atelier paramétrique de macramé
### — v1.2.0

---

[![Déploiement GitHub Pages](https://github.com/teremuhamblin/SG-Art/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/teremuhamblin/SG-Art/actions/workflows/deploy-pages.yml)

---

**SG@Art** *associe un portfolio artistique à un aperçu interactif de motifs de macramé*.
- Le projet est un site statique en ***HTML, CSS et JavaScript*** :
   - *Il peut être consulté sans installation ni service* ***backend***.

---

[![Version](https://img.shields.io/badge/version-1.2.0-8b5cf6?style=for-the-badge)](https://github.com/teremuhamblin/SG-Art)
[![HTML](https://img.shields.io/badge/HTML-5-8b5cf6?style=for-the-badge&logo=html5&logoColor=white)](#stack)
[![CSS](https://img.shields.io/badge/CSS-Responsive-8b5cf6?style=for-the-badge&logo=css3&logoColor=white)](#stack)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-8f5cf6?style=for-the-badge&logo=javascript&logoColor=111)](#stack)
[![Licence](https://img.shields.io/badge/licence-see_LICENSE-8b5fc6?style=for-the-badge)](./LICENSE)

---

**Navigation :** [Aperçu](#aperçu) · [Fonctionnalités](#fonctionnalités) · [Démarrage](#démarrage) · [Utilisation](#utilisation) · [Architecture](#architecture) · [Limites connues](#limites-connues) · [Licence](#licence)

---

## Aperçu

SG@Art est un portfolio consacré à la création graphique et au macramé. Son atelier permet de modifier une graine, un type de nœud et une densité pour visualiser un motif paramétrique, d’en obtenir une estimation indicative de corde et d’exporter le patron en SVG ou en JSON.

> **À propos de l’édition v10.0.0 :** le dépôt contient actuellement une application front-end statique dont le moteur JavaScript et les styles indiquent la version **1.2.0**. Les fonctions décrites dans ce README correspondent au code présent ; elles ne supposent pas l’existence d’une IA autonome, d’une simulation physique de fibres ou d’une galerie immersive WebXR complète.

## Fonctionnalités

- Navigation entre les sections Accueil, Atelier, Parcours, Collection et Contact.
- Prévisualisation paramétrique avec graine déterministe et choix du motif : plat, spirale ou feston.
- Estimation indicative du nombre de brins et de la longueur de corde.
- Rendu progressif : WebGPU si disponible, puis WebGL2 et Canvas 2D.
- Export du patron en SVG et des paramètres en JSON.
- Mise en veille de l’animation lorsque la page ou l’aperçu n’est pas visible, et respect de `prefers-reduced-motion`.
- Interface responsive, navigation clavier et prise en compte des zones de sécurité des appareils mobiles.
- Formulaire de contact utilisant le client mail configuré sur l’appareil ; aucun serveur d’envoi n’est fourni.

## Stack

- **HTML5** pour le contenu et la structure sémantique.
- **CSS** sans framework pour le thème responsive et les états d’accessibilité.
- **JavaScript natif** pour la navigation, le rendu et les exports.
- **WebGPU / WebGL2 / Canvas 2D** comme options de rendu disponibles selon le navigateur.

Aucun gestionnaire de paquets ni dépendance applicative n’est requis.

## Démarrage

Clonez le dépôt, puis servez ses fichiers depuis un serveur local :

```bash
git clone https://github.com/teremuhamblin/SG-Art.git
cd SG-Art
python3 -m http.server 8080
```

Ouvrez ensuite <http://localhost:8080>.

Vous pouvez aussi utiliser Node.js si vous avez déjà `serve` disponible :

```bash
npx serve .
```

Un serveur local est préférable à l’ouverture directe en `file://`. Certaines API de navigateur nécessitent un contexte sécurisé (`localhost` ou HTTPS). Si WebGPU n’est pas accessible, le rendu essaie WebGL2 puis Canvas 2D.

## Utilisation

1. Ouvrez la section **Atelier** depuis la navigation.
2. Saisissez une graine et choisissez le type de nœud et la densité.
3. Consultez l’aperçu et l’estimation de corde. Cette estimation est indicative, pas un métrage de fabrication garanti.
4. Exportez le motif en SVG ou ses paramètres en JSON.

Le bouton de vérification WebXR indique si le navigateur signale la prise en charge de l’API ; il ne démarre pas encore de session immersive.

## Architecture

```text
SG-Art/
├── index.html       # page et sections accessibles
├── style.css        # thème responsive, composants et préférences utilisateur
├── script.js        # navigation, rendu paramétrique et exports
├── images/          # logo, visuels et ressources du portfolio
├── docs/            # documentation, structure, usage et historique
├── .github/         # fichiers de contribution et de gouvernance
├── LICENSE          # conditions de licence du projet
└── scripts/
    └── create-archive.py  # création locale d’une archive ZIP
```

`script.js` initialise la navigation et l’atelier après le chargement du DOM. Il génère une prévisualisation graphique à partir des paramètres, puis choisit le moteur de rendu disponible. Les exports sont produits dans le navigateur, sans téléversement des données.

Documentation complémentaire : [`docs/README.md`](./docs/README.md), [`docs/usage.md`](./docs/usage.md), [`docs/structure.md`](./docs/structure.md) et [`docs/CHANGELOG.md`](./docs/CHANGELOG.md).

## Créer l’archive ZIP

Pour préparer localement une archive complète du dépôt (hors métadonnées Git et fichiers temporaires) :

```bash
python3 scripts/create-archive.py
```

Le fichier `sg-art.zip` est créé à la racine du projet. Il n’est pas ajouté au dépôt par le script.

## Limites connues

- Le projet n’a ni backend, ni stockage distant, ni mécanisme d’envoi de formulaire. Le formulaire ouvre un client mail.
- L’aperçu est une visualisation paramétrique ; il ne constitue pas un simulateur physique de fibres.
- Le test WebXR vérifie la disponibilité déclarée de l’API mais ne fournit pas de galerie XR.
- Les formats glTF/USDZ, les fonctions d’IA générative autonome et les capacités annoncées dans certains anciens textes ne sont pas implémentés dans le code livré.
- Les métriques de capacité ou de performance ne sont pas publiées, car aucune mesure reproductible n’est fournie dans le dépôt.

Les contributions qui ajoutent ces fonctions devraient inclure leur implémentation, leurs tests et une documentation vérifiable avant de les annoncer comme disponibles.

## Contribution

Consultez les consignes dans [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md). Pour signaler un problème de sécurité, suivez [`.github/SECURITY.md`](./.github/SECURITY.md).

## Licence

Consultez [`LICENSE`](./LICENSE) pour les conditions applicables. Ne déduisez pas les droits de réutilisation des créations ou des exports à partir de ce README seul.

---

<div align="center">

**SG@Art · création, motif et macramé**

[↑ Retour en haut](#top)

</div>
