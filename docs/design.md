# 🎨 Design System SG@Art (`v10.0.0`)

## ✨ Style visuel & Direction artistique
- **Thème :** *Neural Macramé Quantum‑Era* — fusion de l'artisanat du nœud (*plat, spirale ADN, feston, losange fractal*) et de l'esthétique neuro‑quantique.
- **Direction :** **« Quantum Obsidian & BlueViolet »**, pensée pour mettre en valeur la finesse des fibres tressées tout en garantissant des contrastes **WCAG 2.2 AAA**.
- **Palette chromatique officielle :**
  - `Quantum BlueViolet` (`#8A2BE2`) — Couleur primaire *(badges, nœuds actifs, états neuronaux, bordures focales)*
  - `Obsidian Abyss` (`#0B0714`) — Fond profond *(Studio 3D et Holo‑Gallery XR)*
  - `Nebula Slate` (`#140B29`) — Surface élevée *(panneaux latéraux, cartes de patrons, barres d'outils)*
  - `Cyber Cyan` (`#00E5FF`) — Accent holographique *(vecteurs de tension physique, rayons WebXR, télémétrie)*
  - `Écru Coton` (`#F4EFE6`) — Accent fibre naturelle *(rendu par défaut des cordes tressées et typographie principale)*
- **Typographie (`style.css` & `index.html`) :**
  - **Titres & Logos (`Display`) :** `Syne` / `Space Grotesk` (`700 Bold`, fallback `system-ui, sans-serif`)
  - **Interface (`UI`) :** `Plus Jakarta Sans` (`400–600`, fallback `Inter, Segoe UI, sans-serif`)
  - **Seeds & Métriques (`Mono`) :** `JetBrains Mono` (`500 Medium`, fallback `Fira Code, monospace`)
- **Architecture CSS :** Feuille `style.css` structurée en `@layer` pour une cascade prévisible et maintenable.

---

## 🪪 Identité visuelle
- **Logo SG@Art (SVG & 3D dynamique) :** Logo vectoriel haute précision dans `images/` complété par un logo 3D holographique interactif dans l'atelier et la *Holo‑Gallery XR*.
- **Badges techniques `v10.0.0` :** Style `for-the-badge` harmonisé en `blueviolet` (`#8A2BE2`) avec fond `Nebula Slate` (`#140B29`).
- **Emblème animé :** Effets de rotation, pulsation et reflets holographiques calibrés pour l'interface neuro‑réactive.
- **Textures de fibres :** Rendus réalistes de coton écru, lin et fibres holographiques.

---

## ⚡ Animations, Rendu & Éco‑Conception
- **Vectoriel & UI :** Animations **SMIL** pour les SVG animés et transitions CSS légères sans surcharge CPU.
- **Temps réel & Spatial :** Shaders **WebGPU** (*Quantum‑Mesh*) pour le tressage 3D physique, avec repli automatique **WebGL2 / Canvas 2D**, et exposition spatiale **WebXR**.
- **Accessibilité cognitive (`WCAG 2.2`) :** Adaptation automatique via `@media (prefers-reduced-motion: reduce)` pour suspendre ou adoucir les animations (rotation, pulsation, SMIL) selon les préférences utilisateur, et états de focus clavier visibles (`ARIA`).
- **Sobriété énergétique :** Mise en veille GPU intelligente (`Page Visibility API`) dès que l'onglet perd le focus.
