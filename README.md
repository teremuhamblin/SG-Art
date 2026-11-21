###### `README.md` — emploi pour la v1.2.0, version améliorée, adaptée et **Stable** :

# SG@Art 🎨🌐✨
> Plateforme artistique avancée fusionnant macramé, *IA et interface Quantum‑Era* — **Version 1.2.0**

![Version](https://img.shields.io/badge/version-1.2.0-blueviolet?style=for-the-badge)
![WebGPU](https://img.shields.io/badge/WebGPU-Ready%20%2B%20Fallback-00d4ff?style=for-the-badge)
![WebXR](https://img.shields.io/badge/WebXR-Holographic%20Gallery-ff007f?style=for-the-badge)
![Sécurité](https://img.shields.io/badge/Security-CI%2FCD%20Audited-00c853?style=for-the-badge)
![Licence](https://img.shields.io/badge/Licence-SG--Art%20v14.04-orange?style=for-the-badge)

---

### ✨ Nouveautés v1.2.0
- 🧠 **Moteur Neural Macramé v2** : Génération paramétrique par *seed* (nœud plat, spirale, feston) et estimation des longueurs de cordes.
- ⚡ **Rendu WebGPU Résilient** : Pipeline optimisé avec bascule automatique (*fallback* WebGL2 / Canvas 2D) sur les appareils non compatibles.
- 📐 **Export des patrons** : Téléchargement direct des motifs générés en **SVG** et **JSON**.
- ♿ **Accessibilité & Éco-conception** : Support natif de `prefers-reduced-motion`, navigation clavier ARIA et mise en veille GPU hors-focus.
- 🛡️ **CI/CD & Sécurité renforcés** : Politique CSP stricte, audit CodeQL et vérification automatisée dans `.github/`.

---

### 🚀 Neural Macramé
```text
- IA générative pour motifs macramé (paramétrique + export SVG/JSON)
- Interface neuro‑réactive respectueuse de l'accessibilité
- Rendu WebGPU tressé avec repli automatique WebGL2/Canvas2D
- Galerie XR holographique (WebXR)
- Animations complexes en temps réel optimisées GPU
```

---

### 🌐 Compatibilité & Lancement rapide
> ⚠️ **Note WebGPU / WebXR** : Pour des raisons de sécurité navigateur, lancez le projet via un serveur local sécurisé (HTTPS ou `localhost`).

```bash
# Exemple de lancement local rapide (sans installation)
npx serve .
# ou avec Python :
python3 -m http.server 8080
```

| Fonctionnalité | Chrome / Edge | Firefox | Safari | Mode Repli |
| :--- | :---: | :---: | :---: | :---: |
| **Rendu WebGPU** | ✅ | ⚙️ Flag | ⚙️ Expérimental | ✅ Canvas 2D / WebGL2 |
| **Galerie WebXR** | ✅ | ❌ | ⚙️ VisionOS | ✅ Mode 3D Classique |
| **Export SVG / JSON** | ✅ | ✅ | ✅ | — |

---

### 📁 Structure du site
- VOIR **docs/structure.md**
- (CSP) stricte
   - CI/CD Quantum‑Era renforcé (contrôle qualité & détection de secrets

---

### 📜 Licence
**Licence SG-Art v14.04** — Voir le fichier [`LICENSE`](./LICENSE).
- *Usage personnel et commercial limité (incluant les patrons générés par l'IA).*

---
